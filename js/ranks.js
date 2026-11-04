// 🏅 Detective Ranks & Rare Season Rewards
// Earn ⭐ stars by solving mysteries to climb the ranks.
// Small ranks are just for bragging. BIG ranks (with a `reward: true`) unlock a RARE item...
// but the rare items change every season! When a season ends, its items are gone forever
// (if you already claimed one, you keep it).
//
// Want more ranks? Add them to the end of RANKS (keep the stars going up!).
// Want a new season? Add one to SEASONS with a rare item for every reward rank
// (and add those items to WARDROBE_DATA.items in wardrobe.js with `rare: true`).

export const RANKS = [
  { id: 'rank-1', name: 'Junior Sleuth', icon: '🔍', stars: 0 },
  { id: 'rank-2', name: 'Clue Collector', icon: '🧵', stars: 600 },
  { id: 'rank-3', name: 'Fashion Detective', icon: '👠', stars: 1500 },
  { id: 'rank-4', name: 'Runway Investigator', icon: '🎀', stars: 3000, reward: true },
  { id: 'rank-5', name: 'Style Spy', icon: '💄', stars: 5000 },
  { id: 'rank-6', name: 'Glamour Sleuth', icon: '🕶️', stars: 8000, reward: true },
  { id: 'rank-7', name: 'Chief of Style', icon: '🎩', stars: 12000 },
  { id: 'rank-8', name: 'Diamond Detective', icon: '💎', stars: 18000, reward: true },
  { id: 'rank-9', name: 'Superstar Sleuth', icon: '🌟', stars: 25000 },
  { id: 'rank-10', name: 'Mystery Royalty', icon: '👑', stars: 35000, reward: true },
  { id: 'rank-11', name: 'Hauteville Icon', icon: '🦋', stars: 50000, reward: true },
  { id: 'rank-12', name: 'Galaxy Glam Inspector', icon: '🌌', stars: 75000, reward: true },
  { id: 'rank-13', name: 'Ultimate Fashion Legend', icon: '🏆', stars: 100000, reward: true }
];

// Each season gives a different rare item for each BIG rank. Dates are YYYY-MM-DD.
export const SEASONS = [
  {
    id: 'autumn-2026', name: 'Autumn Sparkle Season', icon: '🍂',
    starts: '2026-09-01', ends: '2026-12-01',
    rewards: {
      'rank-4': 'rare-pumpkin-beret',
      'rank-6': 'rare-maple-trench',
      'rank-8': 'rare-golden-hour-gown',
      'rank-10': 'rare-harvest-cape',
      'rank-11': 'rare-copper-crown',
      'rank-12': 'rare-cinnamon-boots',
      'rank-13': 'rare-sunset-shades'
    }
  },
  {
    id: 'winter-2026', name: 'Winter Glitter Season', icon: '❄️',
    starts: '2026-12-01', ends: '2027-03-01',
    rewards: {
      'rank-4': 'rare-snowflake-beret',
      'rank-6': 'rare-icicle-blazer',
      'rank-8': 'rare-frost-gown',
      'rank-10': 'rare-aurora-cape',
      'rank-11': 'rare-ice-queen-tiara',
      'rank-12': 'rare-snow-stilettos',
      'rank-13': 'rare-starlight-pearls'
    }
  }
];

const DAY = 24 * 60 * 60 * 1000;
const dateOf = (s) => new Date(`${s}T00:00:00`);

export function rankFor(stars) {
  let current = RANKS[0];
  for (const r of RANKS) if (stars >= r.stars) current = r;
  return current;
}

export function nextRank(stars) {
  return RANKS.find(r => r.stars > stars) || null;
}

export function rankIndex(rank) {
  return RANKS.indexOf(rank);
}

export function activeSeason(now = new Date()) {
  return SEASONS.find(s => now >= dateOf(s.starts) && now < dateOf(s.ends)) || null;
}

export function pastSeasons(now = new Date()) {
  return SEASONS.filter(s => now >= dateOf(s.ends));
}

export function daysLeft(season, now = new Date()) {
  return Math.max(0, Math.ceil((dateOf(season.ends) - now) / DAY));
}

export const claimKey = (season, rank) => `${season.id}:${rank.id}`;

// Which rewards of the current season can this player claim right now?
export function claimableRewards(profile, now = new Date()) {
  const season = activeSeason(now);
  if (!season) return [];
  const claimed = profile.claimedRewards || {};
  return RANKS.filter(r => r.reward && profile.stars >= r.stars && season.rewards[r.id] && !claimed[claimKey(season, r)])
    .map(r => ({ rank: r, season, itemId: season.rewards[r.id] }));
}
