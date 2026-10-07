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
    this.hasBallroomFabricClue = false;
    this.selectedSuspectId = null;
    this.activeCategory = 'outerwear';
    this.profile = null;

    this.init();
  }

  async init() {
    this.profile = await this.db.getProfile();
    this.setupNavigation();
    this.setupAudioToggle();
    this.setupProfileModal();
    this.setupFirstPersonShop();
    this.setupFirstPersonBallroom();
    this.setupWardrobeUI();
    this.setupRunwayUI();
    this.setupContestUI();
    this.updateAvatar();
    this.updateHeaderProfile();

    // Play subtle entrance bell when game starts
    setTimeout(() => {
      sounds.playDoorBell();
    }, 600);
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
    if (starsEl && this.profile) starsEl.textContent = `⭐ ${this.profile.stars}`;
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
    if (rankEl) rankEl.textContent = this.profile.agencyRank || 'Junior Fashion Sleuth';
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
      });
    });
  }

  switchScene(sceneKey) {
    const tab = document.querySelector(`.nav-tab[data-view="${sceneKey}"]`);
    if (tab) tab.click();
  }

  // ================= SCENE 1: FIRST PERSON SHOP =================
  setupFirstPersonShop() {
    const yesBtn = document.getElementById('btn-choice-yes');
    const noBtn = document.getElementById('btn-choice-no');
    const speechEl = document.getElementById('shop-speech-text');
    const choicesRow = document.getElementById('shop-dialog-choices');
    const teleportBox = document.getElementById('pretty-teleport-container');
    const teleportBtn = document.getElementById('btn-teleport-ballroom');
    const swirlOverlay = document.getElementById('teleport-swirl-overlay');
    const countdownEl = document.getElementById('teleport-countdown-text');
    const closetMirrorBtn = document.getElementById('shop-open-closet-btn');

    // Click on vanity mirror in shop -> opens Dress-Up Studio
    if (closetMirrorBtn) {
      closetMirrorBtn.addEventListener('click', () => {
        sounds.playEquip();
        this.switchScene('atelier');
      });
    }

    // CHOICE: YES
    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        sounds.playEquip();
        speechEl.textContent = `“Merci, Detective! You are our only hope! The carriage is outside to take you to the Grand Gala Ballroom. Step through when you are ready!”`;
        choicesRow.classList.add('hidden');
        teleportBox.classList.remove('hidden');
      });
    }

    // CHOICE: NO
    if (noBtn) {
      noBtn.addEventListener('click', () => {
        speechEl.textContent = `“Oh, please don't say no! The royal judges arrive in one hour and my reputation will be ruined! Please reconsider and help me!”`;
        noBtn.textContent = 'Still deciding...';
        yesBtn.classList.add('active');
      });
    }

    // PRETTY TELEPORT BUTTON: DOES NOT TELEPORT IMMEDIATELY!
    if (teleportBtn) {
      teleportBtn.addEventListener('click', () => {
        teleportBtn.disabled = true;
        sounds.playTeleportSwirl();

        // Show magical swirling countdown overlay
        swirlOverlay.classList.remove('hidden');
        countdownEl.textContent = '🌟 Preparing magical carriage...';

        setTimeout(() => {
          countdownEl.textContent = '✨ Sweeping through the Parisian night... 3...';
        }, 900);

        setTimeout(() => {
          countdownEl.textContent = '🏰 Arriving at the Grand Gala Ballroom... 2...';
        }, 1800);

        setTimeout(() => {
          countdownEl.textContent = '💎 Stepping into the ballroom! 1...';
        }, 2700);

        setTimeout(() => {
          swirlOverlay.classList.add('hidden');
          teleportBtn.disabled = false;
          // Jump to the Grand Gala Ballroom in first person!
          this.switchScene('fp-ballroom');
        }, 3400);
      });
    }
  }

  // ================= SCENE 2: FIRST PERSON GRAND BALLROOM =================
  setupFirstPersonBallroom() {
    const floorClue = document.getElementById('clue-fabric-floor');
    const returnShopBtn = document.getElementById('btn-return-shop');
    const modal = document.getElementById('ballroom-dialog-modal');
    const modalClose = document.getElementById('modal-close-btn');

    // Return to shop button
    if (returnShopBtn) {
      returnShopBtn.addEventListener('click', () => {
        this.switchScene('fp-shop');
      });
    }

    // Inspect fabric clue on the floor!
    if (floorClue) {
      floorClue.addEventListener('click', () => {
        this.hasBallroomFabricClue = true;
        sounds.playClueChime();
        floorClue.classList.add('inspected');

        const pouchText = document.getElementById('pouch-status-text');
        if (pouchText) {
          pouchText.textContent = '🔍 Royal Sapphire Velvet fabric scrap with golden threads discovered!';
          pouchText.style.color = '#00E5FF';
        }

        this.openBallroomDialog(
          '🧵 Fabric Clue Discovered!',
          'Crime Scene Evidence',
          '🔍',
          `You bend down and examine the fabric on the floor with your golden magnifying glass. It is a torn swatch of royal sapphire velvet with fine 24k gold embroidery thread! This belongs to Madame Vivienne's stolen ball gown! You tuck it carefully into your detective pouch.`
        );
      });
    }

    // Close modal
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    // NPC Talk Buttons
    document.querySelectorAll('.talk-btn-mini').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const charKey = btn.dataset.character;
        this.handleTalkToCharacter(charKey);
      });
    });
  }

  handleTalkToCharacter(charKey) {
    if (charKey === 'dancers') {
      this.openBallroomDialog(
        'Camille & Luc',
        'Grand Waltz Dancers',
        '💃🕺',
        `“Oh hello, Detective! Are you enjoying the waltz? Excuse me, but earlier we saw Julian Vance the apprentice sneaking by the heavy velvet curtains, looking very nervous!”`
      );
    } else if (charKey === 'sasha') {
      this.openBallroomDialog(
        'Sasha Velvet',
        'Rival Prima Model',
        '🦚',
        `“Oh hello, darling! Looking for Madame Vivienne's missing centerpiece gown? Why would I steal it when my emerald silk gown already turns every head in the room? Look at my sleeves—not a single stray blue fiber!”`
      );
    } else if (charKey === 'baroness') {
      this.openBallroomDialog(
        'Baroness Camille',
        'Gala VIP Guest',
        '🎭',
        `“Good evening, Sleuth. The chandeliers are mesmerizing tonight. But I did see someone carrying a bulky bundle toward the curtain alcove right before the music began!”`
      );
    } else if (charKey === 'julian') {
      const actions = [];

      if (this.hasBallroomFabricClue) {
        actions.push({
          label: '🔍 Compare Fabric Scrap with Julian\'s Sleeves',
          isAccent: true,
          handler: () => {
            sounds.playClueChime();
            this.openBallroomDialog(
              'Julian Vance',
              'Tailor Apprentice (Busted!)',
              '🪡😱',
              `You pull out the sapphire velvet fabric scrap from your pouch and hold it against Julian's coat. His sleeves have the EXACT SAME sapphire threads and golden embroidery fibers! And behind the curtain, Madame Vivienne's stolen ball gown is stuffed inside his leather bag!`,
              [
                {
                  label: '🎯 Accuse Julian & Recover Stolen Gown!',
                  isAccent: true,
                  handler: () => {
                    this.solveBallroomCase();
                  }
                }
              ]
            );
          }
        });
      } else {
        actions.push({
          label: '👀 Ask about Madame Vivienne\'s Gown',
          handler: () => {
            alert('Julian sweats nervously: "I-I haven\'t seen any gown! Look for clues on the floor before you question me!"');
          }
        });
      }

      this.openBallroomDialog(
        'Julian Vance',
        'Tailor Apprentice',
        '🪡',
        `“Oh! Uh... hello Detective Belle! What brings you to this quiet corner near the curtains? I was just... admiring the ballroom drapes!”`,
        actions
      );
    }
  }

  openBallroomDialog(name, subtitle, icon, speech, customActions = []) {
    const modal = document.getElementById('ballroom-dialog-modal');
    const nameEl = document.getElementById('modal-char-name');
    const subEl = document.getElementById('modal-char-subtitle');
    const iconEl = document.getElementById('modal-char-icon');
    const speechEl = document.getElementById('modal-char-speech');
    const actionsContainer = document.getElementById('modal-char-actions');

    if (!modal) return;

    if (nameEl) nameEl.textContent = name;
    if (subEl) subEl.textContent = subtitle;
    if (iconEl) iconEl.textContent = icon;
    if (speechEl) speechEl.textContent = speech;

    if (actionsContainer) {
      actionsContainer.innerHTML = '';
      customActions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `dialog-action-btn ${action.isAccent ? 'accent' : ''}`;
        btn.textContent = action.label;
        btn.onclick = () => {
          action.handler();
        };
        actionsContainer.appendChild(btn);
      });
    }

    modal.classList.remove('hidden');
  }

  async solveBallroomCase() {
    sounds.playVictory();
    this.profile.stars += 300;
    await this.db.updateProfile({ stars: this.profile.stars });
    this.updateHeaderProfile();

    this.openBallroomDialog(
      'Madame Vivienne',
      'High Fashion Couturière (Delighted!)',
      '👑✨',
      `“Mon Dieu! You found my stolen centerpiece gown! Julian confessed everything! You are the greatest detective in Hauteville! Come, wear the recovered Sapphire Gown and take the runway!”`,
      [
        {
          label: '✨ Wear Gown & Walk The Runway! ✨',
          isAccent: true,
          handler: () => {
            // Equip the gala skirt and take runway!
            this.wardrobe.currentLook.bottoms = 'bottom-gala-skirt';
            this.wardrobe.currentLook.outerwear = 'coat-midnight-cape';
            this.updateAvatar();
            document.getElementById('ballroom-dialog-modal').classList.add('hidden');
            this.switchScene('runway');
          }
        }
      ]
    );
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

    const stats = this.wardrobe.calculateStats();
    const stealthVal = document.getElementById('stat-stealth');
    const glamourVal = document.getElementById('stat-glamour');
    const clueVal = document.getElementById('stat-clue');

    if (stealthVal) stealthVal.textContent = stats.stealth;
    if (glamourVal) glamourVal.textContent = stats.glamour;
    if (clueVal) clueVal.textContent = stats.clueBonus;
  }

  // ================= SCENE 4: RUNWAY SHOWDOWN =================
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
    if (walkBtn) walkBtn.disabled = true;

    runwayStage.classList.add('strut-active');
    sounds.playCameraFlash();

    setTimeout(() => sounds.playCameraFlash(), 600);
    setTimeout(() => sounds.playCameraFlash(), 1200);

    setTimeout(async () => {
      runwayStage.classList.remove('strut-active');
      if (walkBtn) walkBtn.disabled = false;

      const activeCase = MYSTERY_CASES[0];
      const stats = this.wardrobe.calculateStats();
      const evaluation = this.runway.evaluateLook(stats, activeCase, 'suspect-julian');

      sounds.playVictory();
      this.profile.stars += 200;
      await this.db.updateProfile({ stars: this.profile.stars });
      this.updateHeaderProfile();

      this.showRunwayResults(evaluation, activeCase);
    }, 2000);
  }

  showRunwayResults(evalResult, activeCase) {
    const verdictCard = document.getElementById('runway-verdict-card');
    if (!verdictCard) return;

    verdictCard.classList.remove('hidden');

    verdictCard.innerHTML = `
      <div class="verdict-banner success">
        <h3>🎉 Standing Ovation on the Runway!</h3>
        <p class="verdict-score-total">Runway Score: <strong>${evalResult.total} / 300 pts</strong></p>
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
        <p class="reward-notice">⭐ Runway Reward: +200 Stars Claimed!</p>
        <button id="close-verdict-btn" class="primary-btn">Return to Atelier</button>
      </div>
    `;

    document.getElementById('close-verdict-btn').onclick = () => {
      verdictCard.classList.add('hidden');
      this.switchScene('fp-shop');
    };
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
