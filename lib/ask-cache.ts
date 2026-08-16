import type { Item } from "./data";

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 300;

type CacheEntry = { item: Item; expiresAt: number };

const cache = new Map<string, CacheEntry>();

function normalize(query: string): string {
  return query.trim().toLowerCase();
}

export function getCached(query: string): Item | null {
  const key = normalize(query);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.item;
}

export function setCached(query: string, item: Item) {
  const key = normalize(query);
  if (!cache.has(key) && cache.size >= MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(key, { item, expiresAt: Date.now() + TTL_MS });
}
