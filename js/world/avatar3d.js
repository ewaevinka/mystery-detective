// 3D Fashion Avatar Builder
// Builds a smooth, natural-proportioned (about 1.75m, 7.5 heads tall) runway model,
// dressed in any wardrobe look. Characters face +Z with their feet at y = 0.
// Poses: 'idle', 'walk', 'dance', 'hide', 'cheer', 'sing'.
//
// How the body is made: every body part is a smooth "loft" — a stack of oval rings
// (like a stack of bracelets) wrapped with a skin. Clothes are the same shapes,
// just a little bigger and in the clothing colour.

import * as THREE from 'three';
import { WARDROBE_DATA, shapeOf } from '../wardrobe.js';

const BASE_SUIT = '#CDB8DA'; // soft lilac base bodysuit under clothes
const DEFAULT_SHOE = '#E8DDE8';
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// Shared caches (≈30 characters on screen, so everything is shared)
// ---------------------------------------------------------------------------
const matCache = new Map();
const geoCache = new Map();
const faceCache = new Map();

function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({
      color, roughness: opts.roughness ?? 0.6, metalness: opts.metalness ?? 0,
      emissive: opts.emissive ?? '#000000', emissiveIntensity: opts.emissiveIntensity ?? 1,
      side: opts.side ?? THREE.FrontSide, transparent: !!opts.opacity, opacity: opts.opacity ?? 1
    }));
  }
  return matCache.get(key);
}

function geo(key, make) {
  if (!geoCache.has(key)) geoCache.set(key, make());
  return geoCache.get(key);
}

function mesh(geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  return m;
}

function put(parent, m) { parent.add(m); return m; }

const item = (id) => shapeOf((id && WARDROBE_DATA.items.find(i => i.id === id)) || null);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function shade(hex, f) {
  const c = new THREE.Color(hex);
  if (f < 1) c.multiplyScalar(f); else c.lerp(new THREE.Color('#ffffff'), f - 1);
  return '#' + c.getHexString();
}

