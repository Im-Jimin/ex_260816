"use client";

import { MapPin } from "lucide-react";
import { regions } from "@/lib/regions";
import type { RegionNotes } from "@/lib/data";

export default function RegionSelect({
  regionNotes,
  region,
  onRegionChange,
}: {
  regionNotes?: RegionNotes;
  region: string;
  onRegionChange: (region: string) => void;
}) {
  const hasSelected = region !== "";
  const note = hasSelected ? regionNotes?.[region] : undefined;

  return (
    <section className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm font-bold text-text" htmlFor="region-select">
        <MapPin className="h-4 w-4 text-text-muted" strokeWidth={2} />
        지역 선택
      </label>
      <select
        id="region-select"
        value={region}
        onChange={(e) => onRegionChange(e.target.value)}
        className="w-full max-w-xs rounded-xl bg-surface px-4 py-3 text-sm text-text shadow-[var(--shadow-card)] focus:outline-none"
      >
        <option value="">지역을 선택하세요</option>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {hasSelected &&
        (note ? (
          <div className="rounded-xl bg-tone-amber-bg px-4 py-3 text-sm font-medium text-tone-amber-fg">
            {note}
          </div>
        ) : (
          <div className="rounded-xl bg-tone-green-bg px-4 py-3 text-sm font-medium text-tone-green-fg">
            이 지역은 특이사항이 없어요. 기본 배출 방법을 따르면 돼요.
          </div>
        ))}
    </section>
  );
}
