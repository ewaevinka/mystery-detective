// The Map of Hauteville! (all numbers are in meters)
// Three places, far apart so you can't see one from another:
//   🏢 The Office at x = -300
//   🏰 The Grand Gala (ballroom + secret garden + parking lot) at x = 0
//   🎤 The Starlight Arena (plaza + concert hall + backstage) at x = +300

export const OFFICE = {
  center: { x: -300, z: 0 },
  minX: -307, maxX: -293, minZ: -6, maxZ: 6,
  spawn: { x: -300, z: 5, yaw: 0 },              // just inside the front door
  desk: { x: -300, z: -3, w: 3.2, d: 1.1 },
  client: { x: -300, z: -4.4 },                  // stands behind the desk
  mirror: { x: -306.4, z: 0 },                   // magic dress-up mirror on the west wall
  portal: { x: -295, z: 2.5 }                    // appears after you take the case
};

// ---------------- 🏰 THE GRAND GALA ----------------
export const GALA = {
  minX: -28, maxX: 28, minZ: -64, maxZ: 0,
  doorHalfWidth: 2.5,
  danceCenter: { x: 0, z: -32 },
  danceRadius: 10,
  tables: [
    { x: -21, z: -10 }, { x: 21, z: -10 },
    { x: -21, z: -22 }, { x: 21, z: -22 },
    { x: -21, z: -34 }, { x: 21, z: -34 },
    { x: -21, z: -46 }, { x: 21, z: -46 }
  ],
  pillarZ: [-8, -16, -24, -40, -48, -56],
  chandelierZ: [-12, -32, -50],
  stage: { minX: -14, maxX: 14, minZ: -64, maxZ: -58 },
  gardenDoor: { minZ: -34, maxZ: -28 },          // door in the west wall to the garden
  guard: { x: 4, z: 1.4 }
};

// 🌷 The secret garden next to the ballroom
export const GARDEN = {
  minX: -76, maxX: -28, minZ: -64, maxZ: 0,
  fountain: { x: -52, z: -31, r: 3.2 },
  gazebo: { x: -52, z: -55, r: 4 },
  hedges: [
    { minX: -41, maxX: -40, minZ: -24, maxZ: -8 },
    { minX: -41, maxX: -40, minZ: -54, maxZ: -38 },
    { minX: -64, maxX: -63, minZ: -24, maxZ: -8 },
    { minX: -64, maxX: -63, minZ: -54, maxZ: -38 },
    { minX: -62, maxX: -42, minZ: -9, maxZ: -8 }
  ],
  benches: [{ x: -52, z: -24 }, { x: -52, z: -38 }, { x: -70, z: -31 }],
  trees: [{ x: -70, z: -6 }, { x: -34, z: -6 }, { x: -70, z: -58 }, { x: -34, z: -58 }, { x: -70, z: -44 }, { x: -70, z: -18 }]
};

export const PARKING = {
  minX: -40, maxX: 40, minZ: 0, maxZ: 52,
  arrival: { x: 0, z: 47, yaw: 0 },              // where the magic portal drops you
  homePortal: { x: -8, z: 48 },                  // portal back to the office
  van: { x: 35, z: 6 },                          // pop-up boutique van (change outfits!)
  rows: [14, 28, 42],
  carXs: [-33, -26, -19, -12, 12, 19, 26, 33],
  lamps: [[-6, 21], [6, 21], [-6, 35], [6, 35], [-36, 48], [36, 48], [-5, 6], [5, 6]],
  carColors: ['#E63B7A', '#F4F1EA', '#1A183A', '#00A6B4', '#D4AF37', '#7E2811', '#9C27B0', '#2B2B2B', '#5BC0EB', '#FF8FAB', '#3D3D3D', '#C0C0C0']
};
// leave a few empty parking spaces so it doesn't look too crowded
PARKING.cars = PARKING.rows.flatMap((z, r) => PARKING.carXs.map((x, i) => ({ x, z, flip: r % 2 === 1 }))
  .filter((_, i) => (i + r) % 5 !== 2));

// ---------------- 🎤 THE STARLIGHT ARENA ----------------
export const ARENA = {
  minX: 272, maxX: 328, minZ: -56, maxZ: 0,
  doorHalfWidth: 2.5,
  centerX: 300,
  stage: { minX: 282, maxX: 318, minZ: -56, maxZ: -44, height: 1.4 },
  backstage: { minX: 272, maxX: 328, minZ: -78, maxZ: -56, doorMinX: 321, doorMaxX: 326 },
  speakers: [{ x: 283.5, z: -42.5 }, { x: 316.5, z: -42.5 }],
  booth: { x: 300, z: -14, w: 5, d: 2.5 },        // sound mixing desk
  merch: { x: 324, z: -10, w: 2.4, d: 5 },        // T-shirt stand
  snackBar: { x: 276, z: -10, w: 2.4, d: 5 },     // popcorn & drinks
  crates: [{ x: 296, z: -74 }, { x: 310, z: -74 }],
  dressingTables: [278, 285, 292, 299, 306],
  racks: [[274.5, -62], [274.5, -67]],
  lounge: { x: 316, z: -66 },                    // VIP lounge corner
  guard: { x: 304, z: 1.4 },
  crowd: { minX: 286, maxX: 314, minZ: -40, maxZ: -24 }
};

