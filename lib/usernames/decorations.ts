import { STYLES } from "@/lib/text-engine/styles";
import type { TextStyle } from "@/lib/text-engine/types";

export interface DecorationPack {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  unicodeSafe: boolean;
}

export const DECORATIONS: DecorationPack[] = [
  { id: "clean", name: "Clean (No Symbols)", prefix: "", suffix: "", unicodeSafe: true },
  { id: "smile", name: "Japanese Smile (ツ)", prefix: "ツ ", suffix: " ツ", unicodeSafe: false },
  { id: "cross", name: "Cross Marks (×)", prefix: "×", suffix: "×", unicodeSafe: false },
  { id: "star", name: "Star Sparkle (★)", prefix: "★ ", suffix: " ★", unicodeSafe: false },
  { id: "clan1", name: "Clan Slash (〆)", prefix: "〆", suffix: "〆", unicodeSafe: false },
  { id: "clan2", name: "Clan Cross (乂)", prefix: "乂", suffix: "乂", unicodeSafe: false },
  { id: "clan3", name: "Clan Mark (么)", prefix: "么", suffix: "么", unicodeSafe: false },
  { id: "wing", name: "Wing Divider (彡)", prefix: "彡", suffix: "彡", unicodeSafe: false },
  { id: "dot", name: "Bullet Dots (•)", prefix: "• ", suffix: " •", unicodeSafe: false },
  { id: "brackets", name: "Bracket Frame ([ ])", prefix: "[", suffix: "]", unicodeSafe: true },
  { id: "chevrons", name: "Chevron Frame (« »)", prefix: "« ", suffix: " »", unicodeSafe: false },
  { id: "tag", name: "Tag Suffix (OP)", prefix: "", suffix: "OP", unicodeSafe: true },
  { id: "yt", name: "YouTube Suffix (YT)", prefix: "", suffix: "YT", unicodeSafe: true },
  { id: "ttv", name: "Twitch Suffix (TTV)", prefix: "", suffix: "TTV", unicodeSafe: true },
  { id: "exe", name: "Executable (.exe)", prefix: "", suffix: ".exe", unicodeSafe: true },
];

export function applyUnicodeStyle(text: string, fontId?: string): string {
  if (!fontId || fontId === "normal") return text;
  const style = STYLES.find((s: TextStyle) => s.id === fontId);
  return style ? style.convert(text) : text;
}
