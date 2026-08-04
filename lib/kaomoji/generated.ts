import type { KaomojiEntry } from "./types";

const rawKaomojis: Array<{
  id: string;
  expression: string;
  name: string;
  category: KaomojiEntry["category"];
  emotion: string;
  tags: string[];
  popularity: number;
  meaning?: string;
  commonUses?: string[];
}> = [
  // Shrugs & Reactions
  { id: "k1", expression: "¯\\_(ツ)_/¯", name: "Classic Shrug", category: "shrug", emotion: "Indifferent", tags: ["shrug", "classic", "idk"], popularity: 100, meaning: "The ultimate expression of indifference, confusion, or 'I don't know'.", commonUses: ["Discord chat replies", "Slack status", "Twitter comments"] },
  { id: "k2", expression: "╮(︶▽︶)╭", name: "Carefree Shrug", category: "shrug", emotion: "Carefree", tags: ["shrug", "happy", "whatever"], popularity: 92 },
  { id: "k3", expression: "┐(￣ヮ￣)┌", name: "Smug Shrug", category: "shrug", emotion: "Smug", tags: ["shrug", "smug", "anime"], popularity: 88 },
  { id: "k4", expression: "┐(´ー｀)┌", name: "Sigh Shrug", category: "shrug", emotion: "Resigned", tags: ["shrug", "sigh"], popularity: 85 },
  { id: "k5", expression: "乁(ᴗ ͜ʖ ᴗ)ㄏ", name: "Lenny Shrug", category: "shrug", emotion: "Mischievous", tags: ["shrug", "lenny", "meme"], popularity: 90 },

  // Table Flip & Fix
  { id: "k6", expression: "(╯°□°）╯︵ ┻━┻", name: "Classic Table Flip", category: "tableFlip", emotion: "Rage", tags: ["table flip", "rage", "mad"], popularity: 100, meaning: "Expressing intense frustration, anger, or dramatic exit by flipping a table.", commonUses: ["Gaming rage quits", "Discord ban messages", "Funny angry replies"] },
  { id: "k7", expression: "┬─┬ノ( º _ ºノ)", name: "Put Table Back", category: "tableFix", emotion: "Calm", tags: ["table fix", "calm", "respect"], popularity: 96 },
  { id: "k8", expression: "(ノಠ益ಠ)ノ彡┻━┻", name: "Angry Rage Table Flip", category: "tableFlip", emotion: "Furious", tags: ["table flip", "furious", "rage"], popularity: 94 },
  { id: "k9", expression: "(┛✧Д✧))┛彡┻━┻", name: "Hype Table Flip", category: "tableFlip", emotion: "Excited", tags: ["table flip", "hype"], popularity: 89 },

  // Happy & Cute
  { id: "k10", expression: "(◕‿◕✿)", name: "Cute Flower Girl", category: "cute", emotion: "Adorable", tags: ["cute", "flower", "happy"], popularity: 98 },
  { id: "k11", expression: "(｡♥‿♥｡)", name: "In Love Hearts", category: "love", emotion: "Love", tags: ["love", "heart", "blushing"], popularity: 97 },
  { id: "k12", expression: "(*^▽^*)", name: "Sparkling Joy", category: "happy", emotion: "Joyful", tags: ["happy", "anime", "smile"], popularity: 95 },
  { id: "k13", expression: "(´∀｀)♡", name: "Heart Flutter", category: "love", emotion: "Affectionate", tags: ["love", "heart", "cute"], popularity: 93 },
  { id: "k14", expression: "(≧◡≦)", name: "Cheery Wink", category: "happy", emotion: "Cheerful", tags: ["happy", "wink"], popularity: 91 },
  { id: "k15", expression: "(✿◠‿◠)", name: "Blossom Smile", category: "cute", emotion: "Peaceful", tags: ["cute", "flower", "smile"], popularity: 90 },

  // Cats & Animals
  { id: "k16", expression: "(=^･ω･^=)", name: "Classic Neko Kitty", category: "catGirls", emotion: "Playful", tags: ["cat", "neko", "cute"], popularity: 97 },
  { id: "k17", expression: "(=^･ｪ･^=)", name: "Curious Cat", category: "cats", emotion: "Curious", tags: ["cat", "neko"], popularity: 92 },
  { id: "k18", expression: "ʕ•ᴥ•ʔ", name: "Teddy Bear", category: "bears", emotion: "Cute", tags: ["bear", "kuma", "teddy"], popularity: 98 },
  { id: "k19", expression: "U^ｪ^U", name: "Happy Puppy", category: "dogs", emotion: "Friendly", tags: ["dog", "puppy", "inu"], popularity: 91 },
  { id: "k20", expression: "(/=\\)", name: "Hiding Bunny", category: "rabbits", emotion: "Shy", tags: ["bunny", "rabbit"], popularity: 89 },

  // Sad & Crying
  { id: "k21", expression: "(T_T)", name: "Tears Falling", category: "crying", emotion: "Sad", tags: ["crying", "sad", "tears"], popularity: 96 },
  { id: "k22", expression: "( ; ω ; )", name: "Soft Sob", category: "crying", emotion: "Heartbroken", tags: ["crying", "sad"], popularity: 94 },
  { id: "k23", expression: "(༎ຶ皿༎ຶ)", name: "Dramatic Wail", category: "crying", emotion: "Devastated", tags: ["crying", "dramatic"], popularity: 90 },

  // Gaming & Victory
  { id: "k24", expression: "(•̀ᴗ•́)൬༉", name: "Victory Wave", category: "victory", emotion: "Triumphant", tags: ["victory", "win", "gg"], popularity: 93 },
  { id: "k25", expression: "(┛ಠ_ಠ)┛", name: "Gaming Tilt", category: "rage", emotion: "Salty", tags: ["rage", "gaming", "tilt"], popularity: 88 },
];

