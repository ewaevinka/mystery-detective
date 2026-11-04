// The 3D World of Hauteville! 🌍
// Builds the Detective Office, the Gala parking lot and the Grand Ballroom,
// and lets you walk around in first person with W A S D or the arrow keys.

import * as THREE from 'three';
import { Character, makeNameTag } from './avatar3d.js';
import { OFFICE, GALA, GARDEN, PARKING, ARENA, PLAZA, areaAt } from './layout.js';

const PLAYER_RADIUS = 0.35;
const EYE_HEIGHT = 1.6;
const WALK_SPEED = 4.2;
const RUN_SPEED = 7.5;
const TURN_SPEED = 2.4;

const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...opts });
const glow = (color, intensity = 1.5) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

function canvasTexture(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  tex.anisotropy = 4;
  return tex;
}

function signTexture(text, bg = '#1A0F2E', fg = '#FFD700') {
  return canvasTexture(1024, 256, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.strokeStyle = fg; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24);
    g.fillStyle = fg;
    let size = 96;
    do { g.font = `bold ${size}px Cinzel, serif`; size -= 4; } while (g.measureText(text).width > w - 80 && size > 20);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 6);
  });
}

function emojiSprite(emoji, size = 0.6) {
  const tex = canvasTexture(128, 128, (g) => {
    g.font = '96px serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(emoji, 64, 72);
  });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true }));
  s.scale.set(size, size, 1);
  return s;
}

// which of the three far-apart places an x position belongs to
const placeOf = (x) => (x < -200 ? 'office' : x > 200 ? 'concert' : 'gala');

export class World {
  constructor(container, hooks = {}) {
    this.container = container;
    this.hooks = hooks;
    this.colliders = [];
    this.venueDoors = [];
    this.guards = {};
    this.homePortals = [];
    this.interactables = [];
    this.mysteryStuff = [];
    this.npcs = [];
    this.clueObjects = new Map();
    this.remotes = new Map();
    this.keys = new Set();
    this.player = { x: OFFICE.spawn.x, y: 0, vy: 0, z: OFFICE.spawn.z, yaw: OFFICE.spawn.yaw, pitch: 0, moving: false, area: 'office' };
    this.thirdPerson = false;
    this.inputEnabled = true;
    this.running = false;
    this.target = null;
    this.portalCooldown = 0;
    this.doorOpen = false;
    this.time = 0;
    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.domElement.className = 'world-canvas';
    container.prepend(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#140F2D');
    this.scene.fog = new THREE.Fog('#140F2D', 45, 150);
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.05, 500);
    this.camera.rotation.order = 'YXZ';

    this.buildSkyAndLights();
    this.buildOffice();
    this.buildParkingLot();
    this.buildGala();
    this.buildGarden();
    this.buildConcert();

    this.placeLights = { office: [], gala: [], concert: [] };
    this.scene.traverse(o => {
      if (o.isPointLight) this.placeLights[placeOf(o.position.x)].push(o);
    });
    this.setActivePlace('office');

    this.playerChar = new Character({}, {});
    this.scene.add(this.playerChar.root);

    this.setupInput();
    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
    this.loop = this.loop.bind(this);
  }

