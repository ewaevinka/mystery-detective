// Main Game Controller for Mystery Runway & Detective Atelier
import { WARDROBE_DATA, WardrobeEngine } from './wardrobe.js';
import { DetectiveDatabase } from './database.js';
import { sounds } from './audio.js';
import { RANKS, rankFor, nextRank, activeSeason, pastSeasons, daysLeft, claimKey, claimableRewards } from './ranks.js';

class GameController {
  constructor() {
    this.wardrobe = new WardrobeEngine();
    this.db = new DetectiveDatabase();

    this.play = null;           // the 3D mystery world (loads from js/play.js)
    this.activeCategory = 'outerwear';
    this.profile = null;

    this.init();
  }

  async init() {
    this.profile = await this.db.getProfile();
    this.setupNavigation();
    this.setupAudioToggle();
    this.setupProfileModal();
    this.setupRanksModal();
    this.setupWardrobeUI();
    this.setupContestUI();
    this.updateAvatar();
    this.updateHeaderProfile();
    this.setupWorld();
  }

  // --- THE 3D MYSTERY WORLD ---
  async setupWorld() {
    const loading = document.getElementById('world-loading');
    try {
      const { PlayController } = await import('./play.js');
      this.play = new PlayController(this);
      loading?.remove();
      const worldVisible = document.getElementById('view-world')?.classList.contains('active');
      this.play.setVisible(!!worldVisible);
    } catch (err) {
      console.error('3D world failed to load:', err);
      if (loading) loading.textContent = '😢 The 3D world needs an internet connection to load. Check your Wi-Fi and refresh the page!';
    }

    const backBtn = document.getElementById('btn-back-to-world');
    if (backBtn) backBtn.addEventListener('click', () => this.switchScene('world'));
  }

  // The magic mirror or the boutique van opens the Dress-Up Studio
  openAtelierFromWorld() {
    document.getElementById('btn-back-to-world')?.classList.remove('hidden');
    this.switchScene('atelier');
  }

