"use client";

import { HelpCircle } from "lucide-react";
import type { Ambiguity } from "@/lib/data";

export default function AmbiguityCard({
  ambiguity,
  onSelect,
}: {
  ambiguity: Ambiguity;
  onSelect: (resultItemId: string) => void;
}) {
  return (
    <section className="rounded-[var(--radius-card)] bg-surface p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tone-amber-bg text-tone-amber-fg">
          <HelpCircle className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-text">{ambiguity.question}</p>
          <p className="mt-1 text-sm text-text-muted">
            정확한 배출 방법을 알려드리려면 확인이 필요해요
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ambiguity.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onSelect(option.resultItemId)}
                className="rounded-full border border-[color-mix(in_srgb,var(--grad-mid)_40%,transparent)] bg-bg px-5 py-2.5 text-sm font-bold text-text transition-colors hover:bg-tone-green-bg"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
