// Wardrobe & Avatar Engine for Mystery Runway & Detective Atelier

export const WARDROBE_DATA = {
  skinTones: [
    { id: 'skin-1', name: 'Warm Peach', color: '#F8D9C0' },
    { id: 'skin-2', name: 'Honey Beige', color: '#E5B887' },
    { id: 'skin-3', name: 'Golden Tan', color: '#CA9464' },
    { id: 'skin-4', name: 'Chestnut', color: '#8D5524' },
    { id: 'skin-5', name: 'Deep Espresso', color: '#4A2E1B' },
    { id: 'skin-6', name: 'Rose Porcelain', color: '#FFE0BD' }
  ],
  
  hairStyles: [
    { id: 'hair-sleuth-ponytail', name: 'Detective Ponytail', type: 'ponytail' },
    { id: 'hair-glam-waves', name: 'Runway Glamour Waves', type: 'waves' },
    { id: 'hair-chic-bob', name: 'French Chic Bob', type: 'bob' },
    { id: 'hair-vintage-curls', name: '1920s Noir Curls', type: 'curls' },
    { id: 'hair-high-bun', name: 'Sleek Ballerina Bun', type: 'bun' }
  ],
  
  hairColors: [
    { id: 'h-obsidian', name: 'Obsidian Black', color: '#1B191B' },
    { id: 'h-chestnut', name: 'Chestnut Brown', color: '#4E301D' },
    { id: 'h-blonde', name: 'Champagne Blonde', color: '#E8C87A' },
    { id: 'h-auburn', name: 'Crimson Auburn', color: '#7E2811' },
    { id: 'h-pastel-pink', name: 'Cotton Candy Pink', color: '#F7A8B8' },
    { id: 'h-silver', name: 'Platinum Silver', color: '#D9D9E2' }
  ],

  categories: [
    { id: 'outerwear', name: 'Coats & Capes', icon: '🧥' },
    { id: 'tops', name: 'Tops & Blouses', icon: '👚' },
    { id: 'bottoms', name: 'Skirts & Pants', icon: '👗' },
    { id: 'shoes', name: 'Footwear', icon: '👠' },
    { id: 'hats', name: 'Hats & Hairpins', icon: '👒' },
    { id: 'accessories', name: 'Detective Gear', icon: '🔍' }
  ],

  items: [
    // Outerwear
    {
      id: 'coat-noir-trench',
      category: 'outerwear',
      name: 'Classic Noir Trench',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 15,
      color: '#C29B38',
      preview: '🧥',
      desc: 'The quintessential coat for sleuthing through misty alleyways.'
    },
    {
      id: 'coat-midnight-cape',
      category: 'outerwear',
      name: 'Midnight Velvet Capelet',
      styleTag: 'disguise',
      stealthBonus: 30,
      glamourBonus: 25,
      color: '#1A183A',
      preview: '✨',
      desc: 'Deep indigo velvet lined with silver star patterns for sneaking into VIP galas.'
    },
    {
      id: 'coat-gold-blazer',
      category: 'outerwear',
      name: 'Gilded Runway Blazer',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 40,
      color: '#D4AF37',
      preview: '🪙',
      desc: 'Sharp tailoring with real gold thread. Unmistakable fashion power.'
    },

    // Tops
    {
      id: 'top-detective-turtleneck',
      category: 'tops',
      name: 'Shadow Ribbed Turtleneck',
      styleTag: 'detective',
      stealthBonus: 20,
      glamourBonus: 10,
      color: '#26282B',
      preview: '🥼',
      desc: 'Comfortable, sleek, and perfect for midnight clue hunting.'
    },
    {
      id: 'top-silk-blouse',
      category: 'tops',
      name: 'Duchess Ruffle Silk Blouse',
      styleTag: 'vintage',
      stealthBonus: 10,
      glamourBonus: 30,
      color: '#FBF5E8',
      preview: '🎀',
      desc: 'Delicate lace cuffs hiding secret notebook pockets.'
    },
    {
      id: 'top-corset-vest',
      category: 'tops',
      name: 'Atelier Tailored Corset',
      styleTag: 'glamour',
      stealthBonus: 15,
      glamourBonus: 35,
      color: '#800020',
      preview: '🥀',
      desc: 'Deep burgundy velvet corset laced with gold thread.'
    },

    // Bottoms
    {
      id: 'bottom-sleuth-trousers',
      category: 'bottoms',
      name: 'High-Waist Sleuth Trousers',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 15,
      color: '#343A40',
      preview: '👖',
      desc: 'Tailored with secret concealed pockets for evidence vials.'
    },
    {
      id: 'bottom-gala-skirt',
      category: 'bottoms',
      name: 'Grand Ballroom Tulle Gown',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 45,
      color: '#9C27B0',
      preview: '👗',
      desc: 'Cascading layers of royal violet silk that sweep the runway floor.'
    },
    {
      id: 'bottom-pleated-skirt',
      category: 'bottoms',
      name: 'Houndstooth Pleated Skirt',
      styleTag: 'vintage',
      stealthBonus: 20,
      glamourBonus: 25,
      color: '#5C5446',
      preview: '🏁',
      desc: 'Classic British detective chic with sharp razor pleats.'
    },

    // Footwear
    {
      id: 'shoes-brogues',
      category: 'shoes',
      name: 'Silent Leather Brogues',
      styleTag: 'detective',
      stealthBonus: 30,
      glamourBonus: 10,
      color: '#4B3621',
      preview: '👞',
      desc: 'Rubber-cushioned soles designed to make zero sound on marble floors.'
    },
    {
      id: 'shoes-stilettos',
      category: 'shoes',
      name: 'Runway Crystal Stilettos',
      styleTag: 'glamour',
      stealthBonus: 0,
      glamourBonus: 40,
      color: '#E0AA3E',
      preview: '👠',
      desc: 'Towering heels that click authoritatively down the runway.'
    },
    {
      id: 'shoes-stealth-boots',
      category: 'shoes',
      name: 'Atelier Combat Boots',
      styleTag: 'disguise',
      stealthBonus: 25,
      glamourBonus: 20,
      color: '#1F2421',
      preview: '🥾',
      desc: 'Heavy buckled leather ready for climbing fire escapes.'
    },

    // Hats
    {
      id: 'hat-fedora',
      category: 'hats',
      name: 'Signature Detective Fedora',
      styleTag: 'detective',
      stealthBonus: 25,
      glamourBonus: 20,
      color: '#2B2B2B',
      preview: '🕵️',
      desc: 'Tilted low over one eye for maximum deductive aura.'
    },
    {
      id: 'hat-beret',
      category: 'hats',
      name: 'Parisian Designer Beret',
      styleTag: 'vintage',
      stealthBonus: 15,
      glamourBonus: 30,
      color: '#A1045A',
      preview: '👒',
      desc: 'A chic wool beret that whispers Haute Couture.'
    },
    {
      id: 'hat-tiara',
      category: 'hats',
      name: 'Diamond Gala Crown',
      styleTag: 'glamour',
      stealthBonus: 0,
      glamourBonus: 50,
      color: '#FFD700',
      preview: '👑',
      desc: 'Sparkling crystals caught in the runway spotlight.'
    },

    // Accessories & Detective Tools
    {
      id: 'acc-magnifier',
      category: 'accessories',
      name: 'Golden Brass Magnifier',
      styleTag: 'detective',
      stealthBonus: 10,
      glamourBonus: 15,
      cluePower: 30,
      color: '#DAA520',
      preview: '🔍',
      desc: 'Reveals microscopic thread burns, hidden dye, and fabric clues.'
    },
    {
      id: 'acc-masquerade',
      category: 'accessories',
      name: 'Venetian Peacock Mask',
      styleTag: 'disguise',
      stealthBonus: 40,
      glamourBonus: 35,
      cluePower: 10,
      color: '#0D5C75',
      preview: '🎭',
      desc: 'Completely conceals your identity at VIP masquerade galas.'
    },
    {
      id: 'acc-sunglasses',
      category: 'accessories',
      name: 'Noir Tinted Spy Shades',
      styleTag: 'detective',
      stealthBonus: 30,
      glamourBonus: 20,
      cluePower: 15,
      color: '#1C1C1C',
      preview: '🕶️',
      desc: 'Observe suspects without them ever knowing where you are looking.'
    },
    {
      id: 'acc-pearls',
      category: 'accessories',
      name: 'Triple Strand Pearl Choker',
      styleTag: 'glamour',
      stealthBonus: 5,
      glamourBonus: 35,
      cluePower: 5,
      color: '#F4F1EA',
      preview: '📿',
      desc: 'Elegant vintage pearls favored by Madame Vivienne herself.'
    }
  ]
};

