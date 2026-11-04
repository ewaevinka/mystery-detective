// Wardrobe & Avatar Engine for Mystery Runway & Detective Atelier

export const WARDROBE_DATA = {
  skinTones: [
    { id: 'skin-1', name: 'Warm Peach', color: '#F8D9C0' },
    { id: 'skin-2', name: 'Honey Beige', color: '#E5B887' },
    { id: 'skin-3', name: 'Golden Tan', color: '#CA9464' },
    { id: 'skin-4', name: 'Chestnut', color: '#8D5524' },
    { id: 'skin-5', name: 'Deep Espresso', color: '#4A2E1B' },
    { id: 'skin-6', name: 'Rose Porcelain', color: '#FFE0BD' }
  ],
  
  hairStyles: [
    { id: 'hair-sleuth-ponytail', name: 'Detective Ponytail', type: 'ponytail' },
    { id: 'hair-glam-waves', name: 'Runway Glamour Waves', type: 'waves' },
    { id: 'hair-chic-bob', name: 'French Chic Bob', type: 'bob' },
    { id: 'hair-vintage-curls', name: '1920s Noir Curls', type: 'curls' },
    { id: 'hair-high-bun', name: 'Sleek Ballerina Bun', type: 'bun' }
  ],
  
  hairColors: [
    { id: 'h-obsidian', name: 'Obsidian Black', color: '#1B191B' },
    { id: 'h-chestnut', name: 'Chestnut Brown', color: '#4E301D' },
    { id: 'h-blonde', name: 'Champagne Blonde', color: '#E8C87A' },
    { id: 'h-auburn', name: 'Crimson Auburn', color: '#7E2811' },
    { id: 'h-pastel-pink', name: 'Cotton Candy Pink', color: '#F7A8B8' },
    { id: 'h-silver', name: 'Platinum Silver', color: '#D9D9E2' }
  ],

  categories: [
    { id: 'outerwear', name: 'Coats & Capes', icon: '🧥' },
    { id: 'tops', name: 'Tops & Blouses', icon: '👚' },
    { id: 'bottoms', name: 'Skirts & Pants', icon: '👗' },
    { id: 'shoes', name: 'Footwear', icon: '👠' },
    { id: 'hats', name: 'Hats & Hairpins', icon: '👒' },
    { id: 'accessories', name: 'Detective Gear', icon: '🔍' }
  ],

  items: [
    // Outerwear
    {
      id: 'coat-noir-trench',
      category: 'outerwear',
      name: 'Classic Noir Trench',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 15,
      color: '#C29B38',
      preview: '🧥',
      desc: 'The quintessential coat for sleuthing through misty alleyways.'
    },
    {
      id: 'coat-midnight-cape',
      category: 'outerwear',
      name: 'Midnight Velvet Capelet',
      styleTag: 'disguise',
      stealthBonus: 30,
      glamourBonus: 25,
      color: '#1A183A',
      preview: '✨',
      desc: 'Deep indigo velvet lined with silver star patterns for sneaking into VIP galas.'
    },
    {
      id: 'coat-gold-blazer',
      category: 'outerwear',
      name: 'Gilded Runway Blazer',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 40,
      color: '#D4AF37',
      preview: '🪙',
      desc: 'Sharp tailoring with real gold thread. Unmistakable fashion power.'
    },

    // Tops
    {
      id: 'top-detective-turtleneck',
      category: 'tops',
      name: 'Shadow Ribbed Turtleneck',
      styleTag: 'detective',
      stealthBonus: 20,
      glamourBonus: 10,
      color: '#26282B',
      preview: '🥼',
      desc: 'Comfortable, sleek, and perfect for midnight clue hunting.'
    },
    {
      id: 'top-silk-blouse',
      category: 'tops',
      name: 'Duchess Ruffle Silk Blouse',
      styleTag: 'vintage',
      stealthBonus: 10,
      glamourBonus: 30,
      color: '#FBF5E8',
      preview: '🎀',
      desc: 'Delicate lace cuffs hiding secret notebook pockets.'
    },
    {
      id: 'top-corset-vest',
      category: 'tops',
      name: 'Atelier Tailored Corset',
      styleTag: 'glamour',
      stealthBonus: 15,
      glamourBonus: 35,
      color: '#800020',
      preview: '🥀',
      desc: 'Deep burgundy velvet corset laced with gold thread.'
    },

    // Bottoms
    {
      id: 'bottom-sleuth-trousers',
      category: 'bottoms',
      name: 'High-Waist Sleuth Trousers',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 15,
      color: '#343A40',
      preview: '👖',
      desc: 'Tailored with secret concealed pockets for evidence vials.'
    },
    {
      id: 'bottom-gala-skirt',
      category: 'bottoms',
      name: 'Grand Ballroom Tulle Gown',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 45,
      color: '#9C27B0',
      preview: '👗',
      desc: 'Cascading layers of royal violet silk that sweep the runway floor.'
    },
    {
      id: 'bottom-pleated-skirt',
      category: 'bottoms',
      name: 'Houndstooth Pleated Skirt',
      styleTag: 'vintage',
      stealthBonus: 20,
      glamourBonus: 25,
      color: '#5C5446',
      preview: '🏁',
      desc: 'Classic British detective chic with sharp razor pleats.'
    },

    // Footwear
    {
      id: 'shoes-brogues',
      category: 'shoes',
      name: 'Silent Leather Brogues',
      styleTag: 'detective',
      stealthBonus: 30,
      glamourBonus: 10,
      color: '#4B3621',
      preview: '👞',
      desc: 'Rubber-cushioned soles designed to make zero sound on marble floors.'
    },
    {
      id: 'shoes-stilettos',
      category: 'shoes',
      name: 'Runway Crystal Stilettos',
      styleTag: 'glamour',
      stealthBonus: 0,
      glamourBonus: 40,
      color: '#E0AA3E',
      preview: '👠',
      desc: 'Towering heels that click authoritatively down the runway.'
    },
    {
      id: 'shoes-stealth-boots',
      category: 'shoes',
      name: 'Atelier Combat Boots',
      styleTag: 'disguise',
      stealthBonus: 25,
      glamourBonus: 20,
      color: '#1F2421',
      preview: '🥾',
      desc: 'Heavy buckled leather ready for climbing fire escapes.'
    },

    // Hats
    {
      id: 'hat-fedora',
      category: 'hats',
      name: 'Signature Detective Fedora',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 20,
      color: '#2B2B2B',
      preview: '🕵️',
      desc: 'Tilted low over one eye for maximum deductive aura.'
    },
    {
      id: 'hat-beret',
      category: 'hats',
      name: 'Parisian Designer Beret',
      styleTag: 'vintage',
      stealthBonus: 15,
      glamourBonus: 30,
      color: '#A1045A',
      preview: '👒',
      desc: 'A chic wool beret that whispers Haute Couture.'
    },
    {
      id: 'hat-tiara',
      category: 'hats',
      name: 'Diamond Gala Crown',
      styleTag: 'glamour',
      stealthBonus: 0,
      glamourBonus: 50,
      color: '#FFD700',
      preview: '👑',
      desc: 'Sparkling crystals caught in the runway spotlight.'
    },

    // Accessories & Detective Tools
    {
      id: 'acc-magnifier',
      category: 'accessories',
      name: 'Golden Brass Magnifier',
      styleTag: 'detective',
      stealthBonus: 10,
      glamourBonus: 15,
      cluePower: 30,
      color: '#DAA520',
      preview: '🔍',
      desc: 'Reveals microscopic thread burns, hidden dye, and fabric clues.'
    },
    {
      id: 'acc-masquerade',
      category: 'accessories',
      name: 'Venetian Peacock Mask',
      styleTag: 'disguise',
      stealthBonus: 40,
      glamourBonus: 35,
      cluePower: 10,
      color: '#0D5C75',
      preview: '🎭',
      desc: 'Completely conceals your identity at VIP masquerade galas.'
    },
    {
      id: 'acc-sunglasses',
      category: 'accessories',
      name: 'Noir Tinted Spy Shades',
      styleTag: 'detective',
      stealthBonus: 30,
      glamourBonus: 20,
      cluePower: 15,
      color: '#1C1C1C',
      preview: '🕶️',
      desc: 'Observe suspects without them ever knowing where you are looking.'
    },
    {
      id: 'acc-pearls',
      category: 'accessories',
      name: 'Triple Strand Pearl Choker',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 35,
      cluePower: 5,
      color: '#F4F1EA',
      preview: '📿',
      desc: 'Elegant vintage pearls favored by Madame Vivienne herself.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-pumpkin-beret',
      base: 'hat-beret',
      rare: true,
      season: 'autumn-2026',
      category: 'hats',
      name: 'Pumpkin Spice Beret',
      styleTag: 'vintage',
      stealthBonus: 20,
      glamourBonus: 55,
      color: '#E07A2E',
      preview: '🎃',
      desc: 'A cozy autumn beret the color of pumpkin pie.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-maple-trench',
      base: 'coat-noir-trench',
      rare: true,
      season: 'autumn-2026',
      category: 'outerwear',
      name: 'Maple Leaf Trench',
      styleTag: 'detective',
      stealthBonus: 35,
      glamourBonus: 55,
      color: '#A0412D',
      preview: '🍁',
      desc: 'A trench coat as red as falling maple leaves.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-golden-hour-gown',
      base: 'bottom-gala-skirt',
      rare: true,
      season: 'autumn-2026',
      category: 'bottoms',
      name: 'Golden Hour Gown',
      styleTag: 'glamour',
      stealthBonus: 10,
      glamourBonus: 75,
      color: '#E8A33D',
      preview: '🌅',
      desc: 'Glows like the sky at sunset.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-harvest-cape',
      base: 'coat-midnight-cape',
      rare: true,
      season: 'autumn-2026',
      category: 'outerwear',
      name: 'Harvest Moon Capelet',
      styleTag: 'disguise',
      stealthBonus: 45,
      glamourBonus: 60,
      color: '#7A2E1A',
      preview: '🌕',
      desc: 'Deep autumn velvet for sneaking under the harvest moon.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-copper-crown',
      base: 'hat-tiara',
      rare: true,
      season: 'autumn-2026',
      category: 'hats',
      name: 'Copper Leaf Crown',
      styleTag: 'glamour',
      stealthBonus: 10,
      glamourBonus: 85,
      color: '#C8742C',
      preview: '👑',
      desc: 'A crown of shining copper autumn leaves.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-cinnamon-boots',
      base: 'shoes-stealth-boots',
      rare: true,
      season: 'autumn-2026',
      category: 'shoes',
      name: 'Cinnamon Combat Boots',
      styleTag: 'disguise',
      stealthBonus: 45,
      glamourBonus: 55,
      color: '#8B4A2B',
      preview: '🥾',
      desc: 'Warm, spicy and super sneaky.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-sunset-shades',
      base: 'acc-sunglasses',
      rare: true,
      season: 'autumn-2026',
      category: 'accessories',
      name: 'Sunset Shades',
      styleTag: 'detective',
      stealthBonus: 45,
      glamourBonus: 65,
      color: '#FF7E5F',
      preview: '🕶️',
      desc: 'See every clue through sunset-orange lenses.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-snowflake-beret',
      base: 'hat-beret',
      rare: true,
      season: 'winter-2026',
      category: 'hats',
      name: 'Snowflake Beret',
      styleTag: 'vintage',
      stealthBonus: 20,
      glamourBonus: 55,
      color: '#DDEFFF',
      preview: '❄️',
      desc: 'Soft as fresh snow.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-icicle-blazer',
      base: 'coat-gold-blazer',
      rare: true,
      season: 'winter-2026',
      category: 'outerwear',
      name: 'Icicle Blazer',
      styleTag: 'glamour',
      stealthBonus: 15,
      glamourBonus: 75,
      color: '#9FD8FF',
      preview: '🧊',
      desc: 'Sharp, shiny and ice cold.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-frost-gown',
      base: 'bottom-gala-skirt',
      rare: true,
      season: 'winter-2026',
      category: 'bottoms',
      name: 'Frost Princess Gown',
      styleTag: 'glamour',
      stealthBonus: 10,
      glamourBonus: 80,
      color: '#8EC5F0',
      preview: '💠',
      desc: 'Swirls like a winter snowstorm.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-aurora-cape',
      base: 'coat-midnight-cape',
      rare: true,
      season: 'winter-2026',
      category: 'outerwear',
      name: 'Aurora Capelet',
      styleTag: 'disguise',
      stealthBonus: 45,
      glamourBonus: 65,
      color: '#5E4BC4',
      preview: '🌌',
      desc: 'Shimmers like the northern lights.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-ice-queen-tiara',
      base: 'hat-tiara',
      rare: true,
      season: 'winter-2026',
      category: 'hats',
      name: 'Ice Queen Tiara',
      styleTag: 'glamour',
      stealthBonus: 10,
      glamourBonus: 90,
      color: '#CFF3FF',
      preview: '👑',
      desc: 'Carved from magic ice that never melts.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-snow-stilettos',
      base: 'shoes-stilettos',
      rare: true,
      season: 'winter-2026',
      category: 'shoes',
      name: 'Snow Crystal Stilettos',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 80,
      color: '#EAF6FF',
      preview: '👠',
      desc: 'Every step leaves a tiny snowflake.'
    },

    // ✨ RARE season reward (only from big ranks, see js/ranks.js)
    {
      id: 'rare-starlight-pearls',
      base: 'acc-pearls',
      rare: true,
      season: 'winter-2026',
      category: 'accessories',
      name: 'Starlight Pearls',
      styleTag: 'glamour',
      stealthBonus: 10,
      glamourBonus: 85,
      color: '#E3DCFF',
      preview: '📿',
      desc: 'Pearls that glow like winter stars.'
    }
  ]
};

