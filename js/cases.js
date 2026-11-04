// Mystery Ingredients for Detective Atelier
// Every time you play, js/mystery.js mixes these together into a BRAND NEW case:
// a random customer, a random problem, a random place, 4 suspects and one secret culprit!
// Want more variety? Just add new entries to any list below.
// `venues` says where something can happen: 'gala' (Grand Gala Ballroom) or 'concert' (Starlight Arena).
// No `venues` means it can happen anywhere.

export const VENUES = {
  gala: { name: 'the Grand Gala', place: 'Grand Gala Ballroom' },
  concert: { name: 'the Starlight Arena concert', place: 'Starlight Arena' }
};

// Customers who walk into your office asking for help
export const CLIENTS = [
  { name: 'Mia', role: 'Ballet Dancer', emoji: '🩰' },
  { name: 'Mr. Okafor', role: 'Head Waiter', emoji: '🍽️' },
  { name: 'Grandma Rosa', role: 'Proud Grandma', emoji: '👵' },
  { name: 'Tasha', role: 'Hair Stylist', emoji: '💇‍♀️' },
  { name: 'Chef Antoine', role: 'Pastry Chef', emoji: '👨‍🍳' },
  { name: 'Nina', role: 'Photographer', emoji: '📷' },
  { name: 'Ellie', role: 'Florist', emoji: '💐' },
  { name: 'Sofia', role: 'Fashion Student', emoji: '🧵' },
  { name: 'Benny', role: 'Party Planner', emoji: '🎈' },
  { name: 'Kai', role: 'Skateboarder', emoji: '🛹' },
  { name: 'Aunt Lulu', role: 'Cat Lover', emoji: '🐱' },
  { name: 'Madame Vivienne', role: 'Fashion Designer', emoji: '👑' },
  { name: 'Marcus', role: 'Band Guitarist', emoji: '🎸', venues: ['concert'] },
  { name: 'Zoe', role: 'Backup Dancer', emoji: '💃', venues: ['concert'] },
  { name: 'Sam', role: 'Sound Engineer', emoji: '🎧', venues: ['concert'] },
  { name: 'Priya', role: 'Biggest Fan', emoji: '💖', venues: ['concert'] }
];

// The problems! `says` is what the customer tells you, `did` is what the culprit confesses,
// `fixed` is the happy ending.
export const CRIMES = [
  { title: 'The Missing Lucky Bracelet', emoji: '📿',
    says: 'Someone took my lucky charm bracelet',
    did: 'took the lucky bracelet', fixed: 'The lucky bracelet is back where it belongs!' },
  { title: 'The Grape Juice Disaster', emoji: '🍇',
    says: 'Someone spilled grape juice all over my brand-new outfit, and it was NOT an accident',
    did: 'spilled the grape juice on purpose', fixed: 'The outfit got cleaned and looks brand new!' },
  { title: 'The Great Hamster Escape', emoji: '🐹',
    says: 'Someone let my hamster Biscuit out of his travel cage and hid him',
    did: 'hid Biscuit the hamster in a cupcake box', fixed: 'Biscuit is safe and munching a sunflower seed!' },
  { title: 'The Clown Shoe Switcheroo', emoji: '🤡',
    says: 'Someone swapped my fancy shoes with giant squeaky clown shoes',
    did: 'swapped the shoes for clown shoes', fixed: 'The fancy shoes are back, and the clown shoes went to the circus!' },
  { title: 'The Missing VIP Ticket', emoji: '🎟️',
    says: 'Someone took my golden VIP ticket right out of my bag',
    did: 'took the golden VIP ticket', fixed: 'The golden ticket is safe in its owner\'s bag again!' },
  { title: 'The Secret Sketchbook Mystery', emoji: '📓', venues: ['gala'],
    says: 'Someone took my secret design sketchbook with all my new dress ideas',
    did: 'took the sketchbook to peek at the designs', fixed: 'The sketchbook is back, and every design is still a secret!' },
  { title: 'The Cake Catastrophe', emoji: '🎂', venues: ['gala'],
    says: 'Someone took a giant bite out of the party cake before anyone could see it',
    did: 'took a bite of the cake', fixed: 'The chef fixed the cake with extra frosting. It looks even better!' },
  { title: 'The Snipped Guitar Strings', emoji: '🎸', venues: ['concert'],
    says: 'Someone snipped the strings on the band\'s guitar right before the show',
    did: 'snipped the guitar strings', fixed: 'The guitar got shiny new strings and the show goes on!' },
  { title: 'The Vanishing Golden Microphone', emoji: '🎤', venues: ['concert'],
    says: 'Someone hid the singer\'s golden microphone',
    did: 'hid the golden microphone', fixed: 'The golden microphone is back on stage, sparkling!' },
  { title: 'The Scrambled Song List', emoji: '📝', venues: ['concert'],
    says: 'Someone scrambled the song list, and now the band is playing everything in the wrong order',
    did: 'scrambled the song list', fixed: 'The song list is fixed and the crowd is singing along!' },
  { title: 'The Pink Glitter Prank', emoji: '✨', venues: ['concert'],
    says: 'Someone filled the dressing room with a giant cloud of pink glitter',
    did: 'set off the glitter cloud', fixed: 'The dressing room is clean again (well... mostly)!' }
];

