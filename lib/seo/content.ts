import type { AppConfig } from "@/lib/text-engine/types";
import type { StyleCategory } from "@/lib/text-engine/types";
import type { SymbolCategory } from "@/lib/symbols/categories";
import type { KaomojiCategory } from "@/lib/kaomoji/categories";
import type { UsernameTheme } from "@/lib/usernames/themes";
import type { FAQItem } from "@/components/seo/FAQSection";

export interface PageContent {
  introTitle: string;
  introParagraph: string;
  faqs: FAQItem[];
}

/**
 * 1. Platform App Generator Content (20 pages)
 */
export function getAppContent(app: AppConfig): PageContent {
  const limits = app.characterLimits ?? {};
  const limitEntries = Object.entries(limits);
  const limitDetails = limitEntries.length > 0
    ? limitEntries.map(([k, v]) => `${k}: ${v} characters`).join(", ")
    : "standard platform character limits";

  let introParagraph = "";
  if (app.type === "gaming") {
    introParagraph = `The ${app.title} creates custom gaming handles, clan tags, and decorated usernames specifically formatted for ${app.name}. Nicknames are optimized for game character rules (${limitDetails}) and support special battle royale symbols like 亗, ꧁, ☬, and ツ. Every style converts locally in your browser so you can copy and paste directly into your ${app.name} account or lobby chat.`;
  } else if (app.type === "creator") {
    introParagraph = `The ${app.title} generates high-visibility Unicode styles for ${app.name} channel branding, stream titles, and profile bios. Formatted to comply with platform limits (${limitDetails}), these custom fonts help your content stand out in recommendations, search feeds, and chat commands. Copy any style in one click with instant client-side conversion.`;
  } else {
    introParagraph = `The ${app.title} transforms standard text into eye-catching Unicode lettering for ${app.name} profiles, captions, stories, and display names. Designed around platform rules (${limitDetails}), these fancy styles render across modern iOS, Android, and desktop browsers without requiring extra font downloads. Copy your favorite variation in one tap for an instant profile upgrade.`;
  }

  const faqs: FAQItem[] = [
    {
      question: `How do I change my ${app.name} font using Glyphtiq?`,
      answer: `Type your text into the input box above, choose your favorite style from the generated results, tap copy, and paste it directly into your ${app.name} profile, bio, or caption editor.`,
    },
    {
      question: `What are the character limits for ${app.name}?`,
      answer: `${app.name} enforces specific character limits: ${limitDetails}. Glyphtiq includes live character counters to ensure your text fits within these requirements.`,
    },
    {
      question: `Are Unicode fonts safe and supported on ${app.name}?`,
      answer: `Yes. Glyphtiq uses standardized Unicode characters that are universally supported across modern operating systems, ensuring your text displays properly to your followers and teammates.`,
    },
  ];

  return {
    introTitle: `About ${app.title}`,
    introParagraph,
    faqs,
  };
}

/**
 * 2. Style Category Content (16 pages)
 */
