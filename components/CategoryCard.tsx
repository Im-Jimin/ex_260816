import Link from "next/link";
import { iconMap } from "@/lib/icon-map";
import type { Category } from "@/lib/data";

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon];
  const toneBg = category.tone === "green" ? "bg-tone-green-bg" : "bg-tone-amber-bg";
  const toneFg = category.tone === "green" ? "text-tone-green-fg" : "text-tone-amber-fg";

  return (
    <Link
      href={`/category/${category.id}`}
      className="group flex flex-col items-center gap-3"
    >
      <div
        className="flex aspect-square w-full items-center justify-center rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card-hover)]"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${toneBg}`}>
          <Icon className={`h-6 w-6 ${toneFg}`} strokeWidth={2} />
        </div>
      </div>
      <span className="text-center text-sm font-bold text-text">{category.label}</span>
    </Link>
  );
}
