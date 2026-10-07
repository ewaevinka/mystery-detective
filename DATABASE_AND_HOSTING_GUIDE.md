# 🌐 Mystery Runway: Database & Web Hosting Guide

This guide explains how to put **Mystery Runway & Detective Atelier** on the web so friends, family, and players around the world can play it online, compete in runway contests, and vote on outfits!

---

## 🗄️ Part 1: How Data Storage Works in the Game

### Level 1: Local Storage (Active Right Now! ✅)
- **Status:** Already built and working! Zero configuration needed.
- **What it does:** Saves player profiles, earned stars, unlocked cases, and saved closet outfits directly in the player's web browser (`localStorage`).
- **Outfit Sharing:** Players can click **"Share Code"** in the Atelier to generate a secret text code (like Roblox or Dress to Impress). Friends can click **"Import Code"** in their own browser to instantly wear that exact look!

---

## ☁️ Part 2: Online Multiplayer & Cloud Database (Supabase)

When you're ready for players on different computers to:
1. Submit outfits into a shared public runway contest.
2. Vote on each other's outfits in real-time.
3. Have a global leaderboard.

### Step 1: Create a Free Supabase Account
1. Go to **[https://supabase.com](https://supabase.com)** and click **Sign Up** (it's 100% free).
2. Click **New Project** and name it `detective-fashion`.

### Step 2: Run this SQL Script
Open the **SQL Editor** tab in Supabase and paste this script:

```sql
-- 1. Table for Online Runway Contest Entries
CREATE TABLE contest_entries (
  id TEXT PRIMARY KEY,
  creator TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  stars INT DEFAULT 100,
  votes INT DEFAULT 0,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Public Read & Insert (Row Level Security)
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contest entries"
ON contest_entries FOR SELECT USING (true);

CREATE POLICY "Anyone can submit contest entries"
ON contest_entries FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can vote on entries"
ON contest_entries FOR UPDATE USING (true);
```

### Step 3: Connect It in `js/database.js`
Open `js/database.js` and update `CLOUD_CONFIG`:
```javascript
export const CLOUD_CONFIG = {
  enabled: true, // Turn on cloud sync!
  supabaseUrl: 'https://YOUR_PROJECT_ID.supabase.co',
  supabaseAnonKey: 'YOUR_ANON_PUBLIC_KEY'
};
```
And add the Supabase CDN script in `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
That's it! All player contest submissions and votes will now synchronize across the internet in real-time!

---

## 🚀 Part 3: Publishing the Website Online for Free

### Option A: GitHub Pages (Recommended & 100% Free)
1. Initialize a git repository if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial launch of Mystery Runway & Detective Atelier"
   ```
2. Create a new repository on [GitHub.com](https://github.com) named `detective-fashion`.
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/detective-fashion.git
   git branch -M main
   git push -u origin main
   ```
4. In your GitHub repo settings, go to **Settings &rarr; Pages** and select the **main branch**.
5. Your game is now live at:  
   `https://YOUR_USERNAME.github.io/detective-fashion`!

### Option B: Netlify Drop (Instant Drag-and-Drop)
1. Go to **[https://app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the `detective_fashion` folder into the browser window.
3. In 5 seconds, Netlify generates a free live URL (e.g. `https://mystery-runway.netlify.app`) that anyone can play on mobile, tablet, or desktop!
