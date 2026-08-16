"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Item } from "@/lib/data";
import ResultBadge from "./ResultBadge";
import PartsBreakdown from "./PartsBreakdown";
import AmbiguityCard from "./AmbiguityCard";
import ChecklistCard from "./ChecklistCard";
import RegionSelect from "./RegionSelect";
import CompleteButton from "./CompleteButton";

export default function GuideView({
  item,
  category,
}: {
  item: Item;
  category: Category | undefined;
}) {
  const router = useRouter();
  const [answered, setAnswered] = useState(!item.ambiguity);
  const [checklistDone, setChecklistDone] = useState(false);

  function handleAmbiguitySelect(resultItemId: string) {
    if (resultItemId === item.id) {
      setAnswered(true);
    } else {
      router.push(`/item/${resultItemId}`);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <ResultBadge itemName={item.name} category={category} />

      <RegionSelect regionNotes={item.regionNotes} />

      {item.ambiguity && !answered ? (
        <AmbiguityCard ambiguity={item.ambiguity} onSelect={handleAmbiguitySelect} />
      ) : (
        <PartsBreakdown parts={item.parts} />
      )}

      <ChecklistCard steps={item.steps} locked={!answered} onComplete={() => setChecklistDone(true)} />

      {checklistDone && <CompleteButton point={item.point} carbonSavingG={item.carbonSavingG} />}
    </div>
  );
}
