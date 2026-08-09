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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="max-w-md w-full relative z-10">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-lg">
            📒
          </div>
          <div>
            <div className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KruAI
            </div>
          </div>
        </Link>

        <div className="card bg-white/90 backdrop-blur-md shadow-2xl">
          <h1 className="text-2xl font-extrabold text-center mb-1">
            {mode === "signin" ? "ยินดีต้อนรับกลับมา! 👋" : "สร้างบัญชีใหม่ ✨"}
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            {mode === "signin" ? "เข้าสู่ระบบเพื่อใช้งานต่อ" : "เริ่มต้นใช้งานฟรี ไม่ต้องบัตรเครดิต"}
          </p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 font-semibold transition ${
                mode === "signin"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 font-semibold transition ${
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
              <label className="label-field">อีเมล / Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="you@school.ac.th หรือ username"
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

          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={useDemoAccount}
              className="text-sm text-primary-600 hover:underline"
            >
              🎲 ใช้บัญชีทดสอบ (สุ่มข้อมูล)
            </button>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 text-xs text-left">
              <div className="font-semibold text-amber-800 mb-1">👤 บัญชี Admin (ทดสอบ):</div>
              <div className="text-amber-700">Username: <code className="bg-white px-1.5 py-0.5 rounded font-mono">suraches</code></div>
              <div className="text-amber-700">Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono">Ake0896887477</code></div>
            </div>
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
