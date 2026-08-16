import { notFound } from "next/navigation";
import { getCategoryById, getItemsByCategory } from "@/lib/data";
import { iconMap } from "@/lib/icon-map";
import ItemCardList from "@/components/ItemCardList";

export default async function CategoryPage(props: PageProps<"/category/[id]">) {
  const { id } = await props.params;
  const category = getCategoryById(id);

  if (!category) {
    notFound();
  }

  const items = getItemsByCategory(category.id);
  const Icon = iconMap[category.icon];
  const toneBg = category.tone === "amber" ? "bg-tone-amber-bg" : "bg-tone-green-bg";
  const toneFg = category.tone === "amber" ? "text-tone-amber-fg" : "text-tone-green-fg";

  return (
    <main className="mx-auto w-full max-w-[880px] flex-1 px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${toneBg}`}>
            <Icon className={`h-7 w-7 ${toneFg}`} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-extrabold text-text">{category.label}</h1>
        </div>

        {items.length > 0 ? (
          <ItemCardList items={items} showCategory={false} />
        ) : (
          <p className="text-sm text-text-muted">아직 등록된 품목이 없어요</p>
        )}
      </div>
    </main>
  );
}