// ---------------------------------------------------------------------------
// Loft: a smooth tube through a list of oval rings.
// ring = [y, rx, zFront, zBack, zOffset]. Rings may go up or down in y.
// opts.mod(phi, t, ring) -> radius multiplier (folds, pleats, curls).
// opts.arc = [start, length] for an open surface (hair curtains, capes).
// Vertices on the seam are shared, so shading stays perfectly smooth.
// ---------------------------------------------------------------------------
function loft(rings, segs = 16, opts = {}) {
  const closed = !opts.arc;
  const [a0, aLen] = opts.arc || [0, TAU];
  const cols = closed ? segs : segs + 1;
  const pos = [];
  rings.forEach((r, ri) => {
    const [y, rx, zf, zb, zo = 0, xo = 0] = r;
    const t = ri / (rings.length - 1);
    for (let j = 0; j < cols; j++) {
      const phi = a0 + (j / segs) * aLen;
      const s = Math.sin(phi), c = Math.cos(phi);
      const k = opts.mod ? opts.mod(phi, t, r) : 1;
      pos.push(xo + rx * s * k, y, zo + (c >= 0 ? zf : zb) * c * k);
    }
  });
  const idx = [];
  const down = rings[rings.length - 1][0] < rings[0][0];
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const j2 = closed ? (j + 1) % segs : j + 1;
      const a = i * cols + j, b = i * cols + j2, c = (i + 1) * cols + j, d = (i + 1) * cols + j2;
      if (!down) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// A tube that follows a curved path (ponytail, thumb, microphone cable…)
function tubeAlong(points, radii, segs = 10) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const n = radii.length;
  const frames = curve.computeFrenetFrames(n - 1, false);
  const pos = [];
  for (let i = 0; i < n; i++) {
    const p = curve.getPointAt(i / (n - 1));
    const N = frames.normals[i], B = frames.binormals[i];
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * TAU;
      const r = radii[i];
      pos.push(p.x + r * (Math.cos(a) * N.x + Math.sin(a) * B.x),
               p.y + r * (Math.cos(a) * N.y + Math.sin(a) * B.y),
               p.z + r * (Math.cos(a) * N.z + Math.sin(a) * B.z));
    }
  }
  const idx = [];
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < segs; j++) {
    const j2 = (j + 1) % segs;
    const a = i * segs + j, b = i * segs + j2, c = (i + 1) * segs + j, d = (i + 1) * segs + j2;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Hair cap: a dome over the head (unit-sphere space) whose lower edge follows a
// hairline. theta(a) = how far down the edge goes at angle a from the face
// (0 = front, PI = back). radius(theta, phi) = puffiness.
function hairCap(thetaMax, radius, segs = 28, rows = 9) {
  const pos = [0, radius(0, 0), 0];
  for (let i = 1; i <= rows; i++) {
    for (let j = 0; j < segs; j++) {
      const phi = (j / segs) * TAU;          // 0 = front (+Z), PI/2 = +X
      const a = Math.abs(Math.atan2(Math.sin(phi), Math.cos(phi)));
      const th = thetaMax(a, phi) * Math.pow(i / rows, 0.9);
      const r = radius(th, phi);
      pos.push(r * Math.sin(th) * Math.sin(phi), r * Math.cos(th), r * Math.sin(th) * Math.cos(phi));
    }
  }
  const idx = [];
  for (let j = 0; j < segs; j++) idx.push(0, 1 + j, 1 + (j + 1) % segs);
  for (let i = 0; i < rows - 1; i++) for (let j = 0; j < segs; j++) {
    const j2 = (j + 1) % segs;
    const a = 1 + i * segs + j, b = 1 + i * segs + j2, c = 1 + (i + 1) * segs + j, d = 1 + (i + 1) * segs + j2;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // the top vertex points at +Y
  g.attributes.normal.setXYZ(0, 0, 1, 0);
  return g;
}

// ---------------------------------------------------------------------------
// Body measurements (metres). Torso profile: [y, halfWidth, front, back, zOffset]
// ---------------------------------------------------------------------------
const TORSO = [
  [0.855, 0.000, 0.000, 0.000, 0],
  [0.868, 0.075, 0.055, 0.060, 0],
  [0.895, 0.138, 0.080, 0.098, 0],
  [0.935, 0.162, 0.088, 0.110, 0],
  [0.985, 0.164, 0.087, 0.104, 0],
  [1.035, 0.147, 0.083, 0.090, 0],
  [1.085, 0.126, 0.078, 0.076, 0],
  [1.135, 0.128, 0.083, 0.072, 0],
  [1.195, 0.138, 0.095, 0.074, 0],
  [1.245, 0.144, 0.104, 0.077, 0],
  [1.290, 0.147, 0.098, 0.080, 0],
  [1.340, 0.158, 0.086, 0.082, 0],
  [1.385, 0.170, 0.076, 0.078, -0.004],
  [1.418, 0.156, 0.065, 0.068, -0.008],
  [1.442, 0.106, 0.054, 0.058, -0.008],
  [1.458, 0.052, 0.044, 0.046, -0.006],
  [1.466, 0.000, 0.000, 0.000, -0.006]
];

// smooth (Catmull-Rom) sample of the torso table at height y
function torsoAt(y) {
  const T = TORSO;
  let i = 0;
  while (i < T.length - 2 && T[i + 1][0] < y) i++;
  const p0 = T[Math.max(0, i - 1)], p1 = T[i], p2 = T[i + 1], p3 = T[Math.min(T.length - 1, i + 2)];
  const t = Math.min(1, Math.max(0, (y - p1[0]) / (p2[0] - p1[0])));
  const out = [y];
  for (let k = 1; k < 5; k++) {
    const a = p0[k], b = p1[k], c = p2[k], d = p3[k];
    out.push(Math.max(0, 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)));
  }
  return out;
}

function torsoRings(y0, y1, n, scale = 1, closeBottom = false, closeTop = false) {
  const rings = [];
  for (let i = 0; i <= n; i++) {
    const y = lerp(y0, y1, i / n);
    const r = torsoAt(y);
    rings.push([y, r[1] * scale, r[2] * scale, r[3] * scale, r[4]]);
  }
  if (closeBottom) rings.unshift([y0 - 0.004, 0, 0, 0, rings[0][4]]);
  if (closeTop) rings.push([y1 + 0.004, 0, 0, 0, rings[rings.length - 1][4]]);
  return rings;
}

const HIP_Y = 0.92, HIP_X = 0.088, PELVIS_Y = 0.98, CHEST_Y = 1.06;
const SHOULDER = [0.158, 1.378];
const NECK_TOP = 1.512;

const THIGH = [
  [0.075, 0, 0, 0], [0.06, 0.05, 0.05, 0.05], [0.03, 0.068, 0.07, 0.072], [-0.04, 0.076, 0.077, 0.076],
  [-0.12, 0.072, 0.074, 0.070], [-0.21, 0.064, 0.066, 0.062], [-0.30, 0.056, 0.058, 0.053],
  [-0.37, 0.049, 0.051, 0.046], [-0.42, 0.045, 0.048, 0.043], [-0.45, 0.040, 0.042, 0.038],
  [-0.47, 0.026, 0.028, 0.026], [-0.478, 0, 0, 0]
];
const KNEE_Y = -0.43;
const SHIN = [
  [0.03, 0, 0, 0], [0.02, 0.030, 0.032, 0.03], [0.0, 0.043, 0.046, 0.041], [-0.06, 0.042, 0.042, 0.047],
  [-0.13, 0.045, 0.041, 0.056], [-0.20, 0.041, 0.038, 0.050], [-0.27, 0.033, 0.033, 0.036],
  [-0.33, 0.027, 0.028, 0.028], [-0.385, 0.024, 0.026, 0.026], [-0.41, 0.022, 0.022, 0.022], [-0.42, 0, 0, 0]
];
const ANKLE_Y = -0.40;
// foot rings run heel -> toe along +Z (built along Y, then rotated). [pos, halfWidth, below, above]
const FOOT = [
  [-0.062, 0, 0, 0], [-0.058, 0.022, 0.030, 0.035], [-0.04, 0.030, 0.038, 0.050], [0.0, 0.032, 0.040, 0.050],
  [0.05, 0.038, 0.040, 0.038], [0.10, 0.042, 0.040, 0.026], [0.145, 0.040, 0.040, 0.020],
  [0.18, 0.031, 0.038, 0.016], [0.196, 0.016, 0.034, 0.010], [0.2, 0, 0, 0]
];
const FOOT_DROP = 0.048; // foot axis below the ankle

const UPPER_ARM = [
  [0.034, 0, 0, 0], [0.026, 0.028, 0.03, 0.03], [0.006, 0.042, 0.045, 0.045], [-0.04, 0.044, 0.044, 0.043],
  [-0.09, 0.040, 0.040, 0.038], [-0.17, 0.036, 0.037, 0.035], [-0.24, 0.032, 0.032, 0.031],
  [-0.28, 0.029, 0.029, 0.029], [-0.30, 0.024, 0.024, 0.024], [-0.312, 0, 0, 0]
];
const ELBOW_Y = -0.28;
const FOREARM = [
  [0.02, 0, 0, 0], [0.012, 0.022, 0.022, 0.022], [0.0, 0.029, 0.029, 0.029], [-0.05, 0.032, 0.033, 0.031],
  [-0.12, 0.028, 0.029, 0.027], [-0.19, 0.021, 0.025, 0.023], [-0.235, 0.017, 0.023, 0.021],
  [-0.25, 0.012, 0.016, 0.015], [-0.256, 0, 0, 0]
];
const WRIST_Y = -0.24;
const HAND = [ // thin across X (palm faces the body), wide across Z
  [0.012, 0, 0, 0], [0.006, 0.014, 0.019, 0.019], [-0.01, 0.017, 0.029, 0.028], [-0.045, 0.019, 0.037, 0.035],
  [-0.08, 0.017, 0.037, 0.034], [-0.096, 0.014, 0.034, 0.032], [-0.13, 0.011, 0.029, 0.027],
  [-0.15, 0.008, 0.021, 0.019], [-0.158, 0, 0, 0]
];

const HEAD_SCALE = [0.08, 0.116, 0.097];
const HEAD_CENTER = [0, 0.1, 0.014]; // relative to the neck top pivot

// ---------------------------------------------------------------------------
// Geometry builders (cached)
// ---------------------------------------------------------------------------
const G = {
  pelvis: () => geo('pelvis', () => loft(torsoRings(0.862, 1.11, 9, 1, true), 20)),
  chest: () => geo('chest', () => loft(torsoRings(1.04, 1.462, 13, 1.012, false, true), 20)),
  thigh: () => geo('thigh', () => loft(THIGH, 12)),
  shin: () => geo('shin', () => loft(SHIN, 12)),
  foot: () => geo('foot', () => {
    const g = loft(FOOT, 10);
    g.rotateX(Math.PI / 2); // loft +Y -> +Z (toes forward), loft +Z -> down
    return g;
  }),
  upperArm: () => geo('upperArm', () => loft(UPPER_ARM, 12)),
  forearm: () => geo('forearm', () => loft(FOREARM, 12)),
  hand: () => geo('hand', () => loft(HAND, 8)),
  thumb: () => geo('thumb', () => tubeAlong([[0, 0, 0], [0.004, -0.02, 0.012], [0.004, -0.045, 0.02]], [0.011, 0.01, 0.0085, 0.0065, 0.002], 7)),
  neck: () => geo('neck', () => loft([[1.40, 0.058, 0.053, 0.06, -0.006], [1.45, 0.05, 0.047, 0.053, -0.004], [1.50, 0.047, 0.043, 0.05, 0], [1.56, 0.045, 0.041, 0.048, 0.004], [1.585, 0, 0, 0, 0.004]], 12)),
  head: () => geo('head', () => {
    const g = new THREE.SphereGeometry(1, 24, 16);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (y < 0) {
        const d = -y;
        x *= 1 - 0.25 * Math.pow(d, 1.9);                        // jaw narrows to the chin
        if (z > 0) z *= 1 - 0.10 * d * d; else z *= 1 - 0.38 * Math.pow(d, 1.4);
        y *= 1 + 0.06 * Math.max(0, z) * d;                      // chin reaches a bit lower
      }
      if (z < 0 && y > -0.4) z *= 1.07;                          // back of the skull
      if (z > 0) {
        const cheek = Math.exp(-((y + 0.15) ** 2) / 0.08) * Math.exp(-((Math.abs(x) - 0.55) ** 2) / 0.06);
        x *= 1 + 0.03 * cheek;
        z *= 0.96;                                               // flatter face
      }
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    // weld the UV seam normals so there is no crease
    const n = g.attributes.normal, map = new Map();
    for (let i = 0; i < p.count; i++) {
      const k = `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(i);
    }
    const v = new THREE.Vector3();
    map.forEach(list => {
      if (list.length < 2) return;
      v.set(0, 0, 0);
      list.forEach(i => v.add(new THREE.Vector3(n.getX(i), n.getY(i), n.getZ(i))));
      v.normalize();
      list.forEach(i => n.setXYZ(i, v.x, v.y, v.z));
    });
    return g;
  }),
  ear: () => geo('ear', () => {
    const g = new THREE.SphereGeometry(1, 8, 6);
    g.scale(0.009, 0.026, 0.016);
    return g;
  }),
  nose: () => geo('nose', () => loft([[0.0, 0.005, 0.002, 0.003, -0.004], [-0.014, 0.006, 0.005, 0.003, -0.003], [-0.028, 0.0075, 0.0075, 0.003, -0.002], [-0.037, 0.0085, 0.0085, 0.003, -0.002], [-0.043, 0.006, 0.005, 0.003, -0.003], [-0.045, 0, 0, 0, -0.004]], 10)),

  sphere: (d = 12) => geo('sphere' + d, () => new THREE.SphereGeometry(1, d, Math.max(6, d * 0.75 | 0)))
};

// Bend a flat shape (x, y in metres, drawn front-on) around the front of the face.
function wrapOnFace(g, k = 1.1) {
  const p = g.attributes.position;
  const [rx, , rz] = HEAD_SCALE;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const a = x / (rx * 1.02);
    const r = k + z / rz;
    p.setXYZ(i, rx * r * Math.sin(a), p.getY(i), rz * 0.96 * r * Math.cos(a));
  }
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------------------
// Face texture: drawn front-on, then wrapped onto the head sphere
// (front of the head = u 0.25 of the texture).
// ---------------------------------------------------------------------------
// Glam makeup looks (Dress-to-Impress style): lipstick, eyeshadow, blush.
const MAKEUP = [
  { lip: '#D9547A', shadow: '#C77A8E', blush: '#F0708A' }, // rosy pink
  { lip: '#C93C5C', shadow: '#9A6A55', blush: '#E66A7A' }, // rose red + bronze lid
  { lip: '#B03A64', shadow: '#7D4C86', blush: '#D9607E' }, // berry + plum smoky
  { lip: '#E07A86', shadow: '#D9A07A', blush: '#F28C8C' }, // peachy gloss
  { lip: '#C25B6E', shadow: '#B98AA6', blush: '#E87890' }  // mauve nude
];

function faceTexture(skin, eyeColor, hairHex, makeupIdx = 0) {
  const key = skin + eyeColor + hairHex + makeupIdx;
  if (faceCache.has(key)) return faceCache.get(key);
  const mk = MAKEUP[makeupIdx % MAKEUP.length];

  // 1) front view: x,y in centimetres, (0,0) = head centre, head is ±8 x ±11.6 cm
  const F = document.createElement('canvas');
  F.width = F.height = 512;
  const f = F.getContext('2d');
  const RX = HEAD_SCALE[0] * 100, RY = HEAD_SCALE[1] * 100;
  f.setTransform(256 / RX, 0, 0, -256 / RY, 256, 256);
  const skinC = new THREE.Color(skin);
  const lum = skinC.r * 0.3 + skinC.g * 0.59 + skinC.b * 0.11;
  const deep = lum < 0.4;
  const css = (c) => '#' + c.getHexString();
  const dark = (amt) => css(skinC.clone().multiplyScalar(1 - amt));
  const ell = (x, y, rx, ry, rot = 0) => { f.beginPath(); f.ellipse(x, y, rx, ry, rot, 0, TAU); };
  const glow = (x, y, r, color, alpha, sy = 1) => {
    const c = new THREE.Color(color);
    const rgb = `${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0}`;
    f.save(); f.translate(x, y); f.scale(1, sy);
    const g = f.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    f.fillStyle = g;
    f.fillRect(-r, -r, r * 2, r * 2);
    f.restore();
  };

  // --- skin modelling: soft contour, glowy highlight, blush ---
  [-1, 1].forEach(s => {
    glow(s * 3.0, 0.3, 2.5, dark(0.25), 0.22);                       // eye socket
    glow(s * 5.6, -4.2, 2.6, dark(0.3), 0.22, 0.6);                  // cheek contour
    glow(s * 4.1, -2.9, 2.5, mk.blush, deep ? 0.13 : lum < 0.6 ? 0.22 : 0.3, 0.8);     // blush
    glow(s * 4.4, -1.6, 1.5, '#FFF4E8', deep ? 0.32 : 0.38, 0.6);    // cheekbone highlight
    glow(s * 0.95, -2.2, 1.3, dark(0.3), 0.22, 1.6);                 // sides of the nose
  });
  glow(0, -1.0, 0.55, '#FFF6EE', 0.4, 3.0);                          // nose-bridge highlight
  glow(0, 3.6, 2.0, '#FFF6EE', 0.18, 0.7);                           // forehead glow
  glow(0, -9.3, 1.4, '#FFF6EE', 0.2, 0.7);                           // chin glow
  glow(0, -4.9, 1.3, dark(0.38), 0.35, 0.6);                         // under the nose
  glow(0, -8.2, 1.5, dark(0.22), 0.25, 0.5);                         // under the lip

  // --- brows: defined, arched, tapered ---
  const browC = new THREE.Color(hairHex);
  const browL = browC.r * 0.3 + browC.g * 0.59 + browC.b * 0.11;
  if (browL > 0.5) browC.multiplyScalar(0.5); else browC.multiplyScalar(0.85);
  f.fillStyle = css(browC);
  [-1, 1].forEach(s => {
    f.globalAlpha = 0.92;
    f.beginPath();
    f.moveTo(s * 1.05, 1.85);
    f.bezierCurveTo(s * 1.6, 2.55, s * 3.0, 3.25, s * 3.75, 3.35);   // arch peak
    f.quadraticCurveTo(s * 4.5, 3.1, s * 5.05, 2.25);                // tail
    f.quadraticCurveTo(s * 4.3, 2.75, s * 3.7, 2.9);
    f.bezierCurveTo(s * 2.9, 2.85, s * 1.7, 2.1, s * 1.05, 1.4);
    f.closePath();
    f.fill();
  });
  f.globalAlpha = 1;

  // --- eyes: almond, eyeshadow, winged liner, long lashes ---
  const eyeC = new THREE.Color(eyeColor);
  [-1, 1].forEach(s => {
    const cx = s * 3.1, cy = 0.2, w = 1.98, up = 1.0, lo = 0.66;
    const inner = cx - s * w, outer = cx + s * w;
    const upperLid = () => {
      f.moveTo(inner, cy - 0.05);
      f.bezierCurveTo(cx - s * w * 0.5, cy + up * 1.3, cx + s * w * 0.5, cy + up * 1.3, outer, cy + 0.22);
    };
    const almond = () => {
      f.beginPath();
      upperLid();
      f.bezierCurveTo(cx + s * w * 0.4, cy - lo * 1.25, cx - s * w * 0.5, cy - lo * 1.25, inner, cy - 0.05);
      f.closePath();
    };
    // eyeshadow: soft wash on the lid, deeper at the outer corner
    glow(cx + s * 0.3, cy + 0.9, 2.0, mk.shadow, 0.55, 0.65);
    glow(cx + s * 1.4, cy + 0.7, 1.2, css(new THREE.Color(mk.shadow).multiplyScalar(0.6)), 0.5, 0.8);
    glow(cx - s * 1.0, cy + 0.6, 0.6, '#FFF3E6', 0.35);              // inner-corner shimmer
    glow(cx + s * 0.6, cy + 2.05, 1.6, '#FFF6EE', 0.25, 0.4);        // brow-bone highlight
    // crease
    f.strokeStyle = dark(0.4); f.lineWidth = 0.12; f.globalAlpha = 0.55;
    f.beginPath(); f.moveTo(inner + s * 0.35, cy + 0.65);
    f.bezierCurveTo(cx - s * 0.6, cy + up * 1.75, cx + s * 0.8, cy + up * 1.8, outer + s * 0.15, cy + 0.75); f.stroke();
    f.globalAlpha = 1;
    // eyeball + iris
    almond(); f.fillStyle = '#F7F3F1'; f.fill();
    f.save(); almond(); f.clip();
    const ix = cx - s * 0.05, iy = cy + 0.12, ir = 0.86;
    const ig = f.createRadialGradient(ix, iy - 0.15, 0.05, ix, iy, ir);
    ig.addColorStop(0, css(eyeC.clone().lerp(new THREE.Color('#FFE9B0'), 0.45)));
    ig.addColorStop(0.45, css(eyeC.clone().lerp(new THREE.Color('#ffffff'), 0.15)));
    ig.addColorStop(0.85, eyeColor);
    ig.addColorStop(1, css(eyeC.clone().multiplyScalar(0.35)));     // limbal ring
    ell(ix, iy, ir, ir); f.fillStyle = ig; f.fill();
    ell(ix, iy, 0.34, 0.34); f.fillStyle = '#100A0E'; f.fill();
    f.fillStyle = 'rgba(70,35,40,0.3)'; f.fillRect(cx - 2.2, cy + 0.55, 4.4, 1.2); // lid shadow
    f.restore();
    // catchlights
    ell(ix + s * 0.28, iy + 0.3, 0.17, 0.15); f.fillStyle = 'rgba(255,255,255,0.97)'; f.fill();
    ell(ix - s * 0.28, iy - 0.3, 0.08, 0.07); f.fillStyle = 'rgba(255,255,255,0.75)'; f.fill();
    // winged liner: thick upper line sweeping out into a sharp flick
    f.fillStyle = '#140C10';
    f.beginPath();
    upperLid();
    f.lineTo(outer + s * 0.95, cy + 0.85);                            // wing tip
    f.quadraticCurveTo(cx + s * w * 0.55, cy + up * 1.2, cx, cy + up * 1.18);
    f.quadraticCurveTo(cx - s * w * 0.6, cy + up * 1.05, inner, cy + 0.12);
    f.closePath();
    f.fill();
    // long, curled upper lashes
    f.strokeStyle = '#120A0E'; f.lineCap = 'round';
    f.fillStyle = '#120A0E';
    for (let k = 0; k < 6; k++) {   // each lash: a tapered, outward-curling wedge
      const t = 0.3 + k * 0.13;
      const lx = lerp(inner, outer, t);
      const ly = cy + up * 1.25 * (1 - Math.pow(2 * t - 1, 2)) * 0.72 + 0.1;
      const len = 0.35 + 0.45 * t;
      f.beginPath();
      f.moveTo(lx - s * 0.09, ly);
      f.quadraticCurveTo(lx + s * len * 0.15, ly + len * 0.75, lx + s * len * 0.95, ly + len * 0.8);
      f.quadraticCurveTo(lx + s * len * 0.3, ly + len * 0.45, lx + s * 0.11, ly - 0.05);
      f.closePath();
      f.fill();
    }
    // lower lash line + a few short lower lashes
    f.strokeStyle = dark(0.5); f.lineWidth = 0.08; f.globalAlpha = 0.8;
    f.beginPath(); f.moveTo(inner + s * 0.4, cy - 0.25);
    f.bezierCurveTo(cx - s * 0.3, cy - lo * 1.25, cx + s * 0.6, cy - lo * 1.2, outer, cy + 0.15); f.stroke();
    f.strokeStyle = '#2A1A1E'; f.lineWidth = 0.06;
    for (let k = 0; k < 3; k++) {
      const lx = lerp(cx, outer, 0.3 + k * 0.25), ly = cy - lo * (0.95 - k * 0.25);
      f.beginPath(); f.moveTo(lx, ly); f.lineTo(lx + s * 0.12, ly - 0.25); f.stroke();
    }
    f.globalAlpha = 1;
  });

  // --- nose: tip highlight + soft nostrils ---
  glow(0, -3.6, 0.7, '#FFFFFF', 0.25);
  f.fillStyle = dark(0.5); f.globalAlpha = 0.5;
  [-1, 1].forEach(s => { ell(s * 0.6, -4.55, 0.3, 0.15, s * 0.4); f.fill(); });
  f.globalAlpha = 1;

  // --- lips: full, glossy lipstick ---
  const lipC = new THREE.Color(mk.lip).lerp(skinC, deep ? 0.12 : 0.05).lerp(new THREE.Color('#ffffff'), 0.06);
  const lipDark = css(lipC.clone().multiplyScalar(0.6));
  const my = -6.55;
  const upperLip = () => {
    f.beginPath();
    f.moveTo(-2.15, my + 0.02);
    f.bezierCurveTo(-1.5, my + 0.45, -0.85, my + 1.05, -0.32, my + 0.92);
    f.quadraticCurveTo(0, my + 0.72, 0.32, my + 0.92);
    f.bezierCurveTo(0.85, my + 1.05, 1.5, my + 0.45, 2.15, my + 0.02);
    f.quadraticCurveTo(0, my - 0.12, -2.15, my + 0.02);
  };
  const lowerLip = () => {
    f.beginPath();
    f.moveTo(-2.05, my);
    f.quadraticCurveTo(0, my - 0.12, 2.05, my);
    f.bezierCurveTo(1.55, my - 1.05, 0.7, my - 1.38, 0, my - 1.38);
    f.bezierCurveTo(-0.7, my - 1.38, -1.55, my - 1.05, -2.05, my);
  };
  const lg = f.createLinearGradient(0, my + 1, 0, my - 1.4);
  lg.addColorStop(0, css(lipC.clone().multiplyScalar(0.85)));
  lg.addColorStop(0.45, css(lipC));
  lg.addColorStop(1, css(lipC.clone().lerp(new THREE.Color('#ffffff'), 0.12)));
  f.fillStyle = lg; upperLip(); f.fill(); lowerLip(); f.fill();
  f.strokeStyle = lipDark; f.lineWidth = 0.06; f.globalAlpha = 0.6;
  upperLip(); f.stroke(); lowerLip(); f.stroke();
  f.globalAlpha = 1; f.lineWidth = 0.11;
  f.beginPath(); f.moveTo(-2.05, my); f.quadraticCurveTo(0, my - 0.2, 2.05, my); f.stroke();
  // gloss
  glow(0.25, my - 0.7, 0.75, '#FFFFFF', 0.6, 0.45);
  glow(-0.5, my + 0.6, 0.35, '#FFFFFF', 0.4, 0.5);
  glow(0, my + 1.25, 0.4, '#FFF6EE', 0.35, 0.5);                    // cupid's-bow highlight

  // 2) wrap onto the sphere texture
  const W = 1024, H = 512;
  const T = document.createElement('canvas');
  T.width = W; T.height = H;
  const t = T.getContext('2d');
  t.fillStyle = skin; t.fillRect(0, 0, W, H);
  const src = f.getImageData(0, 0, 512, 512).data;
  const x0 = Math.floor(W * 0.25 - W * 0.16), x1 = Math.ceil(W * 0.25 + W * 0.16);
  const img = t.getImageData(x0, 0, x1 - x0, H);
  const d = img.data;
  for (let py = 0; py < H; py++) {
    const th = ((py + 0.5) / H) * Math.PI;
    const Y = Math.cos(th), st = Math.sin(th);
    for (let px = x0; px < x1; px++) {
      const a = ((px + 0.5) / W - 0.25) * TAU;
      const X = st * Math.sin(a);
      const fx = Math.round((X + 1) * 256), fy = Math.round((1 - Y) * 256);
      if (fx < 0 || fx > 511 || fy < 0 || fy > 511) continue;
      const si = (fy * 512 + fx) * 4, al = src[si + 3] / 255;
      if (!al) continue;
      const di = (py * (x1 - x0) + (px - x0)) * 4;
      for (let k = 0; k < 3; k++) d[di + k] = d[di + k] * (1 - al) + src[si + k] * al;
    }
  }
  t.putImageData(img, x0, 0);
  const tex = new THREE.CanvasTexture(T);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.42 });
  faceCache.set(key, m);
  return m;
}

// ---------------------------------------------------------------------------
// Hair styles (built in unit-head space, then scaled to the head)
// ---------------------------------------------------------------------------
function hairGeometries(type) {
  return geo('hair-' + type, () => {
    const parts = [];
    const S = HEAD_SCALE;
    if (type === 'ponytail') {
      parts.push({ g: hairCap(a => lerp(0.36, 0.68, smooth(0.2, 2.6, a)) * Math.PI, (th, phi) => 1.045 + 0.03 * Math.cos(th)), unit: true });
      // tail: from the crown, swinging out and down the back
      parts.push({ g: tubeAlong([[0, 0.07, -0.085], [0, 0.07, -0.13], [0, 0.0, -0.165], [0, -0.13, -0.165], [0, -0.27, -0.14]],
        [0.022, 0.034, 0.04, 0.041, 0.038, 0.034, 0.028, 0.02, 0.01, 0.002], 10) });
    } else if (type === 'bun') {
      parts.push({ g: hairCap(a => lerp(0.36, 0.7, smooth(0.2, 2.6, a)) * Math.PI, () => 1.04), unit: true });
      parts.push({ g: (() => { const g = new THREE.SphereGeometry(0.048, 16, 12); g.scale(1, 0.85, 0.95); g.translate(0, 0.105, -0.06); return g; })() });
    } else if (type === 'bob') {
      // side-swept fringe: lower on one side of the forehead
      parts.push({ g: hairCap((a, phi) => {
        const front = 0.36 + 0.07 * smooth(-0.6, 0.6, Math.sin(phi)) * (1 - smooth(0.2, 0.9, a));
        return lerp(front, 0.79, smooth(0.55, 1.25, a)) * Math.PI;
      }, (th) => 1.1 + 0.12 * smooth(1.5, 2.45, th) + 0.05 * Math.sin(th), 32, 11), unit: true });
    } else if (type === 'waves' || type === 'curls') {
      const curly = type === 'curls';
      const bump = curly
        ? (th, phi) => 1 + 0.045 * Math.sin(phi * 11) * Math.sin(th * 13)
        : () => 1;
      // rounded hairline (higher in the middle, lower at the temples) + a soft middle part
      parts.push({ g: hairCap(a => lerp(0.34 + 0.07 * smooth(0, 0.75, a), curly ? 0.74 : 0.68, smooth(0.8, 1.5, a)) * Math.PI,
        (th, phi) => {
          const fwd = Math.cos(phi), side = Math.sin(phi);
          const part = fwd > 0 ? 0.035 * Math.exp(-(side * side) / 0.004) * smooth(0.05, 0.35, th / Math.PI) : 0;
          return (1.1 + (curly ? 0.1 : 0.06) * Math.sin(th) + 0.03 * Math.cos(th) - part) * bump(th, phi);
        }, 26, 9), unit: true });

      // face-framing locks falling over the front of the shoulders
      [-1, 1].forEach(s => {
        const L = curly ? 0.8 : 1;
        const pts = [[0.079, 0.03, 0.002], [0.093, -0.05, 0.012], [0.106, -0.13, 0.026], [0.122, -0.2, 0.056], [0.128, -0.28, 0.078], [0.122, -0.36, 0.088]]
          .slice(0, curly ? 5 : 6)
          .map(([x, y, z], i) => [s * (x + (curly ? 0.008 : 0.006) * Math.sin(i * 2.2)), y * L, z]);
        const radii = curly
          ? [0.018, 0.026, 0.03, 0.022, 0.03, 0.026, 0.028, 0.018, 0.004]
          : [0.016, 0.022, 0.024, 0.026, 0.025, 0.024, 0.021, 0.017, 0.011, 0.003];
        parts.push({ g: tubeAlong(pts, radii, 9) });
      });

      // long curtain hanging down the back
      const len = curly ? 0.27 : 0.4;
      const rings = [];
      const N = 9;
      for (let i = 0; i <= N; i++) {
        const t = i / N, y = 0.0 - t * len;
        rings.push([y,
          lerp(S[0] * 1.13, curly ? 0.13 : 0.1, smooth(0, 0.7, t)) + (curly ? 0.02 * t : 0),
          S[2] * 0.9,
          lerp(S[2] * 1.1, 0.06, smooth(0.15, 1, t)),
          lerp(-0.008, -0.11, smooth(0.15, 0.9, t))]);
      }
      parts.push({ g: loft(rings, 22, {
        arc: [Math.PI * 0.42, Math.PI * 1.16],
        mod: curly
          ? (phi, t) => 1 + 0.07 * Math.sin(phi * 14) * Math.sin(t * 17) * smooth(0, 0.3, t)
          : (phi, t) => 1 + 0.035 * Math.sin(phi * 7 + t * 9) * smooth(0, 0.3, t)
      }) });
    }
    return parts;
  });
}

// ---------------------------------------------------------------------------
// Name tag (unchanged)
// ---------------------------------------------------------------------------
export function makeNameTag(text, color = '#FFD700') {
  const font = 'bold 44px "Plus Jakarta Sans", sans-serif';
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = font;
  const w = Math.ceil(measure.measureText(text).width + 48);
  const c = document.createElement('canvas');
  c.width = w; c.height = 96;
  const g = c.getContext('2d');
  g.font = font;
  g.fillStyle = 'rgba(18,14,36,0.75)';
  g.beginPath(); g.roundRect(2, 10, w - 4, 72, 36); g.fill();
  g.fillStyle = color;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, w / 2, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sprite.scale.set(0.3 * w / 96, 0.3, 1);
  sprite.renderOrder = 10;
  return sprite;
}

const EYE_COLORS = ['#7A4A22', '#2F86D6', '#2FA86E', '#8A5BD6', '#8A6A2E', '#4A2C1C'];

// Every animated joint. Values are smoothly blended toward each pose's targets.
const JOINTS = ['bodyY', 'bodyRY', 'pelvisX', 'pelvisY', 'pelvisZ', 'chestX', 'chestY', 'chestZ', 'headX', 'headY', 'headZ',
  ...['L', 'R'].flatMap(s => ['hipX', 'hipY', 'hipZ', 'knee', 'ankle', 'shX', 'shY', 'shZ', 'elbow', 'elbowY', 'wristX', 'wristY', 'wristZ'].map(j => j + s))];

export class Character {
  constructor(look, { name = null, tagColor, eyeSeed = 0 } = {}) {
    this.root = new THREE.Group();     // moves around the world
    this.body = new THREE.Group();     // bobs, crouches, spins
    this.root.add(this.body);
    this.pose = 'idle';
    this.time = Math.random() * 10;
    this.eyeColor = EYE_COLORS[eyeSeed % EYE_COLORS.length];
    this.makeup = (eyeSeed * 3 + 1) % MAKEUP.length;
    this.j = Object.fromEntries(JOINTS.map(k => [k, 0]));
    this.fresh = true;
    this.build(look || {});
    if (name) {
      this.tag = makeNameTag(name, tagColor);
      this.tag.position.y = 2.15;
      this.root.add(this.tag);
    }
  }

  build(look) {
    this.body.clear();
    const skinHex = (WARDROBE_DATA.skinTones.find(s => s.id === look.skin) || WARDROBE_DATA.skinTones[1]).color;
    const hairHex = (WARDROBE_DATA.hairColors.find(h => h.id === look.hairColor) || WARDROBE_DATA.hairColors[0]).color;
    const hairType = (WARDROBE_DATA.hairStyles.find(h => h.id === look.hairStyle) || WARDROBE_DATA.hairStyles[0]).type;
    const top = item(look.tops), bottom = item(look.bottoms), coat = item(look.outerwear);
    const shoes = item(look.shoes), hat = item(look.hats), acc = item(look.accessories);

    const skin = mat(skinHex, { roughness: 0.5 });
    const hair = mat(hairHex, { roughness: 0.34, metalness: 0.08, side: THREE.DoubleSide });
    const isGown = bottom?.id === 'bottom-gala-skirt';
    const isSkirt = bottom?.id === 'bottom-pleated-skirt';
    const isPants = bottom?.id === 'bottom-sleuth-trousers';
    const isCorset = top?.id === 'top-corset-vest';
    const isTrench = coat?.id === 'coat-noir-trench', isBlazer = coat?.id === 'coat-gold-blazer', isCape = coat?.id === 'coat-midnight-cape';
    const BLOUSE = '#FBF5E8';
    const topMat = mat(top ? (isCorset ? BLOUSE : top.color) : BASE_SUIT, { roughness: top?.id === 'top-silk-blouse' || isCorset ? 0.4 : 0.75 });
    const bottomMat = mat(bottom ? bottom.color : BASE_SUIT, { roughness: isGown ? 0.35 : 0.75 });
    const bottomMat2 = mat(bottom ? bottom.color : BASE_SUIT, { roughness: isGown ? 0.35 : 0.75, side: THREE.DoubleSide });
    const legMat = isPants || !bottom ? bottomMat : skin;
    const coatMat = coat ? mat(coat.color, { roughness: isBlazer ? 0.45 : 0.7, metalness: isBlazer ? 0.25 : 0 }) : null;
    const coatMat2 = coat ? mat(coat.color, { roughness: isBlazer ? 0.45 : 0.7, metalness: isBlazer ? 0.25 : 0, side: THREE.DoubleSide }) : null;
    const sleeveMat = coat && !isCape ? coatMat : top ? topMat : skin;
    const sleeveScale = coat && !isCape ? 1.2 : top ? 1.09 : 1;
    const gold = mat('#E2B93B', { metalness: 0.85, roughness: 0.25 });

    this.heelLift = shoes?.id === 'shoes-stilettos' ? 0.05 : 0;

    // ---------------- Pelvis & legs ----------------
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = PELVIS_Y;
    this.body.add(this.pelvis);
    const pelvisMesh = mesh(G.pelvis(), isGown || isSkirt || isPants || !bottom ? bottomMat : skin, 0, -PELVIS_Y, 0);
    if (!isGown) this.pelvis.add(pelvisMesh); // fully hidden under a ball gown

    const shoeColor = shoes ? shoes.color : DEFAULT_SHOE;
    const shoeMat = mat(shoeColor, shoes?.id === 'shoes-stilettos' ? { metalness: 0.55, roughness: 0.3 } : { roughness: shoes?.id === 'shoes-brogues' ? 0.45 : 0.6 });

    this.legs = [-1, 1].map(side => {
      const hip = new THREE.Group();
      hip.position.set(side * HIP_X, HIP_Y - PELVIS_Y, 0);
      const thigh = mesh(G.thigh(), legMat);
      if (isPants) thigh.scale.set(1.1, 1, 1.1);
      if (!isGown) hip.add(thigh);
      const knee = new THREE.Group();
      knee.position.y = KNEE_Y;
      hip.add(knee);
      const shin = mesh(G.shin(), legMat);
      if (isPants) shin.scale.set(1.28, 1, 1.25);
      if (!isGown) knee.add(shin);
      if (shoes?.id === 'shoes-stealth-boots') {
        const shaft = mesh(geo('bootShaft', () => loft(SHIN.slice(4).map(([y, a, b, c]) => [y, a * 1.14, b * 1.16, c * 1.12]), 14)), shoeMat);
        knee.add(shaft);
        knee.add(mesh(geo('bootCuff', () => loft([[-0.12, 0.054, 0.05, 0.066], [-0.135, 0.056, 0.052, 0.067], [-0.15, 0.054, 0.05, 0.065]], 14)), mat(shade(shoeColor, 1.25), { roughness: 0.5 })));
      }
      const ankle = new THREE.Group();
      ankle.position.y = ANKLE_Y;
      knee.add(ankle);
      const foot = mesh(G.foot(), shoeMat, 0, -FOOT_DROP, 0);
      if (shoes?.id === 'shoes-stealth-boots') foot.scale.set(1.12, 1.1, 1.06);
      if (shoes?.id === 'shoes-brogues') foot.scale.set(1.06, 1.04, 1.04);
      ankle.add(foot);
      if (shoes?.id === 'shoes-stilettos') {
        ankle.rotation.x = 0.4;
        // the slim heel and a strap
        const heel = mesh(geo('heelSpike', () => new THREE.CylinderGeometry(0.009, 0.005, 0.085, 8)), gold, 0, -FOOT_DROP - 0.06, -0.045);
        heel.rotation.x = -0.4;
        ankle.add(heel);
        ankle.add(mesh(geo('strap', () => { const g = new THREE.TorusGeometry(0.027, 0.004, 4, 10); g.rotateX(Math.PI / 2); g.scale(1, 1, 1.05); return g; }), gold, 0, -0.005, 0.002));
      }
      if (shoes?.id === 'shoes-brogues') {
        put(ankle, mesh(G.sphere(6), mat('#C9A27A'), 0, -FOOT_DROP + 0.035, 0.07)).scale.set(0.018, 0.006, 0.02);
      }
      this.pelvis.add(hip);
      return { hip, knee, ankle };
    });

    // ---------------- Skirts & gown (hang from the pelvis) ----------------
    if (isGown) {
      const rings = [];
      const N = 10;
      for (let i = 0; i <= N; i++) {
        const u = Math.pow(i / N, 1.5), y = lerp(1.1, 0.0, u);
        const r = torsoAt(Math.max(y, 0.9));
        const flare = Math.pow(u, 1.6);
        rings.push([y, lerp(r[1] * 1.055, 0.5, flare), lerp(r[2] * 1.07, 0.48, flare), lerp(r[3] * 1.055, 0.55, flare), lerp(0, -0.05, flare)]);
      }
      const gown = mesh(geo('gown', () => loft(rings, 30, { mod: (phi, t) => 1 + 0.06 * t * t * Math.sin(phi * 10) })), bottomMat2, 0, -PELVIS_Y, 0);
      this.pelvis.add(gown);
      // gold sash at the waist
      this.pelvis.add(mesh(geo('sash', () => loft(torsoRings(1.075, 1.105, 2, 1.115), 22)), gold, 0, -PELVIS_Y, 0));
    } else if (isSkirt) {
      const rings = [];
      const N = 6;
      for (let i = 0; i <= N; i++) {
        const t = Math.pow(i / N, 1.4), y = lerp(1.1, 0.56, t);
        const r = torsoAt(Math.max(y, 0.93));
        const flare = smooth(0.15, 1, t);
        rings.push([y, lerp(r[1] * 1.05, 0.25, flare), lerp(r[2] * 1.055, 0.2, flare), lerp(r[3] * 1.05, 0.22, flare), 0]);
      }
      const skirt = mesh(geo('pleatSkirt', () => loft(rings, 40, {
        mod: (phi, t) => 1 + 0.045 * smooth(0.1, 0.6, t) * (Math.abs(((phi * 16 / TAU) % 1) - 0.5) * 2 - 0.5)
      })), bottomMat2, 0, -PELVIS_Y, 0);
      this.pelvis.add(skirt);
      this.pelvis.add(mesh(geo('skirtBand', () => loft(torsoRings(1.08, 1.11, 2, 1.07), 22)), mat(shade(bottom.color, 0.75)), 0, -PELVIS_Y, 0));
    } else if (isPants) {
      this.pelvis.add(mesh(geo('belt', () => loft(torsoRings(1.075, 1.1, 2, 1.04), 22)), mat('#1E1A1A', { roughness: 0.4 }), 0, -PELVIS_Y, 0));
      put(this.pelvis, mesh(G.sphere(6), gold, 0, 1.087 - PELVIS_Y, torsoAt(1.087)[2] * 1.05)).scale.set(0.014, 0.01, 0.005);
    }

    // ---------------- Chest (upper body) ----------------
    this.chest = new THREE.Group();
    this.chest.position.y = CHEST_Y;
    this.body.add(this.chest);
    const C = (y) => y - CHEST_Y; // absolute height -> chest-local
    if (!coat || isCape) this.chest.add(mesh(G.chest(), topMat, 0, -CHEST_Y, 0)); // hidden under coats
    this.chest.add(mesh(G.neck(), skin, 0, -CHEST_Y, 0));

    const frontZ = (y, s = 1) => torsoAt(y)[2] * s + torsoAt(y)[4];
    if (top?.id === 'top-detective-turtleneck') {
      this.chest.add(mesh(geo('turtle', () => loft([[1.41, 0.066, 0.064, 0.07, -0.006], [1.45, 0.058, 0.056, 0.062, -0.004], [1.5, 0.054, 0.051, 0.058, 0], [1.512, 0.047, 0.045, 0.05, 0]], 16)), topMat, 0, -CHEST_Y, 0));
    }
    if (top?.id === 'top-silk-blouse' || isCorset) {
      // soft collar + pearl buttons
      this.chest.add(mesh(geo('collar', () => loft([[1.42, 0.075, 0.062, 0.066, -0.006], [1.445, 0.06, 0.055, 0.058, -0.006], [1.468, 0.05, 0.05, 0.052, -0.004]], 16, { arc: [-Math.PI * 0.82, Math.PI * 1.64] })), mat(BLOUSE, { roughness: 0.4, side: THREE.DoubleSide }), 0, -CHEST_Y, 0));
      if (!isCorset) for (let i = 0; i < 4; i++) {
        const y = 1.37 - i * 0.075;
        put(this.chest, mesh(G.sphere(6), mat('#FFFFFF', { roughness: 0.2 }), 0, C(y), frontZ(y, 1.02))).scale.setScalar(0.007);
      }
    }
    if (isCorset) {
      const cor = mesh(geo('corset', () => loft(torsoRings(1.075, 1.27, 7, 1.08), 22)), mat(top.color, { roughness: 0.45 }), 0, -CHEST_Y, 0);
      this.chest.add(cor);
      for (let i = 0; i < 4; i++) {   // golden laces
        const y = 1.1 + i * 0.045;
        const lace = mesh(geo('lace', () => new THREE.BoxGeometry(0.05, 0.004, 0.004)), gold, 0, C(y), frontZ(y, 1.09));
        lace.rotation.z = (i % 2 ? 1 : -1) * 0.5;
        this.chest.add(lace);
      }
      this.chest.add(mesh(geo('corsetTrim', () => loft(torsoRings(1.262, 1.275, 1, 1.095), 22)), gold, 0, -CHEST_Y, 0));
    }

    // ---------------- Coats & capes ----------------
    if (coat && !isCape) {
      const bottomY = isTrench ? 0.5 : 0.9;
      const coatRing = (y, t) => {
        const r = torsoAt(Math.max(y, 0.92));
        return [y, r[1] * 1.11 + (isTrench ? 0.075 : 0.012) * t, r[2] * 1.12 + (isTrench ? 0.06 : 0.01) * t, r[3] * 1.11 + (isTrench ? 0.1 : 0.01) * t, isTrench ? -0.015 * t : 0];
      };
      const rings = torsoRings(1.0, 1.43, 10, 1.075).map(r => r[0] < 1.12 ? [r[0], ...r.slice(1, 4).map(v => v * (1 + 0.3 * (1.12 - r[0]))), r[4]] : r).reverse();
      rings.unshift([1.452, 0.085, 0.06, 0.063, -0.006]);
      if (isBlazer) for (let i = 1; i <= 3; i++) rings.push(coatRing(lerp(1.0, bottomY, i / 3), i / 3));
      this.chest.add(mesh(geo('coat-' + coat.id, () => loft(rings.reverse(), 24)), coatMat2, 0, -CHEST_Y, 0));
      if (isTrench) {
        // long skirt of the trench, open at the front so legs can stride through
        const low = [];
        for (let i = 0; i <= 6; i++) { const t = i / 6; low.push(coatRing(lerp(1.03, bottomY, t), t)); }
        low[0] = [1.03, ...torsoAt(1.03).slice(1, 4).map(v => v * 1.105), 0];
        this.chest.add(mesh(geo('trenchSkirt', () => loft(low, 24, { arc: [Math.PI * 0.07, Math.PI * 1.86] })), coatMat2, 0, -CHEST_Y, 0));
      }
      // lapels: a folded collar ring in a deeper shade
      this.chest.add(mesh(geo('lapel', () => loft([[1.37, 0.12, 0.09, 0.083, -0.004], [1.42, 0.105, 0.075, 0.074, -0.008], [1.46, 0.07, 0.062, 0.064, -0.008], [1.49, 0.058, 0.055, 0.058, -0.008]], 18, { arc: [Math.PI * 0.16, Math.PI * 1.68] })), mat(shade(coat.color, 0.78), { side: THREE.DoubleSide, roughness: 0.6 }), 0, -CHEST_Y, 0));
      // front opening line
      const strip = mesh(geo('placket', () => new THREE.BoxGeometry(0.006, 1, 0.004)), mat(shade(coat.color, 0.6)), 0, 0, 0);
      const top0 = 1.36, bot0 = bottomY + 0.01;
      strip.scale.y = top0 - bot0;
      strip.position.set(0.012, C((top0 + bot0) / 2), frontZ(1.2, 1.1) - 0.006);
      if (isTrench) strip.position.z = 0.1;
      strip.visible = !isTrench;
      this.chest.add(strip);
      const btnMat = isBlazer ? mat('#FFF1B8', { metalness: 0.9, roughness: 0.2 }) : mat('#2A1E12', { roughness: 0.4 });
      const btnYs = isTrench ? [1.28, 1.2, 1.0, 0.92] : [1.2, 1.1];
      btnYs.forEach(y => {
        [isTrench ? -1 : 1, isTrench ? 1 : null].filter(v => v !== null).forEach(sx => {
          put(this.chest, mesh(G.sphere(6), btnMat, sx * (isTrench ? 0.055 : 0.03), C(y), (y > 0.98 ? frontZ(y, 1.07) : 0.115) + 0.006)).scale.set(0.011, 0.011, 0.005);
        });
      });
      if (isTrench) {
        this.chest.add(mesh(geo('trenchBelt', () => loft(torsoRings(1.075, 1.105, 2, 1.1), 24)), mat('#5A4316', { roughness: 0.5 }), 0, -CHEST_Y, 0));
        this.chest.add(mesh(geo('buckle', () => new THREE.TorusGeometry(0.014, 0.003, 4, 12)), gold, 0, C(1.09), frontZ(1.09, 1.1) + 0.004));
      }
    }
    if (isCape) {
      const rings = [[1.47, 0.052, 0.048, 0.05, -0.004], [1.445, 0.11, 0.08, 0.085, -0.01], [1.41, 0.2, 0.1, 0.105, -0.015], [1.37, 0.235, 0.12, 0.13, -0.02], [1.25, 0.26, 0.15, 0.15, -0.025], [1.1, 0.28, 0.17, 0.17, -0.03], [1.0, 0.3, 0.18, 0.18, -0.035]];
      this.chest.add(mesh(geo('cape', () => loft(rings, 32, { arc: [Math.PI * 0.12, Math.PI * 1.76], mod: (phi, t) => 1 + 0.035 * t * Math.sin(phi * 8) })), coatMat2, 0, -CHEST_Y, 0));
      put(this.chest, mesh(G.sphere(10), mat('#FFD700', { metalness: 0.9, roughness: 0.2, emissive: '#5a4300' }), 0, C(1.43), 0.06)).scale.setScalar(0.016);
    }

    // ---------------- Arms ----------------
    this.arms = [-1, 1].map(side => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * SHOULDER[0], C(SHOULDER[1]), -0.006);
      shoulder.rotation.order = 'YXZ'; // Y last: swings a raised arm in/out
      const upper = mesh(G.upperArm(), sleeveMat);
      upper.scale.set(sleeveScale, 1, sleeveScale);
      shoulder.add(upper);
      const elbow = new THREE.Group();
      elbow.position.y = ELBOW_Y;
      elbow.rotation.order = 'YXZ'; // bend first, then swing the forearm in/out
      shoulder.add(elbow);
      const fore = mesh(G.forearm(), sleeveMat);
      fore.scale.set(sleeveScale * (sleeveMat === skin ? 1 : 1.05), sleeveMat === skin ? 1 : 0.94, sleeveScale * (sleeveMat === skin ? 1 : 1.05));
      elbow.add(fore);
      if (sleeveMat !== skin) {   // cuff + bit of wrist skin showing
        const cuff = mesh(geo('cuff', () => loft([[-0.2, 0.026, 0.03, 0.028], [-0.215, 0.026, 0.03, 0.028]], 12)), isCorset || top?.id === 'top-silk-blouse' ? mat(BLOUSE) : mat(shade(sleeveMat.color.getHexString ? '#' + sleeveMat.color.getHexString() : BASE_SUIT, 0.8)));
        cuff.scale.set(sleeveScale * 1.02, 1, sleeveScale * 1.02);
        elbow.add(cuff);
      }
      const wrist = new THREE.Group();
      wrist.position.y = WRIST_Y;
      wrist.rotation.order = 'XZY'; // twist the hand first (palm forward), then bend
      elbow.add(wrist);
      const hand = new THREE.Group();
      hand.add(mesh(G.hand(), skin));
      hand.add(mesh(G.thumb(), skin, -side * 0.006, -0.012, 0.016));
      hand.rotation.x = -0.12; // fingers curl a little forward
      wrist.add(hand);
      // props held in this hand
      if (side === -1 && acc?.id === 'acc-magnifier') {
        const glass = new THREE.Group();
        glass.position.set(side * 0.005, -0.085, 0.02);
        glass.rotation.x = -0.2;
        const ring = mesh(geo('magRing', () => new THREE.TorusGeometry(0.055, 0.008, 6, 16)), mat('#DAA520', { metalness: 0.9, roughness: 0.2 }), 0, -0.11, 0);
        const lens = mesh(geo('magLens', () => new THREE.CircleGeometry(0.05, 20)), mat('#BEE3F8', { opacity: 0.45, side: THREE.DoubleSide }), 0, -0.11, 0);
        ring.rotation.y = lens.rotation.y = Math.PI / 2;
        glass.add(ring, lens, mesh(geo('magHandle', () => new THREE.CylinderGeometry(0.009, 0.011, 0.09, 8)), mat('#8C6212'), 0, -0.02, 0));
        wrist.add(glass);
        this.magnifier = glass;
      }
      if (side === 1) {
        const mic = new THREE.Group();
        mic.position.set(-0.012, -0.1, 0.012);
        mic.add(mesh(geo('micBody', () => new THREE.CylinderGeometry(0.012, 0.008, 0.13, 10)), mat('#222228', { metalness: 0.5, roughness: 0.35 }), 0, 0, 0));
        put(mic, mesh(G.sphere(8), mat('#C9CCD6', { metalness: 0.85, roughness: 0.3 }), 0, 0.075, 0)).scale.setScalar(0.022);
        mic.rotation.x = Math.PI; // ball end points along the fingers
        mic.rotation.z = 0;
        mic.visible = false;
        wrist.add(mic);
        this.mic = mic;
      }
      this.chest.add(shoulder);
      return { shoulder, elbow, wrist };
    });

    // ---------------- Head ----------------
    this.head = new THREE.Group();
    this.head.position.set(0, C(NECK_TOP), 0.004);
    this.chest.add(this.head);
    const hc = new THREE.Group();
    hc.position.set(...HEAD_CENTER);
    this.head.add(hc);
    const headMesh = mesh(G.head(), faceTexture(skinHex, this.eyeColor, hairHex, this.makeup));
    headMesh.scale.set(...HEAD_SCALE);
    hc.add(headMesh);
    [-1, 1].forEach(s => {
      const ear = mesh(G.ear(), skin, s * 0.078, -0.012, -0.008);
      ear.rotation.y = s * 0.35;
      hc.add(ear);
    });
    hc.add(mesh(G.nose(), skin, 0, -0.002, 0.083));

    // hair
    hairGeometries(hairType).forEach(p => {
      const m = mesh(p.g, hair);
      if (p.unit) m.scale.set(...HEAD_SCALE);
      hc.add(m);
    });
    if (hairType === 'ponytail') hc.add(mesh(geo('hairTie', () => { const g = new THREE.TorusGeometry(0.03, 0.008, 6, 14); return g; }), mat('#DAA520', { metalness: 0.8, roughness: 0.3 }), 0, 0.07, -0.118));
    if (hairType === 'bun') {
      const wrap = mesh(geo('bunWrap', () => new THREE.TorusGeometry(0.036, 0.012, 6, 16)), hair, 0, 0.098, -0.062);
      wrap.rotation.x = 1.0;
      hc.add(wrap);
    }

    // hats
    const hatTop = 0.128;
    if (hat?.id === 'hat-fedora') {
      const hatMat = mat(hat.color, { roughness: 0.7 });
      const fed = new THREE.Group();
      fed.position.set(0, 0.058, -0.006);
      fed.rotation.x = -0.1;
      fed.add(mesh(geo('fedBrim', () => loft([[0.012, 0.145, 0.16, 0.15], [0.004, 0.15, 0.165, 0.155], [0.0, 0.138, 0.152, 0.142], [0.006, 0.09, 0.1, 0.1]], 28, { mod: (phi) => 1 + 0.0 * phi })), mat(hat.color, { roughness: 0.7, side: THREE.DoubleSide })));
      fed.add(mesh(geo('fedCrown', () => loft([[0.0, 0.093, 0.104, 0.104], [0.07, 0.087, 0.097, 0.097], [0.1, 0.07, 0.08, 0.08], [0.11, 0.035, 0.045, 0.045], [0.104, 0, 0, 0]], 22, { mod: (phi, t) => 1 - 0.12 * t * t * Math.max(0, Math.cos(phi)) })), hatMat));
      fed.add(mesh(geo('fedBand', () => loft([[0.012, 0.095, 0.106, 0.106], [0.04, 0.092, 0.103, 0.103]], 22)), mat('#DAA520', { metalness: 0.6, roughness: 0.35 })));
      hc.add(fed);
    } else if (hat?.id === 'hat-beret') {
      const beret = mesh(G.sphere(18), mat(hat.color, { roughness: 0.85 }), 0.02, hatTop - 0.035, -0.012);

      beret.scale.set(0.115, 0.04, 0.12);
      beret.rotation.z = -0.28;
      hc.add(beret);
      put(hc, mesh(G.sphere(6), mat(hat.color), 0.03, hatTop + 0.018, -0.01)).scale.setScalar(0.009);
    } else if (hat?.id === 'hat-tiara') {
      const tiara = new THREE.Group();
      tiara.position.set(0, 0.068, 0.0);
      tiara.rotation.x = 0.42; // front dips down onto the hairline
      tiara.add(mesh(geo('tiaraBand', () => loft([[0, 0.074, 0.089, 0.08], [0.007, 0.073, 0.088, 0.079], [0.012, 0.071, 0.085, 0.077]], 26, { arc: [-Math.PI * 0.4, Math.PI * 0.8] })), mat(hat.color, { metalness: 0.9, roughness: 0.15, emissive: '#7a5c00', emissiveIntensity: 0.6, side: THREE.DoubleSide })));
      const gem = mat('#E0F7FF', { metalness: 0.3, roughness: 0.05, emissive: '#80D8FF', emissiveIntensity: 0.7 });
      [[-0.4, 0.008], [0, 0.016], [0.4, 0.008]].forEach(([a, h]) => {
        const g = mesh(geo('gem', () => new THREE.OctahedronGeometry(1)), gem, Math.sin(a) * 0.08, 0.016 + h, Math.cos(a) * 0.088);
        g.scale.set(0.008 + h * 0.3, 0.011 + h * 0.6, 0.006);
        g.rotation.y = a;
        tiara.add(g);
      });
      hc.add(tiara);
    }

    // face & neck accessories
    if (acc?.id === 'acc-masquerade') {
      hc.add(mesh(geo('mask', () => {
        const sh = new THREE.Shape();
        const half = [[0.03, 0.023], [0.058, 0.034], [0.07, 0.012], [0.058, -0.014], [0.034, -0.02], [0.014, -0.012], [0, -0.005]];
        sh.moveTo(0, 0.01);
        half.forEach(([x, y]) => sh.lineTo(x, y));
        [...half].reverse().slice(1).forEach(([x, y]) => sh.lineTo(-x, y));
        sh.lineTo(-0.03, 0.023); sh.closePath();
        [-1, 1].forEach(sx => { const h = new THREE.Path(); h.absellipse(sx * 0.0305, 0.003, 0.0185, 0.0105, 0, TAU, false); sh.holes.push(h); });
        return wrapOnFace(new THREE.ShapeGeometry(sh, 10), 1.1);
      }), mat(acc.color, { side: THREE.DoubleSide, metalness: 0.45, roughness: 0.3 })));
      hc.add(mesh(geo('maskTrim', () => wrapOnFace(new THREE.TorusGeometry(0.004, 0.0025, 4, 8), 1.1)), gold, 0, 0.0, 0));
      put(hc, mesh(geo('feather', () => new THREE.ConeGeometry(0.009, 0.1, 6)), mat('#FFD700', { metalness: 0.8, roughness: 0.3 }), 0.07, 0.07, 0.06)).rotation.z = -0.45;
    }
    if (acc?.id === 'acc-sunglasses') {
      const frame = mat('#111111', { metalness: 0.6, roughness: 0.3 });
      hc.add(mesh(geo('shades', () => {
        const shapes = [-1, 1].map(sx => {
          const sh = new THREE.Shape();
          sh.absellipse(sx * 0.031, 0.002, 0.023, 0.016, 0, TAU, false);
          return sh;
        });
        return wrapOnFace(new THREE.ShapeGeometry(shapes, 14), 1.12);
      }), mat(acc.color === '#1C1C1C' ? '#0E0E16' : acc.color, { metalness: 0.85, roughness: 0.12, side: THREE.DoubleSide })));
      hc.add(mesh(geo('shadesBridge', () => wrapOnFace(new THREE.BoxGeometry(0.018, 0.004, 0.003), 1.13)), frame, 0, 0.008, 0));
      [-1, 1].forEach(sx => {
        const arm = mesh(geo('shadesArm', () => new THREE.BoxGeometry(0.003, 0.004, 0.1)), frame, sx * 0.084, 0.006, 0.02);
        arm.rotation.y = -sx * 0.12;
        hc.add(arm);
      });
    }
    if (acc?.id === 'acc-pearls') {
      const pearls = mesh(geo('pearls', () => {
        const g = new THREE.TorusGeometry(1, 0.17, 5, 18);

        g.rotateX(Math.PI / 2);
        return g;
      }), mat(acc.color, { roughness: 0.2, metalness: 0.2 }), 0, C(1.43), 0.014);
      pearls.scale.set(0.062, 0.062, 0.062);
      pearls.rotation.x = 0.35;
      this.chest.add(pearls);
    }

    this.body.traverse(o => { if (o.isMesh) o.frustumCulled = true; });
    this.fresh = true;
  }

  setLook(look) {
    this.build(look || {});
  }

  setPose(pose) {
    this.pose = pose;
  }

  // ---------------------------------------------------------------------------
  // Animation: each pose sets target angles; joints glide toward them smoothly.
  // Angle tips: rotation.x < 0 swings a limb forward; knee > 0 bends the shin back;
  // elbow < 0 bends the forearm forward; shZ * side > 0 lifts an arm out sideways.
  // ---------------------------------------------------------------------------
  update(dt) {
    dt = Math.min(dt || 0, 0.1);
    this.time += dt;
    const t = this.time;
    const T = {};
    JOINTS.forEach(k => { T[k] = 0; });
    const set = (side, k, v) => { T[k + (side < 0 ? 'L' : 'R')] = v; };
    const pose = this.pose;
    let props = { mic: false };

    if (pose === 'walk') {
      const w = t * 7.6;
      [-1, 1].forEach(side => {
        const p = w + (side < 0 ? 0 : Math.PI);
        const sp = Math.sin(p), cp = Math.cos(p);
        const hipX = -0.42 * sp;
        const knee = 0.12 + 0.75 * Math.pow(Math.max(0, cp), 1.6) + 0.12 * Math.max(0, -sp) * Math.max(0, -cp);
        set(side, 'hipX', hipX);
        set(side, 'knee', knee);
        set(side, 'ankle', -0.55 * (hipX + knee) + 0.2 * Math.max(0, sp) * Math.max(0, -cp) + 0.1);
        set(side, 'hipZ', side * 0.02);
        set(side, 'shX', 0.42 * sp);
        set(side, 'shZ', side * 0.09);
        set(side, 'elbow', -0.25 - 0.3 * Math.max(0, -sp));
        set(side, 'wristX', -0.1);
      });
      T.bodyY = 0.018 * Math.cos(2 * w) - 0.01;
      T.pelvisY = 0.08 * Math.sin(w);
      T.pelvisZ = 0.045 * Math.sin(w);
      T.chestY = -0.1 * Math.sin(w);
      T.chestZ = -0.03 * Math.sin(w);
      T.chestX = 0.04;
      T.headY = 0.08 * Math.sin(w);
      T.headX = -0.03;
    } else if (pose === 'dance') {
      const b = t * 6.2;
      const bounce = Math.abs(Math.sin(b));
      T.bodyY = -0.045 + 0.04 * bounce;
      T.bodyRY = Math.sin(t * 1.4) * 0.5;
      T.pelvisZ = 0.1 * Math.sin(b);
      T.pelvisY = 0.12 * Math.sin(b * 0.5);
      T.chestZ = -0.12 * Math.sin(b);
      T.chestY = -0.15 * Math.sin(b * 0.5);
      [-1, 1].forEach(side => {
        const ph = Math.sin(b + (side < 0 ? 0 : Math.PI));
        set(side, 'hipX', -0.2 - 0.18 * Math.max(0, ph));
        set(side, 'hipZ', side * 0.08);
        set(side, 'knee', 0.4 + 0.3 * Math.max(0, ph) - 0.25 * bounce);
        set(side, 'ankle', -0.15);
        // arms pump to the beat, one hand flips up high now and then
        const up = Math.sin(b + (side < 0 ? 0 : Math.PI));
        const high = side < 0 ? Math.max(0, Math.sin(t * 0.9)) : Math.max(0, -Math.sin(t * 0.9));
        set(side, 'shX', lerp(-0.75 - 0.45 * up, -0.4, high));
        set(side, 'shZ', side * lerp(0.45 + 0.2 * up, 2.6, high));
        set(side, 'elbow', lerp(-1.45 - 0.3 * up, -0.3, high));
        set(side, 'elbowY', -side * 0.4 * (1 - high));
        set(side, 'wristZ', side * 0.25 * up);
      });
      T.headZ = 0.15 * Math.sin(b);
      T.headX = -0.05;
    } else if (pose === 'cheer') {
      const f = t * 2.2 * TAU / 2;
      const jump = Math.max(0, Math.sin(f));
      const crouch = Math.max(0, -Math.sin(f));
      T.bodyY = 0.1 * jump - 0.09 * crouch;
      T.chestX = -0.08 + 0.12 * crouch;
      [-1, 1].forEach(side => {
        set(side, 'hipX', -0.35 * crouch - 0.05);
        set(side, 'hipZ', side * 0.05);
        set(side, 'knee', 0.75 * crouch + 0.1);
        set(side, 'ankle', -0.4 * crouch + 0.3 * jump);
        const wave = Math.sin(t * 9 + side * 1.2);
        set(side, 'shZ', side * (2.7 + 0.18 * wave));
        set(side, 'shX', -0.15);
        set(side, 'elbow', -0.35 - 0.25 * wave);
        set(side, 'elbowY', 0);
        set(side, 'wristZ', side * 0.35 * wave);
        set(side, 'wristY', -side * 1.3);
      });
      T.headX = -0.22 + 0.08 * crouch;
      T.headZ = 0.08 * Math.sin(t * 3);
    } else if (pose === 'sing') {
      const s = Math.sin(t * 1.9);
      T.bodyY = -0.006 + 0.006 * Math.abs(Math.sin(t * 3.8));
      T.pelvisZ = 0.06 * s;
      T.pelvisY = 0.06 * s;
      T.chestZ = -0.05 * s;
      T.chestY = -0.05 * s;
      T.chestX = -0.05;
      set(-1, 'hipX', -0.04); set(1, 'hipX', 0.06);
      set(-1, 'hipZ', -0.04 - 0.03 * s); set(1, 'hipZ', 0.05 - 0.03 * s);
      set(-1, 'knee', 0.06 + 0.12 * Math.max(0, s)); set(1, 'knee', 0.06 + 0.12 * Math.max(0, -s));
      // mic hand (left side of the screen: +X) to the mouth
      set(1, 'shX', -0.62);
      set(1, 'shZ', -0.22);
      set(1, 'shY', -0.3);
      set(1, 'elbow', -2.25);
      set(1, 'elbowY', -1.0);

      set(1, 'wristX', 0.15);
      // other arm gestures out to the crowd
      const g = Math.sin(t * 1.3);
      set(-1, 'shX', -0.9 - 0.35 * g);
      set(-1, 'shZ', -(0.55 + 0.25 * g));
      set(-1, 'elbow', -0.35 - 0.2 * g);
      set(-1, 'wristX', -0.3);
      set(-1, 'wristY', 1.1);

      T.headX = -0.12 + 0.05 * Math.sin(t * 2.3);
      T.headZ = 0.08 * s;
      props.mic = true;
    } else if (pose === 'hide') {
      // sitting on the ground behind a car, hugging the knees and peeking around
      T.bodyY = -0.775;
      T.chestX = 0.42;
      T.pelvisX = -0.1;
      [-1, 1].forEach(side => {
        set(side, 'hipX', -2.25);
        set(side, 'hipZ', side * 0.1);
        set(side, 'knee', 2.4);
        set(side, 'ankle', -0.15);
        set(side, 'shX', -0.7);
        set(side, 'shZ', side * 0.12);
        set(side, 'shY', -side * 0.35);
        set(side, 'elbow', -1.75);
      });
      T.headY = Math.sin(t * 0.8) * 0.65;
      T.headX = -0.35 + Math.sin(t * 0.8 + 1) * 0.06;
      T.headZ = Math.sin(t * 0.8) * 0.12;
    } else {
      // idle: relaxed model stance with weight shift and breathing
      const shift = Math.sin(t * 0.7);
      const breath = Math.sin(t * 2.2);
      T.bodyY = -0.004 - 0.004 * Math.abs(shift);
      T.pelvisZ = 0.035 * shift;
      T.pelvisY = 0.05 * shift;
      T.chestZ = -0.03 * shift;
      T.chestX = 0.012 * breath;
      [-1, 1].forEach(side => {
        const relaxed = Math.max(0, side * shift); // the leg not holding weight
        set(side, 'hipX', -0.05 * relaxed + 0.02);
        set(side, 'hipZ', -side * 0.025 * shift + side * 0.025);
        set(side, 'knee', 0.03 + 0.16 * relaxed);
        set(side, 'ankle', -0.06 * relaxed);
        set(side, 'shZ', side * (0.1 + 0.012 * breath));
        set(side, 'shX', 0.03);
        set(side, 'elbow', -0.16);
        set(side, 'wristX', -0.06);
      });
      // one hand on the hip (right side)
      set(-1, 'shZ', -0.62);
      set(-1, 'shX', 0.15);
      set(-1, 'shY', 0);

      set(-1, 'elbow', -1.55);
      set(-1, 'elbowY', 0.5);
      T.headZ = 0.04 * shift + 0.03;
      T.headY = 0.12 * Math.sin(t * 0.37);
    }

    // glide toward the targets
    const j = this.j;
    const k = this.fresh ? 1 : Math.min(1, dt * (pose === 'walk' || pose === 'cheer' || pose === 'dance' ? 18 : 8));
    this.fresh = false;
    JOINTS.forEach(key => { j[key] += (T[key] - j[key]) * k; });

    this.body.position.y = j.bodyY + this.heelLift;
    this.body.rotation.y = j.bodyRY;
    this.pelvis.rotation.set(j.pelvisX, j.pelvisY, j.pelvisZ);
    // the chest counter-balances the hips
    this.chest.rotation.set(j.chestX, j.chestY - j.pelvisY * 0.3, j.chestZ);
    this.chest.position.x = -Math.sin(j.pelvisZ) * 0.02;
    this.head.rotation.set(j.headX, j.headY, j.headZ - j.chestZ * 0.6);
    this.legs.forEach((leg, i) => {
      const s = i ? 'R' : 'L';
      leg.hip.rotation.set(j['hipX' + s], j['hipY' + s], j['hipZ' + s] - j.pelvisZ);
      leg.knee.rotation.x = j['knee' + s];
      leg.ankle.rotation.x = j['ankle' + s] + (this.heelLift ? 0.4 : 0);
    });
    this.arms.forEach((arm, i) => {
      const s = i ? 'R' : 'L';
      arm.shoulder.rotation.set(j['shX' + s], j['shY' + s], j['shZ' + s] - j.chestZ);
      arm.elbow.rotation.set(j['elbow' + s], j['elbowY' + s], 0);
      arm.wrist.rotation.set(j['wristX' + s], j['wristY' + s], j['wristZ' + s]);
    });
    if (this.mic) this.mic.visible = props.mic;
  }
}
