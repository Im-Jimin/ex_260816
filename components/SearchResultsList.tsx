import type { Item } from "@/lib/data";
import ItemCardList from "./ItemCardList";

export default function SearchResultsList({ query, results }: { query: string; results: Item[] }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-text-muted">
        &ldquo;{query}&rdquo; 검색 결과 {results.length}건
      </p>
      <ItemCardList items={results} />
    </div>
  );
}