// Each suspect has an alibi (what they say) and a line if you wrongly accuse them.
export const SUSPECT_POOL = [
  { name: 'Sasha Velvet', role: 'Rival Model', emoji: '🦚',
    alibi: 'I was in makeup getting my lashes done the whole time, darling!',
    wrong: 'How dare you! I would never do something like that!' },
  { name: 'Julian Vance', role: 'Tailor Apprentice', emoji: '🪡',
    alibi: 'I-I was sewing a button back on a jacket in the corner...',
    wrong: 'Me?! I can\'t even thread a needle when I\'m nervous!' },
  { name: 'Claire Moreau', role: 'Fashion Critic', emoji: '☕',
    alibi: 'I was sipping lavender tea and writing my review.',
    wrong: 'Absurd! My pen is sharp, but my hands are clean.' },
  { name: 'Felix the Illusionist', role: 'Party Magician', emoji: '🎩',
    alibi: 'My only trick tonight was pulling doves out of a hat!',
    wrong: 'A magician reveals secrets, but never plays mean tricks!' },
  { name: 'Baroness Camille', role: 'Mysterious Guest', emoji: '🎭',
    alibi: 'I was dancing by the fountain all evening.',
    wrong: 'Unmask me if you must, but I am innocent!' },
  { name: 'Rex Bolt', role: 'Photographer', emoji: '📸',
    alibi: 'I was snapping photos the whole time!',
    wrong: 'Check my camera! Every photo proves I\'m innocent!' },
  { name: 'Duke Harrington', role: 'Fancy Guest', emoji: '🎩',
    alibi: 'I was admiring the decorations, thank you very much.',
    wrong: 'Preposterous! I have never been so insulted!' },
  { name: 'Pip Bennett', role: 'Waiter', emoji: '🧁',
    alibi: 'I was carrying cupcakes around all night!',
    wrong: 'But... I just serve the cupcakes!' },
  { name: 'Coco LaRue', role: 'Makeup Artist', emoji: '💄',
    alibi: 'I was painting sparkly eyeshadow on everyone!',
    wrong: 'My brushes are for beauty, not for trouble!' },
  { name: 'Marco Silva', role: 'Shoe Designer', emoji: '👞',
    alibi: 'I was fixing a broken heel for a friend.',
    wrong: 'These hands make shoes, not trouble!' },
  { name: 'Ivy Chen', role: 'Security Guard', emoji: '🔦',
    alibi: 'I was guarding the doors. Nobody got past me!',
    wrong: 'I\'m the guard! I protect people!' },
  { name: 'Lily Park', role: 'Flower Girl', emoji: '🌸',
    alibi: 'I was throwing flower petals everywhere!',
    wrong: 'Hey! I only throw flowers, not mischief!' },
  { name: 'DJ Sparkle', role: 'Concert DJ', emoji: '💿', venues: ['concert'],
    alibi: 'I was spinning tunes at my DJ booth all night!',
    wrong: 'Record scratch! You got the wrong DJ!' },
  { name: 'Kim Torres', role: 'Stage Manager', emoji: '📋', venues: ['concert'],
    alibi: 'I was checking my clipboard and yelling "five minutes to showtime!"',
    wrong: 'I keep this show running, I don\'t mess it up!' },
  { name: 'Tilly Fanheart', role: 'Super Fan', emoji: '🌟', venues: ['concert'],
    alibi: 'I was in the front row screaming the lyrics!',
    wrong: 'I would NEVER ruin my favorite singer\'s show!' },
  { name: 'Gus Rumble', role: 'Roadie', emoji: '🧰', venues: ['concert'],
    alibi: 'I was carrying heavy speakers backstage.',
    wrong: 'I lift speakers, not stuff that isn\'t mine!' },
  { name: 'Bo Beats', role: 'Drummer', emoji: '🥁', venues: ['concert'],
    alibi: 'I was practicing my drum solo. Ba-dum-tss!',
    wrong: 'That accusation is totally off-beat!' }
];

