export type EntityType = "font" | "symbol" | "kaomoji" | "username" | "collection";

export type ActivityAction = "copy" | "generate" | "favorite" | "view";

export interface FavoriteItem {
  id: string;
  type: EntityType;
  title: string;
  content: string;
  slug?: string;
  addedAt: number;
}

export interface RecentActivityItem {
  id: string;
  type: EntityType;
  action: ActivityAction;
  title: string;
  content: string;
  slug?: string;
  timestamp: number;
}

export interface UniversalSearchResult {
  id: string;
  type: EntityType;
  title: string;
  preview: string;
  url: string;
  category?: string;
  score: number;
}
