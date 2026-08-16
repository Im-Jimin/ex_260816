import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import SessionInit from "@/components/SessionInit";

export const metadata: Metadata = {
  title: "어케버려",
  description: "쓰레기의 이름이 아니라, 지금 바로 해야 할 행동을 알려주는 분리배출 가이드",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        <SessionInit />
        {children}
        <Footer />
      </body>
    </html>
  );
}