const CATEGORY_TECH_INFO: Record<StyleCategory, { block: string; focus: string }> = {
  bold: {
    block: "Mathematical Bold and Sans-Serif Bold Unicode blocks (U+1D400–U+1D7FF)",
    focus: "high-contrast, impactful lettering for headlines, important announcements, and emphasized bio tags",
  },
  italic: {
    block: "Mathematical Italic and Sans-Serif Italic Unicode code points",
    focus: "slanted, dynamic typography that adds subtle emphasis and motion to social posts and messages",
  },
  cursive: {
    block: "Mathematical Script and Calligraphic Unicode character sets",
    focus: "flowing, elegant handwritten aesthetic text for Instagram bios, love notes, and luxury branding",
  },
  bubble: {
    block: "Enclosed Alphanumerics and Circled Unicode ranges (U+2460–U+24FF)",
    focus: "friendly, playful circled and black-bubble letters that create standout titles and bullet points",
  },
  gothic: {
    block: "Mathematical Fraktur and Blackletter Unicode blocks (U+1D504–U+1D537)",
    focus: "medieval, dark, and heavy metal lettering for Discord server roles, gaming clan tags, and edgy aesthetics",
  },
  monospace: {
    block: "Mathematical Monospace Unicode code points (U+1D670–U+1D6A3)",
    focus: "uniform, typewriter-style fixed-width characters favored by developers, tech enthusiasts, and minimalist feeds",
  },
  smallcaps: {
    block: "Unicode Phonetic Extensions and Small Capital glyphs",
    focus: "miniature, elevated capital lettering designed for clean subheadings and modern minimalist signatures",
  },
  vaporwave: {
    block: "Fullwidth Latin and Halfwidth Kana Unicode characters (U+FF00–U+FFEF)",
    focus: "vaporwave, spaced-out, and nostalgic letterforms popular in Y2K, retro, and anime aesthetics",
  },
  upsidedown: {
    block: "Inverted Latin and IPA phonetic character mappings",
    focus: "flipped and reversed text designed for fun chat surprises, trick messages, and puzzle nicknames",
  },
  underline: {
    block: "Combining Low Line (U+0332) and double underline diacritics",
    focus: "continuous underlined text effects that emphasize key words without requiring rich text editors",
  },
  strikethrough: {
    block: "Combining Long Stroke Overlay (U+0336) and tilde diacritics",
    focus: "crossed-out and wavy text effects perfect for humorous corrections, to-do lists, and edited thoughts",
  },
  glitch: {
    block: "Combining Diacritical Marks (U+0300–U+036F)",
    focus: "corrupted, chaotic text effects that add vertical distortion and cybernetic mystery to usernames",
  },
  zalgo: {
    block: "Cascading stacked Combining Diacritical Marks",
    focus: "intense cursed and void typography popular in horror, roleplay, and gaming channels",
  },
  kawaii: {
    block: "Japanese decorative marks, sparkles, and circled character combinations",
    focus: "sweet, expressive text styles decorated with cute symbols for gaming handles and social profiles",
  },
  symbol: {
    block: "Mathematical symbols, Greek letters, and stylized glyph replacements",
    focus: "visually transformed characters that blend letters and symbols for distinctive handle branding",
  },
  decorated: {
    block: "Unicode dingbats, wingdings, brackets, and ornamental fleurons",
    focus: "framed, bordered, and sparkling text decorated with stars, hearts, and floral dividers",
  },
};

export function getCategoryContent(categoryKey: StyleCategory, label: string, styleCount: number): PageContent {
  const info = CATEGORY_TECH_INFO[categoryKey] ?? {
    block: "standardized Unicode mathematical and decorative blocks",
    focus: "stylish custom text formatting across social media and gaming networks",
  };

  const introParagraph = `${label} font styles utilize ${info.block} to produce ${info.focus}. Because these styles are composed of genuine Unicode code points rather than device-specific fonts or CSS formatting, they retain their distinct appearance when copied into social bios, messaging apps, and game profiles. Browse the ${styleCount} ${label.toLowerCase()} style variations below to preview and copy your customized text instantly.`;

  const faqs: FAQItem[] = [
    {
      question: `How do ${label.toLowerCase()} Unicode fonts work?`,
      answer: `${label} fonts map standard alphanumeric keys to special Unicode symbols located in mathematical and typographic blocks. This allows the styled appearance to remain intact anywhere plain text is accepted.`,
    },
    {
      question: `Can I copy and paste ${label.toLowerCase()} text into any app?`,
      answer: `Yes. You can paste ${label.toLowerCase()} text into Instagram, TikTok, Discord, X (Twitter), Facebook, WhatsApp, YouTube comments, and multiplayer gaming handles.`,
    },
    {
      question: `Do my friends need special fonts installed to read ${label.toLowerCase()} text?`,
      answer: `No. Standard modern operating systems (iOS, Android, Windows, macOS, Linux) include native system font support for these Unicode character ranges.`,
    },
  ];

  return {
    introTitle: `About ${label} Fonts`,
    introParagraph,
    faqs,
  };
}

/**
 * 3. Symbol Category Content (74 pages)
 */
