import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Header */}
      <header className="relative border-b border-white/40 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
              📒
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KruAI
              </div>
              <div className="text-xs text-gray-500">ผู้ช่วยครูไทย</div>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-primary-600 hidden sm:block font-medium"
            >
              ฟีเจอร์
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-primary-600 hidden sm:block font-medium"
            >
              ราคา
            </Link>
            <Link
              href="/auth"
              className="text-sm text-gray-600 hover:text-primary-600 font-medium"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
            >
              เริ่มใช้งานฟรี
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-primary-700 text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-primary-200">
          🇹🇭 ออกแบบมาสำหรับครูไทย • หลักสูตรฐานสมรรถนะ 2560
        </div>

        {/* Hero illustration */}
        <div className="text-8xl sm:text-9xl mb-6 inline-block animate-bounce">
          📚
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          ครูไทยไม่ต้องทำเอกสาร
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            คนเดียวอีกต่อไป
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          KruAI ช่วยสร้าง <strong>แผนการสอน ใบงาน ข้อสอบ</strong> และเอกสาร PLC/วิจัย
          ให้เสร็จใน <strong>5 นาที</strong> ตรงตามหลักสูตรฐานสมรรถนะ พ.ศ. 2560
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <Link
            href="/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
          >
            🚀 ลองสร้างเอกสารฟรี
          </Link>
          <Link
            href="#features"
            className="text-primary-700 hover:underline font-semibold flex items-center gap-1"
          >
            ดูฟีเจอร์ทั้งหมด
            <span className="text-xl">↓</span>
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          ✅ ไม่ต้องสมัคร · ✅ ไม่ต้องบัตรเครดิต · ✅ ใช้ได้ 5 เอกสาร/เดือนฟรี
        </p>
      </section>

      {/* Document type showcase */}
      <section className="relative max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {[
            { icon: "📚", label: "แผนการสอน", color: "from-blue-500 to-cyan-500" },
            { icon: "📝", label: "ใบงาน", color: "from-purple-500 to-pink-500" },
            { icon: "📊", label: "ข้อสอบ", color: "from-orange-500 to-red-500" },
            { icon: "🤝", label: "PLC", color: "from-green-500 to-emerald-500" },
            { icon: "🔬", label: "วิจัย", color: "from-violet-500 to-indigo-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-white"
            >
              <div className={`inline-block text-4xl mb-2 bg-gradient-to-br ${s.color} bg-clip-text`}>
                {s.icon}
              </div>
              <div className="text-sm font-semibold text-gray-700">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "80%", label: "ประหยัดเวลา", color: "from-blue-500 to-cyan-500", icon: "⚡" },
            { num: "5 นาที", label: "ต่อเอกสาร", color: "from-purple-500 to-pink-500", icon: "⏱️" },
            { num: "6 ด้าน", label: "สมรรถนะหลัก", color: "from-orange-500 to-red-500", icon: "🎯" },
            { num: "100%", label: "ภาษาไทย", color: "from-green-500 to-emerald-500", icon: "🇹🇭" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-white"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.num}
              </div>
              <div className="text-sm text-gray-600 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            ✨ ฟีเจอร์ครบ จบในที่เดียว
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-3">
            เอกสารครบ จบในที่เดียว
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ไม่ต้องเสียเวลานั่งทำเอกสารเป็นชั่วโมง AI ช่วยสร้างให้ในไม่กี่นาที พร้อมใช้จริง
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "📚", title: "แผนการสอน", desc: "แผนการจัดการเรียนรู้ครบ 5 ขั้น พร้อมกิจกรรม สื่อ Rubric", color: "from-blue-500 to-cyan-500" },
            { icon: "📝", title: "ใบงาน/ใบความรู้", desc: "พร้อมเฉลย เหมาะกับนักเรียน ปรับระดับความยากได้", color: "from-purple-500 to-pink-500" },
            { icon: "📊", title: "ข้อสอบ + เฉลย", desc: "ปรนัย อัตนัย ปฏิบัติ พร้อม Rubric ประเมิน", color: "from-orange-500 to-red-500" },
            { icon: "🎓", title: "เอกสาร PLC", desc: "ช่วยเขียนเอกสาร PLC และวิจัยในชั้นเรียน", color: "from-green-500 to-emerald-500" },
            { icon: "📤", title: "Export ครบ", desc: "PDF, Word, Markdown — พร้อมส่งหัวหน้า/ผู้บริหาร", color: "from-pink-500 to-rose-500" },
            { icon: "🔒", title: "ข้อมูลปลอดภัย", desc: "ไม่เก็บข้อมูลส่วนตัวนักเรียน เข้ารหัสทุกข้อมูล", color: "from-indigo-500 to-violet-500" },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group bg-white/90 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 border border-white"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-block text-5xl mb-3 bg-gradient-to-br ${f.color} bg-clip-text transform group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16 my-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-3 text-white">
            ทำงาน 3 ขั้นจบ
          </h2>
          <p className="text-center text-blue-100 mb-12">
            ง่ายกว่านี้ไม่มีแล้ว
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "เลือกเอกสาร", desc: "เลือกประเภท + ระดับชั้น + วิชา + หัวข้อ", icon: "🎯" },
              { step: "2", title: "กรอกบริบท", desc: "จำนวนนักเรียน สมรรถนะ บริบทพิเศษ", icon: "✍️" },
              { step: "3", title: "ได้เอกสาร", desc: "AI สร้างให้ใน 1-2 นาที พร้อม Export", icon: "🎉" },
            ].map((s, i) => (
              <div key={s.step} className="text-center text-white relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-white/30" />
                )}
                <div className="relative inline-block">
                  <div className="text-6xl mb-3">{s.icon}</div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white text-purple-600 font-extrabold text-lg flex items-center justify-center shadow-lg">
                    {s.step}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 mt-2">{s.title}</h3>
                <p className="text-blue-100 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            💰 ราคาจิบจิ๊บ ครูจ่ายไหว
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-3">
            เลือกแพ็กเกจที่ใช่
          </h2>
          <p className="text-gray-600">เริ่มต้นฟรี · ไม่มีข้อผูกมัด · ยกเลิกได้ทุกเมื่อ</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Free", price: "0", desc: "ทดลองใช้", icon: "🌱",
              features: ["5 เอกสาร/เดือน", "Template พื้นฐาน", "Export Markdown"],
              cta: "เริ่มฟรี", popular: false, color: "from-gray-400 to-gray-600",
            },
            {
              name: "Basic", price: "199", desc: "ครูตัวจริง", icon: "📚",
              features: ["50 เอกสาร/เดือน", "Export PDF/Word", "ตัวชี้วัดครบทุกกลุ่มสาระ"],
              cta: "เริ่มใช้ Basic", popular: true, color: "from-blue-500 to-purple-600",
            },
            {
              name: "Pro", price: "499", desc: "ครู มธุระ.", icon: "⭐",
              features: ["ไม่จำกัด", "PLC + วิจัย", "AI ขั้นสูง", "Priority support"],
              cta: "เริ่มใช้ Pro", popular: false, color: "from-yellow-400 to-orange-500",
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border-2 ${
                p.popular ? "border-primary-500 shadow-2xl scale-105" : "border-white"
              } transition-all hover:shadow-2xl`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  🔥 ยอดนิยม
                </div>
              )}
              <div className="text-4xl mb-2">{p.icon}</div>
              <div className="text-sm text-gray-500 mb-1">{p.desc}</div>
              <div className="font-extrabold text-2xl mb-3">{p.name}</div>
              <div className={`text-4xl font-extrabold bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-1`}>
                {p.price}<span className="text-base text-gray-500"> บาท/เดือน</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-600 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className={
                  p.popular
                    ? "block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
                    : "block w-full text-center bg-white hover:bg-gray-50 text-primary-700 font-bold py-3 px-6 rounded-lg border-2 border-primary-600 transition-all"
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-10">📚</div>
          <div className="absolute bottom-0 left-0 text-9xl opacity-10">✨</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white relative z-10">
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </h2>
          <p className="text-blue-100 mb-6 relative z-10">
            ครูไทยกว่า 600,000 คน เจ็บปวดกับงานเอกสาร มาให้ AI ช่วยดูแล
          </p>
          <Link
            href="/create"
            className="inline-block bg-white text-primary-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative z-10"
          >
            🚀 เริ่มสร้างเอกสารฟรี
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/40 bg-white/70 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>📒 KruAI — ผู้ช่วยครูไทยทำเอกสาร</p>
          <p className="mt-2">© 2026 KruAI. Built with ❤️ for Thai teachers.</p>
        </div>
      </footer>
    </main>
  );
}
