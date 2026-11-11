import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "빼빼로로 알아보는 한컴케어링크의 나의 업무성향은?",
  description: "한컴케어링크 11.11 사내 이벤트용 빼빼로 업무성향 테스트",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
