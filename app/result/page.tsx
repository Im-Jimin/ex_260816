import { redirect } from "next/navigation";
import { findUniqueMatch, getCategoryById, searchItems } from "@/lib/data";
import { askAI } from "@/lib/ask";
import { logItemView, logSearch } from "@/lib/analytics";
import { getServerSessionId } from "@/lib/server-session";
import SearchResultsList from "@/components/SearchResultsList";
import EmptyState from "@/components/EmptyState";
import GuideView from "@/components/GuideView";

export default async function ResultPage(props: PageProps<"/result">) {
  const searchParams = await props.searchParams;
  const raw = searchParams.q;
  const query = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";

  if (!query.trim()) {
    redirect("/");
  }

  const sessionId = await getServerSessionId();

  const unique = findUniqueMatch(query);
  if (unique) {
    await logSearch(sessionId, query, "single_match");
    redirect(`/item/${unique.id}`);
  }

  const results = searchItems(query);

  if (results.length > 0) {
    await logSearch(sessionId, query, "multi_match");
    return (
      <main className="mx-auto w-full max-w-[880px] flex-1 px-6 py-16 sm:py-20">
        <SearchResultsList query={query} results={results} />
      </main>
    );
  }

  const aiItem = await askAI(query);
  await logSearch(sessionId, query, aiItem ? "ai_fallback" : "empty");
  if (aiItem) {
    await logItemView(sessionId, aiItem.id, aiItem.name, aiItem.categoryId, "ai");
  }

  return (
    <main className="mx-auto w-full max-w-[880px] flex-1 px-6 py-16 sm:py-20">
      {aiItem ? (
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold text-text-muted">
            등록된 품목은 아니지만, 환경부 등 공식 분리배출 기준을 참고해 AI가 안내를 준비했어요.
          </p>
          <GuideView key={aiItem.id} item={aiItem} category={getCategoryById(aiItem.categoryId)} />
        </div>
      ) : (
        <EmptyState query={query} />
      )}
    </main>
  );
}
