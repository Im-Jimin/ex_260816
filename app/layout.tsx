import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import SessionInit from "@/components/SessionInit";

export const metadata: Metadata = {
  title: "어케버려",
  description: "쓰레기의 이름이 아니라, 지금 바로 해야 할 행동을 알려주는 분리배출 가이드",
};

const GA_MEASUREMENT_ID = "G-XKNHCP0XWH";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <SessionInit />
        {children}
        <Footer />
      </body>
    </html>
  );
}
