import type { SymbolCategoryKey } from "./types";

export interface SymbolSubcategory {
  slug: string;
  name: string;
  description: string;
}

export interface SymbolCategory {
  key: SymbolCategoryKey;
  name: string;
  slug: string;
  description: string;
  subcategories: SymbolSubcategory[];
}

export const SYMBOL_CATEGORIES: Record<SymbolCategoryKey, SymbolCategory> = {
  hearts: {
    key: "hearts",
    name: "Hearts & Love",
    slug: "hearts",
    description: "Black hearts, white hearts, heart suits, and decorative heart symbols.",
    subcategories: [
      { slug: "black", name: "Black Hearts", description: "Filled solid black heart symbols." },
      { slug: "outline", name: "Outline Hearts", description: "White and hollow outline hearts." },
      { slug: "decorative", name: "Decorative Hearts", description: "Sparkling and suit hearts." },
    ],
  },
  stars: {
    key: "stars",
    name: "Stars & Sparkles",
    slug: "stars",
    description: "Filled stars, outline stars, sparkles, asterisks, and celestial symbols.",
    subcategories: [
      { slug: "filled", name: "Filled Stars", description: "Solid black five-pointed and starburst symbols." },
      { slug: "outline", name: "Outline Stars", description: "Hollow white star symbols." },
      { slug: "sparkle", name: "Sparkles & Glow", description: "Four-pointed stars and glittering sparkles." },
    ],
  },
  arrows: {
    key: "arrows",
    name: "Arrows",
    slug: "arrows",
    description: "Right, left, up, down, double-ended, curved, and heavy directional arrows.",
    subcategories: [
      { slug: "right", name: "Right Arrows", description: "Pointing right arrows and pointers." },
      { slug: "left", name: "Left Arrows", description: "Pointing left arrows." },
      { slug: "up", name: "Up Arrows", description: "Ascending and top arrows." },
      { slug: "down", name: "Down Arrows", description: "Descending arrows." },
    ],
  },
  decorative: {
    key: "decorative",
    name: "Decorative & Fleurons",
    slug: "decorative",
    description: "Flowers, fleurons, flourishes, and aesthetic ornament symbols.",
    subcategories: [
      { slug: "flowers", name: "Flowers", description: "Floral dingbats and blossoms." },
      { slug: "flourishes", name: "Flourishes", description: "Curved aesthetic dividers and vine ornaments." },
    ],
  },
  linesBorders: {
    key: "linesBorders",
    name: "Lines & Borders",
    slug: "lines-borders",
    description: "Horizontal dividers, vertical bars, dashed lines, and border accents.",
    subcategories: [
      { slug: "horizontal", name: "Horizontal Lines", description: "Text dividers and rule lines." },
      { slug: "border", name: "Border Accents", description: "Corner and frame border characters." },
    ],
  },
  boxes: {
    key: "boxes",
    name: "Box Drawing & Frames",
    slug: "boxes",
    description: "Single, double, and heavy Unicode box drawing characters for CLI & tables.",
    subcategories: [
      { slug: "single", name: "Single Line Boxes", description: "Light single-line box drawing." },
      { slug: "double", name: "Double Line Boxes", description: "Heavy double-line frame characters." },
    ],
  },
  mathematical: {
    key: "mathematical",
    name: "Mathematical Operators",
    slug: "mathematical",
    description: "Plus, minus, multiplication, division, calculus, algebra, and logic symbols.",
    subcategories: [
      { slug: "operators", name: "Operators", description: "Basic arithmetic signs." },
      { slug: "calculus", name: "Calculus & Integrals", description: "Integrals, summation, and derivatives." },
    ],
  },
  currency: {
    key: "currency",
    name: "Currency Symbols",
    slug: "currency",
    description: "Dollar, Euro, Yen, Pound, Rupee, Bitcoin, and global monetary signs.",
    subcategories: [
      { slug: "major", name: "Major Currencies", description: "Dollar, Euro, Pound, Yen." },
      { slug: "crypto", name: "Crypto & Modern", description: "Bitcoin, Baht, Rupee." },
    ],
  },
  technical: {
    key: "technical",
    name: "Technical & Control",
    slug: "technical",
    description: "Power button, eject, command, alt, control, keyboard, and electrical symbols.",
    subcategories: [
      { slug: "keyboard", name: "Keyboard Keys", description: "Command, Shift, Option, Return." },
      { slug: "power", name: "Power & Systems", description: "Power, eject, and play symbols." },
    ],
  },
  punctuation: {
    key: "punctuation",
    name: "Punctuation & Quotation",
    slug: "punctuation",
    description: "Guillemets, quotes, dashes, dots, bullet points, and section marks.",
    subcategories: [
      { slug: "bullets", name: "Bullet Points", description: "Dots, circles, squares, and list markers." },
      { slug: "quotes", name: "Quotation Marks", description: "Smart quotes and angle brackets." },
    ],
  },
  shapes: {
    key: "shapes",
    name: "Geometric Shapes",
    slug: "shapes",
    description: "Circles, squares, triangles, diamonds, polygons, and shaded blocks.",
    subcategories: [
      { slug: "circles", name: "Circles", description: "Filled and hollow circle symbols." },
      { slug: "squares", name: "Squares", description: "Box and square glyphs." },
      { slug: "triangles", name: "Triangles", description: "Pointing triangles and deltas." },
    ],
  },
  chess: {
    key: "chess",
    name: "Chess & Games",
    slug: "chess",
    description: "King, Queen, Rook, Bishop, Knight, Pawn chess pieces and game symbols.",
    subcategories: [
      { slug: "white", name: "White Chess Pieces", description: "Outline white chess glyphs." },
      { slug: "black", name: "Black Chess Pieces", description: "Solid black chess glyphs." },
    ],
  },
  zodiac: {
    key: "zodiac",
    name: "Zodiac & Astrology",
    slug: "zodiac",
    description: "Aries, Taurus, Gemini, Cancer, Leo, Virgo, and horoscope signs.",
    subcategories: [
      { slug: "signs", name: "Zodiac Signs", description: "12 astrological horoscope glyphs." },
    ],
  },
  weather: {
    key: "weather",
    name: "Weather & Climate",
    slug: "weather",
    description: "Sun, moon, rain, cloud, snowflake, umbrella, and temperature symbols.",
    subcategories: [
      { slug: "sun-moon", name: "Sun & Moon", description: "Solar and lunar symbols." },
      { slug: "snow", name: "Snow & Ice", description: "Snowflakes and winter glyphs." },
    ],
  },
  music: {
    key: "music",
    name: "Music & Audio",
    slug: "music",
    description: "Quarter note, eighth note, beam, flat, sharp, natural, and treble clef.",
    subcategories: [
      { slug: "notes", name: "Musical Notes", description: "Musical note symbols." },
    ],
  },
  religion: {
    key: "religion",
    name: "Religion & Spiritual",
    slug: "religion",
    description: "Cross, Peace sign, Yin Yang, Star of David, Om, Crescent, and Wheel.",
    subcategories: [
      { slug: "symbols", name: "Spiritual Symbols", description: "Global faith and peace signs." },
    ],
  },
  emojiUnicode: {
    key: "emojiUnicode",
    name: "Emoji-style Unicode",
    slug: "emoji-unicode",
    description: "Classical Unicode pictographs, faces, hands, and objects.",
    subcategories: [
      { slug: "faces", name: "Faces", description: "Smiley faces and emoticons." },
    ],
  },
  greek: {
    key: "greek",
    name: "Greek & Coptic",
    slug: "greek",
    description: "Alpha, Beta, Gamma, Delta, Pi, Sigma, Omega, and Greek alphabet symbols.",
    subcategories: [
      { slug: "lowercase", name: "Lowercase Greek", description: "α, β, γ, δ, π, σ, ω." },
      { slug: "uppercase", name: "Uppercase Greek", description: "Α, Β, Γ, Δ, Π, Σ, Ω." },
    ],
  },
  latinExtended: {
    key: "latinExtended",
    name: "Latin Extended",
    slug: "latin-extended",
    description: "Accented letters, diacritics, ligatures, and phonetic Latin symbols.",
    subcategories: [
      { slug: "accented", name: "Accented Letters", description: "Vowels and consonants with accents." },
    ],
  },
  superscript: {
    key: "superscript",
    name: "Superscript Digits & Letters",
    slug: "superscript",
    description: "Superscript numbers ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ and exponent letters.",
    subcategories: [
      { slug: "numbers", name: "Superscript Numbers", description: "Exponent digits." },
    ],
  },
  subscript: {
    key: "subscript",
    name: "Subscript Digits & Letters",
    slug: "subscript",
    description: "Subscript numbers ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ and chemical formula indices.",
    subcategories: [
      { slug: "numbers", name: "Subscript Numbers", description: "Subscript digits." },
    ],
  },
  romanNumerals: {
    key: "romanNumerals",
    name: "Roman Numerals",
    slug: "roman-numerals",
    description: "Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ Unicode Roman numerals.",
    subcategories: [
      { slug: "uppercase", name: "Uppercase Roman", description: "Standard uppercase Roman numerals." },
    ],
  },
  braille: {
    key: "braille",
    name: "Braille Patterns",
    slug: "braille",
    description: "256 Braille dot patterns for text art, grid drawing, and accessibility.",
    subcategories: [
      { slug: "patterns", name: "Braille Grid Patterns", description: "Braille matrix dots." },
    ],
  },
  geometric: {
    key: "geometric",
    name: "Geometric & Block Elements",
    slug: "geometric",
    description: "Shaded blocks █ ▀ ▄ ▌ ▐ ░ ▒ ▓ and ASCII terminal artwork shapes.",
    subcategories: [
      { slug: "blocks", name: "Full & Shade Blocks", description: "Terminal shade blocks." },
    ],
  },
  dingbats: {
    key: "dingbats",
    name: "Dingbats",
    slug: "dingbats",
    description: "Scissors, pens, phones, mail, checkmarks, crosses, and ITC Dingbats.",
    subcategories: [
      { slug: "office", name: "Office & Tools", description: "Scissors, mail, pens, phones." },
    ],
  },
  miscellaneous: {
    key: "miscellaneous",
    name: "Miscellaneous Symbols",
    slug: "miscellaneous",
    description: "Card suits, hazard signs, recycling, male/female, and general symbols.",
    subcategories: [
      { slug: "general", name: "General Misc", description: "Uncategorized Unicode glyphs." },
    ],
  },
};

export const SYMBOL_CATEGORY_LIST: SymbolCategory[] = Object.values(SYMBOL_CATEGORIES);

export function getSymbolCategory(key: SymbolCategoryKey): SymbolCategory {
  return SYMBOL_CATEGORIES[key] ?? SYMBOL_CATEGORIES.miscellaneous;
}

export function getSymbolCategoryBySlug(slug: string): SymbolCategory | undefined {
  return SYMBOL_CATEGORY_LIST.find((c) => c.slug === slug);
}

export const getCategory = getSymbolCategory;
export const getCategoryBySlug = getSymbolCategoryBySlug;