export class WardrobeEngine {
  constructor() {
    this.currentLook = {
      skin: WARDROBE_DATA.skinTones[1].id,
      hairStyle: WARDROBE_DATA.hairStyles[0].id,
      hairColor: WARDROBE_DATA.hairColors[0].id,
      outerwear: 'coat-noir-trench',
      tops: 'top-detective-turtleneck',
      bottoms: 'bottom-sleuth-trousers',
      shoes: 'shoes-brogues',
      hats: 'hat-fedora',
      accessories: 'acc-magnifier',
      paletteTint: '#C29B38'
    };
  }

  equip(category, itemId) {
    if (this.currentLook[category] === itemId) {
      // Toggle off if not mandatory base
      if (!['skin', 'hairStyle', 'hairColor'].includes(category)) {
        this.currentLook[category] = null;
      }
    } else {
      this.currentLook[category] = itemId;
    }
  }

  setSkin(skinId) {
    this.currentLook.skin = skinId;
  }

  setHairStyle(styleId) {
    this.currentLook.hairStyle = styleId;
  }

  setHairColor(colorId) {
    this.currentLook.hairColor = colorId;
  }

  calculateStats() {
    let stealth = 0;
    let glamour = 0;
    let clueBonus = 0;
    const styles = {};

    const itemKeys = ['outerwear', 'tops', 'bottoms', 'shoes', 'hats', 'accessories'];
    for (const key of itemKeys) {
      const id = this.currentLook[key];
      if (!id) continue;
      const item = WARDROBE_DATA.items.find(i => i.id === id);
      if (item) {
        stealth += item.stealthBonus || 0;
        glamour += item.glamourBonus || 0;
        clueBonus += item.cluePower || 0;
        styles[item.styleTag] = (styles[item.styleTag] || 0) + 1;
      }
    }

    return { stealth, glamour, clueBonus, styles };
  }

