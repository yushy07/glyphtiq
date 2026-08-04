import type { KaomojiCategoryKey } from "./types";

export interface KaomojiCategory {
  key: KaomojiCategoryKey;
  name: string;
  slug: string;
  description: string;
  group: "Positive" | "Negative" | "Reactions" | "Anime" | "Animals" | "Gaming" | "Relationships" | "Seasonal";
}

export const KAOMOJI_CATEGORIES: Record<KaomojiCategoryKey, KaomojiCategory> = {
  happy: { key: "happy", name: "Happy", slug: "happy", description: "Joyful, cheerful, and positive kaomoji expressions.", group: "Positive" },
  excited: { key: "excited", name: "Excited", slug: "excited", description: "Hyper, energetic, and hyped Japanese kaomojis.", group: "Positive" },
  proud: { key: "proud", name: "Proud", slug: "proud", description: "Smug, confident, and victorious faces.", group: "Positive" },
  love: { key: "love", name: "Love", slug: "love", description: "Heart eyes, affectionate, and romantic emoticons.", group: "Positive" },
  cute: { key: "cute", name: "Cute & Kawaii", slug: "cute", description: "Adorable, soft, and sweet kaomojis.", group: "Positive" },
  laughing: { key: "laughing", name: "Laughing", slug: "laughing", description: "LOL, giggling, and hilarious text faces.", group: "Positive" },
  smiling: { key: "smiling", name: "Smiling", slug: "smiling", description: "Gentle, friendly, and warm smiling kaomojis.", group: "Positive" },
  blushing: { key: "blushing", name: "Blushing", slug: "blushing", description: "Shy, embarrassed, and rosy-cheeked faces.", group: "Positive" },
  peaceful: { key: "peaceful", name: "Peaceful", slug: "peaceful", description: "Calm, relaxed, and chill kaomojis.", group: "Positive" },

  sad: { key: "sad", name: "Sad", slug: "sad", description: "Depressed, lonely, and gloomy kaomojis.", group: "Negative" },
  crying: { key: "crying", name: "Crying", slug: "crying", description: "Tears, sobbing, and weeping text faces.", group: "Negative" },
  angry: { key: "angry", name: "Angry", slug: "angry", description: "Raging, mad, and furious kaomojis.", group: "Negative" },
  disappointed: { key: "disappointed", name: "Disappointed", slug: "disappointed", description: "Upset, defeated, and let down emoticons.", group: "Negative" },
  scared: { key: "scared", name: "Scared", slug: "scared", description: "Terrified, nervous, and anxious kaomojis.", group: "Negative" },
  frustrated: { key: "frustrated", name: "Frustrated", slug: "frustrated", description: "Annoyed, stressed, and venting faces.", group: "Negative" },
  tired: { key: "tired", name: "Tired", slug: "tired", description: "Exhausted, sleepy, and drained kaomojis.", group: "Negative" },
  sick: { key: "sick", name: "Sick", slug: "sick", description: "Hurt, unwell, and dizzy emoticons.", group: "Negative" },

  shrug: { key: "shrug", name: "Shrug", slug: "shrug", description: "Classic ¯\\_(ツ)_/¯ shrug kaomojis for I don't know.", group: "Reactions" },
  facepalm: { key: "facepalm", name: "Facepalm", slug: "facepalm", description: "Disbelief, SMH, and facepalm text faces.", group: "Reactions" },
  tableFlip: { key: "tableFlip", name: "Table Flip", slug: "table-flip", description: "Iconic (╯°□°）╯︵ ┻━┻ table flip kaomojis.", group: "Reactions" },
  tableFix: { key: "tableFix", name: "Table Fix", slug: "table-fix", description: "┬─┬ノ( º _ ºノ) putting tables back in order.", group: "Reactions" },
  shocked: { key: "shocked", name: "Shocked", slug: "shocked", description: "Surprised, stunned, and jaw-dropping faces.", group: "Reactions" },
  confused: { key: "confused", name: "Confused", slug: "confused", description: "Puzzled, questioning, and lost kaomojis.", group: "Reactions" },
  thinking: { key: "thinking", name: "Thinking", slug: "thinking", description: "Pondering, calculating, and curious faces.", group: "Reactions" },
  sleeping: { key: "sleeping", name: "Sleeping", slug: "sleeping", description: "Zzz, napping, and sleeping kaomojis.", group: "Reactions" },

  kawaii: { key: "kawaii", name: "Kawaii", slug: "kawaii", description: "Ultra-cute anime style Japanese kaomojis.", group: "Anime" },
  senpai: { key: "senpai", name: "Senpai", slug: "senpai", description: "Notice me senpai & anime crush expressions.", group: "Anime" },
  catGirls: { key: "catGirls", name: "Cat Girls & Neko", slug: "cat-girls", description: "Neko (=^･ω･^=) cat girl kaomojis.", group: "Anime" },
  chibi: { key: "chibi", name: "Chibi", slug: "chibi", description: "Small, cute, chibi character expressions.", group: "Anime" },
  magical: { key: "magical", name: "Magical Girl", slug: "magical", description: "Sparkling, magical, and fantasy anime faces.", group: "Anime" },
  hero: { key: "hero", name: "Anime Hero", slug: "hero", description: "Determined and heroic anime reactions.", group: "Anime" },

  cats: { key: "cats", name: "Cats", slug: "cats", description: "Neko, kitty, and feline kaomoji faces.", group: "Animals" },
  bears: { key: "bears", name: "Bears", slug: "bears", description: "Kuma, teddy bear, and cub emoticons.", group: "Animals" },
  dogs: { key: "dogs", name: "Dogs", slug: "dogs", description: "Inu, puppy, and doggy text faces.", group: "Animals" },
  rabbits: { key: "rabbits", name: "Rabbits", slug: "rabbits", description: "Usagi, bunny, and rabbit kaomojis.", group: "Animals" },
  foxes: { key: "foxes", name: "Foxes", slug: "foxes", description: "Kitsune & foxy text expressions.", group: "Animals" },
  birds: { key: "birds", name: "Birds", slug: "birds", description: "Owls, chicks, and bird kaomojis.", group: "Animals" },

  victory: { key: "victory", name: "Victory", slug: "victory", description: "Clutch, win, and GG victory kaomojis.", group: "Gaming" },
  defeat: { key: "defeat", name: "Defeat", slug: "defeat", description: "Game over, KO, and defeat text faces.", group: "Gaming" },
  rage: { key: "rage", name: "Rage & Salt", slug: "rage", description: "Gamer rage, salty, and tilt kaomojis.", group: "Gaming" },
  gg: { key: "gg", name: "Good Game (GG)", slug: "gg", description: "Sportsmanship and GG WP chat faces.", group: "Gaming" },
  afk: { key: "afk", name: "AFK & BRB", slug: "afk", description: "Stepping away and idle gaming reactions.", group: "Gaming" },
  clutch: { key: "clutch", name: "Clutch", slug: "clutch", description: "Pro gamer clutch performance kaomojis.", group: "Gaming" },

  hug: { key: "hug", name: "Hugs", slug: "hugs", description: "Cuddly, warm, and comforting hug kaomojis.", group: "Relationships" },
  kiss: { key: "kiss", name: "Kiss", slug: "kiss", description: "Smooch, blowing kiss, and romantic faces.", group: "Relationships" },
  couples: { key: "couples", name: "Couples", slug: "couples", description: "Pair, holding hands, and love kaomojis.", group: "Relationships" },
  friendship: { key: "friendship", name: "Friendship", slug: "friendship", description: "BFF, high-five, and squad expressions.", group: "Relationships" },
  heartbreak: { key: "heartbreak", name: "Heartbreak", slug: "heartbreak", description: "Broken heart and sad romance kaomojis.", group: "Relationships" },

  halloween: { key: "halloween", name: "Halloween", slug: "halloween", description: "Ghosts, vampires, and spooky seasonal faces.", group: "Seasonal" },
  christmas: { key: "christmas", name: "Christmas", slug: "christmas", description: "Santa, gifts, and winter holiday kaomojis.", group: "Seasonal" },
};

export const KAOMOJI_CATEGORY_LIST: KaomojiCategory[] = Object.values(KAOMOJI_CATEGORIES);

export function getKaomojiCategory(key: KaomojiCategoryKey): KaomojiCategory {
  return KAOMOJI_CATEGORIES[key] ?? KAOMOJI_CATEGORIES.happy;
}

export function getKaomojiCategoryBySlug(slug: string): KaomojiCategory | undefined {
  return KAOMOJI_CATEGORY_LIST.find((c) => c.slug === slug);
}
