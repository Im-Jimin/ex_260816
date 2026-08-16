const STORAGE_KEY = "recycle-guide-stats";

export type Stats = {
  points: number;
  carbonSavingG: number;
  completedCount: number;
};

const EMPTY_STATS: Stats = { points: 0, carbonSavingG: 0, completedCount: 0 };

export function getStats(): Stats {
  if (typeof window === "undefined") return EMPTY_STATS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATS;
    const parsed = JSON.parse(raw);
    return {
      points: Number(parsed.points) || 0,
      carbonSavingG: Number(parsed.carbonSavingG) || 0,
      completedCount: Number(parsed.completedCount) || 0,
    };
  } catch {
    return EMPTY_STATS;
  }
}

export function addCompletion(points: number, carbonSavingG: number): Stats {
  const current = getStats();
  const next: Stats = {
    points: current.points + points,
    carbonSavingG: current.carbonSavingG + carbonSavingG,
    completedCount: current.completedCount + 1,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