// ---------------------------------------------------------------------------
// Doll drawing helpers (private to this file)
// The doll is drawn in a 300 x 480 box with realistic "runway model"
// proportions: about 8 heads tall (head = crown 25 -> chin 78, feet at ~456).
// Body landmarks below are shared by the skin layer AND every clothing item,
// so clothes always fit the body.
// ---------------------------------------------------------------------------

const r1 = n => Math.round(n * 10) / 10;
const pt = p => `${r1(p[0])} ${r1(p[1])}`;

function hexToRgb(hex) {
  let h = String(hex || '#888888').replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// amt < 0 darkens, amt > 0 lightens (range -1 .. 1)
function shade(hex, amt) {
  const f = c => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  return '#' + hexToRgb(hex).map(c => Math.max(0, Math.min(255, f(c))).toString(16).padStart(2, '0')).join('');
}

// Blend two colours (t = 0 -> a, t = 1 -> b)
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return '#' + A.map((c, i) => Math.round(c + (B[i] - c) * t).toString(16).padStart(2, '0')).join('');
}

function isDark(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 70;
}

// Smooth closed/open path through points (Catmull-Rom). A point [x, y, 1] is a sharp corner.
function smoothPath(pts, closed = true) {
  const n = pts.length;
  const get = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pt(pts[0])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d + (closed ? ' Z' : '');
}

// Limb points are [x, y, viewerLeftHalfWidth, viewerRightHalfWidth?].
// Two widths let calves, biceps and thighs bulge more on one side, like real muscles.
function limbEdges(pts, pad = 0) {
  const n = pts.length;
  const left = [], right = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx0 = b[0] - a[0], dy0 = b[1] - a[1], len = Math.hypot(dx0, dy0) || 1;
    const dx = dx0 / len, dy = dy0 / len;
    const pv = typeof pad === 'function' ? pad(pts[i], i) : pad;
    const wl = pts[i][2] + pv, wr = (pts[i][3] ?? pts[i][2]) + pv;
    left.push([pts[i][0] - dy * wl, pts[i][1] + dx * wl]);
    right.push([pts[i][0] + dy * wr, pts[i][1] - dx * wr]);
  }
  return { left, right };
}

// Closed tube outline (arm, leg, sleeve, trouser leg)
function limbPath(pts, { pad = 0, capStart = true, capEnd = true } = {}) {
  const n = pts.length;
  const { left, right } = limbEdges(pts, pad);
  const dirAt = i => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    return [dx / len, dy / len];
  };
  const halfW = i => ((pts[i][2] + (pts[i][3] ?? pts[i][2])) / 2) + (typeof pad === 'function' ? pad(pts[i], i) : pad);
  if (!capStart) { left[0][2] = 1; right[0][2] = 1; }
  if (!capEnd) { left[n - 1][2] = 1; right[n - 1][2] = 1; }
  const out = [];
  if (capStart) {
    const [dx, dy] = dirAt(0), w = halfW(0);
    out.push([pts[0][0] - dx * w * 0.8, pts[0][1] - dy * w * 0.8]);
  }
  out.push(...left);
  if (capEnd) {
    const [dx, dy] = dirAt(n - 1), w = halfW(n - 1);
    out.push([pts[n - 1][0] + dx * w * 0.85, pts[n - 1][1] + dy * w * 0.85]);
  }
  out.push(...right.reverse());
  return smoothPath(out, true);
}

// Open outline strokes for a skin limb (so joints don't show seams)
function limbOutline(pts, yLeft, yRight) {
  const { left, right } = limbEdges(pts, 0);
  const L = left.filter(p => p[1] >= yLeft), R = right.filter(p => p[1] >= yRight);
  return (L.length > 1 ? smoothPath(L, false) : '') + ' ' + (R.length > 1 ? smoothPath(R, false) : '');
}

// Part of a limb between two heights (with interpolated end points)
function sliceLimb(pts, y0, y1) {
  const lerpAt = y => {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (y >= a[1] && y <= b[1]) {
        const t = (y - a[1]) / ((b[1] - a[1]) || 1);
        const ar = a[3] ?? a[2], br = b[3] ?? b[2];
        return [a[0] + (b[0] - a[0]) * t, y, a[2] + (b[2] - a[2]) * t, ar + (br - ar) * t];
      }
    }
    return y < pts[0][1] ? pts[0].slice() : pts[pts.length - 1].slice();
  };
  return [lerpAt(y0), ...pts.filter(p => p[1] > y0 + 1 && p[1] < y1 - 1).map(p => p.slice()), lerpAt(y1)];
}

// --- Body landmarks -------------------------------------------------------
// Torso outline (viewer-left side), neck -> shoulders -> bust -> waist -> hips.
const TORSO_L_BASE = [[141, 64], [141, 84], [138.5, 91], [132.5, 96], [124, 100.5], [117, 105], [114, 113], [117.5, 125], [119, 134], [121, 148], [124.5, 161], [125.5, 170], [124, 182], [118.5, 197], [114.5, 210], [114, 222], [116, 234]];
// Viewer-right side mirrors it; the hips shift a touch toward the standing leg.
// Runway pose: the pelvis swings toward the standing leg (hip tilt), the hip on
// that side pops out a little.
const PELVIS = -4.5;
const hipShift = y => PELVIS * Math.max(0, Math.min(1, (y - 168) / 38));
const hipPop = y => Math.max(0, 1 - Math.abs(y - 206) / 26) * 2;
const TORSO_L = TORSO_L_BASE.map(([x, y]) => [x + hipShift(y) - hipPop(y), y]);
const TORSO_R = TORSO_L_BASE.map(([x, y]) => [300 - x + hipShift(y) - hipPop(y) * 0.6, y]);

// Legs: [x, y, leftHalfWidth, rightHalfWidth]. Viewer-left leg carries the weight,
// the other knee relaxes inward (gentle contrapposto).
const LEG_L_BASE = [[132.5, 212, 18, 16.5], [132, 234, 17.2, 16.6], [133.5, 262, 14.8, 14.4], [136, 298, 11.8, 11.4], [138.2, 324, 9.2, 8.8], [138.8, 338, 9, 8.4], [138.4, 352, 11.2, 9.2], [139, 368, 10.4, 10], [140, 392, 7.6, 7.2], [141, 414, 5.8, 5.3], [141.6, 430, 5.4, 5.3]];
const LEG_R_BASE = [[166, 213, 16.5, 18], [166.5, 235, 16.4, 16.8], [165.5, 263, 14.2, 14.4], [163.5, 298, 11.4, 11.2], [162, 325, 8.8, 9], [161.6, 339, 8.4, 9], [162, 353, 9.2, 11.2], [163, 369, 10, 10.4], [164.6, 393, 7.2, 7.6], [166, 415, 5.3, 5.8], [167, 431, 5.3, 5.4]];

// Arms hang relaxed a little away from the waist. [x, y, leftHalfW, rightHalfW]
// Standing leg angles in under the body; the relaxed leg's knee and foot cross slightly inward.
const LEG_L = LEG_L_BASE.map(([x, y, a, b]) => [x + PELVIS + 8.6 * (y - 212) / 218, y, a, b]);
const LEG_R = LEG_R_BASE.map(([x, y, a, b]) => [x + PELVIS - 2 * (y - 212) / 218, y, a, b]);

// Viewer-left hand rests on the hip (elbow out); the other arm hangs and can hold the magnifier.
const ARM_L = [[121, 110, 8.6, 8], [117, 122, 9.2, 7.2], [113.2, 135, 7.4, 6.6], [109.6, 148, 6.6, 6.2], [106.6, 160, 5.8, 5.4], [105.4, 169, 5, 4.8], [106.4, 178, 6.2, 5.2], [110, 189, 5.4, 4.6], [114.6, 198, 4.5, 4], [118, 204, 4.2, 4]];
const ARM_HANG = [[121, 110, 8.6, 8], [118.4, 120, 9.2, 7.2], [116.8, 134, 7.4, 6.6], [116, 148, 6.6, 6.4], [115.4, 160, 5.8, 5.6], [115, 169, 5, 4.8], [114.6, 180, 6.4, 5.2], [114, 196, 5.4, 4.6], [113.4, 214, 4.2, 3.9], [113, 227, 4.2, 4]];
const ARM_R = ARM_HANG.map(([x, y, a, b], i) => [300 - x + i * 0.3 - (y > 150 ? 1.5 : 0), y, b, a]);

function profX(prof, y) {
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i], b = prof[i + 1];
    if (y >= a[1] && y <= b[1]) return a[0] + (b[0] - a[0]) * ((y - a[1]) / ((b[1] - a[1]) || 1));
  }
  return y < prof[0][1] ? prof[0][0] : prof[prof.length - 1][0];
}

// One side of the torso between two heights, pushed outward by pad (for clothes).
function torsoSide(prof, side, y0, y1, pad = 0) {
  const lift = y => (y < 108 ? pad * 0.8 : 0);
  const out = [[profX(prof, y0) + side * pad, y0 - lift(y0)]];
  for (const p of prof) if (p[1] > y0 + 0.5 && p[1] < y1 - 0.5) out.push([p[0] + side * pad, p[1] - lift(p[1])]);
  out.push([profX(prof, y1) + side * pad, y1 - lift(y1)]);
  return out;
}

// Generic garment body: shoulders/neck to a hem height.
function torsoGarment(pad, yTop, yHem, { neckDip = 4, hemDrop = 2 } = {}) {
  const L = torsoSide(TORSO_L, -1, yTop, yHem, pad);
  const R = torsoSide(TORSO_R, 1, yTop, yHem, pad);
  L[L.length - 1][2] = 1; R[R.length - 1][2] = 1;
  L[0][2] = 1; R[0][2] = 1;
  const hemMid = [(L[L.length - 1][0] + R[R.length - 1][0]) / 2, yHem + hemDrop];
  const neckMid = [(L[0][0] + R[0][0]) / 2, Math.min(L[0][1], R[0][1]) + neckDip];
  return smoothPath([...L, hemMid, ...R.reverse(), neckMid]);
}

// Outline points for anything with two legs (trousers, shorts of the bodysuit):
// torso side -> outer leg -> hem -> inner leg -> crotch -> other leg -> other side.
function pantsPoints(yTop, yHem, legPad, crotchY, torsoPad) {
  const edges = leg => {
    const pts = sliceLimb(leg, 228, yHem);
    return limbEdges(pts, typeof legPad === 'function' ? p => legPad(p[1]) : legPad);
  };
  const eL = edges(LEG_L), eR = edges(LEG_R);
  const sideL = torsoSide(TORSO_L, -1, yTop, 222, torsoPad), sideR = torsoSide(TORSO_R, 1, yTop, 222, torsoPad);
  sideL[0][2] = 1; sideR[0][2] = 1;
  const nL = eL.left.length - 1, nR = eR.left.length - 1;
  eL.left[nL][2] = 1; eL.right[nL][2] = 1; eR.left[nR][2] = 1; eR.right[nR][2] = 1;
  return [
    ...sideL, ...eL.left.slice(1),
    ...eL.right.slice().reverse().filter(p => p[1] > crotchY + 6),
    [150 + PELVIS, crotchY, 1],
    ...eR.left.filter(p => p[1] > crotchY + 6),
    ...eR.right.slice(1).reverse(),
    ...sideR.reverse()
  ];
}

// Little 4-point sparkle star
function sparkle(x, y, s, fill, opacity = 1) {
  return `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${fill}" opacity="${opacity}"/>`;
}

