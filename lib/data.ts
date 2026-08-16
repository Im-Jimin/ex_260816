import rawData from "@/data/items.json";

export type CategoryTone = "green" | "amber";

export type Category = {
  id: string;
  label: string;
  icon: string;
  tone: CategoryTone;
};

export type ItemPart = {
  name: string;
  material: string;
  disposal: string;
};

export type ItemStep = {
  action: string;
  detail: string;
};

export type AmbiguityOption = {
  label: string;
  resultItemId: string;
};

export type Ambiguity = {
  question: string;
  options: AmbiguityOption[];
};

export type RegionNotes = {
  default: string;
  [region: string]: string;
};

export type Item = {
  id: string;
  name: string;
  categoryId: string;
  aliases: string[];
  parts: ItemPart[];
  steps: ItemStep[];
  ambiguity?: Ambiguity;
  regionNotes?: RegionNotes;
  carbonSavingG: number;
  point: number;
};

type ItemsFile = {
  categories: Category[];
  items: Item[];
};

const data = rawData as ItemsFile;

export const categories: Category[] = data.categories;
export const items: Item[] = data.items;

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getItemById(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getItemsByCategory(categoryId: string): Item[] {
  return items.filter((i) => i.categoryId === categoryId);
}

function matches(item: Item, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (item.name.toLowerCase().includes(q)) return true;
  return item.aliases.some((alias) => alias.toLowerCase().includes(q));
}

function relevanceScore(item: Item, query: string): number {
  const q = query.trim().toLowerCase();
  if (item.name.toLowerCase() === q) return 0;
  if (item.name.toLowerCase().startsWith(q)) return 1;
  if (item.aliases.some((a) => a.toLowerCase() === q)) return 2;
  if (item.aliases.some((a) => a.toLowerCase().startsWith(q))) return 3;
  return 4;
}

export function searchItems(query: string): Item[] {
  const q = query.trim();
  if (!q) return [];
  return items
    .filter((item) => matches(item, q))
    .sort((a, b) => relevanceScore(a, q) - relevanceScore(b, q));
}

export function getAutocompleteSuggestions(query: string, limit = 8): Item[] {
  return searchItems(query).slice(0, limit);
}

export function findUniqueMatch(query: string): Item | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  const exact = items.filter(
    (item) => item.name.toLowerCase() === q || item.aliases.some((a) => a.toLowerCase() === q)
  );
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return undefined;

  const partial = searchItems(query);
  return partial.length === 1 ? partial[0] : undefined;
}
