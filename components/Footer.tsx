import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-3 border-t border-black/5 px-6 py-10 text-center">
      <Image
        src="/skku-logo.png"
        alt="성균관대학교"
        width={160}
        height={59}
        className="h-8 w-auto opacity-80"
      />
      <p className="text-xs text-text-muted">
        성균관대학교 &lsquo;신인류AI사피엔스경험디자인&rsquo; 수업 팀 프로젝트로 제작되었습니다
      </p>
      <p className="text-[11px] text-text-muted/70">
        촬영하거나 업로드한 사진은 서비스 개선을 위해 저장될 수 있어요
      </p>
    </footer>
  );
}
