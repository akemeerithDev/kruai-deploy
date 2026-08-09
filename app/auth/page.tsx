"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "../../lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result =
        mode === "signin"
          ? await signIn({ email: formData.email, password: formData.password })
          : await signUp({
              email: formData.email,
              password: formData.password,
              name: formData.name,
            });

      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = () => {
    setFormData({
      email: `demo${Date.now()}@kruai.demo`,
      password: "demo1234",
      name: "ครูทดสอบ",
    });
    setMode("signup");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl">
            📒
          </div>
          <div>
            <div className="font-bold text-2xl text-primary-900">KruAI</div>
          </div>
        </Link>

        <div className="card">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 font-semibold ${
                mode === "signin"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 font-semibold ${
                mode === "signup"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label-field">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="เช่น สมชาย ใจดี"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="label-field">อีเมล</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@school.ac.th"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">รหัสผ่าน</label>
              <input
                type="password"
                className="input-field"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
                required
              />
              {mode === "signup" && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 ข้อมูลถูกเก็บใน local browser เท่านั้น (Demo mode)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? "กำลังดำเนินการ..."
                : mode === "signin"
                ? "เข้าสู่ระบบ"
                : "สมัครสมาชิก"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={useDemoAccount}
              className="text-sm text-primary-600 hover:underline"
            >
              🎲 ใช้บัญชีทดสอบ (สุ่มข้อมูล)
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:underline">
            ← กลับหน้าหลัก
          </Link>
        </p>
      </div>
    </main>
  );
}
