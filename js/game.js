// Main Game Controller for Mystery Runway & Detective Atelier
import { WARDROBE_DATA, WardrobeEngine } from './wardrobe.js';
import { MYSTERY_CASES } from './cases.js';
import { RunwayEngine } from './runway.js';
import { DetectiveDatabase } from './database.js';
import { sounds } from './audio.js';

class GameController {
  constructor() {
    this.wardrobe = new WardrobeEngine();
    this.runway = new RunwayEngine(this);
    this.db = new DetectiveDatabase();

    this.activeCaseIndex = 0;
    this.inspectedClues = new Set();
    this.selectedSuspectId = null;
    this.activeCategory = 'outerwear';
    this.profile = null;

    this.init();
  }

  async init() {
    this.profile = await this.db.getProfile();
    this.setupNavigation();
    this.setupAudioToggle();
    this.setupWardrobeUI();
    this.setupCaseUI();
    this.setupRunwayUI();
    this.setupContestUI();
    this.updateAvatar();
    this.updateHeaderProfile();
  }

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

  updateHeaderProfile() {
    const nameEl = document.getElementById('player-name-display');
    const rankEl = document.getElementById('player-rank-display');
    const starsEl = document.getElementById('player-stars-display');

    if (nameEl && this.profile) nameEl.textContent = this.profile.detectiveName;
    if (rankEl && this.profile) rankEl.textContent = this.profile.agencyRank;
    if (starsEl && this.profile) starsEl.textContent = `⭐ ${this.profile.stars}`;
  }

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
      });
    });
  }

  // --- WARDROBE & ATELIER ---
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

    // Customizer buttons (Skin & Hair)
    this.renderCustomizerSwatches();
    this.renderWardrobeItems();

    // Reset Look button
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

    // Save Look button
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

    // Share Outfit Code button
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

    const items = WARDROBE_DATA.items.filter(item => item.category === this.activeCategory);

    grid.innerHTML = items.map(item => {
      const isEquipped = this.wardrobe.currentLook[item.category] === item.id;
      return `
        <div class="wardrobe-card ${isEquipped ? 'equipped' : ''}" data-id="${item.id}" data-cat="${item.category}">
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
    const runwayDollContainer = document.getElementById('runway-doll-container');
    const svgCode = this.wardrobe.renderAvatarSVG();

    if (avatarContainer) avatarContainer.innerHTML = svgCode;
    if (runwayDollContainer) runwayDollContainer.innerHTML = svgCode;

    // Update stats bar
    const stats = this.wardrobe.calculateStats();
    const stealthVal = document.getElementById('stat-stealth');
    const glamourVal = document.getElementById('stat-glamour');
    const clueVal = document.getElementById('stat-clue');

    if (stealthVal) stealthVal.textContent = stats.stealth;
    if (glamourVal) glamourVal.textContent = stats.glamour;
    if (clueVal) clueVal.textContent = stats.clueBonus;
  }

  // --- MYSTERY CASE FILES ---
  setupCaseUI() {
    const caseSelector = document.getElementById('case-selector-dropdown');
    if (caseSelector) {
      caseSelector.innerHTML = MYSTERY_CASES.map((c, i) => `
        <option value="${i}">${c.title} (${c.difficulty})</option>
      `).join('');

      caseSelector.addEventListener('change', (e) => {
        this.activeCaseIndex = parseInt(e.target.value, 10);
        this.inspectedClues.clear();
        this.selectedSuspectId = null;
        this.renderActiveCase();
      });
    }

    this.renderActiveCase();
  }

  renderActiveCase() {
    const c = MYSTERY_CASES[this.activeCaseIndex];
    if (!c) return;

    const titleEl = document.getElementById('case-title');
    const clientNameEl = document.getElementById('client-name');
    const clientAvatarEl = document.getElementById('client-avatar');
    const briefingEl = document.getElementById('case-briefing');
    const objectiveEl = document.getElementById('case-objective');

    if (titleEl) titleEl.textContent = c.title;
    if (clientNameEl) clientNameEl.textContent = `${c.client} (${c.clientRole})`;
    if (clientAvatarEl) clientAvatarEl.textContent = c.clientAvatar;
    if (briefingEl) briefingEl.textContent = c.briefing;
    if (objectiveEl) objectiveEl.textContent = c.objective;

    // Render Clues
    const clueList = document.getElementById('case-clues-list');
    if (clueList) {
      clueList.innerHTML = c.clues.map(clue => {
        const isFound = this.inspectedClues.has(clue.id);
        return `
          <div class="clue-item ${isFound ? 'inspected' : ''}" data-id="${clue.id}">
            <div class="clue-icon">${clue.icon}</div>
            <div class="clue-info">
              <h5>${clue.name}</h5>
              <p>${isFound ? clue.description : 'Click to inspect fabric clue with your magnifier...'}</p>
            </div>
            <button class="inspect-btn">${isFound ? '✓ Discovered' : '🔍 Inspect'}</button>
          </div>
        `;
      }).join('');

      clueList.querySelectorAll('.clue-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          if (!this.inspectedClues.has(id)) {
            this.inspectedClues.add(id);
            sounds.playClueChime();
            this.renderActiveCase();
          }
        });
      });
    }

    // Render Suspects
    const suspectList = document.getElementById('case-suspects-list');
    if (suspectList) {
      suspectList.innerHTML = c.suspects.map(s => {
        const isSelected = this.selectedSuspectId === s.id;
        return `
          <div class="suspect-card ${isSelected ? 'selected' : ''}" data-id="${s.id}">
            <div class="suspect-avatar">${s.avatar}</div>
            <div class="suspect-body">
              <h4>${s.name} <span class="suspect-role">${s.role}</span></h4>
              <blockquote class="suspect-statement">"${s.statement}"</blockquote>
              ${s.clueAlibi && this.inspectedClues.size > 0 ? `
                <div class="suspect-alibi">💡 <strong>Clue note:</strong> ${s.clueAlibi}</div>
              ` : ''}
            </div>
            <button class="accuse-select-btn">
              ${isSelected ? '🎯 Prime Suspect' : 'Mark as Suspect'}
            </button>
          </div>
        `;
      }).join('');

      suspectList.querySelectorAll('.suspect-card').forEach(card => {
        card.addEventListener('click', () => {
          this.selectedSuspectId = card.dataset.id;
          sounds.playEquip();
          this.renderActiveCase();
        });
      });
    }

    // Accuse and walk button
    const startRunwayBtn = document.getElementById('btn-go-to-runway');
    if (startRunwayBtn) {
      startRunwayBtn.onclick = () => {
        if (!this.selectedSuspectId) {
          alert('⚠️ Please select a prime suspect to accuse before taking the runway!');
          return;
        }
        // Jump to Runway Tab
        const runwayTab = document.querySelector('[data-view="runway"]');
        if (runwayTab) runwayTab.click();
      };
    }
  }

  // --- RUNWAY SHOWDOWN ---
  setupRunwayUI() {
    const walkBtn = document.getElementById('btn-start-runway-walk');
    if (walkBtn) {
      walkBtn.addEventListener('click', () => {
        this.triggerRunwayWalk();
      });
    }
  }

  async triggerRunwayWalk() {
    const walkBtn = document.getElementById('btn-start-runway-walk');
    const runwayStage = document.getElementById('runway-stage');
    const resultsModal = document.getElementById('runway-verdict-card');
    if (walkBtn) walkBtn.disabled = true;

    // Flash lights animation & camera sound
    runwayStage.classList.add('strut-active');
    sounds.playCameraFlash();

    setTimeout(() => sounds.playCameraFlash(), 600);
    setTimeout(() => sounds.playCameraFlash(), 1200);

    setTimeout(async () => {
      runwayStage.classList.remove('strut-active');
      if (walkBtn) walkBtn.disabled = false;

      const activeCase = MYSTERY_CASES[this.activeCaseIndex];
      const stats = this.wardrobe.calculateStats();
      const evaluation = this.runway.evaluateLook(stats, activeCase, this.selectedSuspectId);

      if (evaluation.passed) {
        sounds.playVictory();
        this.profile.stars += activeCase.rewardStars;
        await this.db.updateProfile({ stars: this.profile.stars });
        this.updateHeaderProfile();
      }

      this.showRunwayResults(evaluation, activeCase);
    }, 2000);
  }

  showRunwayResults(evalResult, activeCase) {
    const verdictCard = document.getElementById('runway-verdict-card');
    if (!verdictCard) return;

    verdictCard.classList.remove('hidden');

    const suspect = activeCase.suspects.find(s => s.id === this.selectedSuspectId);

    verdictCard.innerHTML = `
      <div class="verdict-banner ${evalResult.passed ? 'success' : 'failed'}">
        <h3>${evalResult.passed ? '🎉 Case Solved! Standing Ovation!' : '❌ Case Unsolved! Misdirection on the Runway!'}</h3>
        <p class="verdict-score-total">Total Runway Score: <strong>${evalResult.total} / 300 pts</strong></p>
      </div>

      <div class="verdict-accusation-box">
        <h4>Suspect Confrontation: ${suspect ? suspect.name : 'Unknown'}</h4>
        <p>${evalResult.isGuilty ? `<em>"${suspect.confession}"</em>` : `<em>"${suspect ? suspect.reactionWrong : ''}"</em>`}</p>
      </div>

      <div class="judges-grid">
        ${evalResult.judges.map(j => `
          <div class="judge-card">
            <div class="judge-avatar">${j.avatar}</div>
            <h5>${j.name} <span class="judge-title">(${j.title})</span></h5>
            <div class="judge-score-badge">${j.score} pts</div>
            <p class="judge-comment">${j.comment}</p>
          </div>
        `).join('')}
      </div>

      <div class="verdict-actions">
        ${evalResult.passed ? `<p class="reward-notice">⭐ Reward Claimed: +${activeCase.rewardStars} Stars!</p>` : ''}
        <button id="close-verdict-btn" class="primary-btn">Continue Sleuthing</button>
      </div>
    `;

    document.getElementById('close-verdict-btn').onclick = () => {
      verdictCard.classList.add('hidden');
    };
  }

  // --- ONLINE CONTESTS & CLOSET ---
  setupContestUI() {
    const submitBtn = document.getElementById('btn-submit-contest');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const title = prompt('Name your Runway Contest entry:', 'Haute Noir Detective');
        if (title) {
          await this.db.submitToContest(title, this.wardrobe.currentLook, this.profile.detectiveName);
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
          <p>Style: Gilded Sleuth Disguise</p>
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
          // Jump to Atelier view
          document.querySelector('[data-view="atelier"]').click();
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