  // ================= BUILDING HELPERS =================
  box(w, h, d, material, x, y, z, solid = false) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z);
    this.scene.add(m);
    if (solid) this.addCollider(x - w / 2, x + w / 2, z - d / 2, z + d / 2);
    return m;
  }

  addCollider(minX, maxX, minZ, maxZ) {
    const c = { minX, maxX, minZ, maxZ };
    this.colliders.push(c);
    return c;
  }

  addInteractable(obj) {
    this.interactables.push(obj);
    return obj;
  }

  // a pair of front doors that slide open when the guard lets you in
  addVenueDoor(cx, z, halfWidth, material) {
    const panels = [-1, 1].map(side => this.box(halfWidth, 3.8, 0.15, material, cx + side * halfWidth / 2, 1.9, z));
    this.venueDoors.push({ cx, halfWidth, panels, collider: { minX: cx - halfWidth, maxX: cx + halfWidth, minZ: z - 0.3, maxZ: z + 0.3 } });
  }

  addGuard(venue, spot, name) {
    const guard = new Character({
      skin: venue === 'gala' ? 'skin-4' : 'skin-2', hairStyle: 'hair-high-bun', hairColor: 'h-obsidian',
      outerwear: 'coat-noir-trench', tops: 'top-detective-turtleneck', bottoms: 'bottom-sleuth-trousers',
      shoes: 'shoes-stealth-boots', hats: null, accessories: 'acc-sunglasses'
    }, { name, tagColor: '#FFFFFF' });
    guard.root.position.set(spot.x, 0, spot.z);
    this.scene.add(guard.root);
    this.guards[venue] = { char: guard, spot };
    this.addInteractable({ id: `guard-${venue}`, kind: 'guard', label: `talk to the ${venue === 'gala' ? 'Gala Guard' : 'Ticket Checker'}`, pos: { x: spot.x, z: spot.z }, range: 3.2, data: { venue } });
  }

  addHomePortal(spot) {
    const portal = this.makePortal('#7FE7FF');
    portal.position.set(spot.x, 0, spot.z);
    this.scene.add(portal);
    const tag = makeNameTag('🏢 Portal to the Office', '#7FE7FF');
    tag.position.set(spot.x, 2.9, spot.z);
    this.scene.add(tag);
    this.homePortals.push(portal);
  }

  boutiqueVan(van) {
    this.box(2.6, 2.2, 5.5, std('#FF8FC8', { roughness: 0.4 }), van.x, 1.4, van.z, true);
    this.box(2.5, 1.0, 1.4, std('#FF8FC8', { roughness: 0.4 }), van.x, 0.8, van.z - 3.4, true);
    this.box(2.3, 0.6, 0.05, std('#5A78B0', { metalness: 0.3, roughness: 0.15 }), van.x, 1.5, van.z - 4.12);
    const vanSign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.15), new THREE.MeshBasicMaterial({ map: signTexture('POP-UP BOUTIQUE', '#FFF0F7', '#C2185B') }));
    vanSign.rotation.y = -Math.PI / 2;
    vanSign.position.set(van.x - 1.31, 1.9, van.z);
    this.scene.add(vanSign);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => {
      this.box(1.21, 0.09, 0.55, std(i % 2 ? '#FFFFFF' : '#FF4FA3'), van.x - 1.8, 2.505, van.z - 1.9 + i * 0.55).rotation.z = -0.25;
    });
    [-1.3, 1.3].forEach(dx => [van.z - 3.2, van.z + 1.8].forEach(wz => this.wheel(van.x + dx, wz)));
    const dress = emojiSprite('👗', 0.8);
    dress.position.set(van.x - 1.6, 3.2, van.z);
    this.scene.add(dress);
    this.addInteractable({ id: `van-${van.x}`, kind: 'van', label: 'change outfits at the Pop-up Boutique', pos: { x: van.x - 1.8, z: van.z }, range: 2.8 });
  }

  // ================= 🎤 THE STARLIGHT ARENA (map 2) =================
  buildConcert() {
    const P = PLAZA, A = ARENA;
    const pcx = (P.minX + P.maxX) / 2;
    const gold = std('#D4AF37', { metalness: 0.85, roughness: 0.25 });

    // ---- outside plaza ----
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), std('#1E3A2A'));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(pcx, -0.02, 0);
    this.scene.add(grass);
    const tiles = canvasTexture(128, 128, (g) => {
      g.fillStyle = '#4A4458'; g.fillRect(0, 0, 128, 128);
      g.strokeStyle = '#3A3546'; g.lineWidth = 4;
      g.strokeRect(0, 0, 64, 64); g.strokeRect(64, 64, 64, 64); g.strokeRect(64, 0, 64, 64); g.strokeRect(0, 64, 64, 64);
    }, [12, 9]);
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(P.maxX - P.minX, P.maxZ - P.minZ), new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.9 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(pcx, 0.005, (P.minZ + P.maxZ) / 2);
    this.scene.add(plaza);

    const hedge = std('#2F5E3A');
    this.box(0.8, 1.2, P.maxZ - P.minZ, hedge, P.minX, 0.6, (P.minZ + P.maxZ) / 2, true);
    this.box(0.8, 1.2, P.maxZ - P.minZ, hedge, P.maxX, 0.6, (P.minZ + P.maxZ) / 2, true);
    this.box(P.maxX - P.minX, 1.2, 0.8, hedge, pcx, 0.6, P.maxZ, true);
    this.box(A.minX - P.minX, 1.2, 0.8, hedge, (P.minX + A.minX) / 2, 0.6, 0.2, true);
    this.box(P.maxX - A.maxX, 1.2, 0.8, hedge, (P.maxX + A.maxX) / 2, 0.6, 0.2, true);

    // glowing purple walkway to the doors
    const walk = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 14), glow('#8A4FFF', 0.35));
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(A.centerX, 0.02, 7);
    this.scene.add(walk);
    [-2.1, 2.1].forEach(dx => this.box(0.1, 1, 12, std('#C0C0C0', { metalness: 0.8, roughness: 0.3 }), A.centerX + dx, 0.5, 8));

    // food trucks
    P.trucks.forEach(t => {
      this.box(2.6, 2.4, 5.5, std(t.color, { roughness: 0.4 }), t.x, 1.5, t.z, true);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.0), new THREE.MeshBasicMaterial({ map: signTexture(t.sign, '#FFFFFF', '#E63B7A') }));
      sign.rotation.y = Math.PI / 2;
      sign.position.set(t.x + 1.31, 2.1, t.z);
      this.scene.add(sign);
      const win = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.8), glow('#FFE7A8', 0.8));
      win.rotation.y = Math.PI / 2;
      win.position.set(t.x + 1.32, 1.2, t.z);
      this.scene.add(win);
      [-1.3, 1.3].forEach(dx => [t.z - 1.8, t.z + 1.8].forEach(wz => this.wheel(t.x + dx, wz)));
      const treat = emojiSprite(t.treat, 0.8);
      treat.position.set(t.x, 3.2, t.z);
      this.scene.add(treat);
    });

    // poster boards
    P.posters.forEach(([x, z], i) => {
      this.box(0.15, 2.4, 1.6, std('#2B2B2B'), x, 1.6, z, true);
      const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2), new THREE.MeshBasicMaterial({
        map: canvasTexture(140, 200, (g) => {
          const grad = g.createLinearGradient(0, 0, 0, 200);
          grad.addColorStop(0, i ? '#FF4D8D' : '#00E5FF'); grad.addColorStop(1, '#2A1F45');
          g.fillStyle = grad; g.fillRect(0, 0, 140, 200);
          g.font = '70px serif'; g.textAlign = 'center'; g.fillText(i ? '🎤' : '🎶', 70, 100);
          g.fillStyle = '#FFF'; g.font = 'bold 20px sans-serif'; g.fillText('LIVE TONIGHT', 70, 160);
        })
      }));
      poster.rotation.y = i ? -Math.PI / 2 : Math.PI / 2;
      poster.position.set(x + (i ? -0.09 : 0.09), 1.6, z);
      this.scene.add(poster);
    });

    // lamp posts
    P.lamps.forEach(([x, z], i) => {
      this.box(0.15, 4, 0.15, std('#2B2B2B', { metalness: 0.6 }), x, 2, z, true);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), glow(i % 2 ? '#FF7AD9' : '#7FE7FF', 2.5));
      bulb.position.set(x, 4.1, z);
      this.scene.add(bulb);
      if (i >= 2) {
        const l = new THREE.PointLight(i % 2 ? '#FF7AD9' : '#7FE7FF', 35, 20, 1.4);
        l.position.set(x, 3.8, z);
        this.scene.add(l);
      }
    });

    this.boutiqueVan(P.van);
    this.addHomePortal(P.homePortal);

    // 🎡 a giant sparkly Ferris wheel
    const fw = P.ferrisWheel;
    const wheel = new THREE.Group();
    const R = 9;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.18, 8, 64), glow('#FF7AD9', 1.2));
    wheel.add(rim);
    const rim2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.55, 0.1, 8, 48), glow('#7FE7FF', 1.2));
    wheel.add(rim2);
    const cabinColors = ['#FF4D8D', '#FFD700', '#00E5FF', '#8A4FFF', '#7CFFB2', '#FF8A65'];
    this.ferrisCabins = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.08, R, 0.08), std('#DDDDDD', { metalness: 0.8 }));
      spoke.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, 0);
      spoke.rotation.z = a - Math.PI / 2;
      wheel.add(spoke);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), glow(cabinColors[i % 6], 3));
      bulb.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      wheel.add(bulb);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), std(cabinColors[i % 6], { roughness: 0.4 }));
      cabin.userData.a = a;
      this.ferrisCabins.push(cabin);
      this.scene.add(cabin);
    }
    wheel.position.set(fw.x, R + 1.5, fw.z);
    wheel.rotation.y = Math.PI / 2;
    this.scene.add(wheel);
    this.ferrisWheel = wheel;
    [-1, 1].forEach(side => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, R + 2, 0.4), std('#CCCCCC', { metalness: 0.7 }));
      leg.position.set(fw.x, (R + 1.5) / 2, fw.z + side * 2.5);
      leg.rotation.x = side * 0.22;
      this.scene.add(leg);
    });
    this.addCollider(fw.x - 1.5, fw.x + 1.5, fw.z - 4, fw.z + 4);
    const fwTag = makeNameTag('🎡 Starlight Wheel', '#FF7AD9');
    fwTag.position.set(fw.x - 2, 3, fw.z);
    this.scene.add(fwTag);

    // ---- the arena building ----
    const H = 10, T = 0.6;
    const w = A.maxX - A.minX;
    const outer = std('#2A1F45', { roughness: 0.6 });
    const inner = std('#1B1430', { roughness: 0.9 });
    const floorMat = std('#241C38', { roughness: 0.7 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, A.backstage.maxZ - A.backstage.minZ + (A.maxZ - A.minZ)), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(A.centerX, 0.01, (A.backstage.minZ + A.maxZ) / 2);
    this.scene.add(floor);

    const wall = (ww, dd, x, z, h = H) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(ww, h, dd), outer);
      m.position.set(x, h / 2, z);
      this.scene.add(m);
      this.addCollider(x - ww / 2, x + ww / 2, z - dd / 2, z + dd / 2);
    };
    const dh = A.doorHalfWidth;
    const frontW = w / 2 - dh;
    wall(frontW + T, T, A.minX + frontW / 2 - T / 2, A.maxZ);
    wall(frontW + T, T, A.maxX - frontW / 2 + T / 2, A.maxZ);
    this.box(dh * 2, H - 4, T, outer, A.centerX, 4 + (H - 4) / 2, A.maxZ);
    // side walls run all the way back to the end of backstage
    const fullD = A.maxZ - A.backstage.minZ, midZ = (A.maxZ + A.backstage.minZ) / 2;
    wall(T, fullD, A.minX, midZ);
    wall(T, fullD, A.maxX, midZ);
    wall(w + T * 2, T, A.centerX, A.backstage.minZ);
    // wall between arena and backstage, with a doorway on the right side of the stage
    const bs = A.backstage;
    wall(bs.doorMinX - A.minX, T, (A.minX + bs.doorMinX) / 2, bs.maxZ);
    wall(A.maxX - bs.doorMaxX, T, (A.maxX + bs.doorMaxX) / 2, bs.maxZ);
    this.box(bs.doorMaxX - bs.doorMinX, H - 3.2, T, inner, (bs.doorMinX + bs.doorMaxX) / 2, 3.2 + (H - 3.2) / 2, bs.maxZ);
    const bsSign = makeNameTag('🎸 BACKSTAGE', '#FF7AD9');
    bsSign.position.set((bs.doorMinX + bs.doorMaxX) / 2, 3.6, bs.maxZ + 0.5);
    this.scene.add(bsSign);
    // roof
    this.box(w + T * 2, 0.4, fullD + T, std('#120D22'), A.centerX, H + 0.2, midZ);

    // front sign + neon trim
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.5), new THREE.MeshBasicMaterial({ map: signTexture('STARLIGHT ARENA', '#120D22', '#FF7AD9') }));
    sign.position.set(A.centerX, 6.2, A.maxZ + 0.32);
    this.scene.add(sign);
    [-1, 1].forEach(side => {
      const neon = new THREE.Mesh(new THREE.BoxGeometry(0.15, 9, 0.15), glow(side < 0 ? '#00E5FF' : '#FF4D8D', 2.5));
      neon.position.set(A.centerX + side * (dh + 0.4), 4.5, A.maxZ + 0.35);
      this.scene.add(neon);
    });
    const neonTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, 0.15), glow('#8A4FFF', 2.5));
    neonTop.position.set(A.centerX, H - 0.3, A.maxZ + 0.35);
    this.scene.add(neonTop);
    for (let i = 0; i < 18; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), glow(i % 2 ? '#FFD700' : '#FFFFFF', 2));
      star.position.set(A.minX + 1 + i * 1.9, 8.6 + Math.sin(i) * 0.3, A.maxZ + 0.4);
      this.scene.add(star);
    }
    this.addVenueDoor(A.centerX, A.maxZ, dh, std('#8A4FFF', { metalness: 0.5, roughness: 0.3 }));
    this.addGuard('concert', A.guard, '🎟️ Ticket Checker');

    // ---- inside: the stage ----
    const st = A.stage;
    const scx = (st.minX + st.maxX) / 2, scz = (st.minZ + st.maxZ) / 2;
    this.box(st.maxX - st.minX, st.height, st.maxZ - st.minZ, std('#111018', { roughness: 0.3, metalness: 0.4 }), scx, st.height / 2, scz, true);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(st.maxX - st.minX, 0.08, 0.12), glow('#00E5FF', 2.5));
    edge.position.set(scx, st.height + 0.02, st.maxZ);
    this.scene.add(edge);
    // giant screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), new THREE.MeshBasicMaterial({
      map: canvasTexture(512, 192, (g) => {
        const grad = g.createLinearGradient(0, 0, 512, 192);
        grad.addColorStop(0, '#FF4D8D'); grad.addColorStop(0.5, '#8A4FFF'); grad.addColorStop(1, '#00E5FF');
        g.fillStyle = grad; g.fillRect(0, 0, 512, 192);
        g.font = '64px serif'; g.textAlign = 'center';
        g.fillText('💖 🎤 ✨ 🎶 💖', 256, 90);
        g.fillStyle = '#FFF'; g.font = 'bold 34px sans-serif'; g.fillText('LIVE IN CONCERT', 256, 160);
      })
    }));
    screen.position.set(scx, st.height + 4.5, st.minZ + 0.35);
    this.scene.add(screen);
    this.concertScreen = screen;
    // speaker stacks
    A.speakers.forEach(s => {
      this.box(1.5, 2.6, 1.5, std('#1A1A1A', { roughness: 0.5 }), s.x, 1.3, s.z, true);
      [0.7, 1.9].forEach(y => {
        const cone = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), std('#333', { metalness: 0.5 }));
        cone.position.set(s.x, y, s.z + 0.76);
        this.scene.add(cone);
      });
    });
    // light truss with colorful spotlight beams
    this.box(st.maxX - st.minX + 2, 0.3, 0.3, std('#888', { metalness: 0.9, roughness: 0.3 }), scx, H - 1.5, st.maxZ + 1);
    this.beams = [];
    const beamColors = ['#FF4D8D', '#00E5FF', '#FFD700', '#8A4FFF', '#7CFFB2', '#FF7AD9'];
    beamColors.forEach((c, i) => {
      const pivot = new THREE.Group();
      pivot.position.set(st.minX + 2 + i * ((st.maxX - st.minX - 4) / (beamColors.length - 1)), H - 1.6, st.maxZ + 1);
      const beam = new THREE.Mesh(new THREE.ConeGeometry(1.2, 8, 20, 1, true), new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
      }));
      beam.position.y = -4;
      pivot.add(beam);
      this.scene.add(pivot);
      this.beams.push({ pivot, phase: i * 1.1 });
    });
    [[scx - 6, '#FF4D8D'], [scx, '#8A4FFF'], [scx + 6, '#00E5FF']].forEach(([x, c]) => {
      const l = new THREE.PointLight(c, 90, 26, 1.3);
      l.position.set(x, H - 2.5, st.maxZ + 2);
      this.scene.add(l);
    });
    const crowdLight = new THREE.PointLight('#FFE6F5', 40, 30, 1.3);
    crowdLight.position.set(A.centerX, H - 2, -12);
    this.scene.add(crowdLight);

    // sound booth & merch stand
    const b = A.booth;
    this.box(b.w, 1.1, b.d, std('#2B2B2B'), b.x, 0.55, b.z, true);
    for (let i = 0; i < 10; i++) {
      const knob = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.15), glow(['#7CFFB2', '#FFD700', '#FF4D8D'][i % 3], 1.8));
      knob.position.set(b.x - 1.6 + i * 0.35, 1.13, b.z);
      this.scene.add(knob);
    }
    const m = A.merch;
    this.box(m.w, 1.0, m.d, std('#FF8FC8'), m.x, 0.5, m.z, true);
    const merchSign = makeNameTag('👕 Merch', '#FFD700');
    merchSign.position.set(m.x, 2.6, m.z);
    this.scene.add(merchSign);
    ['#FF4D8D', '#00E5FF', '#FFD700'].forEach((c, i) => this.box(0.6, 0.7, 0.05, std(c), m.x - 0.2, 1.6, m.z - 1.2 + i * 1.2));

    // ---- backstage ----
    const bcx = A.centerX;
    [bcx - 9, bcx + 9].forEach(x => {
      const bsLight = new THREE.PointLight('#FFE2B0', 70, 24, 1.3);
      bsLight.position.set(x, 4, (bs.minZ + bs.maxZ) / 2);
      this.scene.add(bsLight);
    });
    // dressing tables with light-bulb mirrors along the back wall
    A.dressingTables.forEach(x => {
      this.box(2.4, 0.9, 0.8, std('#FFFFFF', { roughness: 0.4 }), x, 0.45, bs.minZ + 0.8, true);
      const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), glow('#A9E8FF', 0.4));
      mirror.position.set(x, 1.8, bs.minZ + 0.35);
      this.scene.add(mirror);
      for (let k = 0; k < 6; k++) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), glow('#FFF2C8', 3));
        bulb.position.set(x - 0.9 + (k % 3) * 0.9, 1.1 + Math.floor(k / 3) * 1.4, bs.minZ + 0.4);
        this.scene.add(bulb);
      }
    });
    // clothes racks
    A.racks.forEach(([x, z]) => {
      this.box(0.06, 0.06, 2.4, std('#C0C0C0', { metalness: 0.8 }), x, 1.9, z);
      ['#FF4D8D', '#FFD700', '#00E5FF', '#9C27B0'].forEach((c, i) => this.box(0.35, 1.0, 0.08, std(c), x, 1.35, z - 0.9 + i * 0.6));
      this.addCollider(x - 0.4, x + 0.4, z - 1.3, z + 1.3);
    });
    // crates & couch
    A.crates.forEach(c => this.box(1.6, 1.3, 1.4, std('#7A5230'), c.x, 0.65, c.z, true));
    const guitar = emojiSprite('🎸', 0.7);
    guitar.position.set(A.crates[0].x, 2.0, A.crates[0].z);
    this.scene.add(guitar);

    // ✨ VIP lounge corner with neon sign, sofas and a snack table
    const L = A.lounge;
    const vip = makeNameTag('✨ VIP LOUNGE ✨', '#FFD700');
    vip.position.set(L.x, 3.6, L.z);
    this.scene.add(vip);
    const rug = new THREE.Mesh(new THREE.CircleGeometry(4, 32), std('#5B1E7A'));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(L.x, 0.02, L.z);
    this.scene.add(rug);
    [-2.6, 2.6].forEach(dx => {
      this.box(1, 0.6, 3, std('#FFD700', { roughness: 0.5 }), L.x + dx, 0.3, L.z, true);
      this.box(0.3, 0.9, 3, std('#FFD700', { roughness: 0.5 }), L.x + dx * 1.17, 0.75, L.z);
    });
    this.box(1.4, 0.5, 1.4, std('#FFFFFF', { roughness: 0.3 }), L.x, 0.25, L.z, true);
    const snacks = emojiSprite('🍓', 0.5);
    snacks.position.set(L.x, 0.8, L.z);
    this.scene.add(snacks);

    // snack bar in the arena
    const sb = A.snackBar;
    this.box(sb.w, 1.0, sb.d, std('#7FD8F5'), sb.x, 0.5, sb.z, true);
    const sbSign = makeNameTag('🍿 Snacks', '#FFD700');
    sbSign.position.set(sb.x, 2.6, sb.z);
    this.scene.add(sbSign);
  }

  // ================= SKY & LIGHTS =================
  buildSkyAndLights() {
    this.scene.add(new THREE.HemisphereLight('#B9A8FF', '#2B2140', 1.4));
    const moon = new THREE.DirectionalLight('#C8D2FF', 1.2);
    moon.position.set(-30, 60, 40);
    this.scene.add(moon);

    // stars
    const starGeo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * Math.PI * 2, e = Math.random() * 0.5 + 0.08;
      pts.push(Math.cos(a) * Math.cos(e) * 380, Math.sin(e) * 380, Math.sin(a) * Math.cos(e) * 380);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#FFFFFF', size: 1.4, sizeAttenuation: false, fog: false }));
    this.scene.add(stars);
    this.stars = stars;
    const moonBall = new THREE.Mesh(new THREE.SphereGeometry(12, 24, 16), new THREE.MeshBasicMaterial({ color: '#FFF6D5', fog: false }));
    moonBall.position.set(-120, 160, -300);
    this.scene.add(moonBall);
  }

  // ================= THE DETECTIVE OFFICE =================
  buildOffice() {
    const { minX, maxX, minZ, maxZ } = OFFICE;
    const cx = OFFICE.center.x;
    const w = maxX - minX, d = maxZ - minZ, H = 4;
    const floorTex = canvasTexture(256, 256, (g, W) => {
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#7A4E2D' : '#8B5A33';
        g.fillRect(0, i * 32, W, 32);
        g.fillStyle = 'rgba(0,0,0,0.15)';
        g.fillRect((i * 97) % W, i * 32, 3, 32);
      }
    }, [4, 4]);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0, 0);
    this.scene.add(floor);

    // turquoise wallpaper with light-pink polka dots (one material per wall so the dots stay perfectly round)
    const wallpaper = (length) => new THREE.MeshStandardMaterial({
      map: canvasTexture(128, 128, (g) => {
        g.fillStyle = '#40E0D0'; g.fillRect(0, 0, 128, 128);
        g.fillStyle = '#F8A5C8';
        for (let y = 0; y < 128; y += 32) for (let x = (y / 32) % 2 * 16; x < 128; x += 32) {
          g.beginPath(); g.arc(x + 8, y + 8, 5, 0, Math.PI * 2); g.fill();
        }
      }, [length / 1.6, H / 1.6]),
      roughness: 0.8
    });
    this.box(w, H, 0.3, wallpaper(w), cx, H / 2, minZ, true);
    this.box(w, H, 0.3, wallpaper(w), cx, H / 2, maxZ, true);
    this.box(0.3, H, d, wallpaper(d), minX, H / 2, 0, true);
    this.box(0.3, H, d, wallpaper(d), maxX, H / 2, 0, true);
    this.box(w, 0.2, d, std('#2A1F3D'), cx, H + 0.1, 0);
    // gold trim
    const gold = std('#D4AF37', { metalness: 0.8, roughness: 0.3 });
    [minZ + 0.16, maxZ - 0.16].forEach(z => this.box(w, 0.1, 0.05, gold, cx, 1.1, z));

    // front door (behind where you start)
    this.box(1.6, 2.6, 0.1, std('#5A3A22'), cx, 1.3, maxZ - 0.2);
    this.box(0.12, 0.12, 0.12, gold, cx + 0.55, 1.2, maxZ - 0.3);

    // rug
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.6, 40), std('#8E2459'));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(cx, 0.01, 0);
    this.scene.add(rug);
    const rugTrim = new THREE.Mesh(new THREE.RingGeometry(2.4, 2.55, 40), gold);
    rugTrim.rotation.x = -Math.PI / 2;
    rugTrim.position.set(cx, 0.015, 0);
    this.scene.add(rugTrim);

    // the detective desk
    const { desk } = OFFICE;
    this.box(desk.w, 0.1, desk.d, std('#5C3317', { roughness: 0.35 }), desk.x, 0.8, desk.z, true);
    this.box(desk.w - 0.1, 0.72, desk.d - 0.1, std('#4A2810'), desk.x, 0.38, desk.z);
    this.box(desk.w, 0.04, 0.04, gold, desk.x, 0.86, desk.z + desk.d / 2);
    this.box(0.5, 0.02, 0.35, std('#F4F1EA'), desk.x + 0.6, 0.86, desk.z + 0.1);
    const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 16, 1, true), glow('#FFD27A', 0.8));
    lamp.position.set(desk.x - 1.1, 1.25, desk.z);
    this.scene.add(lamp);
    this.box(0.04, 0.4, 0.04, gold, desk.x - 1.1, 1.0, desk.z);
    const mag = emojiSprite('🔍', 0.35);
    mag.position.set(desk.x + 0.2, 1.05, desk.z + 0.2);
    this.scene.add(mag);

    // bookshelf
    this.box(2.4, 3, 0.5, std('#3B2314'), cx - 4.5, 1.5, minZ + 0.45, true);
    const bookColors = ['#E63B7A', '#00A6B4', '#D4AF37', '#9C27B0', '#F4F1EA', '#2B2B2B'];
    for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) {
      this.box(0.2, 0.5, 0.35, std(bookColors[(row * 9 + i) % bookColors.length]), cx - 5.5 + i * 0.25, 0.45 + row * 0.7, minZ + 0.66);
    }

    // city window
    const cityTex = canvasTexture(256, 160, (g, W, Hh) => {
      const grad = g.createLinearGradient(0, 0, 0, Hh);
      grad.addColorStop(0, '#1A1145'); grad.addColorStop(1, '#5B2A86');
      g.fillStyle = grad; g.fillRect(0, 0, W, Hh);
      for (let i = 0; i < 14; i++) {
        const bw = 12 + Math.random() * 20, bh = 40 + Math.random() * 90, bx = i * 19;
        g.fillStyle = '#0D0A1F'; g.fillRect(bx, Hh - bh, bw, bh);
        g.fillStyle = '#FFD27A';
        for (let k = 0; k < 8; k++) if (Math.random() > 0.4) g.fillRect(bx + 3 + (k % 2) * 6, Hh - bh + 6 + Math.floor(k / 2) * 10, 3, 4);
      }
    });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.9), new THREE.MeshBasicMaterial({ map: cityTex }));
    win.position.set(cx + 3.5, 2.1, minZ + 0.17);
    this.scene.add(win);
    this.box(3.2, 0.12, 0.12, gold, cx + 3.5, 3.1, minZ + 0.2);
    this.box(3.2, 0.12, 0.12, gold, cx + 3.5, 1.1, minZ + 0.2);

    // magic wardrobe mirror + clothes rack
    const { mirror } = OFFICE;
    this.box(0.15, 2.8, 1.6, gold, mirror.x - 0.1, 1.5, mirror.z, true);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 2.5), glow('#A9E8FF', 0.55));
    glass.rotation.y = Math.PI / 2;
    glass.position.set(mirror.x + 0.0, 1.5, mirror.z);
    this.scene.add(glass);
    this.mirrorGlass = glass;
    const mirrorTag = makeNameTag('✨ Magic Wardrobe Mirror', '#7FE7FF');
    mirrorTag.position.set(mirror.x + 0.3, 3.1, mirror.z);
    this.scene.add(mirrorTag);
    this.box(0.05, 0.05, 2.2, gold, mirror.x + 0.3, 2.0, mirror.z + 2.4);
    ['#C29B38', '#1A183A', '#9C27B0', '#800020', '#FBF5E8'].forEach((c, i) => {
      this.box(0.35, 1.0, 0.08, std(c), mirror.x + 0.3, 1.45, mirror.z + 1.5 + i * 0.42);
    });
    this.addCollider(mirror.x, mirror.x + 0.6, mirror.z + 1.2, mirror.z + 3.6);
    this.addInteractable({ id: 'mirror', kind: 'mirror', label: 'open the Magic Wardrobe Mirror', pos: { x: mirror.x + 0.5, z: mirror.z }, range: 2.4 });

    // plant
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.5, 16), std('#D4AF37', { metalness: 0.5 }));
    pot.position.set(maxX - 0.8, 0.25, minZ + 0.8);
    this.scene.add(pot);
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), std('#3E8E5E'));
    leaves.position.set(maxX - 0.8, 1.0, minZ + 0.8);
    this.scene.add(leaves);

    const light = new THREE.PointLight('#FFE2B0', 30, 18, 1.5);
    light.position.set(cx, 3.4, 0);
    this.scene.add(light);

    // magic portal (appears when you take the case)
    this.officePortal = this.makePortal('#FF7AD9');
    this.officePortal.position.set(OFFICE.portal.x, 0, OFFICE.portal.z);
    this.officePortal.rotation.y = -Math.PI / 2;
    this.officePortal.visible = false;
    this.scene.add(this.officePortal);
  }

  makePortal(color) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.09, 12, 48), glow(color, 2));
    ring.position.y = 1.3;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.05, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    disc.position.y = 1.3;
    g.add(ring, disc);
    const sparkles = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), glow(i % 2 ? '#FFD700' : '#FFFFFF', 2));
      s.userData.a = (i / 14) * Math.PI * 2;
      sparkles.add(s);
    }
    sparkles.position.y = 1.3;
    g.add(sparkles);
    g.userData = { ring, disc, sparkles };
    return g;
  }

  // ================= PARKING LOT =================
  buildParkingLot() {
    const { minX, maxX, minZ, maxZ } = PARKING;
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std('#1E3A2A'));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(0, -0.02, 0);
    this.scene.add(grass);

    const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(maxX - minX, maxZ - minZ), std('#3A3A44', { roughness: 0.95 }));
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(0, 0, (minZ + maxZ) / 2);
    this.scene.add(asphalt);

    // parking space lines
    const lineMat = std('#E8E8F0');
    PARKING.rows.forEach(rowZ => {
      PARKING.carXs.forEach(x => [-3.5, 3.5].forEach(dx => this.box(0.12, 0.02, 5, lineMat, x + dx, 0.01, rowZ)));
    });

    // cars!
    PARKING.cars.forEach((car, i) => this.buildCar(car.x, car.z, PARKING.carColors[i % PARKING.carColors.length], car.flip ? Math.PI : 0));

    // hedges around the lot
    const hedge = std('#2F5E3A');
    this.box(0.8, 1.2, maxZ - minZ, hedge, minX, 0.6, (minZ + maxZ) / 2, true);
    this.box(0.8, 1.2, maxZ - minZ, hedge, maxX, 0.6, (minZ + maxZ) / 2, true);
    this.box(maxX - minX, 1.2, 0.8, hedge, 0, 0.6, maxZ, true);
    this.box(maxX - GALA.maxX, 1.2, 0.8, hedge, (GALA.maxX + maxX) / 2, 0.6, 0.2, true);
    this.box(GALA.minX - minX, 1.2, 0.8, hedge, (GALA.minX + minX) / 2, 0.6, 0.2, true);

    // lamp posts
    PARKING.lamps.forEach(([x, z], i) => {
      this.box(0.15, 4, 0.15, std('#2B2B2B', { metalness: 0.6 }), x, 2, z, true);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), glow('#FFE7A8', 2.5));
      bulb.position.set(x, 4.1, z);
      this.scene.add(bulb);
      if (i < 4) {
        const l = new THREE.PointLight('#FFE0A0', 40, 22, 1.4);
        l.position.set(x, 3.8, z);
        this.scene.add(l);
      }
    });

    // red carpet
    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 12), std('#B3123E'));
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.015, 6);
    this.scene.add(carpet);
    [-2.6, 2.6].forEach(x => [3, 6, 9, 12].forEach(z => {
      this.box(0.08, 0.9, 0.08, std('#D4AF37', { metalness: 0.8 }), x, 0.45, z);
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), std('#D4AF37', { metalness: 0.8 }));
      top.position.set(x, 0.95, z);
      this.scene.add(top);
    }));

    this.boutiqueVan(PARKING.van);
    this.addHomePortal(PARKING.homePortal);
  }

  wheel(x, z) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16), std('#151515'));
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.38, z);
    this.scene.add(w);
  }

  buildCar(x, z, color, rotY) {
    const car = new THREE.Group();
    const paint = std(color, { metalness: 0.5, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.75, 4.2), paint);
    body.position.y = 0.65;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.2), std('#5A78B0', { metalness: 0.3, roughness: 0.15 }));
    cabin.position.set(0, 1.3, -0.2);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.08, 2.0), paint);
    roof.position.set(0, 1.62, -0.2);
    car.add(body, cabin, roof);
    [[-1, -1.3], [1, -1.3], [-1, 1.3], [1, 1.3]].forEach(([sx, sz]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.3, 14), std('#151515'));
      w.rotation.z = Math.PI / 2;
      w.position.set(sx * 0.95, 0.36, sz);
      car.add(w);
    });
    [-0.65, 0.65].forEach(sx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.05), glow('#FFF6D0', 1.2));
      hl.position.set(sx, 0.75, -2.11);
      car.add(hl);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.05), glow('#FF2A4A', 1));
      tl.position.set(sx, 0.75, 2.11);
      car.add(tl);
    });
    car.position.set(x, 0, z);
    car.rotation.y = rotY;
    this.scene.add(car);
    this.addCollider(x - 1.05, x + 1.05, z - 2.15, z + 2.15);
  }

  // ================= THE GRAND GALA BALLROOM =================
  buildGala() {
    const { minX, maxX, minZ, maxZ, doorHalfWidth: dh } = GALA;
    const H = 10, T = 0.6;
    const w = maxX - minX, d = maxZ - minZ, cz = (minZ + maxZ) / 2;
    const stone = std('#EFE6D8', { roughness: 0.85 });
    const inner = std('#F6E7EF', { roughness: 0.8 });

    // floor (checkered marble)
    const marble = canvasTexture(256, 256, (g) => {
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
        g.fillStyle = (x + y) % 2 ? '#F3EEF5' : '#2A2140';
        g.fillRect(x * 64, y * 64, 64, 64);
      }
    }, [14, 16]);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: marble, roughness: 0.25, metalness: 0.1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.01, cz);
    this.scene.add(floor);

    // walls (outside is stone, inside is soft pink)
    const wall = (ww, dd, x, z, mats) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(ww, H, dd), mats);
      m.position.set(x, H / 2, z);
      this.scene.add(m);
      this.addCollider(x - ww / 2, x + ww / 2, z - dd / 2, z + dd / 2);
    };
    const frontW = (w / 2) - dh;
    wall(frontW + T, T, minX + frontW / 2 - T / 2, maxZ, [stone, stone, stone, stone, stone, inner]);
    wall(frontW + T, T, maxX - frontW / 2 + T / 2, maxZ, [stone, stone, stone, stone, stone, inner]);
    wall(w + T * 2, T, 0, minZ, [stone, stone, stone, stone, inner, stone]);
    // west wall has an arched doorway into the secret garden
    const gd = GALA.gardenDoor;
    wall(T, maxZ - gd.maxZ, minX, (maxZ + gd.maxZ) / 2, [inner, stone, stone, stone, stone, stone]);
    wall(T, gd.minZ - minZ, minX, (gd.minZ + minZ) / 2, [inner, stone, stone, stone, stone, stone]);
    this.box(T, H - 4, gd.maxZ - gd.minZ, stone, minX, 4 + (H - 4) / 2, (gd.minZ + gd.maxZ) / 2);
    const gardenTag = makeNameTag('🌷 Secret Garden', '#7CFFB2');
    gardenTag.position.set(minX + 0.8, 4.4, (gd.minZ + gd.maxZ) / 2);
    this.scene.add(gardenTag);
    wall(T, d, maxX, cz, [stone, inner, stone, stone, stone, stone]);
    // above the door
    this.box(dh * 2, H - 4, T, stone, 0, 4 + (H - 4) / 2, maxZ);
    // roof / ceiling
    this.box(w + T * 2, 0.4, d + T, std('#2A1F45'), 0, H + 0.2, cz);

    // front decorations
    const gold = std('#D4AF37', { metalness: 0.85, roughness: 0.25 });
    [-(dh + 6), -(dh + 1.6), dh + 1.6, dh + 6].forEach(x => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 8, 20), std('#FFFFFF', { roughness: 0.5 }));
      col.position.set(x, 4, maxZ + 1.2);
      this.scene.add(col);
      this.addCollider(x - 0.55, x + 0.55, maxZ + 0.65, maxZ + 1.75);
      this.box(1.4, 0.3, 1.4, gold, x, 8.1, maxZ + 1.2);
    });
    this.box(2 * (dh + 7.5), 0.6, 2.4, stone, 0, 8.5, maxZ + 1.3);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: signTexture('THE GRAND GALA') }));
    sign.position.set(0, 5.6, maxZ + 0.32);
    this.scene.add(sign);
    for (let x = minX + 3; x <= maxX - 3; x += 5) {
      if (Math.abs(x) < 5) continue;
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), glow('#FFC56E', 0.9));
      win.position.set(x, 4.5, maxZ + 0.31);
      this.scene.add(win);
    }
    // the front doors (open when the guard lets you in)
    this.addVenueDoor(0, maxZ, dh, std('#6B3F1F', { roughness: 0.4 }));
    this.box(dh * 2 + 0.3, 0.2, 0.3, gold, 0, 3.9, maxZ + 0.1);

    // dance floor
    const { danceCenter: dc, danceRadius: dr } = GALA;
    const dance = new THREE.Mesh(new THREE.CircleGeometry(dr, 48), std('#E8C87A', { metalness: 0.6, roughness: 0.2 }));
    dance.rotation.x = -Math.PI / 2;
    dance.position.set(dc.x, 0.02, dc.z);
    this.scene.add(dance);
    const ring = new THREE.Mesh(new THREE.RingGeometry(dr - 0.25, dr, 48), std('#8E2459'));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(dc.x, 0.03, dc.z);
    this.scene.add(ring);

    // round tables
    GALA.tables.forEach(t => {
      const cloth = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.78, 24), std('#FFFFFF', { roughness: 0.9 }));
      cloth.position.set(t.x, 0.39, t.z);
      this.scene.add(cloth);
      const runner = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.05, 24), std('#9C27B0'));
      runner.position.set(t.x, 0.79, t.z);
      this.scene.add(runner);
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8), std('#FFF6E0'));
      candle.position.set(t.x, 0.98, t.z);
      this.scene.add(candle);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), glow('#FFB347', 3));
      flame.position.set(t.x, 1.2, t.z);
      this.scene.add(flame);
      const cake = emojiSprite('🧁', 0.4);
      cake.position.set(t.x + 0.5, 1.0, t.z + 0.2);
      this.scene.add(cake);
      this.addCollider(t.x - 1.3, t.x + 1.3, t.z - 1.3, t.z + 1.3);
    });

    // pillars inside
    [minX + 1, maxX - 1].forEach(x => GALA.pillarZ.forEach(z => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, H, 16), std('#FFFFFF', { roughness: 0.4 }));
      p.position.set(x, H / 2, z);
      this.scene.add(p);
      this.box(0.9, 0.3, 0.9, gold, x, H - 0.3, z);
      const sconce = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), glow('#FFD27A', 2.5));
      sconce.position.set(x * 0.95, 3.2, z);
      this.scene.add(sconce);
    }));

    // stage with velvet curtains
    const st = GALA.stage;
    this.box(st.maxX - st.minX, 0.6, st.maxZ - st.minZ, std('#4A1E6B'), (st.minX + st.maxX) / 2, 0.3, (st.minZ + st.maxZ) / 2, true);
    this.box(st.maxX - st.minX, 0.08, 0.1, gold, 0, 0.62, st.maxZ);
    for (let x = st.minX; x <= st.maxX; x += 0.7) {
      const fold = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, H - 0.6, 10), std('#B3123E', { roughness: 0.9 }));
      fold.position.set(x, (H + 0.6) / 2, minZ + 0.5);
      this.scene.add(fold);
    }
    const stageSign = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), new THREE.MeshBasicMaterial({ map: signTexture('HAUTEVILLE FASHION WEEK', '#2A1F45', '#FFD700') }));
    stageSign.position.set(0, 7, minZ + 0.8);
    this.scene.add(stageSign);

    // chandeliers with real lights
    GALA.chandelierZ.forEach(z => {
      const g = new THREE.Group();
      const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 8, 32), gold);
      ringC.rotation.x = Math.PI / 2;
      g.add(ringC);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.1), glow(i % 2 ? '#FFFFFF' : '#BFEFFF', 1.8));
        crystal.position.set(Math.cos(a) * 1.2, -0.25 - (i % 3) * 0.12, Math.sin(a) * 1.2);
        g.add(crystal);
      }
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), glow('#FFF2C8', 2.5));
      core.position.y = -0.4;
      g.add(core);
      g.position.set(0, H - 1.4, z);
      this.scene.add(g);
      const l = new THREE.PointLight('#FFE6C0', 140, 40, 1.2);
      l.position.set(0, H - 2.2, z);
      this.scene.add(l);
    });

    this.addGuard('gala', GALA.guard, '🛡️ Gala Guard');
  }

  // ================= 🌷 THE SECRET GARDEN (next to the ballroom) =================
  buildGarden() {
    const G = GARDEN;
    const cx = (G.minX + G.maxX) / 2, cz = (G.minZ + G.maxZ) / 2;
    const w = G.maxX - G.minX, d = G.maxZ - G.minZ;
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(w, d), std('#3E7A4A', { roughness: 1 }));
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(cx, 0.005, cz);
    this.scene.add(lawn);
    // stone paths in a cross
    const path = std('#D8CFC0', { roughness: 0.9 });
    this.box(w, 0.02, 3, path, cx, 0.012, G.fountain.z);
    this.box(3, 0.02, d, path, G.fountain.x, 0.012, cz);

    // tall hedge walls around the garden
    const hedge = std('#3F7F4E', { roughness: 1 });
    const HH = 2.6;
    // garden lamps so you can see at night
    [[-40, -4], [-64, -4], [-40, -60], [-64, -60], [-46, -31], [-58, -31]].forEach(([x, z], i) => {
      this.box(0.12, 3, 0.12, std('#2B2B2B', { metalness: 0.6 }), x, 1.5, z, true);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), glow('#FFE7A8', 2.5));
      bulb.position.set(x, 3.1, z);
      this.scene.add(bulb);
      if (i < 4) {
        const l = new THREE.PointLight('#FFE2B0', 45, 24, 1.3);
        l.position.set(x, 3, z);
        this.scene.add(l);
      }
    });
    this.box(0.8, HH, d, hedge, G.minX, HH / 2, cz, true);
    this.box(w, HH, 0.8, hedge, cx, HH / 2, G.minZ, true);
    this.box(w, HH, 0.8, hedge, cx, HH / 2, G.maxZ, true);
    G.hedges.forEach(h => this.box(h.maxX - h.minX, HH * 0.75, h.maxZ - h.minZ, hedge, (h.minX + h.maxX) / 2, HH * 0.375, (h.minZ + h.maxZ) / 2, true));

    // fairy lights on top of the hedges
    const fairy = ['#FFE7A8', '#FF9ED2', '#7FE7FF'];
    for (let i = 0; i < 48; i++) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), glow(fairy[i % 3], 3));
      const t = i / 48;
      if (t < 0.5) bulb.position.set(G.minX + 0.5, HH + 0.1, G.maxZ - t * 2 * d);
      else bulb.position.set(G.minX + (t - 0.5) * 2 * w, HH + 0.1, G.minZ + 0.5);
      this.scene.add(bulb);
    }

    // the fountain
    const f = G.fountain;
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(f.r, f.r + 0.2, 0.7, 32), std('#EFE6D8', { roughness: 0.6 }));
    basin.position.set(f.x, 0.35, f.z);
    const water = new THREE.Mesh(new THREE.CircleGeometry(f.r - 0.2, 32), glow('#5BC0EB', 0.5));
    water.rotation.x = -Math.PI / 2;
    water.position.set(f.x, 0.62, f.z);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2, 16), std('#EFE6D8'));
    pillar.position.set(f.x, 1.3, f.z);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.4, 0.35, 24), std('#EFE6D8'));
    bowl.position.set(f.x, 2.3, f.z);
    const spray = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#BFEFFF', transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
    spray.position.set(f.x, 3.1, f.z);
    spray.rotation.x = Math.PI;
    this.scene.add(basin, water, pillar, bowl, spray);
    this.fountainSpray = spray;
    this.addCollider(f.x - f.r, f.x + f.r, f.z - f.r, f.z + f.r);
    const fl = new THREE.PointLight('#9FE8FF', 30, 16, 1.4);
    fl.position.set(f.x, 2, f.z);
    this.scene.add(fl);

    // the gazebo
    const gz = G.gazebo;
    const white = std('#FFFFFF', { roughness: 0.5 });
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(gz.r, gz.r, 0.2, 6), white);
    floor.position.set(gz.x, 0.1, gz.z);
    this.scene.add(floor);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const px = gz.x + Math.cos(a) * (gz.r - 0.3), pz = gz.z + Math.sin(a) * (gz.r - 0.3);
      if (Math.sin(a) > 0.8) continue; // leave the front open as the entrance
      this.box(0.25, 3.2, 0.25, white, px, 1.7, pz, true);
    }
    const roof = new THREE.Mesh(new THREE.ConeGeometry(gz.r + 0.6, 2, 6), std('#C2185B', { roughness: 0.6 }));
    roof.position.set(gz.x, 4.3, gz.z);
    roof.rotation.y = Math.PI / 6;
    this.scene.add(roof);
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), glow('#FFE7A8', 2.5));
    lantern.position.set(gz.x, 3, gz.z);
    this.scene.add(lantern);
    const gl = new THREE.PointLight('#FFE2B0', 30, 14, 1.4);
    gl.position.set(gz.x, 2.8, gz.z);
    this.scene.add(gl);

    // benches
    G.benches.forEach(b => {
      this.box(2, 0.12, 0.6, std('#8B5A33'), b.x, 0.5, b.z, true);
      this.box(2, 0.5, 0.1, std('#8B5A33'), b.x, 0.85, b.z - 0.3);
    });

    // trees
    G.trees.forEach(t => {
      this.box(0.4, 2.4, 0.4, std('#5C3A21'), t.x, 1.2, t.z, true);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), std('#2E6B3C', { roughness: 1 }));
      crown.position.set(t.x, 3.4, t.z);
      this.scene.add(crown);
    });

    // flower beds
    const petals = ['#FF4D8D', '#FFD700', '#FFFFFF', '#B388FF', '#FF8A65'];
    [[-46, -14], [-58, -14], [-46, -48], [-58, -48]].forEach(([x, z], k) => {
      this.box(4, 0.3, 2, std('#5C3A21'), x, 0.15, z, true);
      for (let i = 0; i < 14; i++) {
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 4), std(petals[(i + k) % petals.length], { roughness: 0.6 }));
        fl.position.set(x - 1.7 + (i % 7) * 0.57, 0.45, z - 0.5 + Math.floor(i / 7) * 0.9);
        this.scene.add(fl);
      }
    });
  }

  // ================= MYSTERY CHARACTERS & CLUES =================
  clearMystery() {
    this.mysteryStuff.forEach(o => this.scene.remove(o));
    this.mysteryStuff = [];
    this.npcs = [];
    this.clueObjects.clear();
    this.interactables = this.interactables.filter(i => !i.mystery);
  }

  loadMystery(mystery, foundClueIds = new Set()) {
    this.clearMystery();
    const add = (obj) => { this.scene.add(obj); this.mysteryStuff.push(obj); return obj; };

    // client waiting in the office
    const client = new Character(mystery.clientLook, { name: `${mystery.client.emoji} ${mystery.client.name}`, eyeSeed: 2 });
    client.root.position.set(OFFICE.client.x, 0, OFFICE.client.z);
    add(client.root);
    this.npcs.push({ char: client, kind: 'client', home: { ...OFFICE.client }, lookAtPlayer: true });
    this.addInteractable({ id: 'client', kind: 'client', mystery: true, label: `talk to ${mystery.client.name}`, pos: { x: OFFICE.client.x, z: OFFICE.client.z }, range: 3.4 });

    // suspects
    mystery.suspects.forEach((s, i) => {
      const ch = new Character(s.look, { name: `${s.emoji} ${s.name}`, eyeSeed: i + 3 });
      ch.root.position.set(s.spot.x, 0, s.spot.z);
      ch.root.rotation.y = s.spot.face;
      ch.setPose(s.spot.pose);
      if (s.spot.pose === 'hide' && ch.tag) ch.tag.position.y = 1.5;
      add(ch.root);
      this.npcs.push({ char: ch, kind: 'suspect', lookAtPlayer: s.spot.pose !== 'hide' });
      this.addInteractable({ id: s.id, kind: 'suspect', mystery: true, label: `question ${s.name}`, pos: { x: s.spot.x, z: s.spot.z }, range: 2.8, data: s });
    });

    // the crowd: waltzing dancers, or a pop star with cheering fans
    mystery.crowd.forEach((pp, i) => {
      const ch = new Character(pp.look, { name: pp.tag, eyeSeed: i });
      ch.setPose(pp.pose);
      add(ch.root);
      const npc = { char: ch, kind: 'crowd', orbit: pp.orbit ? { ...pp.orbit } : null };
      const pos = { x: pp.x ?? 0, z: pp.z ?? 0 };
      if (!pp.orbit) {
        ch.root.position.set(pp.x, pp.y || 0, pp.z);
        ch.root.rotation.y = pp.face || 0;
      }
      npc.pos = pos;
      this.npcs.push(npc);
      // people on the stage are up high, so you can talk to them from the front edge
      const range = pp.y ? 5 : 1.9;
      this.addInteractable({ id: pp.id, kind: 'crowd', mystery: true, label: `chat with the ${pp.name === 'Concert Fan' || pp.name === 'Gala Dancer' || pp.name === 'Backup Dancer' ? pp.name.toLowerCase() : pp.name}`, pos, range, data: pp });
    });

    // shy people hiding
    mystery.hiders.forEach((h, i) => {
      const ch = new Character(h.look, { eyeSeed: i + 1 });
      ch.setPose('hide');
      ch.root.position.set(h.spot.x, 0, h.spot.z);
      add(ch.root);
      this.npcs.push({ char: ch, kind: 'hider' });
      ch.root.rotation.y = h.spot.face || 0;
      this.addInteractable({ id: h.id, kind: 'hider', mystery: true, label: 'peek at the person hiding', pos: { x: h.spot.x, z: h.spot.z }, range: 2.6, data: h });
    });

    // sparkly clues
    mystery.clues.forEach(c => {
      if (foundClueIds.has(c.id)) return;
      const g = new THREE.Group();
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), glow('#FFD700', 2.2));
      gem.position.y = 0.4;
      const halo = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.5, 32), new THREE.MeshBasicMaterial({ color: '#7FE7FF', transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 0.04;
      const icon = emojiSprite('🔍', 0.45);
      icon.position.y = 1.0;
      g.add(gem, halo, icon);
      g.position.set(c.spot.x, 0, c.spot.z);
      g.userData = { gem, halo, icon };
      add(g);
      this.clueObjects.set(c.id, g);
      this.addInteractable({ id: c.id, kind: 'clue', mystery: true, label: 'inspect the sparkly clue', pos: { x: c.spot.x, z: c.spot.z }, range: 2.0, data: c });
    });
  }

  removeClue(id) {
    const obj = this.clueObjects.get(id);
    if (obj) this.scene.remove(obj);
    this.clueObjects.delete(id);
    this.interactables = this.interactables.filter(i => i.id !== id);
  }

  setDoorOpen(open) {
    this.doorOpen = open;
    this.venueDoors.forEach(door => door.panels.forEach((d, i) => {
      d.position.x = door.cx + (i ? 1 : -1) * (open ? door.halfWidth * 1.5 : door.halfWidth / 2);
    }));
    // guards step aside when the doors open
    Object.values(this.guards).forEach(g => { g.char.root.position.z = open ? g.spot.z + 1.6 : g.spot.z; });
  }

  showOfficePortal(show) {
    this.officePortal.visible = show;
  }

  setPlayerLook(look) {
    this.playerChar.setLook(look);
  }

  // where: 'office', 'gala' or 'concert'
  teleport(where) {
    const p = where === 'office' ? OFFICE.spawn : where === 'concert' ? PLAZA.arrival : PARKING.arrival;
    Object.assign(this.player, { x: p.x, z: p.z, yaw: p.yaw, pitch: 0, y: 0, vy: 0 });
    this.portalCooldown = 1.5;
  }

  // only light up the place you're in (lights are expensive for the computer!)
  setActivePlace(place) {
    if (this.activePlace === place) return;
    this.activePlace = place;
    Object.entries(this.placeLights).forEach(([k, lights]) => lights.forEach(l => { l.visible = k === place; }));
  }

  // ================= OTHER PLAYERS (FRIENDS ON YOUR SERVER) =================
  addRemotePlayer(id, name, look) {
    this.removeRemotePlayer(id);
    const ch = new Character(look || {}, { name: `👯 ${name}`, tagColor: '#7FE7FF' });
    this.scene.add(ch.root);
    this.remotes.set(id, { char: ch, target: null });
  }

  updateRemotePlayer(id, state) {
    const r = this.remotes.get(id);
    if (!r) return;
    if (!r.target) r.char.root.position.set(state.x, state.y || 0, state.z);
    r.target = state;
  }

  setRemoteLook(id, look) {
    this.remotes.get(id)?.char.setLook(look);
  }

  removeRemotePlayer(id) {
    const r = this.remotes.get(id);
    if (r) this.scene.remove(r.char.root);
    this.remotes.delete(id);
  }

  getPlayerState() {
    const p = this.player;
    return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2), yaw: +p.yaw.toFixed(3), moving: p.moving, area: p.area };
  }

  // ================= CONTROLS =================
  setupInput() {
    const canvas = this.renderer.domElement;
    const typing = (e) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
    window.addEventListener('keydown', (e) => {
      if (!this.running || typing(e)) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (!this.inputEnabled) return;
      if (e.code === 'KeyE' && this.target) this.hooks.onInteract?.(this.target);
      if (e.code === 'KeyV') this.toggleView();
      if (e.code === 'Space' && this.player.y <= 0.001) this.player.vy = 5.2;
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());

    // Look around by holding a mouse button (or a finger) and dragging, like in Roblox.
    // The mouse is never trapped, so you can always click buttons or leave the game.
    let drag = null;
    canvas.addEventListener('pointerdown', (e) => {
      if (!this.running || !this.inputEnabled) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      canvas.setPointerCapture?.(e.pointerId);
      canvas.classList.add('dragging');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId || !this.inputEnabled) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      if (Math.abs(dx) > 200 || Math.abs(dy) > 200) return; // ignore glitchy jumps
      this.player.yaw -= dx * 0.005;
      this.player.pitch = Math.max(-1.2, Math.min(1.2, this.player.pitch - dy * 0.004));
    });
    const endDrag = () => { drag = null; canvas.classList.remove('dragging'); };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  setInputEnabled(enabled) {
    this.inputEnabled = enabled;
    if (!enabled) {
      this.keys.clear();
    }
  }

  toggleView() {
    this.thirdPerson = !this.thirdPerson;
    return this.thirdPerson;
  }

  // ================= GAME LOOP =================
  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    this.keys.clear();
  }

  resize() {
    const w = this.container.clientWidth || 800, h = this.container.clientHeight || 500;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  collides(x, z, r = PLAYER_RADIUS) {
    const hit = (c) => x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ;
    if (!this.doorOpen && this.venueDoors.some(d => hit(d.collider))) return true;
    return this.colliders.some(hit);
  }

  updatePlayer(dt) {
    const p = this.player;
    const k = this.keys;
    let f = 0, s = 0;
    if (this.inputEnabled) {
      if (k.has('KeyW') || k.has('ArrowUp')) f += 1;
      if (k.has('KeyS') || k.has('ArrowDown')) f -= 1;
      if (k.has('KeyD')) s += 1;
      if (k.has('KeyA')) s -= 1;
      if (k.has('ArrowLeft')) p.yaw += TURN_SPEED * dt;
      if (k.has('ArrowRight')) p.yaw -= TURN_SPEED * dt;
    }
    const len = Math.hypot(f, s);
    p.moving = len > 0;
    if (len > 0) {
      const speed = (k.has('ShiftLeft') || k.has('ShiftRight')) ? RUN_SPEED : WALK_SPEED;
      const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
      const rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
      const dx = ((fx * f + rx * s) / len) * speed * dt;
      const dz = ((fz * f + rz * s) / len) * speed * dt;
      if (!this.collides(p.x + dx, p.z)) p.x += dx;
      if (!this.collides(p.x, p.z + dz)) p.z += dz;
    }
    // jumping
    p.vy -= 14 * dt;
    p.y = Math.max(0, p.y + p.vy * dt);
    if (p.y === 0) p.vy = Math.max(0, p.vy);

    this.setActivePlace(placeOf(p.x));
    const area = areaAt(p.x, p.z);
    if (area !== p.area) {
      p.area = area;
      this.hooks.onAreaChange?.(area);
    }

    // walking into a portal
    this.portalCooldown = Math.max(0, this.portalCooldown - dt);
    if (this.portalCooldown === 0) {
      if (this.officePortal.visible && Math.hypot(p.x - OFFICE.portal.x, p.z - OFFICE.portal.z) < 1.0) {
        this.portalCooldown = 4;
        this.hooks.onPortal?.('to-venue');
      } else if (this.homePortals.some(hp => Math.hypot(p.x - hp.position.x, p.z - hp.position.z) < 1.0)) {
        this.portalCooldown = 4;
        this.hooks.onPortal?.('to-office');
      }
    }
  }

  updateCamera() {
    const p = this.player;
    const cam = this.camera;
    this.playerChar.root.visible = this.thirdPerson;
    this.playerChar.root.position.set(p.x, p.y, p.z);
    this.playerChar.root.rotation.y = p.yaw + Math.PI;
    if (!this.thirdPerson) {
      cam.position.set(p.x, p.y + EYE_HEIGHT, p.z);
      cam.rotation.set(p.pitch, p.yaw, 0);
      return;
    }
    // third person: camera floats behind you (and slides in if a wall is in the way)
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
    let dist = 3.4;
    while (dist > 0.6 && this.collides(p.x - fx * dist, p.z - fz * dist, 0.15)) dist -= 0.2;
    const lift = 0.5 + Math.sin(-p.pitch) * dist * 0.6;
    cam.position.set(p.x - fx * dist, p.y + 1.6 + lift, p.z - fz * dist);
    cam.lookAt(p.x + fx * 2, p.y + 1.4 + Math.sin(p.pitch) * 2, p.z + fz * 2);
  }

  updateNPCs(dt) {
    const p = this.player;
    for (const npc of this.npcs) {
      const ch = npc.char;
      if (npc.orbit) {
        const o = npc.orbit;
        o.angle += dt * 0.25 * o.dir;
        const x = o.cx + Math.cos(o.angle) * o.radius;
        const z = o.cz + Math.sin(o.angle) * o.radius;
        ch.root.position.set(x, 0, z);
        ch.root.rotation.y = -o.angle * o.dir;
        npc.pos.x = x; npc.pos.z = z;
      } else if (npc.lookAtPlayer) {
        const r = ch.root.position;
        if (Math.hypot(p.x - r.x, p.z - r.z) < 6) {
          const want = Math.atan2(p.x - r.x, p.z - r.z);
          let diff = want - ch.root.rotation.y;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          ch.root.rotation.y += diff * Math.min(1, dt * 4);
        }
      }
      ch.update(dt);
    }
    Object.values(this.guards).forEach(g => g.char.update(dt));

    // friends: glide smoothly toward their latest position
    for (const r of this.remotes.values()) {
      if (!r.target) continue;
      const root = r.char.root;
      const t = Math.min(1, dt * 10);
      root.position.x += (r.target.x - root.position.x) * t;
      root.position.y += ((r.target.y || 0) - root.position.y) * t;
      root.position.z += (r.target.z - root.position.z) * t;
      let diff = (r.target.yaw + Math.PI) - root.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      root.rotation.y += diff * t;
      r.char.setPose(r.target.moving ? 'walk' : 'idle');
      r.char.update(dt);
    }

    this.playerChar.setPose(p.moving ? 'walk' : 'idle');
    this.playerChar.update(dt);
  }

  updateEffects(dt) {
    this.time += dt;
    const t = this.time;
    for (const portal of [this.officePortal, ...this.homePortals]) {
      const { ring, sparkles, disc } = portal.userData;
      ring.rotation.z = t * 0.8;
      disc.material.opacity = 0.25 + Math.sin(t * 3) * 0.1;
      sparkles.children.forEach((s, i) => {
        const a = s.userData.a + t * 1.4;
        const r = 1.1 + Math.sin(t * 3 + i) * 0.12;
        s.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
        s.rotation.y = t * 3;
      });
    }
    for (const obj of this.clueObjects.values()) {
      const { gem, halo, icon } = obj.userData;
      gem.rotation.y = t * 2.5;
      gem.position.y = 0.4 + Math.sin(t * 3) * 0.08;
      const s = 1 + Math.sin(t * 4) * 0.2;
      halo.scale.set(s, s, s);
      icon.position.y = 1.0 + Math.sin(t * 2) * 0.08;
    }
    if (this.ferrisWheel) {
      const spin = t * 0.12;
      this.ferrisWheel.rotation.z = spin;
      const fw = PLAZA.ferrisWheel, R = 9;
      this.ferrisCabins.forEach(c => {
        const a = c.userData.a + spin;
        c.position.set(fw.x, R + 1.5 + Math.sin(a) * R - 0.9, fw.z - Math.cos(a) * R);
      });
    }
    if (this.fountainSpray) this.fountainSpray.scale.y = 1 + Math.sin(t * 5) * 0.08;
    this.beams?.forEach(b => {
      b.pivot.rotation.z = Math.sin(t * 0.9 + b.phase) * 0.45;
      b.pivot.rotation.x = 0.35 + Math.cos(t * 0.7 + b.phase) * 0.25;
    });
    if (this.mirrorGlass) this.mirrorGlass.material.emissiveIntensity = 0.45 + Math.sin(t * 2) * 0.15;
  }

  updateTarget() {
    const p = this.player;
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
    let best = null, bestScore = Infinity;
    for (const it of this.interactables) {
      const dx = it.pos.x - p.x, dz = it.pos.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > (it.range || 2.5)) continue;
      const facing = dist < 0.01 ? 1 : (dx * fx + dz * fz) / dist;
      if (facing < 0.25 && dist > 1.4) continue;
      const score = dist - facing;
      if (score < bestScore) { bestScore = score; best = it; }
    }
    if (best !== this.target) {
      this.target = best;
      this.hooks.onTarget?.(best);
    }
  }

  loop() {
    if (!this.running) return;
    const dt = Math.min(0.05, this.clock.getDelta());
    this.updatePlayer(dt);
    this.updateNPCs(dt);
    this.updateEffects(dt);
    this.updateTarget();
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    this.hooks.onFrame?.(dt);
    requestAnimationFrame(this.loop);
  }
}