export const PLAZA = {
  minX: 256, maxX: 344, minZ: 0, maxZ: 56,
  arrival: { x: 300, z: 50, yaw: 0 },
  homePortal: { x: 292, z: 51 },
  van: { x: 338, z: 14 },
  trucks: [
    { x: 262, z: 16, color: '#7FD8F5', sign: 'ICE CREAM', treat: '🍦' },
    { x: 262, z: 30, color: '#FFB347', sign: 'TACOS', treat: '🌮' },
    { x: 262, z: 44, color: '#FF9ED2', sign: 'COTTON CANDY', treat: '🍭' }
  ],
  posters: [[285, 8], [315, 8]],
  lamps: [[270, 52], [330, 52], [285, 26], [315, 26], [285, 40], [315, 40]],
  ferrisWheel: { x: 330, z: 36 }
};

// Where things can be in each place. `face` = which way someone looks (radians).
// Clue spots marked `inside: true` are inside the building.
export const VENUE_SPOTS = {
  gala: {
    suspects: [
      { x: -22, z: -16, pose: 'idle', face: 1.2 },
      { x: 22, z: -28, pose: 'idle', face: -1.4 },
      { x: -8, z: -56, pose: 'idle', face: 0.3 },
      { x: 24, z: -4, pose: 'idle', face: -2.2 },
      { x: -24, z: -4, pose: 'idle', face: 2.2 },
      { x: 24, z: -56, pose: 'idle', face: -0.6 },
      { x: -60, z: -20, pose: 'idle', face: 1.0 },
      { x: -48, z: -56, pose: 'idle', face: 0.2 },
      { x: -19, z: 30.9, pose: 'hide', face: 0 },
      { x: 12, z: 16.9, pose: 'hide', face: 0 }
    ],
    clues: [
      { x: 10, z: -56.5, inside: true },
      { x: -25, z: -38, inside: true },
      { x: 25, z: -20, inside: true },
      { x: -4, z: -56.5, inside: true },
      { x: -25, z: -60, inside: true },
      { x: -66, z: -12 },
      { x: -50, z: -44 },
      { x: -36, z: -60 },
      { x: -30, z: 46 },
      { x: 15.5, z: 21 },
      { x: 37, z: 40 },
      { x: -36, z: 4 }
    ],
    hides: [{ x: -26, z: 30.9 }, { x: 19, z: 30.9 }, { x: -12, z: 16.9 }, { x: 26, z: 44.9 }, { x: -42.5, z: -16 }]
  },
  concert: {
    suspects: [
      { x: 278, z: -30, pose: 'idle', face: 1.2 },
      { x: 322, z: -30, pose: 'idle', face: -1.4 },
      { x: 280, z: -6, pose: 'idle', face: 2.4 },
      { x: 320, z: -4, pose: 'idle', face: -2.6 },
      { x: 280, z: -66, pose: 'idle', face: 1.0 },
      { x: 310, z: -68, pose: 'idle', face: 0.3 },
      { x: 258.6, z: 16, pose: 'hide', face: -Math.PI / 2 },
      { x: 296, z: -75.8, pose: 'hide', face: 0 }
    ],
    clues: [
      { x: 276, z: -42, inside: true },
      { x: 324, z: -24, inside: true },
      { x: 300, z: -42.5, inside: true },
      { x: 296, z: -17, inside: true },
      { x: 276, z: -71, inside: true },
      { x: 322, z: -74, inside: true },
      { x: 302, z: -62, inside: true },
      { x: 285, z: 36 },
      { x: 318, z: 30 },
      { x: 270, z: 6 },
      { x: 340, z: 50 }
    ],
    hides: [{ x: 258.6, z: 30 }, { x: 341.5, z: 14 }, { x: 281.4, z: -42.5 }, { x: 310, z: -75.8 }]
  }
};

export const DANCER_COUNT = 8;
export const FAN_COUNT = 24;

// Which part of the map is the player standing in?
export function areaAt(x, z) {
  if (x < -200) return 'office';
  if (x > 200) {
    if (z >= ARENA.maxZ) return 'plaza';
    if (z < ARENA.backstage.maxZ) return 'backstage';
    return 'arena';
  }
  if (z >= GALA.maxZ) return 'parking';
  return x < GALA.minX ? 'garden' : 'gala';
}
