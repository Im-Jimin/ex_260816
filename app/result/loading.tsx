import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-tone-green-fg" strokeWidth={2} />
      <p className="text-base font-bold text-text">
        환경부 등 공식 분리배출 기준을 참고해 답을 준비하고 있어요
      </p>
      <p className="text-sm text-text-muted">잠시만 기다려주세요</p>
    </main>
  );
}
