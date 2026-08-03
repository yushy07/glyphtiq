import { ALPHABETS, buildAlphabetMap, mapText } from "./alphabets";
import { CATEGORY_SCORES } from "./compat";
import { COMBINING } from "./combining";
import {
  aestheticWide,
  applyPerChar,
  buildFlagMap,
  buildUpsideDownMap,
  checkerboard,
  glitch as glitchFn,
  interleaveChars,
  interleaveNonSpace,
  interleaveWords,
  jitter as jitterFn,
  mockCase,
  reverseText,
  vowelAccent,
  wrapLines,
  zalgo as zalgoFn,
} from "./decorators";
import type { CompatibilityScores, StyleCategory, StyleOptions, TextStyle } from "./types";

const categoryOf = (id: string): StyleCategory => {
  if (id === "bold" || id === "boldItalic" || id === "sansBold" || id === "sansBoldItalic") return "bold";
  if (id === "italic" || id === "sansItalic") return "italic";
  if (id === "script" || id === "boldScript") return "cursive";
  if (id === "circled" || id === "circledNegative" || id === "squared" || id === "squaredNegative" || id === "flagLetters") return "bubble";
  if (id === "fraktur" || id === "boldFraktur" || id === "doubleStruck") return "gothic";
  if (id === "monospace") return "monospace";
  if (id === "smallCaps") return "smallcaps";
  if (id === "fullwidth" || id === "spacedOut" || id.startsWith("aesthetic")) return "vaporwave";
  if (id === "upsideDown" || id === "mirrored") return "upsidedown";
  if (id === "underline" || id === "underlineDouble" || id === "underlineWavy" || id === "overline" || id === "overlineDouble" || id === "underdot" || id === "macron" || id === "caron" || id === "grave" || id === "circumflex" || id === "umlaut" || id === "doubleAcute" || id === "hookAbove" || id === "ringAbove" || id === "breve" || id === "overdot" || id === "tildeAbove" || id === "xAbove" || id === "doubleGrave" || id === "invertedBreve") return "underline";
  if (id === "strike" || id === "strikeShort" || id === "strikeSlash" || id === "strikeDouble" || id === "strikeShortSlash" || id === "strikeX" || id === "strikeTilde" || id === "strikeWave") return "strikethrough";
  if (id === "glitch" || id === "glitchHeavy" || id === "jitter" || id === "glitchFlicker" || id === "glitchStatic" || id === "glitchVhs") return "glitch";
  if (id === "zalgo" || id === "zalgoMini" || id === "zalgoHorror" || id === "zalgoLight" || id === "zalgoHeavy" || id === "zalgoNightmare") return "zalgo";
  if (id.startsWith("kawaii")) return "kawaii";
  if (id === "parenthesized" || id === "superscript" || id === "subscript") return "symbol";
  return "decorated";
};

/** Category defaults merged with explicit per-style overrides. */
function platformsFor(category: StyleCategory, overrides?: CompatibilityScores): CompatibilityScores {
  return { ...CATEGORY_SCORES[category], ...overrides };
}

function font(
  id: string,
  name: string,
  alphabetKey: string,
  description: string,
  category?: StyleCategory,
  platforms?: CompatibilityScores,
): TextStyle {
  const map = buildAlphabetMap(ALPHABETS[alphabetKey]);
  return {
    id,
    name,
    category: category ?? categoryOf(id),
    tags: [name.toLowerCase(), alphabetKey.toLowerCase()],
    platforms: platformsFor(category ?? categoryOf(id), platforms),
    description,
    convert: (text) => mapText(text, map),
  };
}

function combining(
  id: string,
  name: string,
  mark: string,
  description: string,
  category?: StyleCategory,
  platforms?: CompatibilityScores,
): TextStyle {
  return {
    id,
    name,
    category: category ?? categoryOf(id),
    tags: [name.toLowerCase()],
    platforms: platformsFor(category ?? categoryOf(id), platforms),
    description,
    convert: (text) => applyPerChar(text, mark),
  };
}

function wrap(
  id: string,
  name: string,
  left: string,
  right: string,
  description: string,
  category?: StyleCategory,
  platforms?: CompatibilityScores,
): TextStyle {
  return {
    id,
    name,
    category: category ?? categoryOf(id),
    tags: [name.toLowerCase(), "decorated"],
    platforms: platformsFor(category ?? categoryOf(id), platforms),
    description,
    convert: (text) => wrapLines(text, left, right),
  };
}

function join(
  id: string,
  name: string,
  separator: string,
  description: string,
  mode: "chars" | "non-space" | "words" = "chars",
  category?: StyleCategory,
  platforms?: CompatibilityScores,
): TextStyle {
  return {
    id,
    name,
    category: category ?? categoryOf(id),
    tags: [name.toLowerCase(), "separator"],
    platforms: platformsFor(category ?? categoryOf(id), platforms),
    description,
    convert: (text) =>
      mode === "words"
        ? interleaveWords(text, separator)
        : mode === "non-space"
          ? interleaveNonSpace(text, separator)
          : interleaveChars(text, separator),
  };
}

