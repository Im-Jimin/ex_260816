import Link from "next/link";
import { SearchX } from "lucide-react";

export default function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tone-amber-bg text-tone-amber-fg">
        <SearchX className="h-8 w-8" strokeWidth={2} />
      </div>
      <p className="text-lg font-bold text-text">&ldquo;{query}&rdquo; 결과를 찾지 못했어요</p>
      <p className="text-sm text-text-muted">다른 이름으로 검색하거나, 카테고리에서 직접 찾아보세요</p>
      <Link
        href="/"
        className="gradient-brand mt-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)]"
      >
        카테고리에서 찾아보기
      </Link>
    </div>
  );
}
