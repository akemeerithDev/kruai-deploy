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

  // Debug: log response shape
  console.log("PoYo response:", JSON.stringify(data).slice(0, 500));

  // Extract text content - ลองหลาย format
  let content: string = "";

  if (typeof data === "string") {
    content = data;
  } else if (typeof data.output_text === "string") {
    content = data.output_text;
  } else if (typeof data.content === "string") {
    content = data.content;
  } else if (typeof data.text === "string") {
    content = data.text;
  } else if (Array.isArray(data.output)) {
    // OpenAI-style: data.output[].content[].text
    for (const item of data.output) {
      if (item.content && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (typeof c.text === "string") {
            content += c.text;
          }
        }
      } else if (typeof item.text === "string") {
        content += item.text;
      } else if (typeof item.content === "string") {
        content += item.content;
      }
    }
  } else if (Array.isArray(data.choices)) {
    // OpenAI chat completion style
    for (const c of data.choices) {
      if (c.message?.content) {
        content += typeof c.message.content === "string"
          ? c.message.content
          : JSON.stringify(c.message.content);
      }
    }
  } else if (data.choices?.[0]?.message?.content) {
    content = data.choices[0].message.content;
  }

  // ถ้ายังไม่ได้ content → log + throw
  if (!content) {
    console.error("Could not extract content from PoYo response:", JSON.stringify(data, null, 2));
    throw new Error("PoYo response did not contain text content");
  }

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
    return `# แผนการจัดการเรียนรู้

วิชา [ชื่อวิชาตาม${input.subject}] รหัส [ระบุรหัสวิชา] กลุ่มสาระการเรียนรู้ [${input.subject}]

หน่วยการเรียนรู้ที่ [ลำดับหน่วย] [ชื่อหน่วย] ระดับชั้น[${input.grade}] ภาคเรียนที่ [1/2] จำนวน [X] คาบ/สัปดาห์

แผนการจัดการเรียนรู้ที่ [ลำดับแผน] เรื่อง [${input.topic}] เวลา ${input.hours} ชั่วโมง

วันที่สอน........………..……..…เดือน………………………….............................……………..พ.ศ. ….

> ⚠️ **โหมดทดสอบ (Mock)** — นี่คือเอกสารตัวอย่าง เมื่อเชื่อมต่อ AI จริง (PoYo/OpenAI) ระบบจะสร้างเนื้อหาเต็มรูปแบบ

## มาตรฐานการเรียนรู้/ตัวชี้วัด

[ระบุมาตรฐาน ว/x.x และตัวชี้วัดตาม${input.subject} สำหรับ${input.grade}]

## สาระสำคัญ/ความคิดรวบยอด

[เขียน 2-3 ย่อหน้า เกี่ยวกับสาระสำคัญของ${input.topic} ในเชิงลึก]

## จุดประสงค์การเรียนรู้

1. นักเรียนอธิบาย${input.topic}ได้ (K)
2. นักเรียนนำไปประยุกต์ใช้ในชีวิตจริงได้ (P)
3. นักเรียนมีความรับผิดชอบ (A)

## สาระการเรียนรู้

${input.topic}

## สมรรถนะสำคัญของผู้เรียน

- ความสามารถในการสื่อสาร
- ความสามารถในการคิด
- ความสามารถในการใช้เทคโนโลยี
${compList}

## คุณลักษณะอันพึงประสงค์

- ใฝ่เรียนรู้
- มุ่งมั่นในการทำงาน

## ภาระชิ้นงาน/ชิ้นงาน/หลักฐานการเรียนรู้

- แบบฝึกหัด/ใบงาน
- แบบทดสอบวัดผลสัมฤทธิ์

## กิจกรรมการจัดการเรียนรู้

### ขั้นนำ (10 นาที)

1. ครูแจ้งจุดประสงค์การเรียนและทบทวนเนื้อหาเดิม
2. ครูนำเข้าสู่บทเรียนโดยใช้คำถามกระตุ้น
3. นักเรียนร่วมอภิปราย
4. ครูสรุปเข้าสู่เนื้อหาใหม่

### ขั้นสอน (${Math.max(input.hours * 60 - 25, 30)} นาที)

1. ครูอธิบายเนื้อหา${input.topic} พร้อมยกตัวอย่าง
2. นักเรียนศึกษาค้นคว้าจากแหล่งข้อมูล
3. นักเรียนทำกิจกรรมกลุ่ม
4. ครูให้คำปรึกษาและตรวจสอบความเข้าใจ
5. นักเรียนนำเสนอผลงานหน้าชั้น
6. ครูและนักเรียนร่วมอภิปรายและสรุป
7. นักเรียนทำแบบฝึกหัด/ใบงาน
8. ครูตรวจและให้ข้อมูลย้อนกลับ

### ขั้นสรุป (15 นาที)

1. ครูสรุปบทเรียน
2. นักเรียนร่วมสรุปสาระสำคัญ
3. ครูให้นักเรียนทำแบบทดสอบหลังเรียน
4. ครูมอบหมายงานและให้ข้อมูลย้อนกลับ

## สื่อการเรียนรู้/แหล่งการเรียนรู้

- หนังสือเรียน${input.subject} ชั้น${input.grade}
- ใบงาน/ใบความรู้
- สื่อมัลติมีเดีย/วิดีโอ
- เว็บไซต์ที่เกี่ยวข้อง

## การวัดและประเมินผล

| สิ่งที่วัดและประเมิน | วิธีการ | เครื่องมือ | เกณฑ์การประเมิน |
|---|---|---|---|
| ความรู้ (K) | แบบประเมินผลการเรียนรู้ด้วยตนเอง | แบบประเมิน | ใช้การผ่านเกณฑ์ ร้อยละ 70 ขึ้นไป |
| ทักษะ (P) | แบบประเมินด้านทักษะปฏิบัติ | แบบประเมิน | ผ่านเกณฑ์ระดับ 3 ขึ้นไป |
| เจตคติ (A) | แบบประเมินคุณลักษณะอันพึงประสงค์ | แบบประเมิน | ผ่านเกณฑ์ระดับ 3 ขึ้นไป |

| เลขที่ | ชื่อ-นามสกุล | ความตั้งใจ มุ่งมั่น (4) | การตั้งคำถาม ตอบคำถาม (4) | การทำกิจกรรมกลุ่ม (4) | ส่งงานในเวลาที่กำหนด (4) | มาเรียนสม่ำเสมอ (4) | รวมคะแนน (20) | ปรับคะแนน (10) |
|---|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |  |
| 11 |  |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |  |
| 13 |  |  |  |  |  |  |  |  |
| 14 |  |  |  |  |  |  |  |  |
| 15 |  |  |  |  |  |  |  |  |

| เลขที่ | ชื่อ-นามสกุล | มีวินัย | ใฝ่เรียนรู้ | มุ่งมั่นในการทำงาน | มีจิตสาธารณะ | ซื่อสัตย์สุจริต | สรุป |
|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |
| 10 |  |  |  |  |  |  |  |
| 11 |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |
| 13 |  |  |  |  |  |  |  |
| 14 |  |  |  |  |  |  |  |
| 15 |  |  |  |  |  |  |  |

ลงชื่อ ....................................................... (ผู้เขียนแผน)
         ([ชื่อ-นามสกุลผู้เขียน])
         ตำแหน่ง [ตำแหน่ง]

ความคิดเห็นของผู้ตรวจแผน/ผู้ที่ผู้บริหารมอบหมาย
…………………………………………………………………………………………………………………………………………………………………………………………………….……..…...………………………………………………………………………………………………………………………………………................................

ลงชื่อ ....................................................... ผู้ตรวจแผน
         ([ชื่อ-นามสกุลผู้ตรวจ])
         ตำแหน่ง [ตำแหน่ง]

ความคิดเห็น/ข้อเสนอแนะของผู้บริหาร
…………………………………………………………………………………………………………………………………………………………………………………………………….……..…...………………………………………………………………………………………………………………………………………................................

ลงชื่อ ....................................................... ผู้บริหาร
         ([ชื่อ-นามสกุลผู้บริหาร])
         ตำแหน่ง [ตำแหน่ง]

---
⚠️ หมายเหตุ: เอกสารนี้สร้างโดย KruAI ในโหมดทดสอบ (Mock)`;
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
