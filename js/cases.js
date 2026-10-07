// Mystery Case Engine for Detective Atelier

export const MYSTERY_CASES = [
  {
    id: 'case-ballgown-mystery',
    title: 'The Midnight Ball Gown Ruin',
    client: 'Madame Vivienne',
    clientRole: 'High Fashion Couturière',
    clientAvatar: '👑',
    difficulty: '★☆☆',
    rewardStars: 150,
    briefing: `Mon dieu, Detective! The royal midnight runway starts in one hour, and someone snuck backstage and cut the velvet sash on my centerpiece sapphire gown! If the show is ruined, House of Vivienne will lose its crown!`,
    objective: 'Investigate the backstage atelier, find the clue fibers, interrogate the 3 suspects, and put on the right stealth disguise to corner the culprit on the runway!',
    requiredTag: 'detective',
    clues: [
      {
        id: 'clue-golden-fiber',
        name: 'Golden Thread Snag',
        description: 'A microscopic strand of 24k gilded embroidery thread caught in the scissor latch.',
        icon: '🧵',
        suspectLinked: 'suspect-julian'
      },
      {
        id: 'clue-perfume-scent',
        name: 'Lavender & Earl Grey Scent',
        description: 'A delicate lingering perfume note left on the cutting table.',
        icon: '💐',
        suspectLinked: 'suspect-claire'
      },
      {
        id: 'clue-footprint',
        name: 'Stiletto Heel Mark',
        description: 'A sharp, narrow puncture in the velvet fabric offcut, matching a runway stiletto.',
        icon: '👠',
        suspectLinked: 'suspect-sasha'
      }
    ],
    suspects: [
      {
        id: 'suspect-sasha',
        name: 'Sasha Velvet',
        role: 'Rival Prima Model',
        avatar: '🦚',
        statement: 'I was in makeup having my lashes done! Why would I ruin the centerpiece gown when I was supposed to wear it next season?',
        clueAlibi: 'Her stilettos were found clean, but her capelet was seen near the dressing partition.',
        isGuilty: false,
        reactionWrong: 'How dare you accuse me! I wear couture, I do not cut it!'
      },
      {
        id: 'suspect-julian',
        name: 'Julian Vance',
        role: 'Ambitious Tailor Apprentice',
        avatar: '🪡',
        statement: 'I was only polishing Madame\'s golden shears... I would never touch the sapphire velvet without her explicit blessing!',
        clueAlibi: 'His apron has gold embroidery thread matching the exact scissor mark, and the ruined sash cut was done with left-handed tailor shears!',
        isGuilty: true,
        confession: 'Alright, I confess! I wanted Madame to use MY replacement cape design so the Fashion Guild would finally notice my name! I didn\'t mean to ruin her career!'
      },
      {
        id: 'suspect-claire',
        name: 'Claire Moreau',
        role: 'VIP Fashion Critic',
        avatar: '☕',
        statement: 'Darling, I judge fashion, I don\'t create sabotage. I was sipping my lavender tea in the VIP lounge.',
        clueAlibi: 'Her tea cup is half-empty, and her notes actually praised Vivienne\'s collection.',
        isGuilty: false,
        reactionWrong: 'Absurd! My pen is sharp, but my scissors stay at home.'
      }
    ]
  },
  {
    id: 'case-diamond-mask',
    title: 'The Stolen Masquerade Diadem',
    client: 'Inspector Pierre',
    clientRole: 'Hauteville Chief Sleuth',
    clientAvatar: '🕵️‍♂️',
    difficulty: '★★☆',
    rewardStars: 280,
    briefing: `Detective! During the Grand Venetian Masquerade ball, the priceless Diamond Diadem vanished from the pedestal right in front of 200 guests! The thief escaped into the VIP ballroom by wearing a clever disguise.`,
    objective: 'Equip your Masquerade Mask and Midnight Capelet disguise, match the ballroom dress code, and unmask the jewel thief before they slip out the grand garden gates!',
    requiredTag: 'disguise',
    clues: [
      {
        id: 'clue-peacock-feather',
        name: 'Iridescent Peacock Quill',
        description: 'Dropped right beside the diadem display glass.',
        icon: '🪶',
        suspectLinked: 'suspect-baroness'
      },
      {
        id: 'clue-glitter-dust',
        name: 'Silver Powder Residue',
        description: 'Traces of theatrical disguise powder left on the ballroom velvet curtain.',
        icon: '✨',
        suspectLinked: 'suspect-magician'
      }
    ],
    suspects: [
      {
        id: 'suspect-magician',
        name: 'Felix the Illusionist',
        role: 'Runway Gala Magician',
        avatar: '🎩',
        statement: 'My tricks are all sleight of hand, my friends. I had nothing to do with the pedestal vault!',
        isGuilty: false,
        reactionWrong: 'A magician reveals secrets, but never steals genuine jewels!'
      },
      {
        id: 'suspect-baroness',
        name: 'Baroness Camille',
        role: 'Mysterious Gala Guest',
        avatar: '🎭',
        statement: 'I was dancing near the fountain all evening. Why are you questioning my peacock mask?',
        clueAlibi: 'A missing quill from her mask matches the crime scene, and the diadem diamonds were tucked into her velvet muff!',
        isGuilty: true,
        confession: 'You saw through my peacock disguise! The runway lights were too dazzling... I couldn\'t resist having the diadem for my personal salon!'
      }
    ]
  }
];
