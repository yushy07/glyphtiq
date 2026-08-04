import blocks from "../../data/symbols/blocks.json";
import type { SymbolBlock, SymbolCategoryKey } from "./types";

interface BlocksFile {
  version: string;
  blocks: SymbolBlock[];
}

const data = blocks as unknown as BlocksFile;

export const SYMBOLS_SNAPSHOT_VERSION = data.version;

export const SYMBOL_BLOCKS: SymbolBlock[] = data.blocks;

const byKey = new Map(data.blocks.map((b) => [b.key, b]));

export function getBlock(key: string): SymbolBlock | undefined {
  return byKey.get(key);
}

export function blocksByCategory(category: SymbolCategoryKey): SymbolBlock[] {
  return data.blocks.filter((b) => b.category === category);
}
