// The Mystery Game Director 🎬
// Connects the 3D world, the random mystery, the talking windows, the detective notebook,
// and playing with friends.

import { World } from './world/world.js';
import { generateMystery, newSeed, meetsDressCode, traitText } from './mystery.js';
import { TRAITS } from './cases.js';
import { Multiplayer } from './multiplayer.js';
import { sounds } from './audio.js';
import { rankFor } from './ranks.js';

const AREA_NAMES = {
  office: '🏢 Your Detective Office',
  parking: '🚗 Gala Parking Lot',
  gala: '🏰 The Grand Gala Ballroom',
  garden: '🌷 The Secret Garden',
  plaza: '🎟️ Starlight Arena Plaza',
  arena: '🎤 Starlight Arena Concert',
  backstage: '🎸 Backstage'
};
const MAX_LIVES = 3;
const STARS_FOR_SOLVING = 300;

// tiny helper to build HTML safely (text is never treated as code)
function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

export class PlayController {
  constructor(game) {
    this.game = game;
    this.$ = (id) => document.getElementById(id);
    this.stage = this.$('world-stage');
    this.mystery = null;
    this.found = new Set();
    this.interviewed = new Set();
    this.lives = MAX_LIVES;
    this.accepted = false;
    this.doorApproved = false;
    this.solved = false;
    this.failed = false;
    this.started = false;
    this.dialogOpen = false;
    this.sendTimer = 0;

    this.world = new World(this.stage, {
      onTarget: (t) => this.showPrompt(t),
      onInteract: (t) => this.interact(t),
      onPortal: (kind) => this.travel(kind),
      onAreaChange: (area) => this.onAreaChange(area),
      onFrame: (dt) => this.onFrame(dt)
    });
    this.world.setPlayerLook(this.game.wardrobe.currentLook);
    this.world.setInputEnabled(false);

    this.mp = new Multiplayer({
      onPlayerJoin: (id, name, look, state) => {
        this.world.addRemotePlayer(id, name, look);
        if (state) this.world.updateRemotePlayer(id, state);
        this.toast(`👯 ${name} joined the game!`);
        sounds.playDoorBell();
        this.updateServerBadge();
      },
      onPlayerLeave: (id) => {
        this.world.removeRemotePlayer(id);
        this.toast('👋 A friend left the game.');
        this.updateServerBadge();
      },
      onPlayerState: (id, state) => this.world.updateRemotePlayer(id, state),
      onPlayerLook: (id, look) => this.world.setRemoteLook(id, look),
      onEvent: (id, event) => this.onFriendEvent(id, event),
      onDisconnected: () => {
        this.clearRemotes();
        this.toast('📴 The server closed. You are playing solo now.');
        this.updateServerBadge();
      }
    });
    this.mp.getHostSnapshot = () => ({ seed: this.mystery?.seed, found: [...this.found], solved: this.solved });

    this.setupMenus();
  }

