"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Leaf, ListChecks } from "lucide-react";
import { getStats, type Stats } from "@/lib/storage";

export default function MyPage() {
  const [stats, setStats] = useState<Stats>({ points: 0, carbonSavingG: 0, completedCount: 0 });

  useEffect(() => {
    setStats(getStats());
  }, []);

  const carbonDisplay =
    stats.carbonSavingG >= 1000
      ? `${(stats.carbonSavingG / 1000).toFixed(1)}kg`
      : `${stats.carbonSavingG}g`;

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-extrabold text-text">마이페이지</h1>

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
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-surface p-6 text-center shadow-[var(--shadow-card)]">
            <ListChecks className="h-6 w-6 text-tone-green-fg" strokeWidth={2} />
            <p className="text-2xl font-extrabold text-text">{stats.completedCount}</p>
            <p className="text-xs text-text-muted">완료한 배출</p>
          </div>
        </div>

        <Link href="/" className="text-sm font-bold text-tone-green-fg underline">
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
