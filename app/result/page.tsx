"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { exportToPDF, exportToDOCX } from "../../lib/export";

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

const DOC_LABELS: Record<string, string> = {
  lesson_plan: "แผนการสอน",
  worksheet: "ใบงาน",
  exam: "ข้อสอบ",
  plc: "PLC",
  research: "วิจัย",
};

export default function ResultPage() {
  const [data, setData] = useState<ResultData | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kruai_result");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  const safeFilename = (ext: string) => {
    if (!data) return `document.${ext}`;
    const label = DOC_LABELS[data.input.documentType] || data.input.documentType;
    const topic = data.input.topic.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, "_");
    return `${label}-${topic}.${ext}`;
  };

  const handleDownload = async (type: "pdf" | "docx") => {
    if (!data) return;
    setDownloading(type);
    try {
      const filename = safeFilename(type);
      if (type === "pdf") {
        exportToPDF(data.content, filename);
      } else if (type === "docx") {
        await exportToDOCX(data.content, filename);
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("ดาวน์โหลดไม่สำเร็จ: " + (err instanceof Error ? err.message : ""));
    } finally {
      setDownloading(null);
    }
  };

  const printAsPDF = () => {
    window.print();
  };

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 mb-4">ไม่พบข้อมูล กรุณาสร้างเอกสารใหม่</p>
          <Link href="/create" className="btn-primary inline-block">
            สร้างเอกสาร
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
              📒
            </div>
            <div className="font-bold text-primary-900">KruAI</div>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleDownload("docx")}
              disabled={downloading === "docx"}
              className="text-sm px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {downloading === "docx" ? "⏳ กำลังโหลด..." : "📘 Word (.docx)"}
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              disabled={downloading === "pdf"}
              className="text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 rounded-lg font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {downloading === "pdf" ? "⏳ กำลังโหลด..." : "📕 PDF"}
            </button>
            <button
              onClick={printAsPDF}
              className="text-sm px-3 py-1.5 bg-gray-700 text-white hover:bg-gray-800 rounded-lg font-medium transition"
            >
              🖨️ พิมพ์
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Meta */}
        <div className="card mb-6 print:hidden bg-white/80 backdrop-blur border-2 border-primary-100">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
              {data.input.subject}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
              {data.input.grade}
            </span>
            <span className="text-gray-700">📚 {data.input.topic}</span>
            {data.isMock && (
              <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                ⚠️ โหมดทดสอบ (Mock)
              </span>
            )}
            {!data.isMock && (
              <span className="ml-auto bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                ✓ AI: {data.model}
              </span>
            )}
          </div>
        </div>

        {/* Document */}
        <article className="card print:shadow-none print:border-0 bg-white">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 print:text-black">
            {data.content}
          </pre>
        </article>

        {/* Actions bottom */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
          <Link href="/create" className="btn-primary text-center">
            ✨ สร้างเอกสารใหม่
          </Link>
          <Link href="/dashboard" className="bg-white hover:bg-gray-50 text-primary-700 font-semibold py-3 px-6 rounded-lg border-2 border-primary-600 transition-colors text-center">
            📊 ไป Dashboard
          </Link>
          <Link href="/" className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition-colors text-center">
            🏠 กลับหน้าหลัก
          </Link>
        </div>

        {/* Tip */}
        <div className="mt-6 card bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 print:hidden">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span> เคล็ดลับ
          </h3>
          <p className="text-sm text-gray-700">
            เอกสารนี้สร้างโดย AI กรุณา<strong>ตรวจสอบและปรับแต่ง</strong>ก่อนนำไปใช้จริง
            โดยเฉพาะตัวชี้วัด คะแนน และกิจกรรมให้เหมาะกับบริบทห้องเรียนของคุณ
            สามารถดาวน์โหลดเป็น <strong>PDF</strong> หรือ <strong>Word</strong> เพื่อแก้ไขต่อได้เลย
          </p>
        </div>
      </div>
    </main>
  );
}
