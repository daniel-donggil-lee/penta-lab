import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "펜타랩 (PENTA LAB) — 교육 사업 자동화 시스템",
  description:
    "오프라인 학원부터 팔로워 10만 온라인 강사까지 — 리마크 학원 3년 직접 운영으로 검증한 자동화 시스템을 이식합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
