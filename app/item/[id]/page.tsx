import { notFound } from "next/navigation";
import { getCategoryById, getItemById } from "@/lib/data";
import { logItemView } from "@/lib/analytics";
import { getServerSessionId } from "@/lib/server-session";
import GuideView from "@/components/GuideView";

export default async function ItemPage(props: PageProps<"/item/[id]">) {
  const { id } = await props.params;
  const item = getItemById(id);

  if (!item) {
    notFound();
  }

  const category = getCategoryById(item.categoryId);

  const sessionId = await getServerSessionId();
  await logItemView(sessionId, item.id, item.name, item.categoryId, "local");

  return (
    <main className="mx-auto w-full max-w-[880px] flex-1 px-6 py-16 sm:py-20">
      <GuideView key={item.id} item={item} category={category} />
    </main>
  );
}
