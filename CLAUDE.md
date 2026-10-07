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
   - The game works simply by opening `index.html` or running `python3 -m http.server 8888`.

---

## 🎮 Game Architecture Overview

- **`index.html`**: Main game view with 4 core tabs:
  - ✂️ **The Atelier** (Dress-up doll, hair, skin, coats, skirts, accessories, detective stats)
  - 📂 **Case Files** (Mystery cases, client briefings, clue magnifier inspection, suspect interrogation)
  - 🌟 **The Runway** (Catwalk walk, camera flashes, 3 celebrity judges' scoreboards)
  - 🏆 **Contests & Closet** (Community outfit voting, closet saves, outfit codes)
- **`css/style.css`**: Modern haute-couture detective aesthetic (royal purple, gold trims, glowing neon accents, responsive layout).
- **`js/wardrobe.js`**: SVG layered doll engine and wardrobe database (hair, skin, tops, skirts, coats, shoes, hats, detective magnifying glass).
- **`js/cases.js`**: Mystery cases, client stories, clues, suspects, alibis, and confessions.
- **`js/runway.js`**: Runway scoring algorithms and judge personality dialogues (Madame Vivienne, Inspector Pierre, Zephyr).
- **`js/database.js`**: Storage engine. Supports instant `localStorage` (works offline with zero setup) and is ready for cloud multiplayer (Supabase/Firebase).
- **`js/audio.js`**: Built-in sound effects using the Web Audio API (camera flashes, equip chimes, clue victory tunes) — no external mp3 files needed!

---

## 💡 How to Add New Features

### 1. Adding a New Dress or Accessory
- Open `js/wardrobe.js`.
- Add an object to `WARDROBE_DATA.items` with `id`, `category`, `name`, `styleTag`, `stealthBonus`, `glamourBonus`, `color`, and `preview`.
- If it has special visual art, update `renderAvatarSVG()` in `js/wardrobe.js`.

### 2. Adding a New Mystery Case
- Open `js/cases.js`.
- Add a new case object to `MYSTERY_CASES` with `title`, `client`, `briefing`, `objective`, `clues`, and `suspects` (marking one with `isGuilty: true`).

### 3. Adding New Sounds or Runway Effects
- Use `js/audio.js` to create cute synth melodies or chimes without needing external audio files.

---

## 🚀 Running the Local Dev Server
```bash
python3 -m http.server 8888
```
Then visit `http://localhost:8888` in any browser!