// Pop singers who can be performing at the concert
export const SINGERS = ['Nova Skye', 'Rina Rose', 'Jax Jupiter', 'Luna Bright', 'Kiki Comet'];

export const MOTIVES = [
  'I wanted everyone to look at ME for once!',
  'It was supposed to be a funny prank... but it wasn\'t funny at all. I\'m sorry!',
  'I was jealous! Everybody always notices them and never me!',
  'I wanted to ruin the night so my own party would seem better!',
  'I didn\'t think anyone would notice... but you did!',
  'I was grumpy because nobody asked me to dance!'
];

// Clue traits: every suspect gets one of each. Clues left behind match the culprit!
export const TRAITS = {
  shoes: {
    label: 'Shoes',
    values: {
      'shoes-stilettos': { text: 'crystal stilettos', clue: 'Tiny Heel Holes', icon: '👠', where: 'Tiny pointy holes pressed into the floor. Someone was wearing stilettos!' },
      'shoes-stealth-boots': { text: 'combat boots', clue: 'Chunky Boot Print', icon: '🥾', where: 'A big chunky boot print with a buckle mark. Someone was wearing combat boots!' },
      'shoes-brogues': { text: 'leather brogues', clue: 'Brogue Pattern Print', icon: '👞', where: 'A footprint with little dotted brogue patterns. Someone was wearing brogues!' }
    }
  },
  hat: {
    label: 'Headwear',
    values: {
      'hat-fedora': { text: 'a fedora', clue: 'Fedora Hat Band Feather', icon: '🪶', where: 'A small feather from a fedora hat band. The culprit wore a fedora!' },
      'hat-beret': { text: 'a beret', clue: 'Fuzzy Beret Wool', icon: '🧶', where: 'A puff of soft wool from a beret. The culprit wore a beret!' },
      'hat-tiara': { text: 'a tiara', clue: 'Fallen Tiara Crystal', icon: '💎', where: 'A tiny crystal that fell off a tiara. The culprit wore a tiara!' },
      'none': { text: 'no hat', clue: 'Loose Hair Strand', icon: '💇', where: 'A loose hair strand with no hat fuzz on it. The culprit wore NO hat!' }
    }
  },
  scent: {
    label: 'Perfume',
    values: {
      rose: { text: 'rose perfume', clue: 'Rose Perfume Cloud', icon: '🌹', where: 'The air still smells like sweet rose perfume!' },
      lavender: { text: 'lavender perfume', clue: 'Lavender Perfume Cloud', icon: '💜', where: 'The air still smells like calm lavender perfume!' },
      vanilla: { text: 'vanilla perfume', clue: 'Vanilla Perfume Cloud', icon: '🍦', where: 'The air still smells like yummy vanilla perfume!' }
    }
  },
  sparkle: {
    label: 'Sleeve sparkle',
    values: {
      gold: { text: 'gold glitter', clue: 'Gold Glitter Trail', icon: '✨', where: 'A trail of gold glitter. It must have fallen off the culprit\'s sleeve!' },
      silver: { text: 'silver sequins', clue: 'Silver Sequin', icon: '🪩', where: 'A shiny silver sequin. It must have fallen off the culprit\'s sleeve!' },
      pink: { text: 'pink sparkles', clue: 'Pink Sparkle Dust', icon: '🎀', where: 'Pink sparkle dust. It must have fallen off the culprit\'s sleeve!' }
    }
  }
};

// Fun things people say (some give extra hints!)
export const CHATTER = {
  gala: [
    'Isn\'t this music magnifique? I could dance all night!',
    'Have you tried the cupcakes? The pink ones are the best!',
    'I heard a detective is here tonight... is that you?!',
    'Those chandeliers are SO sparkly!',
    'My shoes are killing me, but they look amazing!'
  ],
  concert: [
    'AAAH! This is my favorite song!!',
    'I made this sign myself! Do you like the glitter?',
    'I waited in line since breakfast to be in the front row!',
    'The lights are SO pretty! Purple is my favorite!',
    'Do you think the singer will wave at me?!'
  ]
};

export const DRESS_CODES = {
  glamour: { label: 'Glamour Night', hint: 'sparkly glamour pieces (gold blazer, corset, ball gown, stilettos, tiara or pearls)' },
  detective: { label: 'Detective Noir', hint: 'detective pieces (trench coat, turtleneck, trousers, brogues, fedora, magnifier or shades)' },
  disguise: { label: 'Masquerade Disguise', hint: 'disguise pieces (velvet capelet, combat boots or masquerade mask)' },
  vintage: { label: 'Vintage Paris', hint: 'vintage pieces (silk blouse, pleated skirt or beret)' }
};
