import type { ItemPart } from "@/lib/data";

export default function PartsBreakdown({ parts }: { parts: ItemPart[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-text">구성요소 분해</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => (
          <div
            key={part.name}
            className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-card)]"
          >
            <p className="text-base font-bold text-text">{part.name}</p>
            <p className="mt-1 text-sm text-text-muted">{part.material}</p>
            <p className="mt-3 text-sm font-semibold text-tone-green-fg">{part.disposal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
