// Play With Friends! 👯
// "Create Server" makes a 5-letter code. Friends type that code to join your game.
// Uses PeerJS (loaded in index.html) so browsers can talk straight to each other.
// The person who creates the server is the "host": every message goes through them.
// No chat on purpose: friends can only see each other walk around and solve the case together.

const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PREFIX = 'mystery-runway-atelier-';
export const MAX_PLAYERS = 8;

function makeCode() {
  let code = '';
  for (let i = 0; i < 5; i++) code += CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)];
  return code;
}

export class Multiplayer {
  // handlers: onPlayerJoin(id, name, look), onPlayerLeave(id), onPlayerState(id, state),
  //           onPlayerLook(id, look), onEvent(fromId, event), onWelcome(data), onDisconnected()
  constructor(handlers) {
    this.handlers = handlers;
    this.peer = null;
    this.isHost = false;
    this.code = null;
    this.connections = new Map(); // host: playerId -> connection
    this.hostConn = null;         // guest: connection to host
    this.players = new Map();     // everyone else: id -> { name, look, state }
    this.getHostSnapshot = () => ({});
  }

  get active() {
    return !!this.peer;
  }

  get playerCount() {
    return this.players.size + 1;
  }

  ensurePeerJS() {
    if (!window.Peer) throw new Error('The friends server needs the internet. Check your connection and refresh!');
  }

  host(me) {
    this.ensurePeerJS();
    return new Promise((resolve, reject) => {
      const tryCode = (attempt) => {
        const code = makeCode();
        const peer = new window.Peer(PREFIX + code);
        peer.on('open', () => {
          this.peer = peer;
          this.isHost = true;
          this.code = code;
          this.me = me;
          resolve(code);
        });
        peer.on('connection', (conn) => this.acceptGuest(conn));
        peer.on('error', (err) => {
          if (err.type === 'unavailable-id' && attempt < 5) {
            peer.destroy();
            tryCode(attempt + 1);
          } else if (!this.peer) {
            reject(new Error('Could not create a server right now. Try again in a moment!'));
          }
        });
        peer.on('disconnected', () => peer.reconnect?.());
      };
      tryCode(0);
    });
  }

  join(code, me) {
    this.ensurePeerJS();
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return new Promise((resolve, reject) => {
      const peer = new window.Peer();
      let settled = false;
      const fail = (msg) => {
        if (settled) return;
        settled = true;
        peer.destroy();
        reject(new Error(msg));
      };
      setTimeout(() => fail('No server answered. Double-check the code!'), 12000);
      peer.on('error', (err) => {
        if (err.type === 'peer-unavailable') fail(`There is no server with the code ${clean}. Double-check it!`);
        else if (!settled) fail('Could not connect right now. Try again in a moment!');
      });
      peer.on('open', () => {
        const conn = peer.connect(PREFIX + clean, { reliable: true });
        conn.on('open', () => {
          conn.send({ type: 'hello', name: me.name, look: me.look, state: me.state });
        });
        conn.on('data', (msg) => {
          if (msg.type === 'full') return fail('That server is full! (8 detectives max)');
          if (msg.type === 'welcome' && !settled) {
            settled = true;
            this.peer = peer;
            this.isHost = false;
            this.code = clean;
            this.hostConn = conn;
            this.myId = msg.yourId;
            msg.players.forEach(p => this.players.set(p.id, p));
            resolve(msg);
            return;
          }
          this.handleFromHost(msg);
        });
        conn.on('close', () => {
          if (settled && this.peer) {
            this.reset();
            this.handlers.onDisconnected?.();
          }
        });
      });
    });
  }

  // ---------- HOST SIDE ----------
  acceptGuest(conn) {
    const id = conn.peer;
    conn.on('data', (msg) => {
      if (msg.type === 'hello') {
        if (this.players.size + 1 >= MAX_PLAYERS) {
          conn.send({ type: 'full' });
          setTimeout(() => conn.close(), 500);
          return;
        }
        const name = String(msg.name || 'Detective').slice(0, 25);
        const player = { id, name, look: msg.look, state: msg.state };
        const others = [
          { id: 'host', name: this.me.name, look: this.me.look, state: this.me.state },
          ...[...this.players.values()]
        ];
        this.connections.set(id, conn);
        this.players.set(id, player);
        conn.send({ type: 'welcome', yourId: id, players: others, ...this.getHostSnapshot() });
        this.broadcast({ type: 'join', id, name, look: msg.look, state: msg.state }, id);
        this.handlers.onPlayerJoin?.(id, name, msg.look, msg.state);
        return;
      }
      if (!this.players.has(id)) return;
      this.handleGuestMessage(id, msg);
    });
    conn.on('close', () => this.dropGuest(id));
    conn.on('error', () => this.dropGuest(id));
  }

  dropGuest(id) {
    if (!this.players.has(id)) return;
    this.players.delete(id);
    this.connections.delete(id);
    this.broadcast({ type: 'leave', id });
    this.handlers.onPlayerLeave?.(id);
  }

  handleGuestMessage(id, msg) {
    if (msg.type === 'state') {
      this.players.get(id).state = msg.state;
      this.broadcast({ type: 'state', id, state: msg.state }, id);
      this.handlers.onPlayerState?.(id, msg.state);
    } else if (msg.type === 'look') {
      this.players.get(id).look = msg.look;
      this.broadcast({ type: 'look', id, look: msg.look }, id);
      this.handlers.onPlayerLook?.(id, msg.look);
    } else if (msg.type === 'event') {
      this.broadcast({ type: 'event', id, event: msg.event }, id);
      this.handlers.onEvent?.(id, msg.event);
    }
  }

  broadcast(msg, exceptId = null) {
    for (const [id, conn] of this.connections) {
      if (id !== exceptId && conn.open) conn.send(msg);
    }
  }

  // ---------- GUEST SIDE ----------
  handleFromHost(msg) {
    const { id } = msg;
    if (msg.type === 'join') {
      this.players.set(id, { id, name: msg.name, look: msg.look, state: msg.state });
      this.handlers.onPlayerJoin?.(id, msg.name, msg.look, msg.state);
    } else if (msg.type === 'leave') {
      this.players.delete(id);
      this.handlers.onPlayerLeave?.(id);
    } else if (msg.type === 'state') {
      this.handlers.onPlayerState?.(id, msg.state);
    } else if (msg.type === 'look') {
      this.handlers.onPlayerLook?.(id, msg.look);
    } else if (msg.type === 'event') {
      this.handlers.onEvent?.(id, msg.event);
    }
  }

  // ---------- SENDING (both sides) ----------
  send(msg) {
    if (!this.peer) return;
    if (this.isHost) {
      // the host IS the server: tell everybody, labelled as coming from 'host'
      this.broadcast({ ...msg, id: 'host' });
    } else if (this.hostConn?.open) {
      this.hostConn.send(msg);
    }
  }

  sendState(state) {
    if (this.isHost && this.me) this.me.state = state;
    this.send({ type: 'state', state });
  }

  sendLook(look) {
    if (this.isHost && this.me) this.me.look = look;
    this.send({ type: 'look', look });
  }

  sendEvent(event) {
    this.send({ type: 'event', event });
  }

  nameOf(id) {
    if (id === 'host' && this.isHost) return this.me?.name;
    return this.players.get(id)?.name || 'A friend';
  }

  reset() {
    this.connections.clear();
    this.players.clear();
    this.hostConn = null;
    this.peer = null;
    this.isHost = false;
    this.code = null;
  }

  leave() {
    const peer = this.peer;
    this.reset();
    peer?.destroy();
  }
}
