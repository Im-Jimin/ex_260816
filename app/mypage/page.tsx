"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Leaf, ListChecks, X } from "lucide-react";
import {
  getStats,
  getHistory,
  getLevel,
  getCarbonComparison,
  type Stats,
  type CompletionRecord,
} from "@/lib/storage";
import { getCategoryById } from "@/lib/data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyPage() {
  const [stats, setStats] = useState<Stats>({ points: 0, carbonSavingG: 0, completedCount: 0 });
  const [history, setHistory] = useState<CompletionRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setStats(getStats());
    setHistory(getHistory());
  }, []);

  const carbonDisplay =
    stats.carbonSavingG >= 1000
      ? `${(stats.carbonSavingG / 1000).toFixed(1)}kg`
      : `${stats.carbonSavingG}g`;

  const { current, next, pointsToNext } = getLevel(stats.points);

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-extrabold text-text">마이페이지</h1>

        <div className="flex flex-col items-center gap-1 rounded-[var(--radius-card)] bg-tone-green-bg p-6 text-center">
          <Award className="h-6 w-6 text-tone-green-fg" strokeWidth={2} />
          <p className="text-lg font-extrabold text-text">{current.title}</p>
          <p className="text-xs text-text-muted">
            {next ? `다음 등급 '${next.title}'까지 ${pointsToNext}pt 남았어요` : "최고 등급을 달성했어요!"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-surface p-6 text-center shadow-[var(--shadow-card)]">
            <Award className="h-6 w-6 text-tone-green-fg" strokeWidth={2} />
            <p className="text-2xl font-extrabold text-text">{stats.points}</p>
            <p className="text-xs text-text-muted">누적 포인트</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-surface p-6 text-center shadow-[var(--shadow-card)]">
            <Leaf className="h-6 w-6 text-tone-green-fg" strokeWidth={2} />
            <p className="text-2xl font-extrabold text-text">{carbonDisplay}</p>
            <p className="text-xs text-text-muted">누적 탄소 절감량</p>
            {stats.carbonSavingG > 0 && (
              <p className="text-[11px] font-medium text-tone-green-fg">{getCarbonComparison(stats.carbonSavingG)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            disabled={stats.completedCount === 0}
            className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-surface p-6 text-center shadow-[var(--shadow-card)] transition-transform enabled:hover:scale-[1.02] disabled:opacity-60"
          >
            <ListChecks className="h-6 w-6 text-tone-green-fg" strokeWidth={2} />
            <p className="text-2xl font-extrabold text-text">{stats.completedCount}</p>
            <p className="text-xs text-text-muted">완료한 배출{stats.completedCount > 0 ? " (눌러서 보기)" : ""}</p>
          </button>
        </div>

        <Link href="/" className="text-sm font-bold text-tone-green-fg underline">
          홈으로 돌아가기
        </Link>
      </div>

      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10 sm:items-center"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="relative w-full max-w-[480px] rounded-[var(--radius-card)] bg-bg p-6 shadow-[var(--shadow-card-hover)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setShowHistory(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-muted shadow-[var(--shadow-card)]"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <h2 className="mb-4 text-lg font-bold text-text">최근 배출 기록</h2>
            <ul className="flex flex-col gap-3">
              {history.slice(0, 10).map((record, i) => {
                const category = record.categoryId ? getCategoryById(record.categoryId) : undefined;
                return (
                  <li key={i} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-text">{record.itemName}</span>
                      <span className="text-xs text-text-muted">
                        {category?.label ?? "기타"} · {formatDate(record.completedAt)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-tone-green-fg">+{record.point}pt</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
