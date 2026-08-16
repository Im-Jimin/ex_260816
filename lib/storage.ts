const STORAGE_KEY = "recycle-guide-stats";
const HISTORY_KEY = "recycle-guide-history";
const MAX_HISTORY = 30;

export type Stats = {
  points: number;
  carbonSavingG: number;
  completedCount: number;
};

export type CompletionRecord = {
  itemName: string;
  categoryId?: string;
  point: number;
  carbonSavingG: number;
  completedAt: string;
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

export function getHistory(): CompletionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addCompletion(
  point: number,
  carbonSavingG: number,
  itemName: string,
  categoryId?: string
): Stats {
  const current = getStats();
  const next: Stats = {
    points: current.points + point,
    carbonSavingG: current.carbonSavingG + carbonSavingG,
    completedCount: current.completedCount + 1,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    const record: CompletionRecord = {
      itemName,
      categoryId,
      point,
      carbonSavingG,
      completedAt: new Date().toISOString(),
    };
    const history = [record, ...getHistory()].slice(0, MAX_HISTORY);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  return next;
}

const PINE_TREE_ABSORPTION_G_PER_YEAR = 6600;
const PAPER_CUP_G = 11;

export function getCarbonComparison(carbonSavingG: number): string {
  const trees = carbonSavingG / PINE_TREE_ABSORPTION_G_PER_YEAR;
  if (trees >= 0.1) {
    return `소나무 ${trees.toFixed(1)}그루를 심은 효과예요`;
  }
  const cups = Math.max(1, Math.round(carbonSavingG / PAPER_CUP_G));
  return `종이컵 ${cups}개 분량 탄소를 줄였어요`;
}

export type Level = { title: string; minPoints: number };

export const LEVELS: Level[] = [
  { title: "초보 배출러", minPoints: 0 },
  { title: "분리배출 새싹", minPoints: 50 },
  { title: "에코 루키", minPoints: 150 },
  { title: "그린 히어로", minPoints: 300 },
  { title: "친환경 마스터", minPoints: 600 },
];

export function getLevel(points: number): { current: Level; next: Level | null; pointsToNext: number | null } {
  let current = LEVELS[0];
  let next: Level | null = null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].minPoints) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }

  return {
    current,
    next,
    pointsToNext: next ? next.minPoints - points : null,
  };
}
