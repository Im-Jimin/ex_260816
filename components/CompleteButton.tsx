"use client";

import { useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { addCompletion } from "@/lib/storage";

export default function CompleteButton({
  point,
  carbonSavingG,
}: {
  point: number;
  carbonSavingG: number;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] bg-tone-green-bg p-6 text-center">
        <PartyPopper className="h-7 w-7 text-tone-green-fg" strokeWidth={2} />
        <p className="text-base font-bold text-text">
          배출 완료! 포인트 +{point}, 탄소 {carbonSavingG}g 절감했어요
        </p>
        <Link href="/mypage" className="text-sm font-bold text-tone-green-fg underline">
          마이페이지에서 확인하기
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addCompletion(point, carbonSavingG);
        setDone(true);
      }}
      className="gradient-brand w-full rounded-full py-4 text-base font-bold text-white shadow-[var(--shadow-card)] transition-transform duration-150 hover:scale-[1.01]"
    >
      배출 완료
    </button>
  );
}
