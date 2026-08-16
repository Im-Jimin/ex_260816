import Link from "next/link";
import { getCategoryById, type Item } from "@/lib/data";

export default function ItemCardList({
  items,
  showCategory = true,
}: {
  items: Item[];
  showCategory?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const category = getCategoryById(item.categoryId);
        return (
          <li key={item.id}>
            <Link
              href={`/item/${item.id}`}
              className="flex items-center justify-between rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="text-base font-bold text-text">{item.name}</span>
              {showCategory && category && (
                <span className="text-xs font-semibold text-text-muted">{category.label}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