// Hands in local coords: wrist at 0,0, fingers toward +y, +x = thumb / body side.
const HAND_RELAXED = 'M-4.3 -1 C-4.9 4, -5.6 8, -5.6 11.5 C-5.6 14.5, -5.4 17, -4.8 19.2 C-4.4 20.6, -3.3 20.8, -2.9 19.7 C-2.8 21.4, -2.2 22.7, -1.2 22.5 C-0.8 23.5, 0.6 23.9, 1.2 22.9 C2 23.3, 3.2 22.6, 3.3 21 C3.6 18.6, 3.7 16, 4 13.6 C5.4 13.8, 6.9 12.9, 6.9 11.3 C6.9 9, 5.7 5.5, 4.6 2.5 C4.4 1, 4.3 0, 4.1 -1 Z';
const HAND_RELAXED_LINES = 'M4 13.6 C3.4 11.2, 3.3 8.6, 3.9 6 M-2.9 19.7 C-3.1 17, -3.3 15, -3.5 12.6 M-1.2 22.5 C-1.1 19, -1.2 15.6, -1.3 12.8 M1.2 22.9 C1.3 19, 1.2 15.6, 1.1 12.6 M-5 11 C-3 12, -0.5 12.2, 2.4 11.6';
const HAND_FIST = 'M-4.4 -1 C-5.2 3, -5.8 7, -5.8 10.5 C-5.8 14.5, -4.8 17.6, -2.2 18.2 L3.8 18.2 C6.1 17.8, 6.9 15.6, 6.7 13 C6.6 10, 6 6.5, 5 3 C4.6 1, 4.3 0, 4.2 -1 Z';
const HAND_FIST_LINES = 'M-1.2 11.2 C1 10.6, 4 10.8, 6.6 11.4 M-1.6 14.4 C1 13.8, 4 14, 6.7 14.6 M5 4 C2.4 5.6, -0.6 7.6, -1.6 10 C0.4 10.6, 2.6 9.8, 4.4 8.8';

// Feet in local coords: ankle at 0,0, +x = outer side of the foot.
const FOOT_PATH = 'M-5.2 -3 C-5.4 4, -6.6 10, -7.2 15 C-7.6 19, -6.4 22.4, -3.4 23.4 C0 24.4, 4.6 23.6, 7 21.4 C8.6 19.8, 8.4 17.4, 7.2 14.5 C6 10, 5.6 4, 5.4 -3 Z';
const FOOT_LINES = 'M-2.4 21 L-2.2 23.3 M0.6 21.4 L0.8 23.6 M3.2 21 L3.5 23.1 M5.3 19.6 L5.9 21.9 M-5 1.6 C-4.2 2.6, -4 3.6, -4.6 4.6';

// Cloud-like outline with soft scallops (curly hair silhouettes)
function bumpyBlob(cx, cy, rx, ry, n, depth, a0 = 0, a1 = Math.PI * 2, close = true) {
  const P = (t, k = 0) => [cx + Math.cos(t) * (rx + k), cy + Math.sin(t) * (ry + k)];
  let d = `M${pt(P(a0))}`;
  for (let i = 1; i <= n; i++) {
    const tm = a0 + (a1 - a0) * (i - 0.5) / n;
    d += ` Q${pt(P(tm, depth))} ${pt(P(a0 + (a1 - a0) * i / n))}`;
  }
  return d + (close ? ' Z' : '');
}

// Ringlet texture (spiral groove + shine) drawn on top of a curly mass
function curlTex(x, y, r, hair) {
  return `<path d="M${r1(x - r)} ${r1(y)} A${r1(r)} ${r1(r)} 0 1 1 ${r1(x + r * 0.3)} ${r1(y + r * 0.95)}" fill="none" stroke="${shade(hair, -0.5)}" stroke-opacity="0.5" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M${r1(x - r * 0.7)} ${r1(y - r * 0.5)} A${r1(r * 0.85)} ${r1(r * 0.85)} 0 0 1 ${r1(x + r * 0.4)} ${r1(y - r * 0.8)}" fill="none" stroke="#FFFFFF" stroke-opacity="${isDark(hair) ? 0.18 : 0.32}" stroke-width="0.9" stroke-linecap="round"/>`;
}

// Rare items borrow the shape of their `base` item but keep their own color & name
export function shapeOf(item) {
  if (!item || !item.base) return item;
  const base = WARDROBE_DATA.items.find(i => i.id === item.base);
  return { ...base, ...item, id: item.base };
}

export class WardrobeEngine {
  constructor() {
    this.currentLook = {
      skin: WARDROBE_DATA.skinTones[1].id,
      hairStyle: WARDROBE_DATA.hairStyles[0].id,
      hairColor: WARDROBE_DATA.hairColors[0].id,
      outerwear: 'coat-noir-trench',
      tops: 'top-detective-turtleneck',
      bottoms: 'bottom-sleuth-trousers',
      shoes: 'shoes-brogues',
      hats: 'hat-fedora',
      accessories: 'acc-magnifier',
      paletteTint: '#C29B38'
    };
  }

  equip(category, itemId) {
    if (this.currentLook[category] === itemId) {
      // Toggle off if not mandatory base
      if (!['skin', 'hairStyle', 'hairColor'].includes(category)) {
        this.currentLook[category] = null;
      }
    } else {
      this.currentLook[category] = itemId;
    }
  }

  setSkin(skinId) {
    this.currentLook.skin = skinId;
  }

  setHairStyle(styleId) {
    this.currentLook.hairStyle = styleId;
  }

  setHairColor(colorId) {
    this.currentLook.hairColor = colorId;
  }

  calculateStats() {
    let stealth = 0;
    let glamour = 0;
    let clueBonus = 0;
    const styles = {};

    const itemKeys = ['outerwear', 'tops', 'bottoms', 'shoes', 'hats', 'accessories'];
    for (const key of itemKeys) {
      const id = this.currentLook[key];
      if (!id) continue;
      const item = WARDROBE_DATA.items.find(i => i.id === id);
      if (item) {
        stealth += item.stealthBonus || 0;
        glamour += item.glamourBonus || 0;
        clueBonus += item.cluePower || 0;
        styles[item.styleTag] = (styles[item.styleTag] || 0) + 1;
      }
    }

    return { stealth, glamour, clueBonus, styles };
  }

