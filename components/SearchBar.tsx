"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAutocompleteSuggestions, getCategoryById } from "@/lib/data";
import PhotoAsk from "./PhotoAsk";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => getAutocompleteSuggestions(query), [query]);

  function goToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    router.push(`/result?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(query);
  }

  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <form onSubmit={handleSubmit} className="relative">
        <div className="gradient-brand rounded-full p-[2px]">
          <div className="flex items-center rounded-full bg-surface py-4 pl-4 pr-16">
            <div className="mr-2 flex shrink-0 items-center gap-0.5">
              <PhotoAsk />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              placeholder="내가 가진 쓰레기 어떻게 버려야 할까?"
              className="w-full bg-transparent text-base text-text placeholder:text-text-muted focus:outline-none"
              autoComplete="off"
            />
          </div>
        </div>
        <button
          type="submit"
          aria-label="검색"
          className="gradient-brand absolute right-0 top-1/2 flex h-14 w-14 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full shadow-[var(--shadow-card)] transition-transform duration-150 hover:scale-105"
        >
          <Search className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>
      </form>

      {showSuggestions && query.trim() && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card-hover)]">
          {suggestions.map((item) => {
            const category = getCategoryById(item.categoryId);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goToSearch(item.name);
                  }}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors hover:bg-bg"
                >
                  <span className="font-medium text-text">{item.name}</span>
                  {category && (
                    <span className="text-xs text-text-muted">{category.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