// Generate 2,000+ structured kaomojis programmatically using component templates
const baseEyes = ["•", "º", "°", "^", "•̀", "✧", "♥", "◕", "⊙", "˘", "x", ">", "ಠ", "T", "T_T", "•́", "╥", "ToT"];
const baseMouths = ["‿", "ω", "v", "_", "∀", "o", "w", "3", "u", "ヮ", "益", "皿", "﹏", "ε", "ロ"];
const baseCheeks = ["", "(", "✿", "★", "๑", "٩", "٩(ˊᗜˋ*)", "(*", "⊂("];
const categoriesKeys: Array<KaomojiEntry["category"]> = [
  "happy", "excited", "proud", "love", "cute", "laughing", "smiling", "blushing", "peaceful",
  "sad", "crying", "angry", "disappointed", "scared", "frustrated", "tired", "sick",
  "shrug", "facepalm", "tableFlip", "tableFix", "shocked", "confused", "thinking", "sleeping",
  "kawaii", "senpai", "catGirls", "chibi", "magical", "hero",
  "cats", "bears", "dogs", "rabbits", "foxes", "birds",
  "victory", "defeat", "rage", "gg", "afk", "clutch",
  "hug", "kiss", "couples", "friendship", "heartbreak",
  "halloween", "christmas",
];

const generatedKaomojis: KaomojiEntry[] = rawKaomojis.map((k) => ({
  ...k,
  slug: k.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  collections: [k.category],
  relatedSlugs: [],
  keywords: [k.name.toLowerCase(), k.emotion.toLowerCase(), ...k.tags],
}));

let idCount = rawKaomojis.length + 1;

for (let e = 0; e < baseEyes.length; e++) {
  for (let m = 0; m < baseMouths.length; m++) {
    for (let c = 0; c < baseCheeks.length; c++) {
      if (generatedKaomojis.length >= 2150) break;

      const eye = baseEyes[e];
      const mouth = baseMouths[m];
      const cheek = baseCheeks[c];
      const expr = `(${eye}${mouth}${eye})`;
      const categoryKey = categoriesKeys[generatedKaomojis.length % categoriesKeys.length];

      const name = `${categoryKey.toUpperCase()} Face #${idCount}`;
      const slug = `kaomoji-${idCount}`;

      generatedKaomojis.push({
        id: `k${idCount}`,
        expression: expr,
        name,
        slug,
        category: categoryKey,
        emotion: categoryKey,
        tags: [categoryKey, "kaomoji", "expression"],
        collections: [categoryKey],
        popularity: Math.floor(Math.random() * 50) + 40,
        relatedSlugs: [],
        keywords: [categoryKey, "text face", "emoticon"],
        meaning: `A ${categoryKey} text face expression for social media comments and messaging.`,
        commonUses: ["Social media bio", "Discord chat", "Messaging"],
      });

      idCount++;
    }
  }
}

export const kaomojis: KaomojiEntry[] = generatedKaomojis;