  // --- AUDIO TOGGLE ---
  setupAudioToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        btn.textContent = isMuted ? '🔇 Sound: Off' : '🔊 Sound: On';
        btn.classList.toggle('muted', isMuted);
      });
    }
  }

  // --- PROFILE HEADER & PASSPORT MODAL (5-DAY & 30-DAY COOLDOWNS) ---
  updateHeaderProfile() {
    const nameEl = document.getElementById('player-name-display');
    const userEl = document.getElementById('player-user-display');
    const starsEl = document.getElementById('player-stars-display');

    if (nameEl && this.profile) nameEl.textContent = this.profile.displayName;
    if (userEl && this.profile) userEl.textContent = `@${this.profile.username}`;
    if (starsEl && this.profile) starsEl.textContent = `⭐ ${this.profile.stars.toLocaleString()}`;

    const rankEl = document.getElementById('player-rank-display');
    if (rankEl && this.profile) {
      const rank = rankFor(this.profile.stars);
      const gifts = claimableRewards(this.profile).length;
      rankEl.textContent = `${rank.icon} ${rank.name}${gifts ? ` · 🎁 ${gifts}` : ''}`;
      rankEl.classList.toggle('has-gift', gifts > 0);
    }
  }

  // ================= 🏅 RANKS & RARE REWARDS =================
  setupRanksModal() {
    const overlay = document.getElementById('ranks-modal-overlay');
    const open = (e) => {
      e.stopPropagation(); // don't also open the passport
      this.renderRanksModal();
      overlay.classList.remove('hidden');
      sounds.playEquip();
    };
    document.getElementById('player-stars-display')?.addEventListener('click', open);
    document.getElementById('player-rank-display')?.addEventListener('click', open);
    document.getElementById('close-ranks-modal-btn')?.addEventListener('click', () => overlay.classList.add('hidden'));
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
  }

  renderRanksModal(message = '') {
    const body = document.getElementById('ranks-body');
    if (!body) return;
    const p = this.profile;
    const now = new Date();
    const current = rankFor(p.stars);
    const next = nextRank(p.stars);
    const season = activeSeason(now);
    const owned = new Set(p.ownedItems || []);
    const claimed = p.claimedRewards || {};
    const itemById = (id) => WARDROBE_DATA.items.find(i => i.id === id);
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    body.replaceChildren();

    if (message) body.appendChild(el('div', 'ranks-message', message));

    // current rank + progress bar to the next one
    const hero = el('div', 'rank-hero');
    hero.append(el('div', 'rank-hero-icon', current.icon), el('div', 'rank-hero-name', current.name), el('div', 'rank-hero-stars', `⭐ ${p.stars.toLocaleString()} stars`));
    if (next) {
      const pct = Math.round(((p.stars - current.stars) / (next.stars - current.stars)) * 100);
      const bar = el('div', 'rank-progress');
      const fill = el('div', 'rank-progress-fill');
      fill.style.width = `${pct}%`;
      bar.appendChild(fill);
      hero.append(bar, el('div', 'rank-next', `${(next.stars - p.stars).toLocaleString()} more stars to ${next.icon} ${next.name}${next.reward ? ' 🎁' : ''}`));
    } else {
      hero.appendChild(el('div', 'rank-next', '🏆 You reached the TOP rank! Legendary!'));
    }
    body.appendChild(hero);

    // this season's rare rewards
    const seasonBox = el('div', 'season-box');
    if (season) {
      const left = daysLeft(season, now);
      seasonBox.append(el('h4', null, `${season.icon} ${season.name}`), el('p', 'season-timer', `⏳ These rare items disappear forever in ${left} day${left === 1 ? '' : 's'}!`));
      const grid = el('div', 'reward-grid');
      RANKS.filter(r => r.reward).forEach(r => {
        const item = itemById(season.rewards[r.id]);
        if (!item) return;
        const card = el('div', 'reward-card');
        const reached = p.stars >= r.stars;
        const isClaimed = !!claimed[claimKey(season, r)] || owned.has(item.id);
        card.classList.add(isClaimed ? 'claimed' : reached ? 'ready' : 'locked');
        const preview = el('div', 'reward-preview', reached || isClaimed ? item.preview : '🔒');
        preview.style.borderColor = item.color;
        card.append(preview, el('div', 'reward-name', item.name), el('div', 'reward-rank', `${r.icon} ${r.name}`));
        if (isClaimed) {
          card.appendChild(el('div', 'reward-status', '✅ In your closet'));
        } else if (reached) {
          const btn = el('button', 'reward-claim-btn', '🎁 Claim!');
          btn.onclick = () => this.claimReward(season, r, item);
          card.appendChild(btn);
        } else {
          card.appendChild(el('div', 'reward-status', `Needs ⭐ ${r.stars.toLocaleString()}`));
        }
        grid.appendChild(card);
      });
      seasonBox.appendChild(grid);
    } else {
      seasonBox.append(el('h4', null, '✨ A new season is coming soon!'), el('p', 'season-timer', 'Keep solving mysteries to be ready for the next rare items.'));
    }
    body.appendChild(seasonBox);

    // retired items from past seasons
    const past = pastSeasons(now);
    if (past.length) {
      const retired = el('div', 'season-box retired');
      retired.appendChild(el('h4', null, '🗝️ Retired Rare Items'));
      const grid = el('div', 'reward-grid');
      past.forEach(s => Object.values(s.rewards).forEach(id => {
        const item = itemById(id);
        if (!item) return;
        const have = owned.has(id);
        const card = el('div', `reward-card ${have ? 'claimed' : 'gone'}`);
        card.append(el('div', 'reward-preview', have ? item.preview : '🚫'), el('div', 'reward-name', item.name), el('div', 'reward-status', have ? `✅ You have it! (${s.icon})` : 'Gone forever 😢'));
        grid.appendChild(card);
      }));
      retired.appendChild(grid);
      body.appendChild(retired);
    }

    // the full rank ladder
    const ladder = el('div', 'rank-ladder');
    ladder.appendChild(el('h4', null, '🪜 All Ranks'));
    RANKS.forEach(r => {
      const row = el('div', `rank-row ${p.stars >= r.stars ? 'reached' : ''} ${r === current ? 'current' : ''}`);
      row.append(el('span', 'rank-row-icon', r.icon), el('span', 'rank-row-name', r.name), el('span', 'rank-row-stars', `⭐ ${r.stars.toLocaleString()}`), el('span', 'rank-row-gift', r.reward ? '🎁 Rare item' : ''));
      ladder.appendChild(row);
    });
    body.appendChild(ladder);
  }

  async claimReward(season, rank, item) {
    const p = this.profile;
    p.ownedItems = [...new Set([...(p.ownedItems || []), item.id])];
    p.claimedRewards = { ...(p.claimedRewards || {}), [claimKey(season, rank)]: Date.now() };
    await this.db.updateProfile({ ownedItems: p.ownedItems, claimedRewards: p.claimedRewards });
    sounds.playVictory();
    this.renderWardrobeItems();
    this.updateHeaderProfile();
    this.renderRanksModal(`🎉 You got the ${item.name}! Find it in the Dress-Up Studio under ${WARDROBE_DATA.categories.find(c => c.id === item.category)?.name}.`);
  }

  setupProfileModal() {
    const openBtn = document.getElementById('open-profile-btn');
    const modal = document.getElementById('profile-modal-overlay');
    const closeBtn = document.getElementById('close-profile-modal-btn');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        this.renderProfileModalFields();
        modal.classList.remove('hidden');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }

    // Display Name Save
    const saveDisplayBtn = document.getElementById('btn-save-display-name');
    if (saveDisplayBtn) {
      saveDisplayBtn.addEventListener('click', async () => {
        const input = document.getElementById('input-display-name');
        const msgEl = document.getElementById('display-name-msg');
        if (!input || !input.value.trim()) return;

        const res = await this.db.setDisplayName(input.value.trim());
        if (res.success) {
          this.profile = res.profile;
          this.updateHeaderProfile();
          this.renderProfileModalFields();
          sounds.playClueChime();
          msgEl.style.color = '#22C55E';
          msgEl.textContent = '✓ Display name updated! (Next change allowed in 5 days)';
        } else {
          msgEl.style.color = '#EF4444';
          msgEl.textContent = res.error;
        }
      });
    }

    // Username Save
    const saveUserBtn = document.getElementById('btn-save-username');
    if (saveUserBtn) {
      saveUserBtn.addEventListener('click', async () => {
        const input = document.getElementById('input-username');
        const msgEl = document.getElementById('username-msg');
        if (!input || !input.value.trim()) return;

        const res = await this.db.setUsername(input.value.trim());
        if (res.success) {
          this.profile = res.profile;
          this.updateHeaderProfile();
          this.renderProfileModalFields();
          sounds.playClueChime();
          msgEl.style.color = '#22C55E';
          msgEl.textContent = '✓ Username updated! (Next change allowed in 30 days)';
        } else {
          msgEl.style.color = '#EF4444';
          msgEl.textContent = res.error;
        }
      });
    }
  }

  renderProfileModalFields() {
    if (!this.profile) return;
    const inputDisplay = document.getElementById('input-display-name');
    const inputUser = document.getElementById('input-username');
    const displayTimer = document.getElementById('display-name-timer');
    const userTimer = document.getElementById('username-timer');
    const rankEl = document.getElementById('passport-rank');
    const starsEl = document.getElementById('passport-stars');

    if (inputDisplay) inputDisplay.value = this.profile.displayName;
    if (inputUser) inputUser.value = this.profile.username;
    if (rankEl) rankEl.textContent = `${rankFor(this.profile.stars).icon} ${rankFor(this.profile.stars).name}`;
    if (starsEl) starsEl.textContent = `⭐ ${this.profile.stars}`;

    const status = this.db.getCooldownStatus(this.profile);

    if (displayTimer) {
      if (status.displayAllowed) {
        displayTimer.textContent = 'Changeable now (Every 5 days)';
        displayTimer.style.color = '#22C55E';
      } else {
        displayTimer.textContent = `Wait ${status.displayDaysLeft}d to change`;
        displayTimer.style.color = '#F59E0B';
      }
    }

    if (userTimer) {
      if (status.usernameAllowed) {
        userTimer.textContent = 'Changeable now (Every 30 days)';
        userTimer.style.color = '#22C55E';
      } else {
        userTimer.textContent = `Wait ${status.usernameDaysLeft}d to change`;
        userTimer.style.color = '#F59E0B';
      }
    }
  }

  // --- NAVIGATION ---
  setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetView = tab.dataset.view;

        document.querySelectorAll('.game-view').forEach(view => {
          view.classList.remove('active');
        });
        const activeView = document.getElementById(`view-${targetView}`);
        if (activeView) activeView.classList.add('active');

        if (targetView === 'contest') {
          this.renderContestList();
          this.renderClosetList();
        }
        if (targetView === 'world') {
          document.getElementById('btn-back-to-world')?.classList.add('hidden');
        }
        this.play?.setVisible(targetView === 'world');
      });
    });
  }

  switchScene(sceneKey) {
    const tab = document.querySelector(`.nav-tab[data-view="${sceneKey}"]`);
    if (tab) tab.click();
  }

  // ================= SCENE 3: THE ATELIER (DRESS-UP STUDIO) =================
  setupWardrobeUI() {
    const catContainer = document.getElementById('wardrobe-category-bar');
    if (!catContainer) return;

    catContainer.innerHTML = WARDROBE_DATA.categories.map(cat => `
      <button class="cat-btn ${cat.id === this.activeCategory ? 'active' : ''}" data-cat="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
      </button>
    `).join('');

    catContainer.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catContainer.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.cat;
        this.renderWardrobeItems();
      });
    });

    this.renderCustomizerSwatches();
    this.renderWardrobeItems();

    // Reset Look
    const resetBtn = document.getElementById('reset-look-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.wardrobe.currentLook.outerwear = null;
        this.wardrobe.currentLook.tops = 'top-detective-turtleneck';
        this.wardrobe.currentLook.bottoms = 'bottom-sleuth-trousers';
        this.wardrobe.currentLook.shoes = 'shoes-brogues';
        this.wardrobe.currentLook.hats = null;
        this.wardrobe.currentLook.accessories = null;
        sounds.playEquip();
        this.updateAvatar();
        this.renderWardrobeItems();
      });
    }

    // Save Look
    const saveBtn = document.getElementById('save-closet-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const name = prompt('Give your detective look a title:', 'Midnight Sleuth');
        if (name) {
          await this.db.saveOutfit(name, this.wardrobe.currentLook);
          this.profile = await this.db.getProfile();
          sounds.playClueChime();
          alert(`✨ Saved "${name}" into your Detective Closet!`);
        }
      });
    }

    // Share Outfit Code
    const shareBtn = document.getElementById('share-code-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const code = this.db.exportLookCode(this.wardrobe.currentLook);
        navigator.clipboard?.writeText(code);
        prompt('Copy your Secret Outfit Code to share with friends or paste into Claude Code:', code);
      });
    }
  }

  renderCustomizerSwatches() {
    const skinRow = document.getElementById('skin-swatch-row');
    if (skinRow) {
      skinRow.innerHTML = WARDROBE_DATA.skinTones.map(s => `
        <button class="swatch-btn ${this.wardrobe.currentLook.skin === s.id ? 'active' : ''}" 
                data-id="${s.id}" 
                style="background-color: ${s.color};" 
                title="${s.name}"></button>
      `).join('');

      skinRow.querySelectorAll('.swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.wardrobe.setSkin(btn.dataset.id);
          this.updateAvatar();
          this.renderCustomizerSwatches();
        });
      });
    }

    const hairRow = document.getElementById('hair-swatch-row');
    if (hairRow) {
      hairRow.innerHTML = WARDROBE_DATA.hairColors.map(h => `
        <button class="swatch-btn ${this.wardrobe.currentLook.hairColor === h.id ? 'active' : ''}" 
                data-id="${h.id}" 
                style="background-color: ${h.color};" 
                title="${h.name}"></button>
      `).join('');

      hairRow.querySelectorAll('.swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.wardrobe.setHairColor(btn.dataset.id);
          this.updateAvatar();
          this.renderCustomizerSwatches();
        });
      });
    }

    const hairStyleRow = document.getElementById('hairstyle-selector');
    if (hairStyleRow) {
      hairStyleRow.innerHTML = WARDROBE_DATA.hairStyles.map(h => `
        <button class="chip-btn ${this.wardrobe.currentLook.hairStyle === h.id ? 'active' : ''}" data-id="${h.id}">
          ${h.name}
        </button>
      `).join('');

      hairStyleRow.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.wardrobe.setHairStyle(btn.dataset.id);
          this.updateAvatar();
          this.renderCustomizerSwatches();
        });
      });
    }
  }

  renderWardrobeItems() {
    const grid = document.getElementById('wardrobe-items-grid');
    if (!grid) return;

    const owned = new Set(this.profile?.ownedItems || []);
    const items = WARDROBE_DATA.items.filter(item => item.category === this.activeCategory && (!item.rare || owned.has(item.id)));

    grid.innerHTML = items.map(item => {
      const isEquipped = this.wardrobe.currentLook[item.category] === item.id;
      return `
        <div class="wardrobe-card ${isEquipped ? 'equipped' : ''} ${item.rare ? 'rare' : ''}" data-id="${item.id}" data-cat="${item.category}">
          ${item.rare ? '<span class="rare-badge">✨ RARE</span>' : ''}
          <div class="card-preview" style="border-bottom: 3px solid ${item.color}">${item.preview}</div>
          <div class="card-details">
            <h4 class="card-title">${item.name}</h4>
            <div class="card-badges">
              <span class="style-badge ${item.styleTag}">${item.styleTag}</span>
              ${item.stealthBonus ? `<span class="stat-badge stealth">🕵️ +${item.stealthBonus}</span>` : ''}
              ${item.glamourBonus ? `<span class="stat-badge glamour">✨ +${item.glamourBonus}</span>` : ''}
              ${item.cluePower ? `<span class="stat-badge clue">🔍 +${item.cluePower}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.wardrobe-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const cat = card.dataset.cat;
        this.wardrobe.equip(cat, id);
        sounds.playEquip();
        this.updateAvatar();
        this.renderWardrobeItems();
      });
    });
  }

  updateAvatar() {
    const avatarContainer = document.getElementById('atelier-avatar-container');
    const svgCode = this.wardrobe.renderAvatarSVG();

    if (avatarContainer) avatarContainer.innerHTML = svgCode;

    const stats = this.wardrobe.calculateStats();
    const stealthVal = document.getElementById('stat-stealth');
    const glamourVal = document.getElementById('stat-glamour');
    const clueVal = document.getElementById('stat-clue');

    if (stealthVal) stealthVal.textContent = stats.stealth;
    if (glamourVal) glamourVal.textContent = stats.glamour;
    if (clueVal) clueVal.textContent = stats.clueBonus;

    // dress your 3D detective too (and show friends your new look!)
    this.play?.onLookChanged(this.wardrobe.currentLook);
  }

  // ================= SCENE 5: ONLINE CONTESTS & CLOSET =================
  setupContestUI() {
    const submitBtn = document.getElementById('btn-submit-contest');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const title = prompt('Name your Runway Contest entry:', 'Haute Noir Detective');
        if (title) {
          await this.db.submitToContest(title, this.wardrobe.currentLook, this.profile.displayName);
          sounds.playClueChime();
          this.renderContestList();
          alert('🚀 Your look has been entered into the Online Runway Contest!');
        }
      });
    }

    const importBtn = document.getElementById('btn-import-code');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const code = prompt('Paste a Secret Outfit Code from a friend or Claude:');
        if (code) {
          const parsed = this.db.importLookCode(code);
          if (parsed && parsed.skin) {
            this.wardrobe.currentLook = parsed;
            this.updateAvatar();
            this.renderWardrobeItems();
            sounds.playEquip();
            alert('👗 Outfit Code successfully equipped in Atelier!');
          } else {
            alert('❌ Invalid Outfit Code format.');
          }
        }
      });
    }
  }

  async renderContestList() {
    const listEl = document.getElementById('community-entries-grid');
    if (!listEl) return;

    const entries = await this.db.getCompetitions();
    listEl.innerHTML = entries.map(entry => `
      <div class="contest-card" data-id="${entry.id}">
        <div class="contest-header">
          <div>
            <h4>${entry.title}</h4>
            <span class="contest-author">by @${entry.creator}</span>
          </div>
          <span class="contest-theme-badge">${entry.theme}</span>
        </div>
        <div class="contest-body">
          <p>Style: Haute Sleuth Disguise</p>
          <div class="contest-votes-row">
            <span class="votes-count">💖 ${entry.votes || 0} Votes</span>
            <button class="vote-btn" data-id="${entry.id}">Vote 🌟</button>
          </div>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.vote-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await this.db.voteForEntry(id);
        sounds.playClueChime();
        this.renderContestList();
      });
    });
  }

  async renderClosetList() {
    const closetEl = document.getElementById('saved-closet-grid');
    if (!closetEl) return;

    this.profile = await this.db.getProfile();
    const outfits = this.profile.savedOutfits || [];

    if (outfits.length === 0) {
      closetEl.innerHTML = '<p class="empty-closet-msg">No saved outfits yet. Dress up in the Atelier and tap "Save Look"!</p>';
      return;
    }

    closetEl.innerHTML = outfits.map(o => `
      <div class="closet-item-card" data-id="${o.id}">
        <div class="closet-info">
          <h5>${o.name}</h5>
          <small>Created: ${o.createdAt}</small>
        </div>
        <div class="closet-actions">
          <button class="wear-btn" data-id="${o.id}">Wear</button>
          <button class="delete-btn" data-id="${o.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    closetEl.querySelectorAll('.wear-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const outfit = outfits.find(o => o.id === id);
        if (outfit) {
          this.wardrobe.currentLook = { ...outfit.look };
          this.updateAvatar();
          this.renderWardrobeItems();
          sounds.playEquip();
          this.switchScene('atelier');
        }
      });
    });

    closetEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await this.db.deleteOutfit(id);
        this.renderClosetList();
      });
    });
  }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameController();
});
