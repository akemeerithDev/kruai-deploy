// AI client — รองรับทั้ง OpenAI และ PoYo (proxy) + mock mode
// - PoYo: ใช้ endpoint /v1/responses (custom format)
// - OpenAI: ใช้ OpenAI SDK
// - Mock: ถ้าไม่มี key ใช้ template ตัวอย่าง

import OpenAI from "openai";
import type { GenerateInput } from "./prompts";
import { buildPrompt } from "./prompts";

const apiKey = process.env.OPENAI_API_KEY;
const apiBase = process.env.OPENAI_API_BASE; // เช่น https://api.poyo.ai
const apiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

// ตรวจว่าใช้ PoYo หรือไม่ (จาก base URL)
const isPoYo = apiBase?.includes("poyo.ai") ?? false;

let openaiClient: OpenAI | null = null;
if (apiKey && !isPoYo) {
  // Standard OpenAI
  openaiClient = new OpenAI({ apiKey });
}

export interface GenerateResult {
  content: string;
  model: string;
  isMock: boolean;
}

export async function generateDocument(input: GenerateInput): Promise<GenerateResult> {
  const { system, user } = buildPrompt(input);

  // ลอง PoYo ก่อน (ถ้า base URL เป็น PoYo)
  if (apiKey && isPoYo) {
    try {
      const result = await callPoYo(system, user, apiModel);
      return result;
    } catch (err) {
      console.error("PoYo error:", err);
    }
  }

  // ลอง OpenAI SDK
  if (openaiClient) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: apiModel,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      return {
        content: completion.choices[0].message.content || "",
        model: completion.model,
        isMock: false,
      };
    } catch (err) {
      console.error("OpenAI error:", err);
    }
  }

  // Fallback: Mock mode
  return {
    content: generateMockContent(input),
    model: "mock",
    isMock: true,
  };
}

// ============ PoYo API ============
async function callPoYo(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<GenerateResult> {
  const response = await fetch(`${apiBase}/v1/responses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: `${systemPrompt}\n\n${userPrompt}`,
      reasoning: { effort: "medium" },
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PoYo API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // PoYo response format อาจต่างจาก OpenAI
  // ลองหา text/content หลายที่
  const content =
    data.output_text ||
    data.content ||
    data.text ||
    data.output?.[0]?.content?.[0]?.text ||
    data.choices?.[0]?.message?.content ||
    JSON.stringify(data);

  return {
    content,
    model,
    isMock: false,
  };
}

// ============ Mock content (fallback) ============
function generateMockContent(input: GenerateInput): string {
  const compList = input.competencies.length > 0
    ? input.competencies.map((c) => `- ${c}`).join("\n")
    : "- C2 การคิดขั้นสูง\n- C3 การสื่อสาร";

  if (input.documentType === "lesson_plan") {
    return `# แผนการจัดการเรียนรู้ เรื่อง ${input.topic}

> ⚠️ **โหมดทดสอบ (Mock)** — นี่คือเอกสารตัวอย่าง เมื่อเชื่อมต่อ AI จริง (PoYo/OpenAI) ระบบจะสร้างเนื้อหาเต็มรูปแบบ

## 1. สาระสำคัญ
${input.topic} เป็นเนื้อหาสำคัญในกลุ่มสาระ${input.subject} สำหรับนักเรียนชั้น${input.grade}

## 2. จุดประสงค์
- นักเรียนอธิบายเกี่ยวกับ${input.topic}ได้
- นักเรียนนำไปประยุกต์ใช้ในชีวิตจริงได้

## 3. กิจกรรมการเรียนรู้ (${input.hours} ชั่วโมง)
1. นำเข้าสู่บทเรียน
2. สอน/นำเสนอเนื้อหา
3. ฝึกปฏิบัติ
4. นำไปใช้
5. สรุป

---
⚠️ หมายเหตุ: เอกสารนี้สร้างโดย KruAI ในโหมดทดสอบ`;
  }

  if (input.documentType === "worksheet") {
    return `# ใบงาน เรื่อง "${input.topic}"

> ⚠️ โหมดทดสอบ (Mock)

## ใบความรู้
${input.topic} คือ...

## แบบฝึกหัด
1. ${input.topic} คืออะไร
2. ยกตัวอย่างการใช้${input.topic}`;
  }

  if (input.documentType === "exam") {
    return `# แบบทดสอบ เรื่อง "${input.topic}"

> ⚠️ โหมดทดสอบ (Mock)

## ข้อสอบ
1. ${input.topic} คือข้อใด
   ก. ตัวเลือก A
   ข. ตัวเลือก B
   ค. ตัวเลือก C
   ง. ตัวเลือก D`;
  }

  if (input.documentType === "plc") {
    return `# เอกสาร PLC: ${input.topic}

> ⚠️ โหมดทดสอบ (Mock)

## ขั้นที่ 1: P - Plan
นักเรียนมีปัญหาในการเรียน${input.topic}

## ขั้นที่ 2: A - Act
จัดกิจกรรมการเรียนรู้เพื่อแก้ปัญหา

## ขั้นที่ 3: O - Observe
สังเกตพฤติกรรมและวัดผล

## ขั้นที่ 4: R - Reflect
สะท้อนผลและปรับปรุง`;
  }

  if (input.documentType === "research") {
    return `# บทที่ 1
# บทนำ

> ⚠️ โหมดทดสอบ (Mock)

### ความเป็นมา
การศึกษาเรื่อง${input.topic} มีความสำคัญต่อการพัฒนาผู้เรียน

### วัตถุประสงค์
1. เพื่อพัฒนาการจัดการเรียนรู้${input.topic}
2. เพื่อศึกษาผลสัมฤทธิ์ทางการเรียน

### ขอบเขต
- กลุ่มตัวอย่าง: นักเรียน${input.grade} ${input.students} คน
- ระยะเวลา: ${input.hours} สัปดาห์`;
  }

  return `# ไม่รู้จักประเภทเอกสาร: ${input.documentType}`;
}
