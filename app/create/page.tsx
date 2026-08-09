"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GRADES,
  SUBJECTS,
  DOCUMENT_TYPES,
  CORE_COMPETENCIES,
  POPULAR_TOPICS,
  type DocumentType,
  type Grade,
  type Subject,
} from "../../lib/curriculum";
import { getCurrentUser, consumeCredit, type User } from "../../lib/auth";

const STORAGE_KEY = "kruai_documents";

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "details">("type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    documentType: "" as DocumentType | "",
    grade: "" as Grade | "",
    subject: "" as Subject | "",
    topic: "",
    hours: 1,
    students: 30,
    competencies: [] as string[],
    context: "",
  });

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (u) setUser(u);
  }, []);

  const selectType = (type: DocumentType) => {
    // ถ้าเป็น Pro feature แต่ user เป็น free
    const docType = DOCUMENT_TYPES.find((d) => d.value === type);
    if (docType?.proOnly && (!user || user.tier === "free")) {
      setError("เอกสาร PLC และวิจัยในชั้นเรียน เฉพาะแพ็กเกจ Pro เท่านั้น");
      return;
    }
    setError("");
    setFormData({ ...formData, documentType: type });
    setStep("details");
  };

  const toggleCompetency = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      competencies: prev.competencies.includes(code)
        ? prev.competencies.filter((c) => c !== code)
        : [...prev.competencies, code],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.documentType || !formData.grade || !formData.subject || !formData.topic.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // Check credits
    if (user && user.tier !== "pro") {
      const result = consumeCredit();
      if (!result.success) {
        setError(result.error || "เครดิตไม่เพียงพอ");
        return;
      }
    } else if (!user) {
      // ยังไม่ login - แนะนำให้สมัคร
      if (!confirm("แนะนำให้สมัครสมาชิกเพื่อใช้งานได้เต็มรูปแบบ (ฟรี!) ต้องการสมัครเลยไหม?")) {
        // ใช้แบบ guest ได้
      } else {
        router.push("/auth");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      const data = await res.json();

      // บันทึกประวัติ
      if (user) {
        const raw = localStorage.getItem(STORAGE_KEY);
        const docs = raw ? JSON.parse(raw) : [];
        docs.unshift({
          id: `doc_${Date.now()}`,
          type: formData.documentType,
          subject: formData.subject,
          grade: formData.grade,
          topic: formData.topic,
          createdAt: new Date().toISOString(),
          preview: data.content.slice(0, 150),
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));

        // Refresh user (credits อาจลด)
        setUser(getCurrentUser());
      }

      sessionStorage.setItem("kruai_result", JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <main className="min-h-screen flex items-center justify-center">กำลังโหลด...</main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg">
              📒
            </div>
            <div className="font-bold text-primary-900">KruAI</div>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
                  {user.tier === "pro" ? "∞" : `${user.credits} เครดิต`}
                </span>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-600">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href="/auth" className="btn-primary text-xs py-1.5 px-3">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          <div className={`flex items-center gap-2 ${step === "type" ? "text-primary-700 font-semibold" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "type" ? "bg-primary-600 text-white" : "bg-gray-200"}`}>1</div>
            <span className="text-sm">เลือกประเภท</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === "details" ? "text-primary-700 font-semibold" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "details" ? "bg-primary-600 text-white" : "bg-gray-200"}`}>2</div>
            <span className="text-sm">กรอกรายละเอียด</span>
          </div>
        </div>

        {step === "type" && (
          <div>
            <h1 className="text-3xl font-bold text-center mb-2">เริ่มสร้างเอกสาร</h1>
            <p className="text-center text-gray-600 mb-8">เลือกประเภทเอกสารที่ต้องการ</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOCUMENT_TYPES.map((t) => {
                const isLocked = t.proOnly && (!user || user.tier === "free");
                return (
                  <button
                    key={t.value}
                    onClick={() => selectType(t.value)}
                    className={`card text-left relative transition ${
                      isLocked
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:border-primary-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    }`}
                  >
                    {t.proOnly && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                        ⭐ PRO
                      </div>
                    )}
                    <div className="text-4xl mb-3">{t.icon}</div>
                    <div className="font-bold text-lg mb-1">{t.label}</div>
                    <div className="text-sm text-gray-600">{t.desc}</div>
                    {isLocked && (
                      <div className="text-xs text-yellow-700 mt-2">
                        🔒 อัปเกรดเป็น Pro เพื่อใช้งาน
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="card max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setStep("type")}
              className="text-sm text-primary-600 hover:underline mb-4"
            >
              ← เปลี่ยนประเภทเอกสาร
            </button>

            <h2 className="text-2xl font-bold mb-1">
              {DOCUMENT_TYPES.find((t) => t.value === formData.documentType)?.icon}{" "}
              {DOCUMENT_TYPES.find((t) => t.value === formData.documentType)?.label}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              กรอกรายละเอียดเพื่อให้ AI สร้างเอกสารที่ตรงกับห้องเรียนของคุณ
            </p>

            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">ระดับชั้น *</label>
                  <select
                    className="input-field"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as Grade })}
                    required
                  >
                    <option value="">-- เลือกระดับชั้น --</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-field">กลุ่มสาระ *</label>
                  <select
                    className="input-field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as Subject })}
                    required
                  >
                    <option value="">-- เลือกกลุ่มสาระ --</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-field">หน่วยการเรียนรู้ / เรื่อง *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="เช่น เศษส่วน, ระบบสุริยะ, การอ่านจับใจความ"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
                {formData.subject && POPULAR_TOPICS[formData.subject] && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {POPULAR_TOPICS[formData.subject].slice(0, 4).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, topic: t })}
                        className="text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 px-2 py-1 rounded-md transition"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">
                    {formData.documentType === "research" || formData.documentType === "plc"
                      ? "ระยะเวลา (สัปดาห์)"
                      : "เวลา (ชั่วโมง)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    className="input-field"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label-field">
                    {formData.documentType === "plc"
                      ? "จำนวนสมาชิก PLC"
                      : formData.documentType === "research"
                      ? "ขนาดกลุ่มตัวอย่าง"
                      : "จำนวนนักเรียน"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    className="input-field"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="label-field">สมรรถนะที่ต้องการพัฒนา (เลือกได้หลายข้อ)</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {CORE_COMPETENCIES.map((c) => (
                    <label
                      key={c.code}
                      className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.competencies.includes(c.code)
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.competencies.includes(c.code)}
                        onChange={() => toggleCompetency(c.code)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-semibold text-sm">{c.code} {c.name}</div>
                        <div className="text-xs text-gray-500">{c.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-field">บริบทเพิ่มเติม (ไม่บังคับ)</label>
                <textarea
                  className="input-field min-h-[80px]"
                  placeholder="เช่น มีเด็ก LD 2 คน, โรงเรียนขาดแคลนคอมพิวเตอร์, เน้นการทดลองจริง"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    กำลังสร้างเอกสาร...
                  </span>
                ) : (
                  "✨ สร้างเอกสาร"
                )}
              </button>
              {user && user.tier !== "pro" && (
                <p className="text-xs text-center text-gray-500">
                  ใช้เครดิต 1 ครั้ง (คงเหลือ {user.credits})
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
