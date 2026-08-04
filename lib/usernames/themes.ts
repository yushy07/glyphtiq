import type { UsernameThemeKey } from "./types";

export interface UsernameTheme {
  key: UsernameThemeKey;
  name: string;
  description: string;
  prefixes: string[];
  cores: string[];
  suffixes: string[];
}

export const THEMES: Record<UsernameThemeKey, UsernameTheme> = {
  minimal: {
    key: "minimal",
    name: "Minimal",
    description: "Sleek, short, and clean single-word usernames.",
    prefixes: ["Its", "Real", "IAM", "Just", "Not"],
    cores: ["Aura", "Vibe", "Echo", "Zen", "Pure", "Mode", "Nova", "Flux", "Flow"],
    suffixes: ["X", "HQ", "One", "Co", "IO"],
  },
  luxury: {
    key: "luxury",
    name: "Luxury & Royal",
    description: "High-class, prestigious, and opulent username tags.",
    prefixes: ["Royal", "Velvet", "Gold", "Crown", "Baron", "Lord", "Regal", "Noble"],
    cores: ["Monarch", "Palace", "Dynasty", "Empire", "Sovereign", "Elite", "Prestige"],
    suffixes: ["Royale", "VIP", "Club", "Privé", "Luxe"],
  },
  aesthetic: {
    key: "aesthetic",
    name: "Aesthetic",
    description: "Soft, dreamy, and trendy social media usernames.",
    prefixes: ["Soft", "Cloud", "Honey", "Moon", "Angel", "Velvet", "Sweet"],
    cores: ["Blossom", "Petal", "Melody", "Breeze", "Cosmos", "Pastel", "Glow"],
    suffixes: ["Vibes", "Core", "Land", "Mood", "Sky"],
  },
  dark: {
    key: "dark",
    name: "Dark & Gothic",
    description: "Shadowy, mysterious, and dark-themed usernames.",
    prefixes: ["Shadow", "Dark", "Grim", "Night", "Phantom", "Void", "Abyss"],
    cores: ["Reaper", "Spectre", "Eclipse", "Raven", "Demon", "Obsidian", "Venom"],
    suffixes: ["Shade", "Soul", "Goth", "Crypt", "Fiend"],
  },
  anime: {
    key: "anime",
    name: "Anime & Otaku",
    description: "Japanese anime inspired usernames and character tags.",
    prefixes: ["Chibi", "Kuma", "Neko", "Kitsune", "Senpai", "Kage", "Shin"],
    cores: ["Ramen", "Sakura", "Hikari", "Akira", "Zenith", "Bonsai", "Kami"],
    suffixes: ["San", "Kun", "Chan", "Sama", "X"],
  },
  cyberpunk: {
    key: "cyberpunk",
    name: "Cyberpunk & Hacker",
    description: "Futuristic, sci-fi, and glitchy technology usernames.",
    prefixes: ["Neo", "Cyber", "Byte", "Zero", "Synapse", "Quantum", "Vector"],
    cores: ["Matrix", "Grid", "Pulse", "Hacker", "Node", "Cipher", "System"],
    suffixes: ["EXE", "Net", "Core", "Code", "Hz"],
  },
  hacker: {
    key: "hacker",
    name: "Hacker & Tech",
    description: "Terminal, root, and CLI coder handles.",
    prefixes: ["Root", "Null", "Sudo", "Init", "Admin", "Host"],
    cores: ["Terminal", "Kernel", "Script", "Packet", "Socket", "Proxy"],
    suffixes: ["Dev", "CLI", "Shell", "Run", "Bin"],
  },
  mythology: {
    key: "mythology",
    name: "Mythology & Legends",
    description: "Greek gods, mythical beasts, and ancient legends.",
    prefixes: ["Zeus", "Ares", "Odin", "Thor", "Apollo", "Hades", "Titan"],
    cores: ["Phoenix", "Dragon", "Valhalla", "Olympus", "Valkyrie", "Hydra"],
    suffixes: ["God", "Myth", "Lore", "Rune", "Fate"],
  },
  space: {
    key: "space",
    name: "Space & Cosmic",
    description: "Astronomy, planets, stars, and galaxy handles.",
    prefixes: ["Astro", "Cosmic", "Solar", "Lunar", "Starlight", "Orbit"],
    cores: ["Nebula", "Pulsar", "Quasar", "Comet", "Galaxy", "Meteor", "Orion"],
    suffixes: ["Space", "Star", "Void", "Sky", "Nova"],
  },
  fire: {
    key: "fire",
    name: "Fire & Inferno",
    description: "Blazing, fiery, and incendiary gaming tags.",
    prefixes: ["Blaze", "Inferno", "Ember", "Pyro", "Flame", "Ignite"],
    cores: ["Burn", "Spark", "Magma", "Vulkan", "Ashes", "Scorch"],
    suffixes: ["Fire", "Burn", "Heat", "Flash", "X"],
  },
  ice: {
    key: "ice",
    name: "Ice & Frost",
    description: "Sub-zero, frozen, and chill gaming nicknames.",
    prefixes: ["Frost", "Ice", "Zero", "Glacier", "Arctic", "Subzero"],
    cores: ["Chill", "Breeze", "Cold", "Snow", "Crystal", "Freeze"],
    suffixes: ["Ice", "Cold", "Frost", "Peak", "Vibe"],
  },
  cute: {
    key: "cute",
    name: "Cute & Kawaii",
    description: "Sweet, bubbly, and adorable username tags.",
    prefixes: ["Bubbly", "Peachy", "Cookie", "Sugar", "Mochi", "Fluffy"],
    cores: ["Berry", "Daisy", "Bunny", "Cupcake", "Panda", "Muffin"],
    suffixes: ["Puff", "Cute", "Love", "Pie", "Baby"],
  },
  gothic: {
    key: "gothic",
    name: "Gothic",
    description: "Dark romance, gothic, and velvet username styles.",
    prefixes: ["Velvet", "Goth", "Vamp", "Raven", "Noir", "Black"],
    cores: ["Rose", "Thorn", "Blood", "Ghost", "Shroud", "Venom"],
    suffixes: ["Goth", "Noir", "Crypt", "Soul", "X"],
  },
  royal: {
    key: "royal",
    name: "Royal & Noble",
    description: "Monarchs, crowns, and aristocratic titles.",
    prefixes: ["Crown", "King", "Queen", "Prince", "Duke", "Baron"],
    cores: ["Monarch", "Palace", "Kingdom", "Throne", "Sceptre"],
    suffixes: ["Royal", "Emperor", "Majesty", "Dynasty", "X"],
  },
  fantasy: {
    key: "fantasy",
    name: "Fantasy & Magic",
    description: "Wizards, sorcery, and RPG adventurer names.",
    prefixes: ["Arcane", "Mystic", "Spell", "Rune", "Elven", "Shadow"],
    cores: ["Wizard", "Mage", "Knight", "Paladin", "Sorcerer", "Warlock"],
    suffixes: ["Lore", "Rune", "Realm", "Fate", "Magic"],
  },
  streamer: {
    key: "streamer",
    name: "Streamer & TTV",
    description: "Twitch, YouTube, Kick, and creator handles.",
    prefixes: ["Its", "Real", "Live", "Official", "TTV", "YT"],
    cores: ["Stream", "Plays", "Live", "Broadcast", "Gaming", "Channel"],
    suffixes: ["TTV", "YT", "Live", "OnAir", "TV"],
  },
  ninja: {
    key: "ninja",
    name: "Ninja & Stealth",
    description: "Shinobi, assassin, and shadow gaming nicknames.",
    prefixes: ["Shinobi", "Kage", "Shadow", "Silent", "Stealth", "Blade"],
    cores: ["Ninja", "Assassin", "Katana", "Ronin", "Kunai", "Spectre"],
    suffixes: ["Slash", "Kill", "X", "Striker", "Zero"],
  },
  warrior: {
    key: "warrior",
    name: "Warrior & Battle",
    description: "Combat, warlord, and competitive gaming tags.",
    prefixes: ["Warlord", "Battle", "Combat", "Iron", "Vanguard", "Spartan"],
    cores: ["Warrior", "Striker", "Slayer", "Champion", "Legion", "Titan"],
    suffixes: ["War", "Fight", "Kill", "Apex", "OP"],
  },
  magic: {
    key: "magic",
    name: "Magic & Sorcery",
    description: "Enchanted, mystical, and spellcaster names.",
    prefixes: ["Magic", "Enchanted", "Aura", "Astral", "Celestial", "Ethereal"],
    cores: ["Spells", "Charm", "Wizard", "Illusion", "Vision", "Mirage"],
    suffixes: ["Magic", "Mage", "Mystic", "Aura", "Craft"],
  },
  vaporwave: {
    key: "vaporwave",
    name: "Vaporwave & 80s",
    description: "Synthwave, retro 80s, and neon aesthetic handles.",
    prefixes: ["Synth", "Neon", "Retro", "Wave", "Vapor", "Pixel"],
    cores: ["Arcade", "Cassette", "Sunset", "Drive", "Grid", "Laser"],
    suffixes: ["Wave", "84", "Neon", "Retro", "FM"],
  },
};

export const THEME_LIST = Object.values(THEMES);
