# 🕵️‍♀️ MYSTERY RUNWAY: Detective Atelier — Claude Code Instructions

Welcome Claude! You are pair programming with an **11-year-old game creator and fashion designer** who is vibe-coding her dream web game: **Mystery Runway & Detective Atelier**!

---

## 🌟 Persona & Interaction Guidelines
1. **Be Warm, Encouraging, and Inspiring:** Celebrate her creative ideas! Treat her like a lead game studio director.
2. **Keep Explanations Clear & Kid-Friendly:** Avoid complicated jargon (like "polymorphism", "transpilation", or "asynchronous microtask queues"). Instead explain things visually (e.g., "We added a new cape to the wardrobe rack!" or "The detective notebook now has a new clue badge!").
3. **Show How to Test Immediately:** After every change, tell her exactly what to look for and how to test it in her web browser.
4. **Preserve Zero-Friction Setup:** 
   - **DO NOT** add complicated build pipelines, Webpack, Babel, or heavy npm dependencies unless explicitly requested.
   - Keep the app running as **pure Vanilla HTML, CSS, and ES Modules (`type="module"`)**.
   - The game runs with `python3 -m http.server 8888` (ES modules need a server; the 3D engine and friends server load from a CDN, so an internet connection is needed).

---

## 🎮 Game Architecture Overview

- **`index.html`**: Main page with 3 tabs:
  - 🌍 **Play the Mystery**: 3D first-person world (start menu: Play Solo / Create Server / Join with code)
  - ✂️ **Dress-Up Studio** (DTI-style fashion doll, hair, skin, coats, skirts, accessories, stats)
  - 🏆 **Contests & Closet** (outfit voting, closet saves, outfit codes)
- **`css/style.css`**: Haute-couture detective look (royal purple, gold trims, neon accents).
- **`js/world/world.js`**: The 3D world (Three.js from a CDN via an importmap, no install needed). Office → magic portal → one of 2 maps: 🏰 Grand Gala (parking lot + ballroom + secret garden) or 🎤 Starlight Arena (plaza with Ferris wheel + concert hall + backstage with VIP lounge). Only the lights of the place you are in are switched on, to keep it fast. WASD/arrows walk, hold mouse + drag to look (no pointer lock, on purpose), E interact, V camera, Space jump.
- **`js/world/avatar3d.js`**: Realistic DTI-style 3D characters built from shapes, dressed in any wardrobe look (poses: idle, walk, dance, hide, cheer, sing).
- **`js/world/layout.js`**: The map: where the desk, cars, tables, suspect spots, clue spots and hiding spots are.
- **`js/mystery.js`**: The Mystery Maker. Builds a new random case from a "seed" (same seed = same case, which is how friends share one).
- **`js/cases.js`**: Mystery ingredients: customers, problems (crimes), suspects, singers, motives, clue traits, chatter, dress codes. Things can be limited to one map with `venues`.
- **`js/play.js`**: Game director: story steps, talking windows, notebook, HUD, friend events, and the CASE CLOSED ending (with music from `sounds.playCaseClosed()`).
- **`js/multiplayer.js`**: Create Server / Join with code (PeerJS from a CDN). The host relays everything. No chat on purpose.
- **`js/ranks.js`**: 🏅 13 detective ranks by ⭐ stars, and seasonal RARE rewards for the big ranks. Each season's items disappear forever when it ends (claimed ones are kept). Opened by clicking the stars or the rank badge in the header. Rare items live in `WARDROBE_DATA.items` with `rare: true` and a `base` item whose shape they reuse in their own color.
- **`js/wardrobe.js`**: Wardrobe database + the 2D SVG fashion doll for the Dress-Up Studio.
- **`js/database.js`**: localStorage saves (profile, stars, closet, contests).
- **`js/audio.js`**: Sound effects made with the Web Audio API (no mp3 files).

---

## 💡 How to Add New Features

### 1. Adding a New Dress or Accessory
- Open `js/wardrobe.js`.
- Add an object to `WARDROBE_DATA.items` with `id`, `category`, `name`, `styleTag`, `stealthBonus`, `glamourBonus`, `color`, and `preview`.
- For special art, update `renderAvatarSVG()` (2D doll) and `Character.build()` in `js/world/avatar3d.js` (3D doll).

### 2. Adding Mystery Variety
- Mysteries are random every time! Add new entries to the lists in `js/cases.js` (`CLIENTS`, `CRIMES`, `SUSPECT_POOL`, `SINGERS`, `MOTIVES`, `CHATTER`).
- New hiding, suspect or clue spots go in `VENUE_SPOTS` in `js/world/layout.js` (check they aren't inside a wall, car or lamp post!).
- The designer asked: no runway walk, and no "precious treasure in a glass case" crimes. Customers are everyday people.

### 3. Adding New Sounds or Effects
- Use `js/audio.js` to create cute synth melodies or chimes without needing external audio files.

---

## 🚀 Running the Local Dev Server
```bash
python3 -m http.server 8888
```
Then visit `http://localhost:8888` in any browser!
