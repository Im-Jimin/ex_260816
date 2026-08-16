import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { User } from "lucide-react";
import "./globals.css";
import Footer from "@/components/Footer";
import SessionInit from "@/components/SessionInit";

const SITE_URL = "https://ex-260816-one.vercel.app";
const SITE_TITLE = "어케버려";
const SITE_DESCRIPTION =
  "어케버려(어떻게버려)는 헷갈리는 분리배출·쓰레기 버리는 법을 검색 한 번으로 알려주는 가이드예요. 품목을 검색하거나 사진을 찍으면 버리는 방법을 바로 알려드려요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} | 분리배출・쓰레기 버리는 법 가이드`,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["어케버려", "어떻게버려", "버리는 법", "분리배출", "쓰레기 버리는 법", "재활용", "분리수거"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: `${SITE_TITLE} | 분리배출・쓰레기 버리는 법 가이드`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/sitelogo.png", width: 512, height: 512, alt: "어케버려 로고" }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_TITLE} | 분리배출・쓰레기 버리는 법 가이드`,
    description: SITE_DESCRIPTION,
    images: ["/sitelogo.png"],
  },
};

const GA_MEASUREMENT_ID = "G-XKNHCP0XWH";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "어케버려",
  alternateName: ["어떻게버려", "쓰레기 버리는 법", "분리배출 가이드"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/result?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
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
        <Link
          href="/mypage"
          aria-label="마이페이지"
          className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-muted shadow-[var(--shadow-card)] transition-colors hover:text-tone-green-fg sm:right-6 sm:top-6"
        >
          <User className="h-5 w-5" strokeWidth={2} />
        </Link>
        {children}
        <Footer />
      </body>
    </html>
  );
}
