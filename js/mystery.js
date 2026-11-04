// The Mystery Maker! Mixes the ingredients from cases.js into a brand-new case.
// It uses a "seed" (a secret code word). The same seed always makes the SAME mystery,
// which is how friends on your server all get the exact same case!

import { VENUES, CLIENTS, CRIMES, SUSPECT_POOL, SINGERS, MOTIVES, TRAITS, CHATTER, DRESS_CODES } from './cases.js';
import { WARDROBE_DATA } from './wardrobe.js';
import { VENUE_SPOTS, DANCER_COUNT, FAN_COUNT, GALA, ARENA } from './world/layout.js';

export function newSeed() {
  return Math.random().toString(36).slice(2, 10);
}

export function makeRng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (n) => Math.floor(next() * n),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };
}

const itemsIn = (category) => WARDROBE_DATA.items.filter(i => i.category === category && !i.rare);
const happensAt = (venue) => (thing) => !thing.venues || thing.venues.includes(venue);

// A random party outfit for a bot
export function randomLook(rng, overrides = {}) {
  return {
    skin: rng.pick(WARDROBE_DATA.skinTones).id,
    hairStyle: rng.pick(WARDROBE_DATA.hairStyles).id,
    hairColor: rng.pick(WARDROBE_DATA.hairColors).id,
    outerwear: rng.next() < 0.45 ? rng.pick(itemsIn('outerwear')).id : null,
    tops: rng.pick(itemsIn('tops')).id,
    bottoms: rng.pick(itemsIn('bottoms')).id,
    shoes: rng.pick(itemsIn('shoes')).id,
    hats: rng.next() < 0.45 ? rng.pick(itemsIn('hats')).id : null,
    accessories: rng.next() < 0.35 ? rng.pick(itemsIn('accessories').filter(i => i.id !== 'acc-magnifier')).id : null,
    ...overrides
  };
}

function rollTraits(rng) {
  const traits = {};
  for (const [key, trait] of Object.entries(TRAITS)) {
    traits[key] = rng.pick(Object.keys(trait.values));
  }
  return traits;
}

export function traitText(key, value) {
  return TRAITS[key].values[value].text;
}

