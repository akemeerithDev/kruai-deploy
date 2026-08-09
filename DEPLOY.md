# 🚀 คู่มือ Deploy KruAI ขึ้น Vercel

แอปนี้พร้อม Deploy แล้ว! มี 2 วิธี:

## วิธี A: ผ่าน Vercel Dashboard (ง่ายสุด)

### 1. เตรียมโปรเจกต์
- Download ไฟล์ `kruai-deploy.tar.gz` จาก workspace
- แตก zip: `tar -xzf kruai-deploy.tar.gz`
- เข้าโฟลเดอร์ `kruai/`
- สร้าง Git repo:
  ```bash
  cd kruai
  git init
  git add .
  git commit -m "Initial commit"
  ```

### 2. Push ขึ้น GitHub
- สร้าง repo ใหม่ที่ https://github.com/new
- Push:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/kruai.git
  git branch -M main
  git push -u origin main
  ```

### 3. Import ใน Vercel
1. ไปที่ https://vercel.com/new
2. Sign up / Login (แนะนำใช้ GitHub)
3. คลิก "Import" repo `kruai` ที่เพิ่ง push
4. Vercel จะ detect Next.js อัตโนมัติ
5. คลิก "Deploy"

### 4. ตั้ง Environment Variables (Optional)
ไปที่ Project → Settings → Environment Variables

| Key | Value | Required? |
|-----|-------|-----------|
| `OPENAI_API_KEY` | `sk-...` | Optional - ถ้าไม่ใส่จะใช้ Mock mode |
| `OPENAI_MODEL` | `gpt-4o-mini` | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `xxx` | Optional |

คลิก "Save" แล้ว Vercel จะ redeploy อัตโนมัติ

### 5. เสร็จ! 🎉
ได้ URL หน้าตา `https://kruai-xxx.vercel.app`

---

## วิธี B: ผ่าน Vercel CLI (สำหรับ developer)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd kruai
vercel --prod
```

---

## 🔧 ใส่ API Key จริง (หลัง deploy)

### 1. OpenAI API Key
1. ไปที่ https://platform.openai.com/api-keys
2. สร้าง key ใหม่ (ใช้ GPT-4o-mini ราคาถูก)
3. ใส่ใน Vercel env vars
4. Redeploy

### 2. Supabase (Optional - สำหรับ auth จริง)
1. สร้าง project ที่ https://supabase.com
2. เอา URL + Anon Key ใส่ env vars
3. สร้างตาราง:
   ```sql
   create table users (
     id uuid primary key default uuid_generate_v4(),
     email text unique,
     name text,
     tier text default 'free',
     credits int default 5,
     credits_reset_at timestamp,
     created_at timestamp default now()
   );

   create table documents (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references users(id),
     type text,
     subject text,
     grade text,
     topic text,
     content text,
     created_at timestamp default now()
   );
   ```

---

## 💰 Cost Estimate

| Service | Free Tier | ราคาเมื่อใช้เยอะ |
|---------|-----------|------------------|
| Vercel Hosting | 100GB bandwidth/เดือน | $20/เดือน (Pro) |
| Vercel Serverless | 100GB-hr/เดือน | $0.40/100K calls |
| OpenAI GPT-4o-mini | - | ~$0.15/1M input tokens |
| Supabase | 500MB DB, 50K MAU | $25/เดือน (Pro) |

**ค่าใช้จ่ายจริงต่อเดือน (100 users, 5 doc คน):**
- Vercel: ฿0 (Free tier เอาอยู่)
- OpenAI: ~฿150 (3,000 เอกสาร)
- Supabase: ฿0 (Free tier)
- **รวม: ~฿150/เดือน** หรือ ~฿1.50 ต่อ user

---

## 🎯 Post-Deploy Checklist

- [ ] ทดสอบ signup/login
- [ ] ทดสอบสร้างเอกสารทั้ง 5 ประเภท
- [ ] ใส่ `OPENAI_API_KEY` เพื่อทดสอบ AI จริง
- [ ] ตั้ง custom domain (ถ้ามี)
- [ ] ตั้ง Google Analytics
- [ ] สร้าง OG image
- [ ] เปิดให้ทดสอบ 5-10 ครู
- [ ] เก็บ feedback
