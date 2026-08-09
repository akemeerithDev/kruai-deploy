"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ResultData {
  success: boolean;
  content: string;
  model: string;
  isMock: boolean;
  input: {
    documentType: string;
    grade: string;
    subject: string;
    topic: string;
  };
}

export default function ResultPage() {
  const [data, setData] = useState<ResultData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("kruai_result");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  const copyToClipboard = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsFile = () => {
    if (!data) return;
    const blob = new Blob([data.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.input.documentType}-${data.input.topic}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printAsPDF = () => {
    window.print();
  };

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-600">ไม่พบข้อมูล กรุณาสร้างเอกสารใหม่</p>
          <Link href="/create" className="btn-primary inline-block mt-4">
            สร้างเอกสาร
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
              📒
            </div>
            <div className="font-bold text-primary-900">KruAI</div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={copyToClipboard} className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg">
              {copied ? "✓ คัดลอกแล้ว" : "📋 คัดลอก"}
            </button>
            <button onClick={downloadAsFile} className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg">
              ⬇️ ดาวน์โหลด .md
            </button>
            <button onClick={printAsPDF} className="text-sm px-3 py-1.5 bg-primary-600 text-white hover:bg-primary-700 rounded-lg">
              🖨️ พิมพ์/PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Meta */}
        <div className="card mb-6 print:hidden">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold">
              {data.input.subject}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {data.input.grade}
            </span>
            <span className="text-gray-700">📚 {data.input.topic}</span>
            {data.isMock && (
              <span className="ml-auto bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                ⚠️ โหมดทดสอบ (Mock) — เชื่อมต่อ AI เพื่อเนื้อหาจริง
              </span>
            )}
            {!data.isMock && (
              <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                ✓ AI: {data.model}
              </span>
            )}
          </div>
        </div>

        {/* Document */}
        <article className="card print:shadow-none print:border-0">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 print:text-black">
            {data.content}
          </pre>
        </article>

        {/* Actions bottom */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
          <Link href="/create" className="btn-primary text-center">
            ✨ สร้างเอกสารใหม่
          </Link>
          <Link href="/dashboard" className="btn-secondary text-center">
            📊 ไป Dashboard
          </Link>
          <Link href="/" className="btn-secondary text-center">
            กลับหน้าหลัก
          </Link>
        </div>

        {/* Upsell */}
        {!data.isMock && (
          <div className="mt-8 card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 print:hidden">
            <h3 className="font-bold text-lg mb-2">💡 เคล็ดลับ</h3>
            <p className="text-sm text-gray-700">
              เอกสารนี้สร้างโดย AI กรุณา<strong>ตรวจสอบและปรับแต่ง</strong>ก่อนนำไปใช้จริง
              โดยเฉพาะตัวชี้วัด คะแนน และกิจกรรมให้เหมาะกับบริบทห้องเรียนของคุณ
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