  // ================= START MENU & SERVERS =================
  setupMenus() {
    const msg = this.$('start-menu-msg');
    const busy = (text) => { msg.textContent = text; msg.className = 'start-menu-msg'; };
    const oops = (text) => { msg.textContent = text; msg.className = 'start-menu-msg error'; };

    this.$('btn-play-solo').onclick = () => {
      this.startMystery(newSeed(), { fresh: true });
      this.enterGame();
    };

    this.$('btn-create-server').onclick = async () => {
      busy('✨ Creating your server...');
      try {
        const code = await this.mp.host(this.me());
        this.startMystery(newSeed(), { fresh: true });
        this.enterGame();
        this.updateServerBadge();
        this.toast(`🌐 Server ready! Tell your friend the code: ${code}`, 6000);
      } catch (e) {
        oops(e.message);
      }
    };

    const join = async () => {
      const code = this.$('join-code-input').value;
      if (code.trim().length < 5) return oops('Type the 5-letter code your friend sees on their screen!');
      busy('🔑 Looking for your friend\'s server...');
      try {
        const welcome = await this.mp.join(code, this.me());
        welcome.players.forEach(p => {
          this.world.addRemotePlayer(p.id, p.name, p.look);
          if (p.state) this.world.updateRemotePlayer(p.id, p.state);
        });
        this.startMystery(welcome.seed, { fresh: true, found: welcome.found, solved: welcome.solved });
        this.enterGame();
        this.updateServerBadge();
        this.toast('👯 You joined your friend\'s server! Solve the mystery together!', 5000);
      } catch (e) {
        oops(e.message);
      }
    };
    this.$('btn-join-server').onclick = join;
    this.$('join-code-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') join(); });

    this.$('btn-notebook').onclick = () => this.toggleNotebook();
    this.$('btn-view').onclick = () => { this.world.toggleView(); };
    this.$('hud-prompt').onclick = () => { if (this.world.target) this.interact(this.world.target); };
    this.$('btn-copy-code').onclick = () => {
      navigator.clipboard?.writeText(this.mp.code);
      this.toast('📋 Code copied!');
    };
    this.$('btn-leave-server').onclick = () => {
      this.mp.leave();
      this.clearRemotes();
      this.updateServerBadge();
      this.toast('You left the server. Playing solo now!');
    };

    window.addEventListener('keydown', (e) => {
      if (!this.world.running || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'KeyN' && this.started && !this.dialogOpen) this.toggleNotebook();
      if (e.code === 'Escape') {
        if (this.dialogOpen) this.closeDialog();
        if (!this.$('notebook-panel').classList.contains('hidden')) this.toggleNotebook();
      }
    });
  }

  me() {
    return { name: this.game.profile?.displayName || 'Detective', look: { ...this.game.wardrobe.currentLook }, state: this.world.getPlayerState() };
  }

  enterGame() {
    this.started = true;
    this.$('start-menu').classList.add('hidden');
    this.$('hud').classList.remove('hidden');
    this.world.setInputEnabled(true);
    sounds.playDoorBell();
    this.toast('🖱️ Hold the mouse button and drag to look around. Walk with W A S D or the arrows!', 6000);
  }

  clearRemotes() {
    [...this.world.remotes.keys()].forEach(id => this.world.removeRemotePlayer(id));
  }

  updateServerBadge() {
    const badge = this.$('hud-server');
    if (!this.mp.active) {
      badge.classList.add('hidden');
      return;
    }
    badge.classList.remove('hidden');
    this.$('hud-server-code').textContent = this.mp.code;
    this.$('hud-server-count').textContent = `${this.mp.playerCount} detective${this.mp.playerCount === 1 ? '' : 's'}`;
  }

  // ================= MYSTERY STATE =================
  startMystery(seed, { fresh = false, found = [], solved = false } = {}) {
    this.mystery = generateMystery(seed);
    this.found = new Set(found);
    this.interviewed = new Set();
    this.lives = MAX_LIVES;
    this.accepted = false;
    this.doorApproved = false;
    this.solved = solved;
    this.failed = false;
    this.world.loadMystery(this.mystery, this.found);
    this.world.showOfficePortal(false);
    this.world.setDoorOpen(false);
    if (fresh) this.world.teleport('office');
    this.onAreaChange(this.world.player.area);
    this.updateHUD();
  }

  requestNewMystery() {
    this.closeDialog();
    this.$('case-closed').classList.add('hidden');
    if (this.mp.active && !this.mp.isHost) {
      this.mp.sendEvent({ kind: 'request-new' });
      this.toast('📨 Asked the server host for a new mystery!');
      return;
    }
    const seed = newSeed();
    this.startMystery(seed, { fresh: true });
    if (this.mp.active) this.mp.sendEvent({ kind: 'new-mystery', seed });
    this.toast('🎲 A brand-new mystery is waiting at your desk!');
  }

  onFriendEvent(id, event) {
    const name = this.mp.nameOf(id);
    if (event.kind === 'clue' && this.mystery && !this.found.has(event.clueId)) {
      this.found.add(event.clueId);
      this.world.removeClue(event.clueId);
      const clue = this.mystery.clues.find(c => c.id === event.clueId);
      this.toast(`🔍 ${name} found a clue: ${clue?.icon} ${clue?.name}!`);
      sounds.playClueChime();
      this.updateHUD();
    } else if (event.kind === 'solved' && !this.solved) {
      this.closeDialog();
      this.markSolved();
      this.showCaseClosed(name);
    } else if (event.kind === 'new-mystery') {
      this.closeDialog();
      this.$('case-closed').classList.add('hidden');
      this.startMystery(event.seed, { fresh: true });
      this.toast(`🎲 ${name} started a brand-new mystery! Head to the desk!`, 5000);
    } else if (event.kind === 'request-new' && this.mp.isHost) {
      this.toast(`📨 ${name} wants a new mystery!`);
      this.requestNewMystery();
    }
  }

  async markSolved() {
    this.solved = true;
    sounds.playVictory();
    const profile = this.game.profile;
    const solvedCases = profile.solvedCases || [];
    if (!solvedCases.includes(this.mystery.seed)) {
      const rankBefore = rankFor(profile.stars);
      solvedCases.push(this.mystery.seed);
      profile.stars += STARS_FOR_SOLVING;
      const rankAfter = rankFor(profile.stars);
      if (rankAfter !== rankBefore) {
        setTimeout(() => {
          this.toast(`🏅 RANK UP! You are now a ${rankAfter.icon} ${rankAfter.name}!`, 6000);
          if (rankAfter.reward) this.toast('🎁 A RARE item is waiting for you! Click your rank at the top to claim it.', 7000);
        }, 1500);
      }
      profile.solvedCases = solvedCases;
      await this.game.db.updateProfile({ stars: profile.stars, solvedCases });
      this.game.updateHeaderProfile();
    }
    this.updateHUD();
  }

  // ================= TALKING & INSPECTING =================
  interact(target) {
    if (this.dialogOpen || !this.started) return;
    const m = this.mystery;
    switch (target.kind) {
      case 'client': return this.talkToClient();
      case 'mirror':
      case 'van':
        sounds.playEquip();
        this.game.openAtelierFromWorld();
        return;
      case 'guard': return this.talkToGuard(target.data.venue);
      case 'clue': return this.inspectClue(target.data);
      case 'suspect': return this.questionSuspect(target.data);
      case 'crowd':
        sounds.playEquip();
        return this.showDialog({ icon: target.data.icon, name: target.data.name, subtitle: target.data.subtitle, speech: `“${target.data.line}”` });
      case 'hider':
        sounds.playEquip();
        return this.showDialog({ icon: '🙈', name: target.data.name, subtitle: 'Hiding where nobody looks', speech: `“${target.data.line}”` });
    }
  }

  talkToClient() {
    const m = this.mystery;
    const c = m.client;
    sounds.playEquip();
    if (this.solved || this.failed) {
      return this.showDialog({
        icon: c.emoji, name: c.name, subtitle: c.role,
        speech: this.solved
          ? `“You did it, Detective! ${m.crime.fixed} You're the best detective in Hauteville!”`
          : '“Oh no, the culprit got away... but I know you\'ll catch the next one!”',
        actions: [{ label: '🎲 Start a brand-new mystery!', accent: true, onClick: () => this.requestNewMystery() }]
      });
    }
    if (this.accepted) {
      return this.showDialog({ icon: c.emoji, name: c.name, subtitle: c.role, speech: `“Hurry, Detective! Walk into the glowing magic portal and it will take you to ${m.venueInfo.name}!”` });
    }
    this.showDialog({
      icon: c.emoji, name: c.name, subtitle: c.role,
      speech: `“Detective, thank goodness you're here! ${m.briefing}”`,
      notice: `👗 Tonight's dress code at the ${m.venueInfo.place}: ${m.dressCodeInfo.label}`,
      actions: [
        {
          label: '💖 Yes! I\'ll take the case!', accent: true, onClick: () => {
            this.accepted = true;
            this.world.showOfficePortal(true);
            sounds.playClueChime();
            this.showDialog({ icon: c.emoji, name: c.name, subtitle: c.role, speech: `“Thank you, Detective! I opened a magic portal for you. Walk into it to travel to ${m.venueInfo.name}!”` });
            this.updateHUD();
          }
        },
        {
          label: '👋 Sorry, I\'m busy', onClick: () => this.showDialog({
            icon: c.emoji, name: c.name, subtitle: c.role,
            speech: '“Oh please, please reconsider! You\'re the only detective who can solve this!”',
            actions: [{ label: '💖 Okay, I\'ll help!', accent: true, onClick: () => { this.closeDialog(); this.talkToClient(); } }]
          })
        }
      ]
    });
  }

  talkToGuard(venue) {
    const m = this.mystery;
    const code = m.dressCodeInfo;
    const who = venue === 'gala' ? { icon: '🛡️', name: 'Gala Guard', subtitle: 'Front Door Security' } : { icon: '🎟️', name: 'Ticket Checker', subtitle: 'Starlight Arena Doors' };
    sounds.playEquip();
    if (venue !== m.venue) {
      return this.showDialog({ ...who, speech: `“Sorry, there's no event here tonight! Your case is at ${m.venueInfo.name}.”` });
    }
    if (this.doorApproved) {
      return this.showDialog({ ...who, speech: '“Welcome back! The doors are open for you. Have fun!”' });
    }
    if (!this.accepted) {
      return this.showDialog({ ...who, speech: '“Sorry, you need an invitation! Talk to your customer at the office desk first.”' });
    }
    if (meetsDressCode(this.game.wardrobe.currentLook, m.dressCode)) {
      this.doorApproved = true;
      this.world.setDoorOpen(true);
      sounds.playClueChime();
      this.updateHUD();
      return this.showDialog({
        ...who,
        speech: `“Ooh, what a look! That's perfect for tonight's ${code.label} dress code. Come right in, Detective!”`,
        notice: '🚪 The doors swing open!'
      });
    }
    this.showDialog({
      ...who,
      speech: `“Wait! Tonight's dress code is ${code.label}. You need at least 2 ${code.hint}.”`,
      notice: '👗 Visit the pink Pop-up Boutique van outside to change your outfit!',
      actions: [{ label: '👗 Go to the Pop-up Boutique now', accent: true, onClick: () => { this.closeDialog(); this.game.openAtelierFromWorld(); } }]
    });
  }

  inspectClue(clue) {
    if (this.found.has(clue.id)) return;
    this.found.add(clue.id);
    this.world.removeClue(clue.id);
    sounds.playClueChime();
    if (this.mp.active) this.mp.sendEvent({ kind: 'clue', clueId: clue.id });
    this.updateHUD();
    this.showDialog({
      icon: clue.icon, name: `Clue found: ${clue.name}`, subtitle: `Clue ${this.found.size} of ${this.mystery.clues.length}`,
      speech: clue.description,
      notice: '📓 Added to your Detective Notebook (press N). Find the suspect who matches!'
    });
  }

  suspectNotice(s) {
    const t = s.traits;
    return `👀 You notice: ${traitText('shoes', t.shoes)}, ${traitText('hat', t.hat)}, smells like ${traitText('scent', t.scent)}, and has ${traitText('sparkle', t.sparkle)} on their sleeve.`;
  }

  questionSuspect(s) {
    sounds.playEquip();
    this.interviewed.add(s.id);
    this.updateHUD();
    const actions = [];
    if (!this.solved && !this.failed) {
      actions.push({
        label: `🎯 Accuse ${s.name}!`, accent: true, onClick: () => this.accuse(s)
      });
    }
    this.showDialog({ icon: s.emoji, name: s.name, subtitle: s.role, speech: `“${s.alibi}”`, notice: this.suspectNotice(s), actions });
  }

  accuse(s) {
    if (this.found.size < 2) {
      return this.showDialog({ icon: '🔍', name: 'Not so fast, Detective!', subtitle: 'You need more evidence', speech: `Find at least 2 clues before you accuse anyone. You have found ${this.found.size} of ${this.mystery.clues.length}. Look for sparkly 🔍 spots around the ballroom and parking lot!` });
    }
    if (s.isGuilty) {
      this.markSolved();
      if (this.mp.active) this.mp.sendEvent({ kind: 'solved', suspectId: s.id });
      return this.showDialog({
        icon: `${s.emoji}😳`, name: `${s.name} confesses!`, subtitle: 'You caught the culprit!',
        speech: `“${this.mystery.confession}”`,
        actions: [{ label: '✨ Close the case!', accent: true, onClick: () => { this.closeDialog(); this.showCaseClosed(); } }]
      });
    }
    this.lives -= 1;
    sounds.playEquip();
    this.updateHUD();
    if (this.lives <= 0) {
      this.failed = true;
      this.updateHUD();
      const culprit = this.mystery.suspects.find(x => x.isGuilty);
      return this.showDialog({
        icon: '💨', name: 'The culprit escaped!', subtitle: 'Better luck next time',
        speech: `“${s.wrong}” While everyone was arguing, the real culprit, ${culprit.name}, slipped out the back door!`,
        notice: 'Tip: compare each clue with what you notice about each suspect. Only ONE suspect matches every clue!',
        actions: [{ label: '🎲 Try a new mystery', accent: true, onClick: () => this.requestNewMystery() }]
      });
    }
    this.showDialog({
      icon: `${s.emoji}😤`, name: s.name, subtitle: 'Wrong suspect!',
      speech: `“${s.wrong}”`,
      notice: `🔍 You have ${this.lives} accusation${this.lives === 1 ? '' : 's'} left. Check your notebook (N) and compare the clues!`
    });
  }

  // ================= THE BIG "CASE CLOSED" ENDING =================
  showCaseClosed(solverName = null) {
    const m = this.mystery;
    const culprit = m.suspects.find(x => x.isGuilty);
    const overlay = this.$('case-closed');
    this.world.setInputEnabled(false);
    this.$('cc-title').textContent = m.title;
    this.$('cc-solver').textContent = solverName ? `👯 ${solverName} cracked the case for your team!` : '🕵️ You cracked the case!';
    this.$('cc-culprit').textContent = `${culprit.emoji} The culprit was ${culprit.name}, the ${culprit.role}.`;
    this.$('cc-fixed').textContent = `${m.client.emoji} ${m.crime.fixed}`;
    this.$('cc-stars').textContent = `⭐ +${STARS_FOR_SOLVING} stars`;

    // confetti!
    const confetti = this.$('cc-confetti');
    confetti.replaceChildren();
    const colors = ['#FF4D8D', '#FFD700', '#00E5FF', '#8A4FFF', '#7CFFB2', '#FFFFFF'];
    for (let i = 0; i < 70; i++) {
      const piece = el('span', 'cc-piece');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 2.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.appendChild(piece);
    }

    overlay.classList.remove('hidden');
    overlay.classList.remove('play');
    void overlay.offsetWidth; // restart the stamp animation
    overlay.classList.add('play');
    sounds.playCaseClosed();

    this.$('cc-new').onclick = () => { overlay.classList.add('hidden'); this.requestNewMystery(); };
    this.$('cc-explore').onclick = () => { overlay.classList.add('hidden'); this.world.setInputEnabled(!this.dialogOpen); };
  }

  // ================= TRAVEL =================
  travel(kind) {
    const overlay = this.$('teleport-swirl-overlay');
    const text = this.$('teleport-countdown-text');
    this.world.setInputEnabled(false);
    overlay.classList.remove('hidden');
    sounds.playTeleportSwirl();
    const arrive = this.mystery.venue === 'concert' ? '🎤 Landing outside the Starlight Arena... 2...' : '🚗 Landing in the Gala parking lot... 2...';
    const steps = kind === 'to-venue'
      ? ['🌟 Stepping into the magic portal...', '✨ Swirling through the night sky... 3...', arrive, '💎 Here we are! 1...']
      : ['🌟 Stepping into the magic portal...', '✨ Zooming back across Hauteville... 2...', '🏢 Home sweet office! 1...'];
    steps.forEach((s, i) => setTimeout(() => { text.textContent = s; }, i * 800));
    setTimeout(() => {
      this.world.teleport(kind === 'to-venue' ? this.mystery.venue : 'office');
      overlay.classList.add('hidden');
      this.world.setInputEnabled(!this.dialogOpen);
    }, steps.length * 800);
  }

  onAreaChange(area) {
    this.$('hud-area').textContent = AREA_NAMES[area];
    this.updateHUD();
  }

  // ================= HUD =================
  objective() {
    const m = this.mystery;
    if (!m) return '';
    if (this.solved) return '🎉 Case closed! Go back to the office desk for a new mystery, or keep exploring.';
    if (this.failed) return '💨 The culprit escaped... Go back to the office desk for a new mystery.';
    if (!this.accepted) return `Walk to ${m.client.name}'s desk and press E to talk.`;
    const area = this.world.player.area;
    if (area === 'office') return '✨ Walk into the glowing magic portal!';
    const here = m.venue === 'concert' ? ['plaza', 'arena', 'backstage'] : ['parking', 'gala', 'garden'];
    if (!here.includes(area)) return `✨ Wrong place! Your case is at ${m.venueInfo.name}. Take the portal back to the office.`;
    if (!this.doorApproved) return `${m.venue === 'gala' ? '🛡️ Talk to the guard at the gala doors' : '🎟️ Talk to the ticket checker at the arena doors'}. Dress code: ${m.dressCodeInfo.label}`;
    return `🔍 Find clues (${this.found.size}/${m.clues.length}) and question suspects. Then accuse the culprit!`;
  }

  updateHUD() {
    if (!this.mystery) return;
    this.$('hud-case-title').textContent = `📁 ${this.mystery.title}`;
    this.$('hud-objective').textContent = this.objective();
    this.$('hud-lives').textContent = this.accepted ? `Accusations left: ${'🔍'.repeat(Math.max(0, this.lives))}${'▫️'.repeat(MAX_LIVES - Math.max(0, this.lives))}` : '';
    if (!this.$('notebook-panel').classList.contains('hidden')) this.renderNotebook();
  }

  showPrompt(target) {
    const prompt = this.$('hud-prompt');
    if (!target || !this.started) {
      prompt.classList.add('hidden');
      return;
    }
    prompt.textContent = `Press E to ${target.label}`;
    prompt.classList.remove('hidden');
  }

  toast(text, ms = 3500) {
    const t = this.$('world-toast');
    const item = el('div', 'toast-item', text);
    t.appendChild(item);
    setTimeout(() => item.classList.add('fade'), ms - 400);
    setTimeout(() => item.remove(), ms);
  }

  // ================= DIALOG WINDOW =================
  showDialog({ icon, name, subtitle, speech, notice, actions = [] }) {
    this.dialogOpen = true;
    this.world.setInputEnabled(false);
    this.$('world-dialog-icon').textContent = icon;
    this.$('world-dialog-name').textContent = name;
    this.$('world-dialog-subtitle').textContent = subtitle || '';
    this.$('world-dialog-speech').textContent = speech;
    const noticeEl = this.$('world-dialog-notice');
    noticeEl.textContent = notice || '';
    noticeEl.classList.toggle('hidden', !notice);
    const box = this.$('world-dialog-actions');
    box.replaceChildren();
    [...actions, { label: actions.length ? 'Leave' : 'Okay!', onClick: () => this.closeDialog() }].forEach(a => {
      const b = el('button', `dialog-action-btn ${a.accent ? 'accent' : ''}`, a.label);
      b.onclick = a.onClick;
      box.appendChild(b);
    });
    this.$('world-dialog').classList.remove('hidden');
  }

  closeDialog() {
    if (!this.dialogOpen) return;
    this.dialogOpen = false;
    this.$('world-dialog').classList.add('hidden');
    this.world.setInputEnabled(true);
  }

  // ================= DETECTIVE NOTEBOOK =================
  toggleNotebook() {
    const panel = this.$('notebook-panel');
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !opening);
    if (opening) this.renderNotebook();
  }

  renderNotebook() {
    const m = this.mystery;
    const panel = this.$('notebook-body');
    panel.replaceChildren();

    const header = el('div', 'nb-section');
    header.append(
      el('h4', null, `📁 ${m.title}`),
      el('p', null, `Customer: ${m.client.emoji} ${m.client.name} (${m.client.role})`),
      el('p', null, `What happened: ${m.crime.emoji} ${m.crime.says}`),
      el('p', null, `Where: 📍 ${m.venueInfo.place}`),
      el('p', null, `Dress code: 👗 ${m.dressCodeInfo.label}`)
    );
    panel.appendChild(header);

    const clues = el('div', 'nb-section');
    clues.appendChild(el('h4', null, `🔍 Clues (${this.found.size}/${m.clues.length})`));
    m.clues.forEach(c => {
      if (this.found.has(c.id)) {
        const row = el('div', 'nb-clue');
        row.append(el('span', 'nb-icon', c.icon), el('div', null, null));
        row.lastChild.append(el('strong', null, c.name), el('p', null, c.description));
        clues.appendChild(row);
      } else {
        clues.appendChild(el('div', 'nb-clue missing', '❔ Not found yet... look for a sparkly 🔍 spot!'));
      }
    });
    panel.appendChild(clues);

    const sus = el('div', 'nb-section');
    sus.appendChild(el('h4', null, '🕵️ Suspects'));
    sus.appendChild(el('p', 'nb-tip', 'Talk to each suspect to notice details. ✅ = matches a clue you found. The culprit matches EVERY clue!'));
    const foundClues = m.clues.filter(c => this.found.has(c.id));
    m.suspects.forEach(s => {
      const card = el('div', 'nb-suspect');
      card.appendChild(el('strong', null, `${s.emoji} ${s.name}`));
      card.appendChild(el('span', 'nb-role', s.role));
      if (!this.interviewed.has(s.id)) {
        card.appendChild(el('p', 'nb-unknown', 'Not questioned yet. Find them and press E!'));
      } else {
        const list = el('ul', 'nb-traits');
        Object.keys(TRAITS).forEach(key => {
          const clue = foundClues.find(c => c.trait === key);
          const mark = !clue ? '•' : (clue.value === s.traits[key] ? '✅' : '❌');
          list.appendChild(el('li', null, `${mark} ${TRAITS[key].label}: ${traitText(key, s.traits[key])}`));
        });
        card.appendChild(list);
      }
      sus.appendChild(card);
    });
    panel.appendChild(sus);
  }

  // ================= EVERY FRAME =================
  onFrame(dt) {
    if (!this.mp.active) return;
    this.sendTimer += dt;
    if (this.sendTimer > 0.1) {
      this.sendTimer = 0;
      this.mp.sendState(this.world.getPlayerState());
    }
  }

  // called by game.js when the outfit changes
  onLookChanged(look) {
    this.world.setPlayerLook(look);
    if (this.mp.active) this.mp.sendLook({ ...look });
  }

  // called by game.js when switching tabs
  setVisible(visible) {
    if (visible) {
      this.world.start();
      this.world.resize();
    } else {
      this.world.stop();
      this.closeDialog();
    }
    if (visible && this.started) this.world.setInputEnabled(!this.dialogOpen);
    if (visible && !this.started) this.world.setInputEnabled(false);
  }
}
