// Runway Showdown Engine with Catwalk, Judges and Accusation Climax

export class RunwayEngine {
  constructor(game) {
    this.game = game;
  }

  evaluateLook(lookStats, activeCase, accusedSuspectId) {
    const isGuilty = activeCase.suspects.find(s => s.id === accusedSuspectId)?.isGuilty;

    // Judge 1: Madame Vivienne (Fashion & Harmony)
    let vivienneScore = 50 + Math.min(45, Math.floor(lookStats.glamour * 0.45));
    let vivienneComment = '“Magnifique silhouette, darling! The tailoring turns heads!”';
    if (lookStats.glamour < 40) {
      vivienneScore = 65;
      vivienneComment = '“A bit rugged for Hauteville Fashion Week, but with bold attitude!”';
    } else if (lookStats.glamour > 80) {
      vivienneScore = 98;
      vivienneComment = '“Pure perfection! This look belongs on the cover of Runway Gazette!”';
    }

    // Judge 2: Inspector Pierre (Deduction & Case Accuracy)
    let pierreScore = 40;
    let pierreComment = '';
    if (isGuilty) {
      pierreScore = 95 + Math.min(5, Math.floor(lookStats.clueBonus * 0.2));
      pierreComment = '“Exceptional deductive reasoning! Your evidence is airtight, Detective!”';
    } else {
      pierreScore = 35;
      pierreComment = '“Halt! The evidence points elsewhere. We almost arrested an innocent fashionista!”';
    }

    // Judge 3: Zephyr (Trendsetter Vibe)
    let zephyrScore = 70 + Math.min(25, Math.floor((lookStats.stealth + lookStats.glamour) * 0.15));
    let zephyrComment = '“Total aesthetic excellence! The suspense combined with chic style is viral!”';

    const total = Math.min(300, vivienneScore + pierreScore + zephyrScore);
    const passed = isGuilty && total >= 180;

    return {
      passed,
      total,
      isGuilty,
      judges: [
        { name: 'Madame Vivienne', title: 'Couture Critic', score: vivienneScore, comment: vivienneComment, avatar: '👑' },
        { name: 'Inspector Pierre', title: 'Chief Sleuth', score: pierreScore, comment: pierreComment, avatar: '🕵️‍♂️' },
        { name: 'Zephyr', title: 'Trendsetter', score: zephyrScore, comment: zephyrComment, avatar: '⚡' }
      ]
    };
  }
}