export function generateMystery(seed) {
  const rng = makeRng(seed);
  const venue = rng.pick(Object.keys(VENUES));
  const venueInfo = VENUES[venue];
  const spots = VENUE_SPOTS[venue];
  const client = rng.pick(CLIENTS.filter(happensAt(venue)));
  const crime = rng.pick(CRIMES.filter(happensAt(venue)));
  const dressCode = rng.pick(Object.keys(DRESS_CODES));
  const people = rng.shuffle(SUSPECT_POOL.filter(happensAt(venue)).filter(p => p.name !== client.name)).slice(0, 4);

  // Pick 3 traits for the clues; the 4th one becomes a witness hint.
  const traitKeys = rng.shuffle(Object.keys(TRAITS));
  const clueTraits = traitKeys.slice(0, 3);
  const hintTrait = traitKeys[3];

  // Roll traits until the culprit is the ONLY suspect matching every clue,
  // and each single clue matches at least 2 suspects (so you need more than one clue!).
  let traitsList, guiltyIndex;
  for (let attempt = 0; attempt < 500; attempt++) {
    traitsList = people.map(() => rollTraits(rng));
    guiltyIndex = rng.int(people.length);
    const culprit = traitsList[guiltyIndex];
    const matchesAll = traitsList.filter(t => clueTraits.every(k => t[k] === culprit[k])).length === 1;
    const eachNeedsMore = clueTraits.every(k => traitsList.filter(t => t[k] === culprit[k]).length >= 2);
    if (matchesAll && (eachNeedsMore || attempt > 400)) break;
  }

  const suspectSpots = rng.shuffle(spots.suspects).slice(0, people.length);
  const suspects = people.map((p, i) => {
    const traits = traitsList[i];
    return {
      id: `suspect-${i}`,
      name: p.name,
      role: p.role,
      emoji: p.emoji,
      alibi: p.alibi,
      wrong: p.wrong,
      traits,
      isGuilty: i === guiltyIndex,
      spot: suspectSpots[i],
      look: randomLook(rng, {
        shoes: traits.shoes,
        hats: traits.hat === 'none' ? null : traits.hat
      })
    };
  });
  const culprit = suspects[guiltyIndex];

  // at least one clue is always inside the building, the rest can be anywhere
  const insideSpot = rng.pick(spots.clues.filter(s => s.inside));
  const clueSpots = [insideSpot, ...rng.shuffle(spots.clues.filter(s => s !== insideSpot)).slice(0, clueTraits.length - 1)];
  const clues = clueTraits.map((key, i) => {
    const info = TRAITS[key].values[culprit.traits[key]];
    return {
      id: `clue-${i}`,
      trait: key,
      value: culprit.traits[key],
      name: info.clue,
      icon: info.icon,
      description: info.where,
      spot: clueSpots[i]
    };
  });

  // The crowd: waltzing dancers at the gala, or cheering fans + a pop star at the concert
  const hintLine = `Psst... I saw someone with ${traitText(hintTrait, culprit.traits[hintTrait])} sneaking around right before it happened!`;
  const crowd = [];
  if (venue === 'gala') {
    for (let i = 0; i < DANCER_COUNT; i++) {
      crowd.push({
        id: `crowd-${i}`, name: 'Gala Dancer', icon: '💃', subtitle: 'Dancing on the ballroom floor',
        look: randomLook(rng), pose: 'dance', line: rng.pick(CHATTER.gala),
        orbit: { cx: GALA.danceCenter.x, cz: GALA.danceCenter.z, radius: 2.5 + (i % 2) * 2.5, angle: (i / DANCER_COUNT) * Math.PI * 2, dir: i % 2 ? 1 : -1 }
      });
    }
  } else {
    const singer = rng.pick(SINGERS);
    crowd.push({
      id: 'singer', name: singer, tag: `🎤 ${singer}`, icon: '🎤', subtitle: 'Pop Star, singing on stage',
      look: randomLook(rng, { bottoms: 'bottom-gala-skirt', shoes: 'shoes-stilettos', outerwear: 'coat-gold-blazer', accessories: null }),
      pose: 'sing', x: ARENA.centerX, z: ARENA.stage.maxZ - 5, y: ARENA.stage.height, face: 0,
      line: 'Thank you, thank you! 🎶 Oh, a detective? I hope you solve the case! This next song is for you!'
    });
    [-6, 6].forEach((dx, i) => crowd.push({
      id: `backup-${i}`, name: 'Backup Dancer', icon: '💃', subtitle: 'Dancing on stage',
      look: randomLook(rng), pose: 'dance', x: ARENA.centerX + dx, z: ARENA.stage.maxZ - 7, y: ARENA.stage.height, face: 0,
      line: 'Five, six, seven, eight! Sorry, I can\'t stop dancing!'
    }));
    const c = ARENA.crowd;
    for (let i = 0; i < FAN_COUNT; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      crowd.push({
        id: `crowd-${i}`, name: 'Concert Fan', icon: '🙌', subtitle: 'Cheering in the crowd',
        look: randomLook(rng), pose: 'cheer', line: rng.pick(CHATTER.concert),
        x: c.minX + 1 + col * ((c.maxX - c.minX - 2) / 5) + (rng.next() - 0.5) * 1.4,
        z: c.minZ + 1.5 + row * 4 + (rng.next() - 0.5) * 1.2,
        face: Math.PI + (rng.next() - 0.5) * 0.4
      });
    }
  }
  rng.pick(crowd.filter(p => p.id.startsWith('crowd-'))).line = hintLine;

  // Shy people hiding outside or backstage
  const hiders = rng.shuffle(spots.hides).slice(0, 2).map((spot, i) => ({
    id: `hider-${i}`,
    name: i === 0 ? 'Shy Guest' : 'Sneaky Photographer',
    look: randomLook(rng),
    spot,
    line: i === 0
      ? `Eek! You found me! I'm hiding because I'm a little shy. ${hintLine}`
      : 'Shhh! I\'m hiding here to get a secret photo! I heard the culprit dropped clues all over the place...'
  }));

  return {
    seed,
    venue,
    venueInfo,
    title: crime.title,
    crime,
    client,
    dressCode,
    dressCodeInfo: DRESS_CODES[dressCode],
    briefing: `${crime.says} ${crime.emoji} at ${venueInfo.name}! The culprit is still there. Please, Detective, can you find out who did it?`,
    suspects,
    clues,
    crowd,
    hiders,
    clientLook: randomLook(rng),
    culpritId: culprit.id,
    confession: `Okay, okay, I ${crime.did}! ${rng.pick(MOTIVES)}`
  };
}

// Does the player's outfit follow the dress code? (needs 2 matching pieces)
export function meetsDressCode(look, dressCode) {
  const keys = ['outerwear', 'tops', 'bottoms', 'shoes', 'hats', 'accessories'];
  const count = keys
    .map(k => WARDROBE_DATA.items.find(i => i.id === look[k]))
    .filter(item => item && item.styleTag === dressCode).length;
  return count >= 2;
}
