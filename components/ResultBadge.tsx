import type { Category } from "@/lib/data";

export default function ResultBadge({
  itemName,
  category,
}: {
  itemName: string;
  category: Category | undefined;
}) {
  const toneBg = category?.tone === "amber" ? "bg-tone-amber-bg" : "bg-tone-green-bg";
  const toneFg = category?.tone === "amber" ? "text-tone-amber-fg" : "text-tone-green-fg";

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-3xl font-extrabold text-text">{itemName}</h1>
      {category && (
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${toneBg} ${toneFg}`}
        >
          {category.label}
        </span>
      )}
    </div>
  );
}