  renderAvatarSVG() {
    const look = this.currentLook || {};
    const skinObj = WARDROBE_DATA.skinTones.find(s => s.id === look.skin) || WARDROBE_DATA.skinTones[0];
    const hairColorObj = WARDROBE_DATA.hairColors.find(h => h.id === look.hairColor) || WARDROBE_DATA.hairColors[0];
    const hairStyleObj = WARDROBE_DATA.hairStyles.find(h => h.id === look.hairStyle) || WARDROBE_DATA.hairStyles[0];
    const getItem = id => shapeOf(id ? WARDROBE_DATA.items.find(i => i.id === id) : null);
    const top = getItem(look.tops);
    const bottom = getItem(look.bottoms);
    const coat = getItem(look.outerwear);
    const shoes = getItem(look.shoes);
    const hat = getItem(look.hats);
    const acc = getItem(look.accessories);

    const skin = skinObj.color;
    const hair = hairColorObj.color;
    const hairStyle = hairStyleObj.type;

    // Unique id prefix so two dolls on the same page never share gradient ids
    const u = 'dl' + Math.random().toString(36).slice(2, 8);
    const defs = [];
    const gradCache = {};
    const ref = id => `url(#${u}-${id})`;

    // Soft fabric / skin shading: light comes from the upper left
    const cloth = (color, key = color, gloss = 1) => {
      const id = 'c' + key.replace(/[^a-zA-Z0-9]/g, '');
      if (!gradCache[id]) {
        gradCache[id] = true;
        const hi = (isDark(color) ? 0.26 : 0.2) * gloss;
        defs.push(`<linearGradient id="${u}-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${shade(color, -0.28)}"/>
          <stop offset="0.2" stop-color="${shade(color, hi * 0.45)}"/>
          <stop offset="0.33" stop-color="${shade(color, hi)}"/>
          <stop offset="0.5" stop-color="${shade(color, hi * 0.25)}"/>
          <stop offset="0.8" stop-color="${shade(color, -0.12)}"/>
          <stop offset="1" stop-color="${shade(color, -0.34)}"/>
        </linearGradient>`);
      }
      return ref(id);
    };
    const line = color => shade(color, isDark(color) ? -0.55 : -0.42);
    const fillS = (color, w = 0.8) => `fill="${cloth(color)}" stroke="${line(color)}" stroke-width="${w}" stroke-linejoin="round"`;
    // Fabric fold: a soft shadow crease with a little highlight ridge beside it
    const fold = (d, color, o = 0.45) => `<path d="${d}" fill="none" stroke="${shade(color, -0.5)}" stroke-opacity="${o}" stroke-width="0.9" stroke-linecap="round" filter="url(#${u}-blur1)"/>
      <path d="${d}" fill="none" stroke="${shade(color, 0.45)}" stroke-opacity="${o * 0.5}" stroke-width="0.6" stroke-linecap="round" transform="translate(1.1 0)"/>`;

    const skinLine = shade(skin, -0.35);
    const skinDeep = shade(skin, -0.28);
    const skinFill = cloth(skin, 'skin', 0.55);
    const skinFillAttr = `fill="${skinFill}"`;
    const skinAttr = `fill="${skinFill}" stroke="${skinLine}" stroke-width="0.6" stroke-linejoin="round"`;
    const hairLine = shade(hair, isDark(hair) ? -0.6 : -0.38);
    const browColor = isDark(hair) ? shade(hair, 0.06) : shade(hair, -0.5);
    const lip = isDark(skin) ? mix(skin, '#C2416E', 0.55) : mix(skin, '#E0457B', 0.62);
    // Eye colour picks up the hair colour for a coordinated glam look
    const IRIS = { 'h-obsidian': '#8A5530', 'h-chestnut': '#8C7232', 'h-blonde': '#3D86CF', 'h-auburn': '#3E9A62', 'h-pastel-pink': '#8E5FD0', 'h-silver': '#5F92BE' };
    const irisC = IRIS[hairColorObj.id] || '#8A5530';
    const shadowC = mix('#C76A8E', irisC, 0.25);

    defs.push(`
      <radialGradient id="${u}-face" cx="0.45" cy="0.42" r="0.7">
        <stop offset="0" stop-color="${shade(skin, 0.16)}"/>
        <stop offset="0.5" stop-color="${shade(skin, 0.05)}"/>
        <stop offset="0.85" stop-color="${shade(skin, -0.1)}"/>
        <stop offset="1" stop-color="${shade(skin, -0.2)}"/>
      </radialGradient>
      <linearGradient id="${u}-hair" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="${shade(hair, isDark(hair) ? 0.2 : 0.18)}"/>
        <stop offset="0.35" stop-color="${hair}"/>
        <stop offset="1" stop-color="${shade(hair, -0.3)}"/>
      </linearGradient>
      <radialGradient id="${u}-iris" cx="0.5" cy="0.62" r="0.6">
        <stop offset="0" stop-color="${shade(irisC, 0.55)}"/>
        <stop offset="0.45" stop-color="${shade(irisC, 0.15)}"/>
        <stop offset="0.8" stop-color="${irisC}"/>
        <stop offset="1" stop-color="${shade(irisC, -0.6)}"/>
      </radialGradient>
      <radialGradient id="${u}-floor" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="${u}-blur1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.6"/></filter>
      <filter id="${u}-blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <filter id="${u}-blur4" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="${u}-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`);
    const hairAttr = `fill="${ref('hair')}" stroke="${hairLine}" stroke-width="0.7" stroke-linejoin="round"`;
    // Hair strand texture: darker grooves + light sheen
    const strands = (d, w = 0.7) => `<path d="${d}" fill="none" stroke="${shade(hair, -0.45)}" stroke-opacity="0.45" stroke-width="${w}" stroke-linecap="round"/>`;
    const sheen = (d, w = 1.4) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-opacity="${isDark(hair) ? 0.34 : 0.55}" stroke-width="${w * 1.3}" stroke-linecap="round" filter="url(#${u}-blur1)"/>`;
    const soft = (d, color, o, f = 'blur2') => `<path d="${d}" fill="${color}" opacity="${o}" filter="url(#${u}-${f})"/>`;

    const headT = 'translate(150 82) rotate(-3) scale(1.05) translate(-150 -78)';
    const FEET = [{ x: LEG_L[LEG_L.length - 1][0], y: 430, dir: -1, leg: LEG_L }, { x: LEG_R[LEG_R.length - 1][0], y: 431, dir: 1, leg: LEG_R }];
    const FS = 1.13; // foot scale
    const holding = acc && acc.id === 'acc-magnifier';

    // ---------------- HAIR ----------------
    // Shared hair "cap" over the skull with a natural forehead hairline
    const capPath = `M127 59 C124.4 37, 135.5 19.5, 150 19.5 C164.5 19.5, 175.6 37, 173 59 L170.6 54.5 C170.4 42, 162.5 33.6, 151.5 33 C140 33.5, 130.8 41.5, 129.4 54.5 Z`;
    const hairBack = () => {
      let s = `<ellipse cx="150" cy="47" rx="23.6" ry="27.4" ${hairAttr}/>`;
      if (hairStyle === 'ponytail') {
        const tail = 'M164 33 C181 28, 192 42, 190.5 60 C189.5 78, 196 96, 193 116 C191 132, 185 144, 177 154 C180.5 136, 181.5 120, 178 104 C174.5 88, 169 72, 166.5 52 Z';
        s += `<path d="${tail}" ${hairAttr}/>
          ${strands('M178 40 C186 56, 184 80, 188 102 C190 118, 186 134, 181 148 M172 44 C178 64, 176 86, 182 108 C184 122, 182 132, 179 142')}
          ${sheen('M183 50 C187 66, 186 86, 189 104', 1.6)}
          <path d="M168.5 36.5 L177 32.5" stroke="#DAA520" stroke-width="3" stroke-linecap="round"/>`;
      } else if (hairStyle === 'waves') {
        const back = 'M128 28 C113 38, 113 62, 112 84 C111 104, 107 120, 109 140 C111 158, 105 172, 109 188 C112 197, 118 202, 126 201 C132 198, 137 200, 141 197 L159 197 C163 200, 168 198, 174 201 C182 202, 188 197, 191 188 C195 172, 189 158, 191 140 C193 120, 189 104, 188 84 C187 62, 187 38, 172 28 C164 19, 136 19, 128 28 Z';
        s += `<path d="${back}" ${hairAttr}/>
          ${strands('M118 70 C116 96, 112 118, 116 140 C119 160, 112 176, 117 194 M182 70 C184 96, 188 118, 184 140 C181 160, 188 176, 183 194 M126 90 C124 120, 128 150, 124 180 M174 90 C176 120, 172 150, 176 180')}`;
      } else if (hairStyle === 'bob') {
        s += `<path d="M123.6 50 C122 30, 136 18.6, 150 18.6 C164 18.6, 178 30, 176.4 50 C177 62, 179.4 74, 178.4 85 C170 89.5, 130 89.5, 121.6 85 C120.6 74, 123 62, 123.6 50 Z" ${hairAttr}/>`;
      } else if (hairStyle === 'curls') {
        s += `<path d="${bumpyBlob(150, 60, 33, 47, 22, 7)}" ${hairAttr}/>`;
        const tex = [];
        for (let k = 0; k < 2; k++) {
          const rr = k ? 0.82 : 0.62, n = k ? 16 : 11;
          for (let i = 0; i < n; i++) {
            const t = Math.PI * 2 * (i + k * 0.5) / n;
            const x = 150 + Math.cos(t) * 33 * rr, y = 60 + Math.sin(t) * 47 * rr;
            if (Math.abs(x - 150) < 18 && y > 30) continue; // hidden behind the face
            tex.push(curlTex(x, y, k ? 3.6 : 3.2, hair));
          }
        }
        s += tex.join('');
      }
      return s;
    };

    const hairFront = () => {
      if (hairStyle === 'ponytail' || hairStyle === 'bun') {
        let s = `<path d="${capPath}" ${hairAttr}/>
          ${strands('M134 44 C138 33, 145 25, 152 21.5 M142 36 C147 28, 152 23.5, 157 21 M158 34.5 C162 29, 163 25, 161 21 M166 41 C169 34, 168 27, 164 22 M131 50 C132 40, 138 31, 146 25')}
          ${sheen('M137 30 C143 24, 152 22, 160 23.5', 1.8)}`;
        if (hairStyle === 'ponytail') {
        } else {
          const showBun = !hat || hat.id === 'hat-tiara';
          if (showBun) {
            s = `<ellipse cx="150" cy="15.5" rx="12.5" ry="10.5" ${hairAttr}/>
              ${strands('M139 14 C143 7.5, 155 6.5, 160.5 13 M139.5 18 C145 23, 156 23, 161 17 M143 10 C148 13.5, 154 15, 159 13')}
              ${sheen('M142 11 C146 7.5, 153 7.2, 157 9.5', 1.5)}` + s +
              `<path d="M141 24.2 C145 26, 155 26, 159 24.2" fill="none" stroke="#DAA520" stroke-width="1.3" stroke-linecap="round"/>`;
          }
        }
        return s;
      }
      if (hairStyle === 'waves') {
        const curtain = 'M130 44 C124 52, 124.6 62, 124.4 76 C124 90, 117 99, 117.6 114 C118.2 128, 124.6 136, 121.6 151 C119.6 162, 122 172, 127.6 181 C130.6 171, 132 162, 134.6 152 C137.6 140, 131.4 128, 133.4 116 C135.4 104, 133.4 92, 133 80 C132.6 66, 133.4 52, 137 42 Z';
        const cs = 'M127 60 C127 80, 121 96, 121 112 C121 128, 127 140, 124 156 M130 70 C130 86, 126 100, 127 116 C128 130, 131 142, 128 160';
        return `<g transform="translate(-2.4 0)"><path d="${curtain}" ${hairAttr}/>${strands(cs)}${sheen('M126 92 C123 106, 124 118, 126 128', 1.6)}</g>
          <g transform="translate(302.4 0) scale(-1 1)"><path d="${curtain}" ${hairAttr}/>${strands(cs)}</g>
          <path d="M126.2 66 C123.6 37, 135 19.5, 150 19.5 C165 19.5, 176.4 37, 173.8 66 C172.6 48, 165 36, 151 33 C138 35.4, 128.6 48, 126.2 66 Z" ${hairAttr}/>
          ${strands('M150.5 21 L151 33 M147 22 C141 25, 134 34, 130 48 M155 22 C161 25, 167 34, 170 48')}
          ${sheen('M138 26 C144 22.5, 157 22.5, 163 27', 1.8)}`;
      }
      if (hairStyle === 'bob') {
        return `<path d="M150 19.6 C165 19.6, 176.6 32, 175.6 50 C175.4 62, 178.4 74, 177.6 85 C173 88, 167.4 87.6, 164.2 84.4 C166 76, 167.4 66, 167.4 56 C167.4 50.5, 167 45.5, 166 40.4 C162 38.2, 160 37.2, 156 38 C152 36.6, 148.5 37.8, 145 36.8 C141 37.8, 138 37.2, 134.2 39.6 C133 45.5, 132.6 50.5, 132.6 56 C132.6 66, 134 76, 135.8 84.4 C132.6 87.6, 127 88, 122.4 85 C121.6 74, 124.6 62, 124.4 50 C123.4 32, 135 19.6, 150 19.6 Z" ${hairAttr}/>
          ${strands('M140 23 C137 30, 136 36, 137 41 M147 21.5 C146 28, 146 34, 147 40 M155 21.5 C156 28, 156 34, 155 40.6 M162 23.5 C164 30, 164.5 36, 163.5 41.8 M128 46 C126 60, 125.6 74, 126.6 85 M172 46 C174 60, 174.4 74, 173.4 85 M131 56 C130.4 66, 131 76, 132 84 M169 56 C169.6 66, 169 76, 168 84')}
          ${sheen('M136 27 C143 23.5, 157 23.5, 164 27', 1.8)}${sheen('M127.6 56 C127 64, 127 72, 127.6 78', 1)}`;
      }
      // curls: scalloped hairline + curly side pieces
      const outer = 'M126 64 C122 36, 134 17.5, 150 17.5 C166 17.5, 178 36, 174 64';
      const hairline = bumpyBlob(150, 53, 21.6, 20.5, 9, -4.5, 0.08, -Math.PI - 0.08, false).replace(/^M/, 'L');
      const side = x => `<path d="${bumpyBlob(x, 76, 6.4, 19, 9, 4)}" ${hairAttr}/>${curlTex(x - 0.5, 68, 3, hair)}${curlTex(x + 0.5, 82, 3, hair)}`;
      return `${side(126.6)}${side(173.4)}<path d="${outer} ${hairline} Z" fill="${ref('hair')}"/>
        <path d="${hairline.replace(/^L/, 'M')}" fill="none" stroke="${hairLine}" stroke-width="0.7"/>
        ${[[138, 27, 3.4], [150, 24, 3.6], [162, 27, 3.4], [131, 37, 3], [169, 37, 3], [144, 33, 2.6], [156, 33, 2.6]].map(([x, y, r]) => curlTex(x, y, r, hair)).join('')}`;
    };

    // ---------------- FACE ----------------
    const eye = `
      ${soft('M133.6 49.4 C135.2 43, 144.4 42, 148 47.8 C144.4 45.2, 138.8 45.4, 133.6 49.4 Z', shadowC, 0.6)}
      ${soft('M136 42.6 C139.6 41.2, 144.6 41.4, 147 43.6 C143.6 43, 139.6 43.2, 136 42.6 Z', '#FFFFFF', 0.3, 'blur1')}
      <path id="${u}-eyeL" d="M135.8 50 C137.8 46.2, 144.4 45.6, 147.2 50.4 C144.8 53.6, 138.6 53.8, 135.8 50 Z" fill="#FBF7F4"/>
      <clipPath id="${u}-eyeclip"><use href="#${u}-eyeL"/></clipPath>
      <g clip-path="url(#${u}-eyeclip)">
        <circle cx="141.9" cy="49.9" r="3.15" fill="${ref('iris')}"/>
        <circle cx="141.9" cy="49.9" r="3.15" fill="none" stroke="${shade(irisC, -0.65)}" stroke-width="0.45"/>
        <circle cx="141.9" cy="49.9" r="1.3" fill="#0E0806"/>
        <path d="M135.6 49.8 C138 46, 144.6 45.6, 147.4 50.4 L147.4 46 L135.6 46 Z" fill="${shade(skin, -0.55)}" opacity="0.3"/>
        <circle cx="143" cy="48.6" r="0.95" fill="#FFFFFF"/>
        <circle cx="140.7" cy="51.2" r="0.45" fill="#FFFFFF" opacity="0.85"/>
      </g>
      <path d="M137 51.2 C139.4 53, 144.2 53, 146.4 51.2" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.5"/>
      <path d="M136.6 51.4 C139 53.6, 144 53.8, 146.6 51.4" fill="none" stroke="${shade(skin, -0.45)}" stroke-width="0.4" opacity="0.7"/>
      <path d="M147.4 50.5 C144.4 44.9, 137.6 44.9, 135 48.8 L131.2 45.8 L135.8 50.4 C138.4 47.5, 144 47.3, 147.4 50.5 Z" fill="#1A0E0B"/>
      <path d="M135.2 48.7 Q133.2 48.2, 131.9 46.2 M136.2 47.7 Q134.3 46.7, 133.6 44.5 M137.4 46.9 Q135.8 45.6, 135.6 43.3 M138.8 46.3 Q137.6 44.9, 137.8 42.8 M140.4 45.9 Q139.8 44.5, 140.3 42.7 M142 45.8 Q141.8 44.6, 142.5 43.3" fill="none" stroke="#1A0E0B" stroke-width="0.55" stroke-linecap="round"/>
      <path d="M137.2 52.1 L136.4 53 M138.6 52.8 L138.1 53.7" stroke="#1A0E0B" stroke-width="0.3" stroke-linecap="round" opacity="0.55"/>
      <path d="M134.2 44.4 C136.5 40.6, 140.5 38.6, 143.6 38.8 C145.4 38.9, 146.8 39.7, 147.6 40.4 C147.8 41.4, 147.6 42.2, 147.2 42.6 C145.2 41.4, 142.6 41, 140.2 41.6 C138.2 42.2, 136 43.4, 134.2 44.4 Z" fill="${browColor}"/>
      <path d="M137 42 C139.6 40.2, 143 39.6, 146 40.4" fill="none" stroke="${shade(browColor, 0.3)}" stroke-width="0.3" opacity="0.6"/>`;

    const face = `
      <path d="M130 49 C126.8 47.4, 125.4 50.6, 126.2 54.2 C126.9 57.8, 128.4 60.6, 131 61.2 Z" ${skinAttr}/>
      <path d="M170 49 C173.2 47.4, 174.6 50.6, 173.8 54.2 C173.1 57.8, 171.6 60.6, 169 61.2 Z" ${skinAttr}/>
      <path d="M150 25 C162.2 25, 170.6 34, 170.6 47 C170.6 55, 169.6 61.4, 166.6 67.2 C163 73.4, 157 78, 150 78.4 C143 78, 137 73.4, 133.4 67.2 C130.4 61.4, 129.4 55, 129.4 47 C129.4 34, 137.8 25, 150 25 Z" fill="${ref('face')}" stroke="${skinLine}" stroke-width="0.6"/>
      ${soft('M131 56 C133 63, 136 67, 140.5 70 C137 70.4, 133.4 67, 131.6 62 Z M169 56 C167 63, 164 67, 159.5 70 C163 70.4, 166.6 67, 168.4 62 Z', shade(skin, -0.35), 0.35)}
      ${soft('M144 75.8 C147 77.6, 153 77.6, 156 75.8 C154 78.6, 146 78.6, 144 75.8 Z', shade(skin, -0.3), 0.3)}
      <ellipse cx="137" cy="60" rx="5.6" ry="3.3" fill="${isDark(skin) ? '#E8603C' : '#FF6F91'}" opacity="${isDark(skin) ? 0.32 : 0.3}" filter="url(#${u}-blur2)"/>
      <ellipse cx="163" cy="60" rx="5.6" ry="3.3" fill="${isDark(skin) ? '#E8603C' : '#FF6F91'}" opacity="${isDark(skin) ? 0.32 : 0.3}" filter="url(#${u}-blur2)"/>
      <ellipse cx="135.6" cy="56.4" rx="2.6" ry="1.1" fill="#FFFFFF" opacity="${isDark(skin) ? 0.16 : 0.32}" transform="rotate(-20 135.6 56)" filter="url(#${u}-blur1)"/>
      <ellipse cx="164.4" cy="56.4" rx="2.6" ry="1.1" fill="#FFFFFF" opacity="${isDark(skin) ? 0.16 : 0.32}" transform="rotate(20 164.4 56)" filter="url(#${u}-blur1)"/>
      <ellipse cx="150" cy="35" rx="5" ry="2.4" fill="#FFFFFF" opacity="0.18" filter="url(#${u}-blur2)"/>
      <ellipse cx="150" cy="75.6" rx="2" ry="0.9" fill="#FFFFFF" opacity="0.25" filter="url(#${u}-blur1)"/>
      <g>${eye}</g>
      <g transform="translate(300 0) scale(-1 1)">${eye.replace(new RegExp(`${u}-eyeL`, 'g'), `${u}-eyeR`).replace(new RegExp(`${u}-eyeclip`, 'g'), `${u}-eyeclipR`)}</g>
      ${soft('M152.4 46 C152.8 51, 153 56, 154.4 60.4 C153.4 61.6, 152 61.8, 151.4 61 C151.6 56, 151.6 51, 151.2 46 Z', shade(skin, -0.38), 0.5, 'blur1')}
      <path d="M149.6 48 L149.9 59.4" stroke="#FFFFFF" stroke-opacity="0.38" stroke-width="1.2" stroke-linecap="round" filter="url(#${u}-blur1)"/>
      ${soft('M146.6 60.6 C145.8 63, 147.6 64.8, 150 64.9 C152.4 64.8, 154.2 63, 153.4 60.6 C152.4 62.6, 147.6 62.6, 146.6 60.6 Z', shade(skin, -0.42), 0.55, 'blur1')}
      <path d="M146.7 60.4 C145.9 61.6, 146.1 62.9, 147.3 63.3 M153.3 60.4 C154.1 61.6, 153.9 62.9, 152.7 63.3" fill="none" stroke="${skinDeep}" stroke-width="0.45" stroke-linecap="round" opacity="0.6"/>
      <path d="M147.6 63.1 C148.2 63.8, 149 63.8, 149.3 63.3 M152.4 63.1 C151.8 63.8, 151 63.8, 150.7 63.3" fill="none" stroke="${shade(skin, -0.5)}" stroke-width="0.6" stroke-linecap="round" opacity="0.75"/>
      <ellipse cx="150.2" cy="61" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.4" filter="url(#${u}-blur1)"/>
      <path d="M148.9 64.8 L148.6 67.2 M151.1 64.8 L151.4 67.2" stroke="${skinDeep}" stroke-width="0.4" opacity="0.35"/>
      <path d="M142.8 69.4 C144.8 67.6, 147.2 66.2, 148.9 66.7 L150 67.4 L151.1 66.7 C152.8 66.2, 155.2 67.6, 157.2 69.4 C153.6 70.1, 146.4 70.1, 142.8 69.4 Z" fill="${shade(lip, -0.15)}"/>
      <path d="M143.2 69.6 C145.2 74.2, 154.8 74.2, 156.8 69.6 C153 70.5, 147 70.5, 143.2 69.6 Z" fill="${lip}"/>
      <path d="M142.4 68.9 C142.8 69.3, 143.1 69.5, 143.5 69.6 C147 70.5, 153 70.5, 156.5 69.6 C156.9 69.5, 157.2 69.3, 157.6 68.9" fill="none" stroke="${shade(lip, -0.5)}" stroke-width="0.55" stroke-linecap="round"/>
      <ellipse cx="150.8" cy="71.7" rx="2.8" ry="0.9" fill="#FFFFFF" opacity="0.6" filter="url(#${u}-blur1)"/>
      <ellipse cx="151.2" cy="71.5" rx="1.2" ry="0.4" fill="#FFFFFF" opacity="0.85"/>
      <path d="M146.4 67.9 C147.4 67.3, 148.2 67.3, 148.8 67.6" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.5" stroke-linecap="round"/>
      ${soft('M146.5 73.6 C148.5 74.6, 151.5 74.6, 153.5 73.6 C152 75, 148 75, 146.5 73.6 Z', shade(skin, -0.4), 0.35, 'blur1')}`;

    // ---------------- FACE ACCESSORIES ----------------
    let faceAcc = '';
    if (acc && acc.id === 'acc-masquerade') {
      const c = acc.color;
      faceAcc = `<path d="M169 46 C175 36, 180 27, 187 19" fill="none" stroke="#DAA520" stroke-width="0.9"/>
        <path d="M170 45 C169 34, 177 23, 187 17 C189 27, 183 40, 170 45 Z" fill="${shade(c, 0.15)}" stroke="#DAA520" stroke-width="0.6"/>
        <ellipse cx="183.5" cy="24" rx="2.6" ry="3.6" fill="#1D7A6E" stroke="#DAA520" stroke-width="0.6" transform="rotate(35 183.5 24)"/>
        <circle cx="183.5" cy="24.4" r="1.2" fill="#16205A"/>
        <path fill-rule="evenodd" d="M128.8 49 C128 41.6, 138 39.8, 150 45 C162 39.8, 172 41.6, 171.2 49 C170.4 56.6, 159.4 59.4, 150 54.8 C140.6 59.4, 129.6 56.6, 128.8 49 Z M135.8 50 C137.8 46.2, 144.6 45.8, 147 50.2 C144.6 53.4, 138 53.6, 135.8 50 Z M164.2 50 C162.2 46.2, 155.4 45.8, 153 50.2 C155.4 53.4, 162 53.6, 164.2 50 Z" ${fillS(c, 0.6)}/>
        <path d="M128.8 49 C128 41.6, 138 39.8, 150 45 C162 39.8, 172 41.6, 171.2 49" fill="none" stroke="#FFD700" stroke-width="1"/>
        <circle cx="150" cy="47" r="1.5" fill="#FFD700"/>
        ${sparkle(131.5, 45, 1.8, '#FFE9A0')}${sparkle(168.5, 45, 1.8, '#FFE9A0')}`;
    } else if (acc && acc.id === 'acc-sunglasses') {
      const c = acc.color;
      const lens = `M134.4 46.4 C134.6 44.6, 147.2 44.2, 147.6 46.4 C148 51, 145.8 55.4, 141 55.4 C136.2 55.4, 134.2 51, 134.4 46.4 Z`;
      faceAcc = `<path d="M134.6 46.6 L129.4 48 M165.4 46.6 L170.6 48" stroke="#DAA520" stroke-width="1"/>
        <path d="${lens}" fill="${c}" fill-opacity="0.92" stroke="#DAA520" stroke-width="0.9"/>
        <path d="${lens}" fill="${c}" fill-opacity="0.92" stroke="#DAA520" stroke-width="0.9" transform="translate(300 0) scale(-1 1)"/>
        <path d="M147.6 46.4 C148.8 45.2, 151.2 45.2, 152.4 46.4" fill="none" stroke="#DAA520" stroke-width="1"/>
        <path d="M137 51 L142 46 M139.4 53 L144.6 47.6 M156 51 L161 46 M158.4 53 L163.6 47.6" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.9" stroke-linecap="round"/>`;
    }

    // ---------------- HATS ----------------
    let hatSVG = '';
    if (hat) {
      const c = hat.color;
      if (hat.id === 'hat-fedora') {
        hatSVG = `<g transform="rotate(-6 150 32)">
          ${soft('M118 38 C135 44, 165 44, 182 38 L180 44 C165 49, 135 49, 120 44 Z', '#000', 0.35)}
          <path d="M103.5 35 C119 27.5, 181 27.5, 196.5 33.5 C199.5 38.5, 187 41.6, 150 41.6 C114 41.6, 100.5 39.6, 103.5 35 Z" ${fillS(c)}/>
          <path d="M127 34 C124.6 19, 131 6.5, 150 6 C169 6.5, 175.4 19, 173 34 C162 36.6, 138 36.6, 127 34 Z" ${fillS(c)}/>
          <path d="M141 8.4 C145 14.6, 155 14.6, 159 8.4" fill="none" stroke="${line(c)}" stroke-width="0.9"/>
          <path d="M131 26 C130 18, 134 11, 141 8.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M127.3 27.6 C138 30.6, 162 30.6, 172.7 27.6 L173 34 C162 36.6, 138 36.6, 127 34 Z" fill="#B8860B" stroke="${line(c)}" stroke-width="0.5"/>
          <path d="M108 35.4 C125 31.6, 175 31.6, 192 34.4" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1.1"/>
        </g>`;
      } else if (hat.id === 'hat-beret') {
        hatSVG = `<g transform="rotate(10 150 32)">
          <path d="M113 34.4 C104 19.5, 128 6.5, 155 8.4 C183 10.4, 196.5 24, 187 35.4 C172 40.4, 129 41.4, 113 34.4 Z" ${fillS(c)}/>
          ${soft('M125 16 C140 9, 165 9, 180 18 C170 15, 145 14, 125 16 Z', '#FFFFFF', 0.25)}
          <path d="M117 33.6 C134 39, 167 39, 184 33.6" fill="none" stroke="${line(c)}" stroke-width="2" stroke-linecap="round"/>
          <path d="M155 8.8 L156 4" stroke="${line(c)}" stroke-width="2.2" stroke-linecap="round"/>
        </g>`;
      } else if (hat.id === 'hat-tiara') {
        hatSVG = `<g filter="url(#${u}-glow)">
          <path d="M131 35 L135 26 L140.5 30.5 L145 20 L150 27.5 L155 20 L159.5 30.5 L165 26 L169 35 C160 31.6, 140 31.6, 131 35 Z" fill="${c}" stroke="#B8860B" stroke-width="0.7" stroke-linejoin="round"/>
          <circle cx="145" cy="20.5" r="1.6" fill="#FFFFFF"/>
          <circle cx="155" cy="20.5" r="1.6" fill="#FFFFFF"/>
          <circle cx="135" cy="26.5" r="1.3" fill="#FFFFFF"/>
          <circle cx="165" cy="26.5" r="1.3" fill="#FFFFFF"/>
          <path d="M150 27.5 L152.2 30.4 L150 33.2 L147.8 30.4 Z" fill="#80D8FF" stroke="#FFFFFF" stroke-width="0.4"/>
          <circle cx="141" cy="32.2" r="0.9" fill="#FF8FC7"/><circle cx="159" cy="32.2" r="0.9" fill="#FF8FC7"/>
        </g>`;
      }
    }

    // ---------------- BODY (skin) ----------------
    const legShade = leg => `<path d="${limbPath(leg)}" ${skinFillAttr}/>
      <path d="${limbOutline(leg, 236, 250)}" fill="none" stroke="${skinLine}" stroke-width="0.6"/>`;
    const kneeL = LEG_L[5], kneeR = LEG_R[5];
    const legsSVG = `${legShade(LEG_R)}${legShade(LEG_L)}
      ${[kneeL, kneeR].map(k => `<path d="M${r1(k[0] - 4.5)} ${r1(k[1] - 4)} C${r1(k[0] - 2)} ${r1(k[1])}, ${r1(k[0] + 2)} ${r1(k[1])}, ${r1(k[0] + 4.5)} ${r1(k[1] - 4)}" fill="none" stroke="${skinLine}" stroke-width="0.5" opacity="0.5"/>
        ${soft(`M${r1(k[0] - 5)} ${r1(k[1] + 2)} C${r1(k[0] - 2)} ${r1(k[1] + 5)}, ${r1(k[0] + 2)} ${r1(k[1] + 5)}, ${r1(k[0] + 5)} ${r1(k[1] + 2)} L${r1(k[0] + 4)} ${r1(k[1] + 7)} L${r1(k[0] - 4)} ${r1(k[1] + 7)} Z`, shade(skin, -0.3), 0.3)}`).join('')}
      ${FEET.map(f => `<g transform="translate(${r1(f.x)} ${f.y}) rotate(${-f.dir * 7}) scale(${f.dir * FS} ${FS})"><path d="${FOOT_PATH}" ${skinAttr}/><path d="${FOOT_LINES}" fill="none" stroke="${skinLine}" stroke-width="0.45" opacity="0.7"/></g>`).join('')}`;

    const torsoSkinD = (() => {
      const L = TORSO_L.map(p => p.slice()), R = TORSO_R.map(p => p.slice());
      L[0][2] = 1; R[0][2] = 1;
      return smoothPath([...L, [150 + PELVIS, 250, 1], ...R.reverse()]);
    })();
    const torsoSkin = `<path d="${torsoSkinD}" ${skinAttr}/>
      ${soft('M141 72 C145 82, 155 82, 159 72 L159.5 88 C155 85.5, 145 85.5, 140.5 88 Z', shade(skin, -0.4), 0.45)}
      <path d="M144.2 82 C145.6 87, 147 91.5, 148.2 95 M155.8 82 C154.4 87, 153 91.5, 151.8 95" fill="none" stroke="${skinLine}" stroke-width="0.4" opacity="0.15"/>
      <path d="M147.6 96.6 C142 96.4, 134 97.6, 125 99.6 M152.4 96.6 C158 96.4, 166 97.6, 175 99.6" fill="none" stroke="${skinLine}" stroke-width="0.55" opacity="0.55"/>
      <path d="M147.6 97.8 C142 97.8, 135 98.8, 127 100.6 M152.4 97.8 C158 97.8, 165 98.8, 173 100.6" fill="none" stroke="#FFFFFF" stroke-width="0.6" opacity="0.18"/>`;

    // ---------------- BASE BODYSUIT (always on, keeps the doll modest) ----------------
    const suit = '#C9BFD6';
    const bodysuit = (() => {
      // sleeveless crew-neck bodysuit with bike-short legs
      const pts = pantsPoints(128, 260, 0.6, 248, 0.6);
      const d = smoothPath([[137.2, 93.2, 1], [128.4, 98.8], [125.4, 106], [123.6, 116], ...pts, [176.4, 116], [174.6, 106], [171.6, 98.8], [162.8, 93.2, 1], [150, 101.5]]);
      return `<path d="${d}" ${fillS(suit, 0.6)}/>
        ${soft('M127 138 C133 143, 141 144, 146 141 C141 146, 132 145, 127 138 Z M173 138 C167 143, 159 144, 154 141 C159 146, 168 145, 173 138 Z', shade(suit, -0.4), 0.35)}
        ${fold('M140 238 C143 243, 146 246, 148 248 M160 238 C157 243, 154 246, 152 248', suit, 0.3)}`;
    })();
    const suitSleeves = '';

    // ---------------- SHOES ----------------
    let shoesSVG = '';
    if (shoes) {
      const c = shoes.color;
      const T = f => `transform="translate(${r1(f.x)} ${f.y}) rotate(${-f.dir * 7}) scale(${f.dir * FS} ${FS})"`;
      if (shoes.id === 'shoes-stilettos') {
        shoesSVG = FEET.map(f => `<g ${T(f)}>
          <path d="M3.6 10 L6.2 10.4 L5.6 25.6 L4.6 25.6 Z" fill="${shade(c, -0.35)}" stroke="${line(c)}" stroke-width="0.4"/>
          <path d="M-6.2 6 C-6.8 11, -7.6 16, -6.8 21 C-5.8 25, -1.4 27.8, 0.8 28.4 C3 27.8, 7 23.4, 7.6 19.2 C8.2 14.4, 7 9.6, 6 6 C2 8.6, -2.2 8.6, -6.2 6 Z" ${fillS(c, 0.6)}/>
          <path d="M-4.6 12 C-4.8 17, -3.2 22, -0.6 25.4" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="0.9" stroke-linecap="round"/>
          ${sparkle(2.5, 14, 1.6, '#FFFFFF', 0.9)}
        </g>`).join('');
      } else if (shoes.id === 'shoes-stealth-boots') {
        shoesSVG = FEET.map(f => {
          const shaft = sliceLimb(f.leg, 384, 430);
          const last = shaft[shaft.length - 1];
          shaft.push([last[0] + 0.3, 437, last[2] + 0.4, (last[3] ?? last[2]) + 0.4]);
          return `<path d="${limbPath(shaft, { pad: 1.9, capStart: false, capEnd: false })}" ${fillS(c, 0.7)}/>
            <g ${T(f)}>
              <path d="M-7.2 -2 C-7.8 6, -8.6 13, -8.6 18.5 C-8.6 23.6, -4.8 26.4, 0.4 26.4 C5.6 26.4, 9.2 24, 9.2 19 C9.2 13, 7.8 5, 7.2 -2 Z" ${fillS(c, 0.7)}/>
              <path d="M-8.6 23.4 C-6 26.6, 6 26.8, 9.2 22.6 L9.4 25.4 C6 29.4, -6 29.4, -8.8 26.4 Z" fill="#0E0F0E"/>
              <path d="M-5 14 C-2 12, 3 12, 6 14" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1"/>
            </g>
            <path d="M${r1(shaft[1][0] - 8)} 398 L${r1(shaft[1][0] + 8)} 398 M${r1(f.x - 7.6)} 418 L${r1(f.x + 7.6)} 418" stroke="#9EA3A8" stroke-width="1.8"/>
            <rect x="${r1(shaft[1][0] - 2)}" y="396" width="4" height="4" fill="none" stroke="#DAA520" stroke-width="0.9"/>
            <rect x="${r1(f.x - 2)}" y="416" width="4" height="4" fill="none" stroke="#DAA520" stroke-width="0.9"/>`;
        }).join('');
      } else {
        // brogues
        shoesSVG = FEET.map(f => `<g ${T(f)}>
          <path d="M-6.2 1.5 C-7 8.5, -8 15, -7.8 19.5 C-7.6 23.6, -4 25.6, 0.5 25.6 C5 25.6, 8.4 23.6, 8.4 19.5 C8.4 15, 6.8 8, 6 1.5 C2 3.4, -2.2 3.4, -6.2 1.5 Z" ${fillS(c, 0.6)}/>
          <path d="M-7.6 23 C-4 26.4, 5 26.4, 8.4 22.6 L8.4 24.4 C5 27.8, -4 27.8, -7.8 24.6 Z" fill="${shade(c, -0.6)}"/>
          <path d="M-6.8 15.6 C-3 13.4, 4 13.4, 7.8 15.6" fill="none" stroke="#E8D6B8" stroke-width="0.5" stroke-dasharray="0.6 1"/>
          <path d="M-2.4 4 L2.6 5.6 M-2.4 6.6 L2.6 8.2 M2.6 4 L-2.4 5.6 M2.6 6.6 L-2.4 8.2" stroke="#E8D6B8" stroke-width="0.55"/>
          <path d="M-4.4 18 C-3.6 21, -1.6 23, 1 23.6" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="0.9" stroke-linecap="round"/>
        </g>`).join('');
      }
    }

    // ---------------- TOPS ----------------
    let topBody = '', topSleeves = '', topOver = '';
    const blouseSleeve = color => [ARM_L, ARM_R].map(arm => {
      const pads = [2.4, 3, 3.8, 4.2, 4.4, 4.4, 4.6, 4, 2.6, 1.2];
      const d = limbPath(arm, { pad: (p, i) => pads[i] ?? 2, capEnd: false });
      const w = arm[arm.length - 1], v = arm[arm.length - 2];
      const ang = Math.atan2(w[1] - v[1], w[0] - v[0]) * 180 / Math.PI - 90;
      const e = arm[5];
      return `<path d="${d}" ${fillS(color, 0.6)}/>
        ${fold(`M${r1(arm[2][0] - 2)} ${r1(arm[2][1])} C${r1(arm[3][0])} ${r1(arm[3][1] + 4)}, ${r1(e[0] + 2)} ${r1(e[1] - 2)}, ${r1(e[0] + 3)} ${r1(e[1] + 2)} M${r1(e[0] - 3)} ${r1(e[1] + 4)} C${r1(e[0])} ${r1(e[1] + 2)}, ${r1(e[0] + 2)} ${r1(e[1] + 6)}, ${r1(e[0] + 4)} ${r1(e[1] + 5)} M${r1(arm[6][0] - 2)} ${r1(arm[6][1])} C${r1(arm[6][0])} ${r1(arm[6][1] + 8)}, ${r1(arm[7][0])} ${r1(arm[7][1] + 2)}, ${r1(arm[7][0] + 1)} ${r1(arm[7][1] + 6)}`, color, 0.4)}
        <path d="M-6.4 -1.5 C-5 2.6, -3.4 1, -2 3.6 C-0.4 1.4, 1.2 3.4, 2.6 1.4 C4.2 3.4, 5.8 1.6, 6.4 -1.5 Z" transform="translate(${r1(w[0])} ${r1(w[1])}) rotate(${r1(ang)})" fill="#FFFFFF" stroke="${line(color)}" stroke-width="0.5"/>`;
    }).join('');

    if (top) {
      const c = top.color;
      if (top.id === 'top-detective-turtleneck') {
        topBody = `<path d="${torsoGarment(1.2, 88, 214, { neckDip: 0 })}" ${fillS(c)}/>
          ${[134, 140, 145, 150, 155, 160, 166].map(x => `<path d="M${x} 104 C${x + (x - 150) * 0.12} 130, ${x + (x - 150) * 0.05} 160, ${x} 212" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1.1" fill="none"/>`).join('')}
          ${fold('M126 138 C132 143, 140 143.6, 145 140.6 M174 138 C168 143, 160 143.6, 155 140.6', c, 0.6)}
          ${fold('M131 160 C137 164, 141 168, 143 172 M169 160 C163 164, 159 168, 157 172', c, 0.4)}
          <path d="M139.2 96 L139.6 75.5 C146 78.2, 154 78.2, 160.4 75.5 L160.8 96 C155 98.8, 145 98.8, 139.2 96 Z" ${fillS(c)}/>
          <path d="M139.4 82 C146 84.6, 154 84.6, 160.6 82 M139.4 89 C146 91.6, 154 91.6, 160.6 89" fill="none" stroke="${shade(c, -0.6)}" stroke-width="0.7" stroke-opacity="0.7"/>
          <path d="M139.4 83 C146 85.6, 154 85.6, 160.6 83" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="0.8"/>`;
        topSleeves = [ARM_L, ARM_R].map(arm => {
          const e = arm[5];
          return `<path d="${limbPath(arm, { pad: (p, i) => (i < 2 ? 0.7 : 1.1), capEnd: false })}" ${fillS(c)}/>
          ${fold(`M${r1(e[0] - 4)} ${r1(e[1] - 3)} C${r1(e[0] - 1)} ${r1(e[1])}, ${r1(e[0] + 1)} ${r1(e[1])}, ${r1(e[0] + 4)} ${r1(e[1] - 2)} M${r1(e[0] - 4)} ${r1(e[1] + 3)} C${r1(e[0] - 1)} ${r1(e[1] + 5)}, ${r1(e[0] + 1)} ${r1(e[1] + 5)}, ${r1(e[0] + 4)} ${r1(e[1] + 3)}`, c, 0.7)}
          <path d="${limbPath(sliceLimb(arm, 216, 227), { pad: 1.6, capStart: false, capEnd: false })}" fill="${shade(c, -0.15)}" stroke="${line(c)}" stroke-width="0.5"/>`;
        }).join('');
      } else if (top.id === 'top-silk-blouse') {
        topBody = `<path d="${torsoGarment(2.4, 89, 214, { neckDip: 12 })}" ${fillS(c)}/>
          ${fold('M125 136 C131 142, 139 144, 146 141 M175 136 C169 142, 161 144, 154 141', c, 0.5)}
          ${fold('M128 116 C133 124, 135 132, 135 138 M172 116 C167 124, 165 132, 165 138 M133 158 C137 164, 140 170, 141 178 M167 158 C163 164, 160 170, 159 178', c, 0.4)}`;
        topSleeves = blouseSleeve(c);
        topOver = `<path d="M150 100 C141 108, 147 114, 142 121 C147 127, 142 134, 145.6 141 C147.6 145, 152.4 145, 154.4 141 C158 134, 153 127, 158 121 C153 114, 159 108, 150 100 Z" fill="#FFFFFF" stroke="${line(c)}" stroke-width="0.5"/>
          ${fold('M146 112 C149 114, 151 114, 154 112 M145 125 C149 127.4, 151 127.4, 155 125 M147 136 C149 138, 151 138, 153 136', c, 0.5)}
          <path d="M139.5 87 C143 94, 146 99, 150 101 L141 106 C137 100, 136.6 93, 139.5 87 Z M160.5 87 C157 94, 154 99, 150 101 L159 106 C163 100, 163.4 93, 160.5 87 Z" fill="#FFFFFF" stroke="${line(c)}" stroke-width="0.5" stroke-linejoin="round"/>
          <circle cx="150" cy="152" r="1.2" fill="#DAA520"/><circle cx="150" cy="164" r="1.2" fill="#DAA520"/><circle cx="150" cy="176" r="1.2" fill="#DAA520"/>`;
      } else if (top.id === 'top-corset-vest') {
        const under = '#F6EFE6';
        topBody = `<path d="${torsoGarment(2, 89, 212, { neckDip: 10 })}" ${fillS(under)}/>
          <path d="M139.5 87 C143 94, 146 98, 150 100 L141 105 C137 99, 136.6 93, 139.5 87 Z M160.5 87 C157 94, 154 98, 150 100 L159 105 C163 99, 163.4 93, 160.5 87 Z" fill="#FFFFFF" stroke="${line(under)}" stroke-width="0.5" stroke-linejoin="round"/>
          ${fold('M128 114 C132 120, 135 126, 136 132 M172 114 C168 120, 165 126, 164 132', under, 0.35)}`;
        topSleeves = blouseSleeve(under);
        // modest corset bodice worn over the blouse (starts below the bust line)
        const L = torsoSide(TORSO_L, -1, 136, 210, 2.4);
        const R = torsoSide(TORSO_R, 1, 136, 210, 2.4);
        L[0][2] = 1; R[0][2] = 1; L[L.length - 1][2] = 1; R[R.length - 1][2] = 1;
        const d = smoothPath([[150, 140, 1], ...L, [150, 222, 1], ...R.reverse()]);
        const lace = [];
        for (let y = 148; y <= 208; y += 8) lace.push(`M146.6 ${y} L153.4 ${y + 5.4} M153.4 ${y} L146.6 ${y + 5.4}`);
        topOver = `<path d="${d}" ${fillS(c)}/>
          <path d="M${r1(L[0][0] + 1)} 137 C136 135.6, 144 137.6, 150 141.4 C156 137.6, 164 135.6, ${r1(R[R.length - 1][0] - 1)} 137" fill="none" stroke="#DAA520" stroke-width="1.3"/>
          <path d="${lace.join(' ')}" stroke="#FFD700" stroke-width="0.9" stroke-linecap="round"/>
          <path d="M136 146 C135 170, 137 192, 140 212 M164 146 C165 170, 163 192, 160 212 M128 150 C130 170, 129 190, 126 206 M172 150 C170 170, 171 190, 174 206" fill="none" stroke="${shade(c, -0.4)}" stroke-width="0.7"/>
          <path d="M131 152 C133 170, 132 188, 130 202" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.6" stroke-linecap="round"/>`;
      }
    }

    // ---------------- BOTTOMS ----------------
    let bottomSVG = '';
    if (bottom) {
      const c = bottom.color;
      if (bottom.id === 'bottom-sleuth-trousers') {
        const pts = pantsPoints(161, 447, y => 2.2 + Math.max(0, Math.min(1, (y - 250) / 190)) * 5.4, 254, 1.8);
        const tl = pts[0], tr = pts[pts.length - 1];
        const trouserD = smoothPath([...pts, [150, 163]]);
        bottomSVG = `<path d="${trouserD}" ${fillS(c)}/>
          <path d="M151.5 172 C151.8 190, 151.5 204, 149.5 214" fill="none" stroke="${line(c)}" stroke-width="0.5" opacity="0.6"/>
          ${fold('M135 262 C136 300, 139 380, 141 446 M165 262 C164 300, 163 380, 166 446', c, 0.25)}
          <path d="M133.6 262 C134.6 300, 137.6 380, 139.6 446 M163.6 262 C162.6 300, 161.6 380, 164.6 446" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.2"/>
          ${fold('M131 330 C135 334, 141 335, 145 333 M157 334 C161 336, 166 336, 169 333 M131 430 C135 433, 141 433, 146 430 M158 431 C162 434, 168 434, 172 431', c, 0.5)}
          <path d="M${r1(tl[0])} ${r1(tl[1])} L${r1(tr[0])} ${r1(tr[1])} L${r1(profX(TORSO_R, 169) + 1.8)} 169 C160 170.2, 140 170.2, ${r1(profX(TORSO_L, 169) - 1.8)} 169 Z" fill="#1B1B1B"/>
          <rect x="146.5" y="160.6" width="7" height="8.4" rx="1" fill="none" stroke="#DAA520" stroke-width="1.3"/>
          <path d="M129 186 C133 190, 136 191, 139 190 M171 186 C167 190, 164 191, 161 190" fill="none" stroke="${line(c)}" stroke-width="0.6"/>`;
      } else if (bottom.id === 'bottom-gala-skirt') {
        defs.push(`<linearGradient id="${u}-gown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${shade(c, -0.05)}"/>
            <stop offset="0.6" stop-color="${shade(c, -0.18)}"/>
            <stop offset="1" stop-color="${shade(c, -0.4)}"/>
          </linearGradient>`);
        const L0 = profX(TORSO_L, 161) - 2, R0 = profX(TORSO_R, 161) + 2;
        const hemPts = [];
        const n = 12;
        for (let i = 0; i <= n; i++) {
          const x = 68 + (228 - 68) * i / n;
          hemPts.push([x, 455 + (i % 2 ? 3.5 : -1) + Math.sin(i) * 0.8]);
        }
        hemPts[0][2] = 1; hemPts[n][2] = 1;
        const skirtPts = [[L0, 161, 1], [profX(TORSO_L, 178) - 3, 178], [113.5, 198], [102.5, 228], [89, 290], [77.5, 370], [68, 455, 1], ...hemPts.slice(1, -1), [228, 455, 1], [217.5, 370], [205, 290], [190.5, 228], [179.5, 198], [profX(TORSO_R, 178) + 3, 178], [R0, 161, 1]];
        const d = smoothPath(skirtPts);
        const panels = [];
        for (let i = 0; i < 9; i++) {
          const t0 = (i + 0.15) / 9, t1 = (i + 0.55) / 9;
          const xt = L0 + (R0 - L0) * ((i + 0.35) / 9);
          const xb0 = 72 + 156 * t0, xb1 = 72 + 156 * t1;
          panels.push(`<path d="M${r1(xt)} 178 C${r1(xt + (xb0 - xt) * 0.3)} 260, ${r1(xb0)} 360, ${r1(xb0)} 452 L${r1(xb1)} 452 C${r1(xb1)} 360, ${r1(xt + (xb1 - xt) * 0.3 + 2)} 260, ${r1(xt + 1.5)} 178 Z" fill="${i % 2 ? '#FFFFFF' : '#000000'}" opacity="${i % 2 ? 0.16 : 0.32}" filter="url(#${u}-blur4)"/>`);
        }
        bottomSVG = `<path d="${d}" fill="url(#${u}-gown)" stroke="${line(c)}" stroke-width="0.8"/>
          <g clip-path="url(#${u}-gownclip)">${panels.join('')}</g>
          <clipPath id="${u}-gownclip"><path d="${d}"/></clipPath>
          <path d="${smoothPath(skirtPts.map(p => [150 + (p[0] - 150) * 0.9, p[1] < 300 ? p[1] : p[1] - (p[1] - 300) * 0.06, p[2]]))}" fill="${shade(c, 0.4)}" opacity="0.22" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="0.5"/>
          <path d="M${r1(profX(TORSO_L, 159) - 2.2)} 158 L${r1(profX(TORSO_R, 159) + 2.2)} 158 L${r1(profX(TORSO_R, 170) + 2.6)} 170 C160 171.4, 140 171.4, ${r1(profX(TORSO_L, 170) - 2.6)} 170 Z" fill="#DAA520" stroke="#8C6212" stroke-width="0.5"/>
          <path d="M163 160 C170 154, 176 156, 173 163 C176 168, 170 171, 163 166 Z M163 166 L167 182 M164 166 L161 181" fill="#E8BE45" stroke="#8C6212" stroke-width="0.6"/>
          ${[[118, 300], [178, 280], [98, 410], [205, 400], [146, 360], [128, 240], [168, 420], [190, 340]].map(([x, y]) => sparkle(x, y, 2.4, '#FFE9A0', 0.85)).join('')}`;
      } else {
        // pleated houndstooth skirt (knee length)
        defs.push(`<pattern id="${u}-hound" width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M0 0 H3.5 V3.5 H0 Z M3.5 3.5 H7 V7 H3.5 Z M3.5 0 L7 0 L3.5 3.5 Z M0 3.5 L3.5 7 L0 7 Z" fill="${shade(c, -0.5)}" opacity="0.5"/>
          </pattern>`);
        const L0 = profX(TORSO_L, 161) - 2, R0 = profX(TORSO_R, 161) + 2;
        const hemY = 324;
        const hem = [];
        for (let i = 0; i <= 10; i++) hem.push([97.5 + 98 * i / 10, hemY + (i % 2 ? 2.4 : 0)]);
        const skirtPts = [[L0, 161, 1], [profX(TORSO_L, 182) - 2, 182], [112.5, 204], [107.5, 228], [97.5, hemY, 1], ...hem.slice(1, -1), [195.5, hemY, 1], [185.5, 228], [180.5, 204], [profX(TORSO_R, 182) + 2, 182], [R0, 161, 1]];
        const d = smoothPath(skirtPts);
        const pleats = [];
        for (let i = 1; i < 10; i++) {
          const t = i / 10;
          const xt = L0 + (R0 - L0) * t, xb = 97.5 + 98 * t;
          pleats.push(`<path d="M${r1(xt)} 170 C${r1(xt + (xb - xt) * 0.3)} 220, ${r1(xb)} 280, ${r1(xb)} ${hemY + 1}" fill="none" stroke="${line(c)}" stroke-width="0.7" opacity="0.7"/>`);
          if (i % 2) pleats.push(`<path d="M${r1(xt)} 170 C${r1(xt + (xb - xt) * 0.3)} 220, ${r1(xb)} 280, ${r1(xb)} ${hemY} L${r1(xb + 9.8)} ${hemY} C${r1(xb + 9.8)} 280, ${r1(xt + 3.2 + (xb - xt) * 0.3)} 220, ${r1(xt + 3.2)} 170 Z" fill="#000000" opacity="0.13"/>`);
        }
        bottomSVG = `<path d="${d}" ${fillS(c)}/>
          <path d="${d}" fill="url(#${u}-hound)"/>
          ${pleats.join('')}
          <path d="M${r1(L0)} 160 L${r1(R0)} 160 L${r1(profX(TORSO_R, 169) + 2.3)} 169 C160 170, 140 170, ${r1(profX(TORSO_L, 169) - 2.3)} 169 Z" fill="${shade(c, -0.3)}" stroke="${line(c)}" stroke-width="0.5"/>
          <circle cx="${r1(R0 - 5)}" cy="164.5" r="1.3" fill="#DAA520"/>`;
      }
    }

    // ---------------- OUTERWEAR ----------------
    let coatBody = '', coatSleeves = '', capeSVG = '';
    if (coat) {
      const c = coat.color;
      const lapel = (bottomY, notchW = 1) => `M140.5 85.5 L127 95 L${r1(132.6 * notchW + 0 * (1 - notchW))} 105.6 L129.4 109 L148.6 ${bottomY} L151 ${bottomY - 22} L144.8 103.6 Z`;
      if (coat.id === 'coat-noir-trench') {
        const outerL = [...torsoSide(TORSO_L, -1, 86, 206, 3.4), [107.5, 246], [102, 300], [98.5, 354, 1]];
        const outerR = [...torsoSide(TORSO_R, 1, 86, 206, 3.4), [185.5, 246], [191, 300], [195, 354, 1]];
        outerL[0][2] = 1; outerR[0][2] = 1;
        const d = smoothPath([...outerL, [146.8, 357], ...outerR.reverse(), [150, 134, 1]]);
        const beltL = profX(TORSO_L, 170) - 4.4, beltR = profX(TORSO_R, 170) + 4.4;
        coatBody = `<path d="${d}" ${fillS(c)}/>
          ${fold('M126 140 C132 145, 140 146, 146 143 M174 140 C168 145, 160 146, 154 143', c, 0.5)}
          ${fold('M126 182 C120 220, 114 280, 110 350 M136 182 C134 230, 130 290, 128 352 M146 184 C147 240, 146 300, 146 354 M164 182 C166 230, 170 290, 172 352 M174 182 C180 220, 186 280, 190 350', c, 0.55)}
          <path d="M151 134 L156.5 176 L159 356" fill="none" stroke="${line(c)}" stroke-width="0.8"/>
          ${soft('M157 176 L160 356 L163 356 L160 176 Z', shade(c, -0.5), 0.4, 'blur1')}
          <path d="${lapel(156)}" fill="${shade(c, -0.08)}" stroke="${line(c)}" stroke-width="0.6" stroke-linejoin="round"/>
          <path d="${lapel(156)}" transform="translate(300 0) scale(-1 1)" fill="${shade(c, -0.15)}" stroke="${line(c)}" stroke-width="0.6" stroke-linejoin="round"/>
          <path d="M165 98 L177 104 L178 128 L166 124 Z" fill="${shade(c, -0.06)}" stroke="${line(c)}" stroke-width="0.5"/>
          <path d="M${r1(beltL)} 165.6 L${r1(beltR)} 165.6 L${r1(beltR + 0.6)} 175 L${r1(beltL - 0.6)} 175 Z" fill="${shade(c, -0.12)}" stroke="${line(c)}" stroke-width="0.6"/>
          <rect x="145" y="164.4" width="10" height="11.6" rx="1.4" fill="none" stroke="#5A4520" stroke-width="1.5"/>
          <path d="M153.6 175 L157.4 200 L161 198.6 L156.6 175 Z M148.4 175 L146 196 L149.4 197 L151 175 Z" ${fillS(c, 0.5)}/>
          ${[[141, 150], [159, 150], [141, 192], [161.5, 192], [141, 212], [162, 212]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#5A4520"/><circle cx="${x - 0.4}" cy="${y - 0.4}" r="0.5" fill="#FFFFFF" opacity="0.4"/>`).join('')}
          <path d="M114.5 228 L127.5 222 M178.5 228 L165.5 222" stroke="${line(c)}" stroke-width="0.8"/>`;
        coatSleeves = [ARM_L, ARM_R].map(arm => {
          const e = arm[5];
          return `<path d="${limbPath(arm, { pad: (p, i) => 3.4 - i * 0.12, capEnd: false })}" ${fillS(c)}/>
          ${fold(`M${r1(e[0] - 5)} ${r1(e[1] - 4)} C${r1(e[0] - 1)} ${r1(e[1])}, ${r1(e[0] + 1)} ${r1(e[1] + 1)}, ${r1(e[0] + 5)} ${r1(e[1] - 1)} M${r1(arm[2][0] - 2)} ${r1(arm[2][1] - 6)} C${r1(arm[2][0])} ${r1(arm[2][1] + 4)}, ${r1(arm[3][0])} ${r1(arm[3][1])}, ${r1(arm[3][0] + 1)} ${r1(arm[3][1] + 4)}`, c, 0.55)}
          <path d="${limbPath(sliceLimb(arm, 206, 213), { pad: 3.9, capStart: false, capEnd: false })}" fill="${shade(c, -0.15)}" stroke="${line(c)}" stroke-width="0.5"/>
          <path d="M${r1(arm[0][0] + (arm[0][0] < 150 ? 9 : -9))} 98.5 L${r1(arm[0][0] + (arm[0][0] < 150 ? -6 : 6))} 104" stroke="${shade(c, -0.15)}" stroke-width="4" stroke-linecap="round"/>`;
        }).join('');
      } else if (coat.id === 'coat-gold-blazer') {
        const L = torsoSide(TORSO_L, -1, 86, 226, 3.2), R = torsoSide(TORSO_R, 1, 86, 226, 3.2);
        L[0][2] = 1; R[0][2] = 1; L[L.length - 1][2] = 1; R[R.length - 1][2] = 1;
        L.forEach(p => { if (p[1] < 112 && p[1] > 92) p[0] -= 1.6; });
        R.forEach(p => { if (p[1] < 112 && p[1] > 92) p[0] += 1.6; });
        const d = smoothPath([...L, [138, 230], [150, 182, 1], [162, 230], ...R.reverse(), [150, 172, 1]]);
        coatBody = `<path d="${d}" ${fillS(c)}/>
          ${fold('M125 140 C131 145, 138 146, 144 143 M175 140 C169 145, 162 146, 156 143 M131 182 C136 188, 140 190, 146 188 M169 182 C164 188, 160 190, 154 188', c, 0.5)}
          <path d="${lapel(175)}" fill="${shade(c, -0.2)}" stroke="${line(c)}" stroke-width="0.6" stroke-linejoin="round"/>
          <path d="${lapel(175)}" transform="translate(300 0) scale(-1 1)" fill="${shade(c, -0.28)}" stroke="${line(c)}" stroke-width="0.6" stroke-linejoin="round"/>
          <circle cx="150" cy="178" r="2.1" fill="#FFF3C4" stroke="#8C6212" stroke-width="0.5"/>
          <path d="M160.6 133 L169 132 L169 136 L160.6 137 Z" fill="#FFFFFF" opacity="0.9"/>
          <path d="M161.6 133 L163.6 129 L165.6 132.5 L167.6 129.5 L168.8 132.2" fill="#E9D7FF" stroke="#B98BE0" stroke-width="0.4"/>
          <path d="M122 202 L137 203.4 L137 207.4 L122 206 Z M178 202 L163 203.4 L163 207.4 L178 206 Z" fill="${shade(c, -0.12)}" stroke="${line(c)}" stroke-width="0.5"/>`;
        coatSleeves = [ARM_L, ARM_R].map(arm => {
          const e = arm[5];
          return `<path d="${limbPath(arm, { pad: (p, i) => (i === 0 ? 4.6 : 2.9), capEnd: false })}" ${fillS(c)}/>
          ${fold(`M${r1(e[0] - 4)} ${r1(e[1] - 3)} C${r1(e[0] - 1)} ${r1(e[1])}, ${r1(e[0] + 1)} ${r1(e[1] + 1)}, ${r1(e[0] + 4)} ${r1(e[1] - 1)}`, c, 0.5)}
          <path d="${limbPath(sliceLimb(arm, 212, 218), { pad: 3.1, capStart: false, capEnd: false })}" fill="${shade(c, -0.25)}"/>`;
        }).join('');
      } else if (coat.id === 'coat-midnight-cape') {
        const capePts = [[140, 84, 1], [160, 84, 1], [172, 92], [188, 104], [200, 124], [208, 150], [213, 180, 1], [199, 184.6], [184, 179.4], [168, 186], [150, 188], [132, 186], [116, 179.4], [101, 184.6], [87, 180, 1], [92, 150], [100, 124], [112, 104], [128, 92]];
        const capeD = smoothPath(capePts);
        capeSVG = `<path d="${capeD}" ${fillS(c)}/>
          <clipPath id="${u}-capeclip"><path d="${capeD}"/></clipPath>
          <g clip-path="url(#${u}-capeclip)">
            ${[[118, 104, 96, 186], [130, 100, 122, 190], [170, 100, 178, 190], [182, 104, 204, 186], [150, 104, 150, 192]].map(([x0, y0, x1, y1], i) => `<path d="M${x0} ${y0} L${x1 - 6} ${y1} L${x1 + 6} ${y1} Z" fill="${i % 2 ? '#FFFFFF' : '#000000'}" opacity="${i % 2 ? 0.06 : 0.28}" filter="url(#${u}-blur4)"/>`).join('')}
          </g>
          <path d="${capeD}" fill="none" stroke="#C9CCE8" stroke-width="1" opacity="0.7" transform="translate(150 136) scale(0.97) translate(-150 -136)"/>
          <path d="M140 84 C138.6 92, 143 97, 150 97 C157 97, 161.4 92, 160 84" fill="${shade(c, 0.12)}" stroke="#C9CCE8" stroke-width="0.7"/>
          ${[[116, 140, 2.4], [184, 136, 2], [132, 160, 1.8], [170, 158, 2.4], [150, 140, 1.4], [104, 162, 1.5], [196, 160, 1.5]].map(([x, y, s]) => sparkle(x, y, s, '#E8ECFF', 0.9)).join('')}
          <circle cx="150" cy="99" r="3.3" fill="#FFD700" stroke="#8C6212" stroke-width="0.6"/>
          <circle cx="149" cy="98" r="1" fill="#FFFFFF" opacity="0.8"/>`;
      }
    }

    // ---------------- ARMS, HANDS, PROPS ----------------
    const forearmsSVG = `<clipPath id="${u}-fa"><rect x="0" y="150" width="300" height="200"/></clipPath>
      <g clip-path="url(#${u}-fa)">${[ARM_L, ARM_R].map(arm => `<path d="${limbPath(arm)}" ${skinFillAttr}/>
        <path d="${limbOutline(arm, 0, 0)}" fill="none" stroke="${skinLine}" stroke-width="0.6"/>`).join('')}</g>`;
    const armsSVG = [ARM_L, ARM_R].map(arm => `<path d="${limbPath(arm)}" ${skinFillAttr}/>
      <path d="${limbOutline(arm, arm[0][1] < 150 && arm[0][0] < 150 ? 106 : 124, arm[0][0] < 150 ? 124 : 106)}" fill="none" stroke="${skinLine}" stroke-width="0.6"/>
      <path d="M${r1(arm[5][0] - 2)} ${r1(arm[5][1] + 1)} C${r1(arm[5][0])} ${r1(arm[5][1] + 2.4)}, ${r1(arm[5][0] + 1.6)} ${r1(arm[5][1] + 2)}, ${r1(arm[5][0] + 2.6)} ${r1(arm[5][1])}" fill="none" stroke="${skinLine}" stroke-width="0.45" opacity="0.5"/>`).join('');
    const handAt = (arm, inward, fist) => {
      const a = arm[arm.length - 2], b = arm[arm.length - 1];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90;
      return `<g transform="translate(${r1(b[0])} ${r1(b[1] - 1.5)}) rotate(${r1(ang)}) scale(${inward * 1.12} 1.12)">
        <path d="${fist ? HAND_FIST : HAND_RELAXED}" ${skinAttr}/>
        <path d="${fist ? HAND_FIST_LINES : HAND_RELAXED_LINES}" fill="none" stroke="${skinLine}" stroke-width="0.45" stroke-linecap="round" opacity="0.85"/>
        <path d="M-3.6 3 C-4 7, -4 10, -3.4 12" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" stroke-linecap="round"/>
      </g>`;
    };
    const handsSVG = handAt(ARM_L, 1, false) + handAt(ARM_R, -1, holding);
    let propSVG = '';
    if (holding) {
      const c = acc.color;
      const w = ARM_R[ARM_R.length - 1];
      const hx = w[0] + 0.5, hy = w[1] + 8;
      const tx = hx + 12, ty = hy - 24;
      const lx = tx + 6.2, ly = ty - 11.6;
      propSVG = `<path d="M${r1(hx - 3.4)} ${r1(hy + 9)} L${r1(tx)} ${r1(ty)}" stroke="#5C3A10" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M${r1(hx - 3.4)} ${r1(hy + 9)} L${r1(tx)} ${r1(ty)}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="${r1(lx)}" cy="${r1(ly)}" r="12" fill="#BEE3F8" fill-opacity="0.4" stroke="${c}" stroke-width="3.4"/>
        <circle cx="${r1(lx)}" cy="${r1(ly)}" r="12" fill="none" stroke="#8C6212" stroke-width="0.6"/>
        <path d="M${r1(lx - 7.6)} ${r1(ly - 3)} A8 8 0 0 1 ${r1(lx - 1)} ${r1(ly - 8)}" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    let neckAcc = '';
    if (acc && acc.id === 'acc-pearls') {
      const beads = [];
      [[82, 9.6, 2.6], [85.6, 10.6, 3.8], [89.2, 11.8, 5]].forEach(([cy, rx, ry]) => {
        for (let a = 0; a <= 12; a++) {
          const t = Math.PI * a / 12;
          beads.push(`<circle cx="${r1(150 + Math.cos(t) * rx)}" cy="${r1(cy + Math.sin(t) * ry)}" r="1.15" fill="${acc.color}" stroke="#B9B2A2" stroke-width="0.3"/>`);
        }
      });
      neckAcc = `<g>${beads.join('')}</g><circle cx="150" cy="95.6" r="1.8" fill="${acc.color}" stroke="#B9B2A2" stroke-width="0.35"/>`;
    }
    // Top sleeves hide inside a long-sleeved coat
    const sleevedCoat = coat && coat.id !== 'coat-midnight-cape';

    return `
    <svg viewBox="0 0 300 480" class="mannequin-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs.join('')}</defs>
      <ellipse cx="152" cy="459" rx="70" ry="9" fill="url(#${u}-floor)"/>
      <!-- back hair -->
      <g transform="${headT}">${hairBack()}</g>
      <!-- body -->
      ${legsSVG}
      ${torsoSkin}
      ${armsSVG}
      ${shoesSVG}
      ${bodysuit}
      ${suitSleeves}
      <!-- clothes -->
      ${topBody}
      ${bottomSVG}
      ${topOver}
      ${coatBody}
      ${forearmsSVG}
      ${sleevedCoat ? '' : topSleeves}
      ${coatSleeves}
      ${capeSVG}
      ${propSVG}
      ${handsSVG}
      ${neckAcc}
      <!-- head -->
      <g transform="${headT}">
        ${face}
        ${faceAcc}
        ${hairFront()}
        ${!hat || hat.id === 'hat-tiara' ? `<path d="M136 31 C142 24.6, 158 24.6, 164 31" fill="none" stroke="#FFFFFF" stroke-opacity="${isDark(hair) ? 0.3 : 0.45}" stroke-width="3.2" stroke-linecap="round" filter="url(#${u}-blur2)"/>` : ''}
        ${hatSVG}
      </g>
    </svg>
    `;
  }
}
