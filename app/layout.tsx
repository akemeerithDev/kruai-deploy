import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KruAI - ผู้ช่วยครูไทยทำเอกสารด้วย AI",
  description: "สร้างแผนการสอน ใบงาน ข้อสอบ ตามหลักสูตรฐานสมรรถนะ ใน 5 นาที",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