function custom(
  id: string,
  name: string,
  convert: (text: string, options?: StyleOptions) => string,
  description: string,
  tags: string[] = [],
  category?: StyleCategory,
  platforms?: CompatibilityScores,
): TextStyle {
  return {
    id,
    name,
    category: category ?? categoryOf(id),
    tags: [name.toLowerCase(), ...tags],
    platforms: platformsFor(category ?? categoryOf(id), platforms),
    description,
    convert,
  };
}

const UP_DOWN = buildUpsideDownMap();
const FLAG = buildFlagMap();

/** Emoji/symbol-heavy styles that many games reject. */
const EMOJI_RISK: CompatibilityScores = {
  freeFire: 60,
  pubg: 60,
  roblox: 55,
  fortnite: 58,
  minecraft: 60,
  mobileLegends: 60,
  codMobile: 60,
  valorant: 58,
  gaming: 60,
};

export const STYLES: TextStyle[] = [
  // ——— Fonts ———
  font("bold", "Bold", "bold", "Classic bold letters."),
  font("italic", "Italic", "italic", "Slanted, flowing italics."),
  font("boldItalic", "Bold Italic", "boldItalic", "Bold and slanted."),
  font("script", "Script", "script", "Elegant calligraphy."),
  font("boldScript", "Bold Script", "boldScript", "Heavy calligraphy."),
  font("fraktur", "Fraktur", "fraktur", "Old-school gothic blackletter."),
  font("boldFraktur", "Bold Fraktur", "boldFraktur", "Dark and chunky gothic."),
  font("doubleStruck", "Double-Struck", "doubleStruck", "Blackboard bold."),
  font("runic", "Runic", "runic", "Ancient runes.", "gothic"),
  font("cyrillic", "Cyrillic", "cyrillic", "Russian lookalikes.", "gothic"),
  font("greek", "Greek", "greek", "Greek letter lookalikes.", "gothic"),
  font("monospace", "Monospace", "monospace", "Fixed-width typewriter."),
  font("sans", "Sans Serif", "sans", "Clean geometric sans."),
  font("sansBold", "Sans Serif Bold", "sansBold", "Chunky sans-serif."),
  font("sansItalic", "Sans Serif Italic", "sansItalic", "Slanted sans-serif."),
  font("sansBoldItalic", "Sans Serif Bold Italic", "sansBoldItalic", "Bold, slanted sans."),
  font("fullwidth", "Fullwidth", "fullwidth", "Wide monospace-style letters."),

  // ——— Bubble / symbol alphabets ———
  font("circled", "Circled", "circled", "Every letter in a circle."),
  font("circledNegative", "Negative Circled", "circledNegative", "Filled-circle letters."),
  font("squared", "Squared", "squared", "Letters inside squares."),
  font("squaredNegative", "Negative Squared", "squaredNegative", "Filled squares."),
  font("parenthesized", "Parenthesized", "parenthesized", "Letters in tiny brackets."),
  font("superscript", "Superscript", "superscript", "Tiny raised letters."),
  font("subscript", "Subscript", "subscript", "Small lowered letters."),
  font("smallCaps", "Small Caps", "smallCaps", "Uppercase-sized capitals."),
  custom("flagLetters", "Flag Letters", (t) => mapText(t, FLAG), "Emoji flag indicators.", [], "bubble", EMOJI_RISK),
  custom("upsideDown", "Upside Down", (t) => mapText(t, UP_DOWN), "Rotated 180°."),
  custom("mirrored", "Mirrored", (t) => reverseText(t), "Reversed reading order."),

  // ——— Underline ———
  combining("underline", "Underline", COMBINING.lowLine, "Single underline under each letter."),
  combining("underlineDouble", "Double Underline", COMBINING.doubleLowLine, "Double underline."),
  combining("underlineWavy", "Wavy Underline", COMBINING.tildeBelow, "Wavy underline."),
  combining("overline", "Overline", COMBINING.overline, "Line above each letter."),
  combining("overlineDouble", "Double Overline", COMBINING.doubleOverline, "Double line above."),
  combining("underdot", "Underdot", COMBINING.underDot, "Dot under each letter."),

  // ——— Strikethrough ———
  combining("strike", "Strikethrough", COMBINING.longStrike, "Full strike through each letter."),
  combining("strikeShort", "Short Strike", COMBINING.shortStrike, "Short diagonal strike."),
  combining("strikeSlash", "Slash Strike", COMBINING.slash, "Solid slashed letters."),
  custom("strikeDouble", "Double Strike", (t) => applyPerChar(t, COMBINING.longStrike + COMBINING.longStrike), "Two strikes per letter."),

  // ——— Glitch ———
  custom("glitch", "Glitch", (t) => glitchFn(t, 2), "Corrupted signal look."),
  custom("glitchHeavy", "Glitch Heavy", (t) => glitchFn(t, 4), "Heavily corrupted."),
  custom("jitter", "Jitter", (t) => jitterFn(t), "Shaking vertical bars."),

  // ——— Zalgo ———
  custom("zalgo", "Zalgo", (t, o) => zalgoFn(t, o?.zalgoIntensity ?? 50), "Let it consume you."),
  custom("zalgoMini", "Zalgo Mini", (t, o) => zalgoFn(t, Math.min(o?.zalgoIntensity ?? 20, 30)), "A whisper of Zalgo."),
  custom("zalgoHorror", "Zalgo Horror", (t, o) => zalgoFn(t, Math.max(o?.zalgoIntensity ?? 75, 70)), "Unleash the void."),

  // ——— Kawaii ———
  custom("kawaiiHearts", "Kawaii Hearts", (t) => "(◕ᴗ◕✿) " + interleaveChars(t, " ♡ "), "Sweet and soft."),
  custom("kawaiiSparkles", "Kawaii Sparkles", (t) => "✧ " + interleaveNonSpace(t, " ✦ ") + " ✧", "Shiny and cute."),
  custom("kawaiiStars", "Kawaii Stars", (t) => "⋆｡°✩ " + interleaveWords(t, " ✩ ") + " ✩°｡⋆", "Little star trails."),
  custom("kawaiiDots", "Kawaii Dots", (t) => "｡ " + interleaveChars(t, " ・ ") + " ｡", "Tiny dot pauses."),
  custom("kawaiiFace", "Kawaii Face", (t) => "(づ｡◕‿◕｡)づ " + t + " (◕‿◕✿)", "Hold hands with it."),
  custom("kawaiiFlowers", "Kawaii Flowers", (t) => "❀ " + interleaveNonSpace(t, " ❀ ") + " ❀", "Fresh and floral."),

  // ——— Case transforms ———
  custom("checkerboard", "Checkerboard", (t) => checkerboard(t), "Alternating case pattern."),
  custom("mockCase", "Mocking Case", (t) => mockCase(t), "sPoNgEbOb energy."),
  custom("vowelAccent", "Vowel Accent", (t) => vowelAccent(t), "Acute accents on vowels."),

  // ——— Vaporwave ———
  custom("aestheticWide", "A E S T H E T I C", (t) => aestheticWide(t), "Wide spaced fullwidth."),
  join("spacedOut", "Spaced Out", " ", "Letters pushed apart.", "non-space"),

  // ——— Decorated: brackets ———
  wrap("starBox", "Star Box", "✧", "✧", "Wrapped in stars."),
  wrap("starDoubleBox", "Double Star Box", "✦", "✦", "Double sparkles."),
  wrap("starTripleBox", "Triple Star Box", "★★", "★★", "Shining bright."),
  wrap("heartBox", "Heart Box", "♡", "♡", "Soft hearts."),
  wrap("heartFullBox", "Filled Heart Box", "♥", "♥", "Full hearts.", undefined, EMOJI_RISK),
  wrap("spadeBox", "Spade Box", "♠", "♠", "Classic suits."),
  wrap("clubBox", "Club Box", "♣", "♣", "Card suit charm."),
  wrap("diamondBox", "Diamond Box", "◆", "◆", "Sharp diamonds."),
  wrap("crownBox", "Crown Box", "♛", "♛", "Royal flourish.", undefined, EMOJI_RISK),
  wrap("kingBox", "Chess King Box", "♔", "♔", "Chess regalia.", undefined, EMOJI_RISK),
  wrap("moonBox", "Moon Box", "☾", "☽", "Lunar frame."),
  wrap("sunBox", "Sun Box", "☼", "☼", "Radiant glow."),
  wrap("flowerBox", "Flower Box", "❀", "❀", "A gentle bloom."),
  wrap("flowerAltBox", "Sparkle Flower Box", "✿", "✿", "Flowers with flair."),
  wrap("musicBox", "Music Box", "♪", "♪", "A musical note.", undefined, EMOJI_RISK),
  wrap("noteBox", "Note Box", "♫", "♫", "Beamed notes.", undefined, EMOJI_RISK),
  wrap("crossBox", "Cross Box", "†", "†", "Elegant crosses."),
  wrap("tildeBox", "Tilde Box", "~", "~", "Squiggly sides."),
  wrap("tripleTildeBox", "Triple Tilde Box", "≋", "≋", "Wavy waves."),
  wrap("waveBox", "Wave Box", "〜", "〜", "Gentle waves."),
  wrap("asteriskBox", "Asterisk Box", "*", "*", "Simple sparkle."),
  wrap("doubleAsteriskBox", "Double Asterisk Box", "**", "**", "Bold sparkle."),
  wrap("slashBox", "Slash Box", "/", "/", "Forward slashes."),
  wrap("doubleSlashBox", "Double Slash Box", "//", "//", "Code-style frame."),
  wrap("parenthesisBox", "Parenthesis Box", "(", ")", "Minimal parentheses."),
  wrap("bracketBox", "Bracket Box", "[", "]", "Square brackets."),
  wrap("braceBox", "Brace Box", "{", "}", "Curly braces."),
  wrap("angleBox", "Angle Box", "《", "》", "Wide angle brackets."),
  wrap("pointyBox", "Pointy Box", "〈", "〉", "Sharp angle brackets."),
  wrap("japaneseBox", "Japanese Box", "「", "」", "Japanese corner quotes."),
  wrap("japaneseDoubleBox", "Double Japanese Box", "『", "』", "Double corner quotes."),
  wrap("cornerBox", "Corner Box", "⌜", "⌝", "Top corners."),
  wrap("cornerBottomBox", "Bottom Corner Box", "⌞", "⌟", "Bottom corners."),
  wrap("doubleBracketBox", "Double Bracket Box", "⟦", "⟧", "Deep brackets."),
  wrap("squigglyBox", "Squiggly Box", "⦃", "⦄", "Curly double braces."),
  wrap("doubleAngleBox", "Double Angle Box", "⟪", "⟫", "Double wide angles."),
  wrap("floorBox", "Floor Box", "⌊", "⌋", "Floor brackets."),
  wrap("ceilBox", "Ceil Box", "⌈", "⌉", "Ceiling brackets."),
  wrap("runeBox", "Rune Box", "᚛", "᚜", "Ancient runes."),
  wrap("quoteBox", "Quote Box", "❝", "❞", "Fancy quotes."),
  wrap("singleQuoteBox", "Single Quote Box", "'", "'", "Straight quotes."),
  wrap("energyBox", "Energy Box", "⚡", "⚡", "Electrified.", undefined, EMOJI_RISK),
  wrap("spiralBox", "Spiral Box", "❃", "❃", "Swirling charm."),
  wrap("hexCyberBox", "Hexagon Cyber", "⬢", "⬢", "Cyber hexagon frame.", undefined, EMOJI_RISK),
  wrap("fireBox", "Fire Box", "✴", "✴", "Spark flare."),
  wrap("peaceBox", "Peace Box", "☮", "☮", "Peaceful vibes.", undefined, EMOJI_RISK),
  wrap("loveBox", "Love Box", "❤", "❤", "All the love.", undefined, EMOJI_RISK),
  wrap("checkBox", "Check Box", "✓", "✓", "Approved marks.", undefined, EMOJI_RISK),
  wrap("crossXBox", "Cross Mark Box", "✗", "✗", "X marks the spot.", undefined, EMOJI_RISK),
  wrap("arrowBox", "Arrow Box", "→", "←", "Pointing in."),
  wrap("doubleArrowBox", "Double Arrow Box", "⇒", "⇐", "Implication frames."),
  wrap("infinityBox", "Infinity Box", "∞", "∞", "Endless sides."),
  wrap("warnBox", "Warning Box", "⚠", "⚠", "Caution ahead.", undefined, EMOJI_RISK),

  // ——— Decorated: joins ———
  join("dotJoin", "Dot Join", "·", "Separated by dots."),
  join("starJoin", "Star Join", "✦", "Separated by sparkles."),
  join("heartJoin", "Heart Join", "♡", "Separated by hearts."),
  join("slashJoin", "Slash Join", "/", "Separated by slashes."),
  join("plusJoin", "Plus Join", "+", "Separated by pluses."),
  join("dashJoin", "Dash Join", "-", "Separated by dashes."),
  join("underscoreJoin", "Underscore Join", "_", "Separated by underscores."),
  join("tildeJoin", "Tilde Join", "~", "Separated by tildes."),
  join("asteriskJoin", "Asterisk Join", "*", "Separated by asterisks."),
  join("waveJoin", "Wave Join", "〜", "Separated by waves."),
  join("arrowWordJoin", "Arrow Words", " → ", "Arrows between words.", "words"),
  join("heartWordJoin", "Heart Words", " ♡ ", "Hearts between words.", "words"),
  join("dotWordJoin", "Dot Words", " · ", "Dots between words.", "words"),
  join("starWordJoin", "Star Words", " ✦ ", "Stars between words.", "words"),

  // ——— Accent marks (underline) ———
  combining("macron", "Macron", COMBINING.macron, "Straight bar above."),
  combining("caron", "Caron", COMBINING.caron, "A small v above."),
  combining("grave", "Grave Accent", COMBINING.grave, "Slanted accent above."),
  combining("circumflex", "Circumflex", COMBINING.circumflex, "Pointed cap above."),
  combining("umlaut", "Umlaut", COMBINING.umlaut, "Two dots above."),
  combining("doubleAcute", "Double Acute", COMBINING.doubleAcute, "Double-slash accents."),
  combining("hookAbove", "Hook Above", COMBINING.hookAbove, "Tiny hooks above."),
  combining("ringAbove", "Ring Above", COMBINING.ringAbove, "Circles above letters."),
  combining("breve", "Breve", COMBINING.breve, "Gentle arc above."),
  combining("overdot", "Overdot", COMBINING.overdot, "Dot above each letter."),
  combining("tildeAbove", "Tilde Above", COMBINING.tildeAbove, "Wavy line above."),
  combining("xAbove", "X Above", COMBINING.xAbove, "A small x above."),
  combining("doubleGrave", "Double Grave", COMBINING.doubleGrave, "Twin grave accents."),
  combining("invertedBreve", "Inverted Breve", COMBINING.invertedBreve, "Upside-down arc above."),

  // ——— Strikethrough variants ———
  combining("strikeShortSlash", "Short Slash Strike", COMBINING.shortSolidus, "Short diagonal slash."),
  custom("strikeX", "X Strike", (t) => applyPerChar(t, COMBINING.longStrike + COMBINING.slash), "Crossed-out letters."),
  custom("strikeTilde", "Wave Strike", (t) => applyPerChar(t, COMBINING.longStrike + COMBINING.tildeBelow), "Strike with a wave."),
  custom("strikeWave", "Strike Wave", (t) => applyPerChar(t, COMBINING.longStrike + COMBINING.doubleTilde), "Double-wave strike."),

  // ——— Glitch variants ———
  custom("glitchFlicker", "Glitch Flicker", (t) => glitchFn(t, 3), "Flickering signal."),
  custom("glitchStatic", "Glitch Static", (t) => glitchFn(t, 5), "Full static corruption."),
  custom("glitchVhs", "VHS Glitch", (t) => glitchFn(jitterFn(t), 2), "Old tape distortion."),

  // ——— Zalgo variants ———
  custom("zalgoLight", "Zalgo Light", (t, o) => zalgoFn(t, Math.min(o?.zalgoIntensity ?? 25, 35)), "A soft whisper."),
  custom("zalgoHeavy", "Zalgo Heavy", (t, o) => zalgoFn(t, Math.max(o?.zalgoIntensity ?? 65, 60)), "Growing shadows."),
  custom("zalgoNightmare", "Zalgo Nightmare", (t) => zalgoFn(t, 100), "Maximum corruption."),

  // ——— Kawaii faces ———
  custom("kawaiiCute", "Kawaii Cute", (t) => "(◕‿◕) " + interleaveNonSpace(t, " ˚ ") + " (◕‿◕)", "Soft and round."),
  custom("kawaiiHappy", "Kawaii Happy", (t) => "(≧◡≦) " + t + " (≧◡≦)", "Beaming with joy."),
  custom("kawaiiBlush", "Kawaii Blush", (t) => "(˶ᵔ ᵕ ᵔ˶) " + interleaveChars(t, " ♥ ") + " (˶ᵔ ᵕ ᵔ˶)", "Shy and pink."),
  custom("kawaiiKiss", "Kawaii Kiss", (t) => "(￣ε￣) " + t + " (￣ε￣)", "Blowing kisses."),
  custom("kawaiiCat", "Kawaii Cat", (t) => "=^..^= " + interleaveNonSpace(t, " ₊ ") + " =^..^=", "Feline and soft."),
  custom("kawaiiBear", "Kawaii Bear", (t) => "ʕ•ᴥ•ʔ " + t + " ʕ•ᴥ•ʔ", "Huggable bear vibes."),
  custom("kawaiiBunny", "Kawaii Bunny", (t) => "(／≧ω≦)／ " + interleaveChars(t, " ♡ ") + " ～♡", "Bouncing with love."),
  custom("kawaiiChu", "Kawaii Chu", (t) => "(´｡• ω •｡`) " + t + " ♡", "Cuddly affection."),
  custom("kawaiiNya", "Kawaii Nya", (t) => "〜(꒪꒳꒪)〜 " + t + " ✿", "A quiet little nya."),
  custom("kawaiiStar", "Kawaii Star Eyes", (t) => "(★^O^★) " + t + " (★^O^★)", "Twinkling with stars."),

  // ——— Vaporwave ———
  custom("aestheticSpace", "A E S T H E T I C Wide", (t) => Array.from(t).map((ch) => (/\s/.test(ch) ? ch : ch + "\u3000\u3000")).join("").trimEnd(), "Extra-wide spacing."),
  join("aestheticTilde", "A E S T H E T I C Wave", "≋", "Waves between letters.", "non-space"),
  join("aestheticDot", "A E S T H E T I C Dot", " ・ ", "Dots between letters.", "non-space"),
  join("aestheticSparkle", "A E S T H E T I C Sparkle", " ✦ ", "Sparkles between letters.", "non-space"),
  join("aestheticWave", "A E S T H E T I C Tilde", " 〜 ", "Tildes between letters.", "non-space"),

  // ——— Case & spacing utilities ———
  custom("upperCase", "UPPERCASE", (t) => t.toUpperCase(), "ALL CAPS ENERGY."),
  custom("lowerCase", "lowercase", (t) => t.toLowerCase(), "All quiet and small."),
  custom("titleCase", "Title Case", (t) => t.replace(/(^|[\s(\[{«„])(\p{L})/gu, (m, sep, letter) => `${sep}${letter.toUpperCase()}`), "Capitalized words."),
  custom("reverseWords", "Reversed Words", (t) => t.split("\n").map((l) => l.split(/(\s+)/).reverse().join("")).join("\n"), "Words back to front."),
  join("kebabCase", "Kebab Case", "-", "Dashes between words.", "words"),
  join("snakeCase", "Snake Case", "_", "Underscores between words.", "words"),
  join("dotCaseWords", "Dot Case", "·", "Dots between words.", "words"),
  custom("noSpaces", "No Spaces", (t) => t.replace(/ +/g, ""), "Everything joined together."),

  // ——— Zodiac (symbol) ———
  wrap("ariesBox", "Aries", "♈", "♈", "Ram season.", "symbol", EMOJI_RISK),
  wrap("taurusBox", "Taurus", "♉", "♉", "Bull energy.", "symbol", EMOJI_RISK),
  wrap("geminiBox", "Gemini", "♊", "♊", "Twins vibes.", "symbol", EMOJI_RISK),
  wrap("cancerBox", "Cancer", "♋", "♋", "Crab charm.", "symbol", EMOJI_RISK),
  wrap("leoBox", "Leo", "♌", "♌", "Lion pride.", "symbol", EMOJI_RISK),
  wrap("virgoBox", "Virgo", "♍", "♍", "Maiden grace.", "symbol", EMOJI_RISK),
  wrap("libraBox", "Libra", "♎", "♎", "Scales balance.", "symbol", EMOJI_RISK),
  wrap("scorpioBox", "Scorpio", "♏", "♏", "Scorpion sting.", "symbol", EMOJI_RISK),
  wrap("sagittariusBox", "Sagittarius", "♐", "♐", "Archer aim.", "symbol", EMOJI_RISK),
  wrap("capricornBox", "Capricorn", "♑", "♑", "Goat climb.", "symbol", EMOJI_RISK),
  wrap("aquariusBox", "Aquarius", "♒", "♒", "Water bearer.", "symbol", EMOJI_RISK),
  wrap("piscesBox", "Pisces", "♓", "♓", "Twin fish.", "symbol", EMOJI_RISK),

  // ——— Math & symbol wraps (symbol) ———
  wrap("plusMinusBox", "Plus Minus Box", "±", "±", "Balanced marks.", "symbol"),
  wrap("degreesBox", "Degrees Box", "°", "°", "Hot around the edges.", "symbol"),
  wrap("divideBox", "Divide Box", "÷", "÷", "Divided attention.", "symbol"),
  wrap("multiplyBox", "Multiply Box", "×", "×", "Multiplied marks.", "symbol"),
  wrap("sqrtBox", "Square Root Box", "√", "√", "Rooted sides.", "symbol"),
  wrap("sigmaBox", "Sigma Box", "Σ", "Σ", "Summed up.", "symbol"),
  wrap("deltaBox", "Delta Box", "∆", "∆", "Change is constant.", "symbol"),
  wrap("piBox", "Pi Box", "π", "π", "Mathematical flair.", "symbol"),
  wrap("omegaBox", "Omega Box", "Ω", "Ω", "The final letter.", "symbol"),
  wrap("sumBox", "Sum Box", "∑", "∑", "Everything added up.", "symbol"),
  wrap("integralBox", "Integral Box", "∫", "∫", "Curved calculus.", "symbol"),
  wrap("approxBox", "Approx Box", "≈", "≈", "Roughly balanced.", "symbol"),

  // ——— Decorated: stars & shapes ———
  wrap("starFillBox", "Filled Star Box", "★", "★", "Solid stars."),
  wrap("starFillDoubleBox", "Double Filled Star Box", "★★", "★★", "Double solid stars."),
  wrap("starOutlineBox", "Outline Star Box", "☆", "☆", "Hollow stars."),
  wrap("starEightBox", "Eight-Point Star Box", "✵", "✵", "Complex stars."),
  wrap("starFlowerBox", "Star Flower Box", "✲", "✲", "Snowflake stars."),
  wrap("sparkleFourBox", "Sparkle Box", "✩", "✩", "Paper sparkles."),
  wrap("snowflakeBox", "Snowflake Box", "❄", "❄", "Cold and crisp."),
  wrap("snowflakeAltBox", "Starflake Box", "❆", "❆", "Asterisk snow."),
  wrap("leafBox", "Leaf Box", "❧", "❧", "Falling leaves."),
  wrap("floralHeartBox", "Floral Heart Box", "❦", "❦", "Ornamental hearts."),
  wrap("flowerWhiteBox", "Blossom Box", "❁", "❁", "Delicate blossoms."),
  wrap("crescentBox", "Crescent Box", "☾", "☾", "A sleepy moon."),
  wrap("sunRaysBox", "Sun Rays Box", "☀", "☀", "Bright sunshine.", undefined, EMOJI_RISK),
  wrap("cloudBox", "Cloud Box", "☁", "☁", "Up in the sky.", undefined, EMOJI_RISK),
  wrap("umbrellaBox", "Umbrella Box", "☂", "☂", "Rainy day.", undefined, EMOJI_RISK),
  wrap("snowmanBox", "Snowman Box", "☃", "☃", "Frosty sides.", undefined, EMOJI_RISK),
  wrap("cometBox", "Comet Box", "☄", "☄", "Shooting stars.", undefined, EMOJI_RISK),
  wrap("starDavidBox", "Star of David Box", "✡", "✡", "Six-pointed stars.", "symbol", EMOJI_RISK),
  wrap("yinYangBox", "Yin Yang Box", "☯", "☯", "Balanced harmony.", "symbol", EMOJI_RISK),
  wrap("dharmaBox", "Dharma Wheel Box", "☸", "☸", "The wheel turns.", "symbol", EMOJI_RISK),
  wrap("atomBox", "Atom Box", "⚛", "⚛", "Atomic orbits.", "symbol", EMOJI_RISK),
  wrap("infinitySolidBox", "Solid Infinity Box", "♾", "♾", "Endless loops."),

  // ——— Decorated: planets & celestial (symbol) ———
  wrap("mercuryBox", "Mercury Box", "☿", "☿", "Planetary sign.", "symbol", EMOJI_RISK),
  wrap("venusBox", "Venus Box", "♀", "♀", "Feminine glyph.", "symbol", EMOJI_RISK),
  wrap("marsBox", "Mars Box", "♂", "♂", "Masculine glyph.", "symbol", EMOJI_RISK),
  wrap("jupiterBox", "Jupiter Box", "♃", "♃", "Jovian sign.", "symbol", EMOJI_RISK),
  wrap("saturnBox", "Saturn Box", "♄", "♄", "Ringed planet.", "symbol", EMOJI_RISK),

  // ——— Decorated: everyday glyphs ———
  wrap("mailBox", "Mail Box", "✉", "✉", "You've got mail.", undefined, EMOJI_RISK),
  wrap("phoneBox", "Phone Box", "☎", "☎", "Call me maybe.", undefined, EMOJI_RISK),
  wrap("pencilBox", "Pencil Box", "✎", "✎", "Write it down."),
  wrap("scissorsBox", "Scissors Box", "✂", "✂", "Cut it out.", undefined, EMOJI_RISK),
  wrap("checkAltBox", "Heavy Check Box", "✔", "✔", "Bold approvals.", undefined, EMOJI_RISK),
  wrap("crossAltBox", "Heavy Cross Box", "✘", "✘", "Bold rejections."),
  wrap("bulletBox", "Bullet Box", "•", "•", "Focused dots."),
  wrap("sectionBox", "Section Box", "§", "§", "Legal chic.", "symbol"),
  wrap("paragraphBox", "Paragraph Box", "¶", "¶", "Editorial mark.", "symbol"),

  // ——— Decorated: geometric shapes ———
  wrap("diamondThinBox", "Thin Diamond Box", "◇", "◇", "Hollow diamonds."),
  wrap("diamondFillBox", "Filled Diamond Box", "♦", "♦", "Solid diamonds."),
  wrap("triangleUpBox", "Triangle Box", "△", "△", "Pointing up."),
  wrap("triangleDownBox", "Down Triangle Box", "▽", "▽", "Pointing down."),
  wrap("triangleFillBox", "Filled Triangle Box", "▲", "▲", "Solid triangles."),
  wrap("pentagonBox", "Pentagon Box", "⬟", "⬟", "Five-sided frame."),
  wrap("hexagonBox", "Hexagon Box", "⬡", "⬡", "Six-sided frame."),
  wrap("circleDotBox", "Circled Dot Box", "⊙", "⊙", "Target circles."),
  wrap("circleCrossBox", "Circled Cross Box", "⊗", "⊗", "Crossed circles."),
  wrap("circlePlusBox", "Circled Plus Box", "⊕", "⊕", "Plus in a circle."),
  wrap("leftRightArrowBox", "Left Right Arrow Box", "↔", "↔", "Two-way frame."),
  wrap("upDownArrowBox", "Up Down Arrow Box", "↕", "↕", "Vertical frame."),

  // ——— Decorated: comparison & math ———
  wrap("notEqualBox", "Not Equal Box", "≠", "≠", "Rebel sides.", "symbol"),
  wrap("identicalBox", "Identical Box", "≡", "≡", "Perfectly equal.", "symbol"),
  wrap("greaterBox", "Greater Than Box", "≫", "≫", "Much greater."),
  wrap("lessBox", "Less Than Box", "≪", "≪", "Much less."),
  wrap("minusBox", "Minus Box", "−", "−", "Subtracted sides."),
  wrap("squareRootBox", "Radical Box", "√", "√", "Rooted frame."),

  // ——— Decorated: hazardous & sacred (symbol, game-risky) ———
  wrap("skullBox", "Skull Box", "☠", "☠", "Skull and crossbones.", "symbol", EMOJI_RISK),
  wrap("radioactiveBox", "Radioactive Box", "☢", "☢", "Caution: energy.", "symbol", EMOJI_RISK),
  wrap("biohazardBox", "Biohazard Box", "☣", "☣", "Hazardous vibes.", "symbol", EMOJI_RISK),
  wrap("recycleBox", "Recycle Box", "♻", "♻", "Reduce, reuse.", "symbol", EMOJI_RISK),

  // ——— Decorated: joins (extra) ———
  join("equalsJoin", "Equals Join", "=", "Separated by equals."),
  join("pipeJoin", "Pipe Join", "|", "Separated by pipes."),
  join("colonJoin", "Colon Join", ":", "Separated by colons."),
  join("commaJoin", "Comma Join", ",", "Separated by commas."),
  join("hashJoin", "Hashtag Join", "#", "Separated by hashtags."),
  join("ampersandJoin", "Ampersand Join", "&", "Separated by ampersands."),
  join("percentJoin", "Percent Join", "%", "Separated by percents."),
  join("arrowJoin", "Arrow Join", "→", "Separated by arrows."),
  join("arrowNonSpaceJoin", "Arrow Char Join", "→", "Arrows between letters.", "non-space"),
  join("diamondJoin", "Diamond Join", "◆", "Separated by diamonds."),
  join("dotNonSpaceJoin", "Dot Char Join", "·", "Dots between letters.", "non-space"),
  join("heartNonSpaceJoin", "Heart Char Join", "♡", "Hearts between letters.", "non-space"),
  join("starNonSpaceJoin", "Star Char Join", "✦", "Stars between letters.", "non-space"),
  join("slashWordJoin", "Slash Words", " / ", "Slashes between words.", "words"),
  join("underscoreWordJoin", "Underscore Words", " _ ", "Underscores between words.", "words"),
  join("dashWordJoin", "Dash Words", " - ", "Dashes between words.", "words"),
  join("bulletWordJoin", "Bullet Words", " • ", "Bullets between words.", "words"),

  // ——— Decorated: per-letter framing ———
  custom("perCharBrackets", "Bracket Every Letter", (t) => Array.from(t).map((ch) => (/\s/.test(ch) ? ch : "[" + ch + "]")).join(""), "Every letter framed."),
  custom("perCharParens", "Paren Every Letter", (t) => Array.from(t).map((ch) => (/\s/.test(ch) ? ch : "(" + ch + ")")).join(""), "Every letter held."),
  custom("caged", "Caged", (t) => Array.from(t).map((ch) => (/\s/.test(ch) ? ch : "【" + ch + "】")).join(""), "Every letter boxed in."),
  custom("boxFrame", "Box Frame", (t) => {
    const lines = t.split("\n");
    const width = Math.max(1, ...lines.map((l) => Array.from(l).length));
    const bar = "─".repeat(width + 2);
    return ["┌" + bar + "┐", ...lines.map((l) => "│ " + l.padEnd(width) + " │"), "└" + bar + "┘"].join("\n");
  }, "A neat box around the text."),
];

export const STYLE_MAP: Record<string, TextStyle> = Object.fromEntries(
  STYLES.map((s) => [s.id, s]),
);

export function getStyleById(id: string): TextStyle | undefined {
  return STYLE_MAP[id];
}
