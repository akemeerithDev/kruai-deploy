"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut, upgradeTier, type User } from "../../lib/auth";

interface DocumentRecord {
  id: string;
  type: string;
  subject: string;
  grade: string;
  topic: string;
  createdAt: string;
  preview: string;
}

const STORAGE_KEY = "kruai_documents";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u) {
      router.push("/auth");
      return;
    }
    setUser(u);

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setDocs(JSON.parse(raw));
    }
  }, [router]);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const handleUpgrade = (tier: "basic" | "pro") => {
    const updated = upgradeTier(tier);
    if (updated) setUser(updated);
  };

  const deleteDoc = (id: string) => {
    if (!confirm("ลบเอกสารนี้?")) return;
    const next = docs.filter((d) => d.id !== id);
    setDocs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  if (!mounted || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </main>
    );
  }

  const creditPct = user.tier === "pro" ? 100 : Math.min(100, (user.credits / 50) * 100);
  const resetDate = new Date(user.creditsResetAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg">
              📒
            </div>
            <div className="font-bold text-primary-900">KruAI</div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              👋 {user.name}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome + Stats */}
        <div>
          <h1 className="text-3xl font-bold mb-1">สวัสดี, {user.name} 👋</h1>
          <p className="text-gray-600">พร้อมสร้างเอกสารใหม่หรือยัง?</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Credits */}
          <div className="card sm:col-span-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm text-gray-500 mb-1">เครดิตคงเหลือ</div>
                <div className="text-3xl font-bold text-primary-600">
                  {user.tier === "pro" ? "∞" : user.credits}
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>แพ็กเกจ: <span className="font-bold uppercase text-primary-600">{user.tier}</span></div>
                {user.tier !== "pro" && <div>รีเซ็ต: {resetDate}</div>}
              </div>
            </div>
            {user.tier !== "pro" && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${creditPct}%` }}
                  />
                </div>
                {user.tier === "free" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleUpgrade("basic")}
                      className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700"
                    >
                      ⬆️ อัปเกรด Basic (199 บาท/เดือน)
                    </button>
                    <button
                      onClick={() => handleUpgrade("pro")}
                      className="text-sm bg-primary-900 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700"
                    >
                      ⭐ Pro (499 บาท/เดือน)
                    </button>
                  </div>
                )}
                {user.tier === "basic" && (
                  <button
                    onClick={() => handleUpgrade("pro")}
                    className="text-sm bg-primary-900 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 mt-3"
                  >
                    ⭐ อัปเกรด Pro (ไม่จำกัด)
                  </button>
                )}
              </>
            )}
          </div>

          {/* Quick create */}
          <Link
            href="/create"
            className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white hover:shadow-lg transition flex flex-col items-center justify-center text-center"
          >
            <div className="text-5xl mb-2">✨</div>
            <div className="font-bold text-lg">สร้างเอกสารใหม่</div>
            <div className="text-sm text-primary-100">ใช้เวลา 1-2 นาที</div>
          </Link>
        </div>

        {/* Document history */}
        <div>
          <h2 className="text-xl font-bold mb-3">📄 เอกสารของฉัน ({docs.length})</h2>
          {docs.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>ยังไม่มีเอกสาร</p>
              <Link href="/create" className="text-primary-600 hover:underline text-sm">
                สร้างเอกสารแรก →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {docs.map((d) => (
                <div key={d.id} className="card hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(d.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="font-bold">{d.topic}</div>
                    </div>
                    <button
                      onClick={() => deleteDoc(d.id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                      {DOC_LABELS[d.type] || d.type}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {d.subject}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {d.grade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{d.preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tier comparison */}
        {user.tier === "free" && (
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="font-bold text-lg mb-2">🎁 อัปเกรดเพื่อปลดล็อกฟีเจอร์เพิ่ม</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-bold text-primary-700">Basic 199 บาท/เดือน</div>
                <ul className="text-gray-700 space-y-0.5 mt-1">
                  <li>✓ 50 เอกสาร/เดือน</li>
                  <li>✓ Export PDF/Word</li>
                  <li>✓ ตัวชี้วัดครบทุกกลุ่มสาระ</li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-primary-900">Pro 499 บาท/เดือน</div>
                <ul className="text-gray-700 space-y-0.5 mt-1">
                  <li>✓ ไม่จำกัดเอกสาร</li>
                  <li>✓ เอกสาร PLC + วิจัยในชั้นเรียน</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const DOC_LABELS: Record<string, string> = {
  lesson_plan: "แผนการสอน",
  worksheet: "ใบงาน",
  exam: "ข้อสอบ",
  plc: "PLC",
  research: "วิจัย",
};