  renderAvatarSVG() {
    const skinObj = WARDROBE_DATA.skinTones.find(s => s.id === this.currentLook.skin) || WARDROBE_DATA.skinTones[0];
    const hairColorObj = WARDROBE_DATA.hairColors.find(h => h.id === this.currentLook.hairColor) || WARDROBE_DATA.hairColors[0];
    const hairStyleObj = WARDROBE_DATA.hairStyles.find(h => h.id === this.currentLook.hairStyle) || WARDROBE_DATA.hairStyles[0];

    const skin = skinObj.color;
    const hair = hairColorObj.color;
    
    // Resolve item colors
    const getItem = (id) => WARDROBE_DATA.items.find(i => i.id === id);
    const top = getItem(this.currentLook.tops);
    const bottom = getItem(this.currentLook.bottoms);
    const coat = getItem(this.currentLook.outerwear);
    const shoes = getItem(this.currentLook.shoes);
    const hat = getItem(this.currentLook.hats);
    const acc = getItem(this.currentLook.accessories);

    const topColor = top ? top.color : '#e6e6e6';
    const bottomColor = bottom ? bottom.color : '#444444';
    const coatColor = coat ? coat.color : 'transparent';
    const shoeColor = shoes ? shoes.color : '#222222';
    const hatColor = hat ? hat.color : '#333333';

    return `
    <svg viewBox="0 0 300 480" class="mannequin-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients and Shadows -->
        <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD700" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#120E24" stop-opacity="0"/>
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Stage Backdrop Shadow -->
      <ellipse cx="150" cy="460" rx="90" ry="14" fill="#0b0819" opacity="0.6"/>
      <ellipse cx="150" cy="460" rx="60" ry="8" fill="#1b143a" opacity="0.4"/>

      <!-- Back Hair Layer -->
      ${hairStyleObj.type === 'waves' ? `
        <path d="M110 110 C90 150 80 230 100 270 C110 240 125 180 120 150 Z" fill="${hair}"/>
        <path d="M190 110 C210 150 220 230 200 270 C190 240 175 180 180 150 Z" fill="${hair}"/>
      ` : ''}

      <!-- Body / Skin Base -->
      <!-- Legs -->
      <path d="M132 290 L134 430 L146 430 L144 290 Z" fill="${skin}" filter="url(#softShadow)"/>
      <path d="M156 290 L154 430 L166 430 L168 290 Z" fill="${skin}" filter="url(#softShadow)"/>

      <!-- Shoes -->
      ${shoes ? `
        <!-- Left Shoe -->
        <path d="M128 425 L147 425 L148 445 L124 445 Z" fill="${shoeColor}" filter="url(#softShadow)"/>
        ${shoes.id === 'shoes-stilettos' ? `<rect x="144" y="428" width="4" height="18" fill="#D4AF37"/>` : ''}
        <!-- Right Shoe -->
        <path d="M153 425 L172 425 L176 445 L152 445 Z" fill="${shoeColor}" filter="url(#softShadow)"/>
        ${shoes.id === 'shoes-stilettos' ? `<rect x="152" y="428" width="4" height="18" fill="#D4AF37"/>` : ''}
      ` : ''}

      <!-- Torso & Neck -->
      <rect x="143" y="115" width="14" height="26" rx="6" fill="${skin}"/>
      <path d="M125 135 L175 135 L165 240 L135 240 Z" fill="${skin}"/>

      <!-- Bottoms (Skirts / Pants) -->
      ${bottom ? (bottom.id === 'bottom-gala-skirt' ? `
        <!-- Grand Ballroom Gown -->
        <path d="M134 235 L166 235 L215 435 L85 435 Z" fill="${bottomColor}" filter="url(#softShadow)"/>
        <path d="M134 235 Q150 245 166 235 Q190 350 215 435 Q150 420 85 435 Z" fill="url(#stageGlow)" opacity="0.6"/>
        <path d="M110 320 Q150 340 190 320" stroke="#FFD700" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M95 380 Q150 405 205 380" stroke="#FFD700" stroke-width="2" fill="none" opacity="0.6"/>
      ` : bottom.id === 'bottom-sleuth-trousers' ? `
        <!-- Sleuth Trousers -->
        <path d="M132 230 L168 230 L172 428 L152 428 L150 270 L148 428 L128 428 Z" fill="${bottomColor}" filter="url(#softShadow)"/>
        <!-- Belt & Brass Buckle -->
        <rect x="132" y="230" width="36" height="7" fill="#1b1b1b"/>
        <rect x="146" y="230" width="8" height="7" stroke="#DAA520" stroke-width="1.5" fill="none"/>
      ` : `
        <!-- Pleated Skirt -->
        <path d="M134 230 L166 230 L185 320 L115 320 Z" fill="${bottomColor}" filter="url(#softShadow)"/>
        <line x1="130" y1="230" x2="135" y2="320" stroke="#222" stroke-width="1.5"/>
        <line x1="145" y1="230" x2="148" y2="320" stroke="#222" stroke-width="1.5"/>
        <line x1="155" y1="230" x2="152" y2="320" stroke="#222" stroke-width="1.5"/>
        <line x1="170" y1="230" x2="165" y2="320" stroke="#222" stroke-width="1.5"/>
      `) : ''}

      <!-- Top Wear -->
      ${top ? `
        <path d="M125 138 L175 138 L168 235 L132 235 Z" fill="${topColor}" filter="url(#softShadow)"/>
        ${top.id === 'top-silk-blouse' ? `
          <!-- Ruffles -->
          <path d="M145 140 Q150 180 155 140" stroke="#FFF" stroke-width="3" fill="none"/>
          <circle cx="150" cy="155" r="2" fill="#DAA520"/>
          <circle cx="150" cy="170" r="2" fill="#DAA520"/>
          <circle cx="150" cy="185" r="2" fill="#DAA520"/>
        ` : ''}
        ${top.id === 'top-corset-vest' ? `
          <!-- Gold lacing -->
          <line x1="145" y1="150" x2="155" y2="160" stroke="#FFD700" stroke-width="2"/>
          <line x1="155" y1="150" x2="145" y2="160" stroke="#FFD700" stroke-width="2"/>
          <line x1="145" y1="170" x2="155" y2="180" stroke="#FFD700" stroke-width="2"/>
          <line x1="155" y1="170" x2="145" y2="180" stroke="#FFD700" stroke-width="2"/>
        ` : ''}
      ` : ''}

      <!-- Arms -->
      <path d="M124 140 L108 240 L118 242 L132 150 Z" fill="${skin}"/>
      <path d="M176 140 L192 240 L182 242 L168 150 Z" fill="${skin}"/>

      <!-- Outerwear (Coat / Cape) -->
      ${coat ? (coat.id === 'coat-midnight-cape' ? `
        <!-- Velvet Capelet -->
        <path d="M120 135 L180 135 L210 260 L90 260 Z" fill="${coatColor}" opacity="0.95" filter="url(#softShadow)"/>
        <circle cx="120" cy="210" r="2" fill="#FFF" opacity="0.8"/>
        <circle cx="180" cy="190" r="2" fill="#FFF" opacity="0.8"/>
        <circle cx="140" cy="240" r="2.5" fill="#FFD700" opacity="0.9"/>
        <circle cx="165" cy="230" r="1.5" fill="#FFF" opacity="0.8"/>
        <!-- Cape Gold Clasp -->
        <circle cx="150" cy="142" r="5" fill="#FFD700"/>
      ` : `
        <!-- Trench Coat or Blazer -->
        <path d="M120 135 L145 138 L142 340 L105 330 Z" fill="${coatColor}" filter="url(#softShadow)"/>
        <path d="M180 135 L155 138 L158 340 L195 330 Z" fill="${coatColor}" filter="url(#softShadow)"/>
        <!-- Lapels -->
        <path d="M128 136 L148 180 L138 180 L122 142 Z" fill="#222" opacity="0.2"/>
        <path d="M172 136 L152 180 L162 180 L178 142 Z" fill="#222" opacity="0.2"/>
        <!-- Belt -->
        <rect x="122" y="225" width="56" height="8" fill="#1b1b1b"/>
        <rect x="145" y="223" width="10" height="12" stroke="#FFD700" stroke-width="2" fill="none"/>
        <!-- Sleeves -->
        <path d="M123 138 L104 235 L116 238 L133 150 Z" fill="${coatColor}"/>
        <path d="M177 138 L196 235 L184 238 L167 150 Z" fill="${coatColor}"/>
      `) : ''}

      <!-- Hands -->
      <circle cx="110" cy="244" r="7" fill="${skin}"/>
      <circle cx="190" cy="244" r="7" fill="${skin}"/>

      <!-- Props / Accessories In Hand -->
      ${acc ? (acc.id === 'acc-magnifier' ? `
        <!-- Golden Brass Magnifying Glass -->
        <g transform="translate(90, 215)" filter="url(#softShadow)">
          <circle cx="14" cy="14" r="14" stroke="#DAA520" stroke-width="4" fill="#BEE3F8" fill-opacity="0.45"/>
          <line x1="24" y1="24" x2="38" y2="42" stroke="#8C6212" stroke-width="5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="38" y2="42" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 10 A 10 10 0 0 1 18 6" stroke="#FFFFFF" stroke-width="2" fill="none"/>
        </g>
      ` : '') : ''}

      <!-- Head & Face -->
      <ellipse cx="150" cy="95" rx="22" ry="26" fill="${skin}" filter="url(#softShadow)"/>
      <!-- Soft blush -->
      <ellipse cx="138" cy="102" rx="4" ry="2.5" fill="#E86E80" opacity="0.4"/>
      <ellipse cx="162" cy="102" rx="4" ry="2.5" fill="#E86E80" opacity="0.4"/>
      <!-- Eyes -->
      <ellipse cx="141" cy="94" rx="3.5" ry="4" fill="#201E22"/>
      <circle cx="142" cy="93" r="1.3" fill="#FFF"/>
      <ellipse cx="159" cy="94" rx="3.5" ry="4" fill="#201E22"/>
      <circle cx="160" cy="93" r="1.3" fill="#FFF"/>
      <!-- Eyebrows & Lashes -->
      <path d="M137 88 Q142 85 146 88" stroke="#333" stroke-width="1.2" fill="none"/>
      <path d="M154 88 Q158 85 163 88" stroke="#333" stroke-width="1.2" fill="none"/>
      <!-- Chic smile -->
      <path d="M146 107 Q150 111 154 107" stroke="#A83248" stroke-width="1.8" fill="none"/>

      <!-- Accessories (Face & Neck) -->
      ${acc && acc.id === 'acc-pearls' ? `
        <ellipse cx="150" cy="126" rx="12" ry="4" fill="none" stroke="#F4F1EA" stroke-width="3" stroke-dasharray="3,2"/>
      ` : ''}

      ${acc && acc.id === 'acc-masquerade' ? `
        <!-- Venetian Peacock Mask -->
        <path d="M133 90 Q150 97 167 90 Q175 80 162 76 Q150 84 138 76 Q125 80 133 90 Z" fill="#0D5C75" stroke="#FFD700" stroke-width="1.5" filter="url(#softShadow)"/>
        <circle cx="141" cy="91" r="3" fill="#120E24"/>
        <circle cx="159" cy="91" r="3" fill="#120E24"/>
        <circle cx="150" cy="78" r="3" fill="#FFD700"/>
      ` : ''}

      ${acc && acc.id === 'acc-sunglasses' ? `
        <!-- Noir Spy Sunglasses -->
        <rect x="133" y="88" width="14" height="10" rx="3" fill="#111" stroke="#DAA520" stroke-width="1"/>
        <rect x="153" y="88" width="14" height="10" rx="3" fill="#111" stroke="#DAA520" stroke-width="1"/>
        <line x1="147" y1="92" x2="153" y2="92" stroke="#DAA520" stroke-width="1.5"/>
      ` : ''}

      <!-- Hair Front -->
      ${hairStyleObj.type === 'ponytail' ? `
        <path d="M130 90 C125 65 175 65 170 90 C165 72 135 72 130 90 Z" fill="${hair}"/>
        <!-- Sleuth Ponytail flowing back -->
        <path d="M165 78 C185 75 200 95 195 140 C190 120 180 95 168 85 Z" fill="${hair}" filter="url(#softShadow)"/>
        <circle cx="168" cy="80" r="4" fill="#DAA520"/>
      ` : hairStyleObj.type === 'bob' ? `
        <path d="M130 92 C125 65 175 65 170 92 C178 115 170 130 166 132 C164 105 160 80 150 80 C140 80 136 105 134 132 C130 130 122 115 130 92 Z" fill="${hair}"/>
      ` : hairStyleObj.type === 'curls' ? `
        <path d="M128 92 C125 60 175 60 172 92 C180 125 172 145 164 140 C160 110 150 82 150 82 C150 82 140 110 136 140 C128 145 120 125 128 92 Z" fill="${hair}"/>
      ` : hairStyleObj.type === 'bun' ? `
        <circle cx="150" cy="62" r="14" fill="${hair}" filter="url(#softShadow)"/>
        <circle cx="150" cy="62" r="5" stroke="#FFD700" stroke-width="2" fill="none"/>
        <path d="M130 90 C125 68 175 68 170 90 C165 74 135 74 130 90 Z" fill="${hair}"/>
      ` : `
        <path d="M130 90 C125 68 175 68 170 90 C165 74 135 74 130 90 Z" fill="${hair}"/>
      `}

      <!-- Hat Layer -->
      ${hat ? (hat.id === 'hat-fedora' ? `
        <!-- Detective Fedora -->
        <g transform="translate(0, -3)" filter="url(#softShadow)">
          <path d="M120 78 C120 60 180 60 180 78 C185 75 198 80 188 83 C165 88 135 88 112 83 C102 80 115 75 120 78 Z" fill="${hatColor}"/>
          <path d="M130 76 C135 52 165 52 170 76 Z" fill="${hatColor}"/>
          <!-- Hat band -->
          <path d="M130 74 C140 76 160 76 170 74" stroke="#DAA520" stroke-width="3" fill="none"/>
          <path d="M142 56 L158 56" stroke="#111" stroke-width="2"/>
        </g>
      ` : hat.id === 'hat-beret' ? `
        <!-- French Beret -->
        <path d="M124 75 Q152 48 182 70 Q176 84 136 82 Z" fill="${hatColor}" filter="url(#softShadow)"/>
        <circle cx="152" cy="55" r="2.5" fill="${hatColor}"/>
      ` : hat.id === 'hat-tiara' ? `
        <!-- Diamond Gala Crown -->
        <g filter="url(#goldGlow)">
          <path d="M136 78 L142 66 L150 72 L158 66 L164 78 Z" fill="#FFD700" stroke="#FFF" stroke-width="1"/>
          <circle cx="142" cy="66" r="2" fill="#FFF"/>
          <circle cx="150" cy="72" r="2" fill="#80D8FF"/>
          <circle cx="158" cy="66" r="2" fill="#FFF"/>
        </g>
      ` : '') : ''}
    </svg>
    `;
  }
}
