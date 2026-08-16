"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import type { ItemStep } from "@/lib/data";

export default function ChecklistCard({
  steps,
  locked,
  onComplete,
}: {
  steps: ItemStep[];
  locked: boolean;
  onComplete?: () => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));

  const doneCount = checked.filter(Boolean).length;
  const progress = steps.length === 0 ? 0 : Math.round((doneCount / steps.length) * 100);
  const allDone = steps.length > 0 && doneCount === steps.length;

  function toggle(index: number) {
    if (locked) return;
    const next = [...checked];
    next[index] = !next[index];
    setChecked(next);
    if (next.every(Boolean)) onComplete?.();
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="sticky top-4 z-10 flex flex-col gap-2 rounded-[var(--radius-card)] bg-surface p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text">
            행동 체크리스트
            {locked && <Lock className="h-4 w-4 text-text-muted" strokeWidth={2} />}
          </h2>
          <span className="text-sm font-bold text-tone-green-fg">
            {doneCount}/{steps.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
          <div
            className="gradient-brand h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {locked && (
          <p className="text-xs text-text-muted">위 질문에 먼저 답해주세요</p>
        )}
        {allDone && !locked && (
          <p className="text-xs font-bold text-tone-green-fg">모든 단계를 완료했어요</p>
        )}
      </div>

      <ol className={`flex flex-col gap-3 ${locked ? "pointer-events-none opacity-50" : ""}`}>
        {steps.map((step, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-start gap-4 rounded-[var(--radius-card)] bg-surface p-4 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-bg"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  checked[index]
                    ? "border-transparent bg-tone-green-fg text-white"
                    : "border-text-muted text-transparent"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span>
                <span
                  className={`block text-sm font-bold ${
                    checked[index] ? "text-text-muted line-through" : "text-text"
                  }`}
                >
                  {index + 1}. {step.action}
                </span>
                {step.detail && (
                  <span className="mt-1 block text-xs text-text-muted">{step.detail}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
