// Storage & Database Layer for Detective Atelier
// Supports both offline LocalStorage (instant, zero setup)
// and Cloud Database (Supabase / Firebase) for online multiplayer competitions!

export const CLOUD_CONFIG = {
  enabled: false, // Set to true once you paste your Supabase URL & Key below!
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Default community contest entries for offline/preview mode
const DEFAULT_COMMUNITY_ENTRIES = [
  {
    id: 'entry-1',
    creator: 'Detective_Coco',
    title: 'Shadow Silk Sleuth',
    stars: 342,
    votes: 89,
    theme: 'Midnight Infiltration',
    items: {
      skin: 'skin-2',
      hairStyle: 'hair-chic-bob',
      hairColor: 'h-obsidian',
      outerwear: 'coat-noir-trench',
      tops: 'top-detective-turtleneck',
      bottoms: 'bottom-sleuth-trousers',
      shoes: 'shoes-brogues',
      hats: 'hat-fedora',
      accessories: 'acc-magnifier'
    }
  },
  {
    id: 'entry-2',
    creator: 'VelvetSherlock',
    title: 'Gilded Ball Mystery',
    stars: 289,
    votes: 74,
    theme: 'VIP Masquerade Gala',
    items: {
      skin: 'skin-1',
      hairStyle: 'hair-glam-waves',
      hairColor: 'h-blonde',
      outerwear: 'coat-midnight-cape',
      tops: 'top-corset-vest',
      bottoms: 'bottom-gala-skirt',
      shoes: 'shoes-stilettos',
      hats: 'hat-tiara',
      accessories: 'acc-masquerade'
    }
  },
  {
    id: 'entry-3',
    creator: 'LumiereStylist',
    title: 'Parisian Trench & Pearls',
    stars: 265,
    votes: 61,
    theme: 'Vintage Detective Chic',
    items: {
      skin: 'skin-3',
      hairStyle: 'hair-sleuth-ponytail',
      hairColor: 'h-chestnut',
      outerwear: 'coat-gold-blazer',
      tops: 'top-silk-blouse',
      bottoms: 'bottom-pleated-skirt',
      shoes: 'shoes-brogues',
      hats: 'hat-beret',
      accessories: 'acc-pearls'
    }
  }
];

export class DetectiveDatabase {
  constructor() {
    this.storageKey = 'detective_fashion_save_v1';
    this.competitionsKey = 'detective_fashion_contests_v1';
    this.initLocalData();
  }

  initLocalData() {
    if (!localStorage.getItem(this.competitionsKey)) {
      localStorage.setItem(this.competitionsKey, JSON.stringify(DEFAULT_COMMUNITY_ENTRIES));
    }
    if (!localStorage.getItem(this.storageKey)) {
      const initialProfile = {
        displayName: 'Detective Belle',
        username: 'detective_belle',
        agencyRank: 'Junior Fashion Sleuth',
        stars: 350,
        lastDisplayNameChange: null,
        lastUsernameChange: null,
        solvedCases: [],
        savedOutfits: []
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialProfile));
    }
  }

  async getProfile() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      const profile = JSON.parse(data);
      // Ensure backwards compatibility with fields
      if (!profile.displayName) profile.displayName = profile.detectiveName || 'Detective Belle';
      if (!profile.username) profile.username = 'detective_belle';
      if (!profile.ownedItems) profile.ownedItems = [];        // rare items you've claimed
      if (!profile.claimedRewards) profile.claimedRewards = {}; // which season rewards you took
      return profile;
    } catch (e) {
      console.error('Error reading profile:', e);
      return null;
    }
  }

  getCooldownStatus(profile) {
    const now = Date.now();
    const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    let displayAllowed = true;
    let displayTimeRemaining = 0;
    if (profile.lastDisplayNameChange) {
      const elapsed = now - profile.lastDisplayNameChange;
      if (elapsed < FIVE_DAYS) {
        displayAllowed = false;
        displayTimeRemaining = FIVE_DAYS - elapsed;
      }
    }

    let usernameAllowed = true;
    let usernameTimeRemaining = 0;
    if (profile.lastUsernameChange) {
      const elapsed = now - profile.lastUsernameChange;
      if (elapsed < THIRTY_DAYS) {
        usernameAllowed = false;
        usernameTimeRemaining = THIRTY_DAYS - elapsed;
      }
    }

    return {
      displayAllowed,
      displayDaysLeft: Math.ceil(displayTimeRemaining / (24 * 60 * 60 * 1000)),
      displayHoursLeft: Math.ceil(displayTimeRemaining / (60 * 60 * 1000)),
      usernameAllowed,
      usernameDaysLeft: Math.ceil(usernameTimeRemaining / (24 * 60 * 60 * 1000)),
      usernameHoursLeft: Math.ceil(usernameTimeRemaining / (60 * 60 * 1000))
    };
  }

  async setDisplayName(newName) {
    const profile = await this.getProfile();
    const status = this.getCooldownStatus(profile);
    if (!status.displayAllowed) {
      return { success: false, error: `You can change your display name in ${status.displayDaysLeft} day(s)! (Allowed every 5 days)` };
    }
    profile.displayName = newName.trim();
    profile.lastDisplayNameChange = Date.now();
    await this.updateProfile(profile);
    return { success: true, profile };
  }

  async setUsername(newUsername) {
    const profile = await this.getProfile();
    const status = this.getCooldownStatus(profile);
    if (!status.usernameAllowed) {
      return { success: false, error: `You can change your username in ${status.usernameDaysLeft} day(s)! (Allowed every 30 days)` };
    }
    const cleanUser = newUsername.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUser.length < 3) {
      return { success: false, error: 'Username must be at least 3 letters or numbers!' };
    }
    profile.username = cleanUser;
    profile.lastUsernameChange = Date.now();
    await this.updateProfile(profile);
    return { success: true, profile };
  }

  async updateProfile(updates) {
    const profile = await this.getProfile();
    const newProfile = { ...profile, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(newProfile));
    return newProfile;
  }

  async saveOutfit(name, lookData) {
    const profile = await this.getProfile();
    const newOutfit = {
      id: 'outfit-' + Date.now(),
      name: name || 'Detective Look ' + (profile.savedOutfits.length + 1),
      createdAt: new Date().toLocaleDateString(),
      look: { ...lookData }
    };
    profile.savedOutfits.unshift(newOutfit);
    await this.updateProfile({ savedOutfits: profile.savedOutfits });
    return newOutfit;
  }

  async deleteOutfit(outfitId) {
    const profile = await this.getProfile();
    profile.savedOutfits = profile.savedOutfits.filter(o => o.id !== outfitId);
    await this.updateProfile({ savedOutfits: profile.savedOutfits });
    return profile.savedOutfits;
  }

  async getCompetitions() {
    try {
      const data = localStorage.getItem(this.competitionsKey);
      return data ? JSON.parse(data) : DEFAULT_COMMUNITY_ENTRIES;
    } catch {
      return DEFAULT_COMMUNITY_ENTRIES;
    }
  }

  async submitToContest(title, lookData, creatorName) {
    const entries = await this.getCompetitions();
    const newEntry = {
      id: 'entry-' + Date.now(),
      creator: creatorName || 'You',
      title: title || 'Midnight Sleuth',
      stars: 100,
      votes: 1,
      theme: 'Weekly Runway Contest',
      items: { ...lookData }
    };
    entries.unshift(newEntry);
    localStorage.setItem(this.competitionsKey, JSON.stringify(entries));

    // If cloud is enabled, also sync to Supabase
    if (CLOUD_CONFIG.enabled && window.supabase) {
      try {
        await window.supabase.from('contest_entries').insert([newEntry]);
      } catch (err) {
        console.warn('Supabase sync skipped:', err);
      }
    }
    return newEntry;
  }

  async voteForEntry(entryId) {
    const entries = await this.getCompetitions();
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      entry.votes = (entry.votes || 0) + 1;
      localStorage.setItem(this.competitionsKey, JSON.stringify(entries));
    }
    return entries;
  }

  // Export / Import look code (like Roblox or Dress to Impress outfit sharing!)
  exportLookCode(lookData) {
    try {
      const jsonStr = JSON.stringify(lookData);
      return btoa(jsonStr);
    } catch {
      return '';
    }
  }

  importLookCode(base64Code) {
    try {
      const jsonStr = atob(base64Code.trim());
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
}
