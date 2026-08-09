#!/bin/bash
# KruAI - Deploy script
# ใช้ deploy ขึ้น Vercel

set -e

echo "🚀 KruAI Deploy Script"
echo "======================="
echo ""

# Check vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "❌ ไม่พบ Vercel CLI"
  echo "ติดตั้ง: npm install -g vercel"
  exit 1
fi

# Check login
if ! vercel whoami &> /dev/null; then
  echo "🔐 กรุณา login Vercel ก่อน"
  vercel login
fi

echo "📦 กำลัง build..."
npm run build

echo "🌐 กำลัง deploy..."
vercel --prod

echo ""
echo "✅ Deploy เสร็จ!"
echo ""
echo "📝 หลัง deploy อย่าลืม:"
echo "  1. ไปที่ Vercel Dashboard"
echo "  2. เปิด Project → Settings → Environment Variables"
echo "  3. เพิ่ม (ถ้ามี):"
echo "     - OPENAI_API_KEY"
echo "     - NEXT_PUBLIC_SUPABASE_URL"
echo "     - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  4. (Optional) ตั้ง custom domain"