export function getSymbolCategoryContent(category: SymbolCategory, count: number): PageContent {
  const subNames = category.subcategories.map((s) => s.name).join(", ");
  const subClause = subNames ? ` Featuring subcategories such as ${subNames}, each` : " Each";

  const introParagraph = `This collection features ${count} ${category.name} Unicode symbols curated for social media bios, chat reactions, and design typography. ${category.description}${subClause} symbol is mapped with its official Unicode code point, HTML entity, and JavaScript escape code for rapid copying. Tap any symbol card to copy it directly to your clipboard with zero formatting loss.`;

  const faqs: FAQItem[] = [
    {
      question: `How do I copy and paste ${category.name} symbols?`,
      answer: `Click or tap on any symbol in the grid above to instantly copy it to your clipboard. You can then paste it into any text field, document, or social media app.`,
    },
    {
      question: `Will ${category.name} symbols work on Instagram and Discord?`,
      answer: `Yes. All symbols in this collection are part of the international Unicode Standard and display properly in Instagram bios, Discord channels, TikTok comments, and messaging apps.`,
    },
    {
      question: `How do I find code points and HTML entities for these symbols?`,
      answer: `Clicking on any individual symbol opens its detailed view containing official hex code points (U+XXXX), HTML entities (&#xXXXX;), and JavaScript escape sequences (\\u{XXXX}).`,
    },
  ];

  return {
    introTitle: `About ${category.name} Symbols`,
    introParagraph,
    faqs,
  };
}

/**
 * 4. Kaomoji Category Content (52 pages)
 */
export function getKaomojiCategoryContent(category: KaomojiCategory, count: number): PageContent {
  const introParagraph = `Browse our directory of ${count} ${category.name} Japanese kaomojis and text emoticons. ${category.description} Unlike Western sideways emoticons, Japanese kaomojis are designed to be read upright and utilize a diverse range of Japanese kana, punctuation marks, and mathematical symbols to convey expressive emotions. Tap any kaomoji to copy it to your clipboard for instant chat reactions.`;

  const faqs: FAQItem[] = [
    {
      question: `What are ${category.name} kaomojis?`,
      answer: `${category.name} kaomojis are upright Japanese text faces crafted from keyboard symbols and East Asian characters to visually communicate ${category.name.toLowerCase()} expressions without images.`,
    },
    {
      question: `How do I paste ${category.name} kaomojis in Discord or TikTok?`,
      answer: `Tap any kaomoji card above to copy the text face to your clipboard, then paste (Ctrl+V or long-press paste) directly into your chat or comment box.`,
    },
    {
      question: `Do I need a Japanese keyboard installed to use these emoticons?`,
      answer: `No. All kaomojis on Glyphtiq are pre-assembled Unicode text strings that work right in your browser with no special keyboard or font downloads required.`,
    },
  ];

  return {
    introTitle: `About ${category.name} Kaomojis`,
    introParagraph,
    faqs,
  };
}

/**
 * 5. Username Theme Content (20 pages)
 */
export function getUsernameThemeContent(theme: UsernameTheme): PageContent {
  const sampleCores = theme.cores.slice(0, 5).join(", ");
  const introParagraph = `Generate creative ${theme.name.toLowerCase()} usernames and aesthetic handle ideas tailored for social profiles and gaming accounts. ${theme.description} Our generator pairs thematic roots (${sampleCores}) with stylistic prefixes and suffixes optimized for character limit rules across Instagram, TikTok, Discord, and popular multiplayer games.`;

  const faqs: FAQItem[] = [
    {
      question: `How does the ${theme.name} username generator create ideas?`,
      answer: `The generator combines curated ${theme.name.toLowerCase()} core words with stylistic prefixes, suffixes, and Unicode symbols to create original handle ideas formatted for modern platforms.`,
    },
    {
      question: `Are these ${theme.name.toLowerCase()} usernames compatible with games and social media?`,
      answer: `Yes. The generated usernames adhere to standard alphanumeric rules and delimiters supported by major gaming networks and social platforms.`,
    },
    {
      question: `How do I choose the best ${theme.name.toLowerCase()} handle?`,
      answer: `Experiment with different seed words and affixes in the Username Studio above, test your favorites in the live preview, and copy your chosen handle in one click.`,
    },
  ];

  return {
    introTitle: `About ${theme.name} Usernames`,
    introParagraph,
    faqs,
  };
}
