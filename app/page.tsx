import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-14 px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2.5">
          <Image src="/sitelogo.png" alt="어케버려 로고" width={44} height={44} className="h-11 w-11" priority />
          <h1 className="gradient-text text-4xl font-extrabold">어케버려</h1>
        </div>
        <p className="text-sm text-text-muted">이거 어떻게 버리지? 지금 바로 알려드릴게요</p>
      </div>
      <SearchBar />
      <CategoryGrid />
    </main>
  );
}
