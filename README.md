# 📒 KruAI - ผู้ช่วยครูไทยทำเอกสารด้วย AI

> เว็บแอป AI ที่ช่วยครูไทยทุกระดับสร้างแผนการสอน ใบงาน ข้อสอบ เอกสาร PLC และวิจัยในชั้นเรียน
> ตามหลักสูตรฐานสมรรถนะ พ.ศ. 2560 ใน 5 นาที

## ✨ ฟีเจอร์

- 📚 **แผนการสอน** — แผนการจัดการเรียนรู้ครบ 5 ขั้น
- 📝 **ใบงาน/ใบความรู้** — พร้อมเฉลย
- 📊 **ข้อสอบ** — ปรนัย อัตนัย ปฏิบัติ พร้อม Rubric
- 🤝 **เอกสาร PLC** — วงจร PAOR (Pro)
- 🔬 **วิจัยในชั้นเรียน** — โครงร่าง 5 บท (Pro)

## 🚀 เริ่มต้นใช้งาน

### Development

```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

### Deploy ขึ้น Vercel

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

หรือ connect GitHub repo ที่ [vercel.com](https://vercel.com)

## 🔑 Environment Variables

คัดลอก `.env.example` ไปเป็น `.env.local` แล้วใส่ค่า:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional | ถ้าไม่ใส่จะใช้ Mock mode |
| `OPENAI_MODEL` | Optional | default: `gpt-4o-mini` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | ถ้าไม่ใส่จะใช้ localStorage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | - |

## 🏗️ โครงสร้าง

```
kruai/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── auth/              # Login / Signup
│   ├── create/            # Form สร้างเอกสาร
│   ├── result/            # แสดงผลลัพธ์
│   ├── dashboard/         # User dashboard
│   └── api/generate/      # AI API endpoint
├── lib/
│   ├── curriculum.ts      # ข้อมูลหลักสูตร
│   ├── prompts.ts         # Prompt engineering
│   ├── ai.ts              # OpenAI client
│   └── auth.ts            # Auth (localStorage + Supabase)
└── public/                # Static assets
```

## 💰 Pricing

| Tier | Price | Quota | Features |
|------|-------|-------|----------|
| Free | 0 บาท | 5 เอกสาร/เดือน | แผนสอน, ใบงาน, ข้อสอบ |
| Basic | 199 บาท/เดือน | 50 เอกสาร/เดือน | Export PDF/Word |
| Pro | 499 บาท/เดือน | ไม่จำกัด | + PLC, วิจัย, Priority support |

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI GPT-4o-mini
- **Auth:** Supabase (optional) / localStorage
- **Deploy:** Vercel

## 📄 License

MIT
