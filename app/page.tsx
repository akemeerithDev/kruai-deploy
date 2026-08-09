import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl">
              📒
            </div>
            <div>
              <div className="font-bold text-lg text-primary-900">KruAI</div>
              <div className="text-xs text-gray-500">ผู้ช่วยครูไทย</div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm text-gray-600 hover:text-primary-600 hidden sm:block">
              ฟีเจอร์
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-primary-600 hidden sm:block">
              ราคา
            </Link>
            <Link
              href="/auth"
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/create"
              className="btn-primary text-sm py-2 px-4"
            >
              เริ่มใช้งานฟรี
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          🇹🇭 ออกแบบมาสำหรับครูไทย • หลักสูตรฐานสมรรถนะ 2560
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          ครูไทยไม่ต้องทำเอกสาร
          <br />
          <span className="text-primary-600">คนเดียวอีกต่อไป</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          KruAI ช่วยสร้าง <strong>แผนการสอน ใบงาน ข้อสอบ</strong> และเอกสาร PLC/วิจัย
          ให้เสร็จใน <strong>5 นาที</strong> ตรงตามหลักสูตรฐานสมรรถนะ พ.ศ. 2560
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/create" className="btn-primary text-lg px-8 py-4">
            🚀 ลองสร้างเอกสารฟรี
          </Link>
          <Link href="#features" className="text-primary-700 hover:underline font-semibold">
            ดูฟีเจอร์ →
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          ✅ ไม่ต้องสมัคร · ✅ ไม่ต้องบัตรเครดิต · ✅ ใช้ได้ 5 เอกสาร/เดือนฟรี
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "80%", label: "ประหยัดเวลา" },
            { num: "5 นาที", label: "ต่อเอกสาร" },
            { num: "6 ด้าน", label: "สมรรถนะหลัก" },
            { num: "100%", label: "ภาษาไทย" },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">{s.num}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          เอกสารครบ จบในที่เดียว
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          ไม่ต้องเสียเวลานั่งทำเอกสารเป็นชั่วโมง AI ช่วยสร้างให้ในไม่กี่นาที พร้อมใช้จริง
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📚",
              title: "แผนการสอน",
              desc: "แผนการจัดการเรียนรู้ครบ 5 ขั้น พร้อมกิจกรรม สื่อ Rubric",
            },
            {
              icon: "📝",
              title: "ใบงาน/ใบความรู้",
              desc: "พร้อมเฉลย เหมาะกับนักเรียน ปรับระดับความยากได้",
            },
            {
              icon: "📊",
              title: "ข้อสอบ + เฉลย",
              desc: "ปรนัย อัตนัย ปฏิบัติ พร้อม Rubric ประเมิน",
            },
            {
              icon: "🎓",
              title: "เอกสาร PLC",
              desc: "ช่วยเขียนเอกสาร PLC และวิจัยในชั้นเรียน",
            },
            {
              icon: "📤",
              title: "Export ครบ",
              desc: "PDF, Word, Markdown — พร้อมส่งหัวหน้า/ผู้บริหาร",
            },
            {
              icon: "🔒",
              title: "ข้อมูลปลอดภัย",
              desc: "ไม่เก็บข้อมูลส่วนตัวนักเรียน เข้ารหัสทุกข้อมูล",
            },
          ].map((f) => (
            <div key={f.title} className="card hover:shadow-lg transition">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            ทำงาน 3 ขั้นจบ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "เลือกเอกสาร", desc: "เลือกประเภท + ระดับชั้น + วิชา + หัวข้อ" },
              { step: "2", title: "กรอกบริบท", desc: "จำนวนนักเรียน สมรรถนะ บริบทพิเศษ" },
              { step: "3", title: "ได้เอกสาร", desc: "AI สร้างให้ใน 1-2 นาที พร้อม Export" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          ราคาจิบจิ๊บ ครูจ่ายไหว
        </h2>
        <p className="text-center text-gray-600 mb-12">
          เริ่มต้นฟรี · ไม่มีข้อผูกมัด
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Free", price: "0", desc: "ทดลองใช้", features: ["5 เอกสาร/เดือน", "Template พื้นฐาน", "Export Markdown"],
              cta: "เริ่มฟรี", popular: false,
            },
            {
              name: "Basic", price: "199", desc: "ครูตัวจริง", features: ["50 เอกสาร/เดือน", "Export PDF/Word", "ตัวชี้วัดครบทุกกลุ่มสาระ"],
              cta: "เริ่มใช้ Basic", popular: true,
            },
            {
              name: "Pro", price: "499", desc: "ครู มธุระ.", features: ["ไม่จำกัด", "PLC + วิจัย", "AI ขั้นสูง", "Priority support"],
              cta: "เริ่มใช้ Pro", popular: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`card relative ${p.popular ? "border-2 border-primary-500 shadow-xl" : ""}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ยอดนิยม
                </div>
              )}
              <div className="text-sm text-gray-500 mb-1">{p.desc}</div>
              <div className="font-bold text-2xl mb-4">{p.name}</div>
              <div className="text-4xl font-bold text-primary-600 mb-1">
                {p.price}<span className="text-base text-gray-500"> บาท/เดือน</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-600 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-primary-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className={p.popular ? "btn-primary w-full text-center block" : "btn-secondary w-full text-center block"}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มใช้งานแล้วหรือยัง?</h2>
          <p className="text-primary-100 mb-6">
            ครูไทยกว่า 600,000 คน เจ็บปวดกับงานเอกสาร มาให้ AI ช่วยดูแล
          </p>
          <Link
            href="/create"
            className="inline-block bg-white text-primary-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            🚀 เริ่มสร้างเอกสารฟรี
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>📒 KruAI — ผู้ช่วยครูไทยทำเอกสาร</p>
          <p className="mt-2">© 2026 KruAI. Built with ❤️ for Thai teachers.</p>
        </div>
      </footer>
    </main>
  );
}
