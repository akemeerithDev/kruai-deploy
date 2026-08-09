import { NextRequest, NextResponse } from "next/server";
import { generateDocument } from "../../../lib/ai";
import type { GenerateInput } from "../../../lib/prompts";
import type { DocumentType, Grade, Subject } from "../../../lib/curriculum";

const VALID_GRADES: Grade[] = [
  "อ.1", "อ.2", "อ.3",
  "ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6",
  "ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6",
];

const VALID_SUBJECTS: Subject[] = [
  "ภาษาไทย",
  "คณิตศาสตร์",
  "วิทยาศาสตร์และเทคโนโลยี",
  "สังคมศึกษา ศาสนา และวัฒนธรรม",
  "สุขศึกษาและพลศึกษา",
  "ศิลปะ",
  "การงานอาชีพ",
  "ภาษาอังกฤษ",
];

const VALID_TYPES: DocumentType[] = ["lesson_plan", "worksheet", "exam", "plc", "research"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    if (!body.documentType || !VALID_TYPES.includes(body.documentType)) {
      return NextResponse.json(
        { error: "documentType ไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    if (!body.grade || !VALID_GRADES.includes(body.grade)) {
      return NextResponse.json({ error: "grade ไม่ถูกต้อง" }, { status: 400 });
    }
    if (!body.subject || !VALID_SUBJECTS.includes(body.subject)) {
      return NextResponse.json({ error: "subject ไม่ถูกต้อง" }, { status: 400 });
    }
    if (!body.topic || body.topic.trim().length < 2) {
      return NextResponse.json({ error: "กรุณาระบุหัวข้อ" }, { status: 400 });
    }

    const input: GenerateInput = {
      documentType: body.documentType,
      grade: body.grade,
      subject: body.subject,
      topic: body.topic.trim(),
      hours: Number(body.hours) || 1,
      students: Number(body.students) || 30,
      competencies: Array.isArray(body.competencies) ? body.competencies : [],
      context: (body.context || "").trim(),
    };

    const result = await generateDocument(input);

    return NextResponse.json({
      success: true,
      content: result.content,
      model: result.model,
      isMock: result.isMock,
      input,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างเอกสาร" },
      { status: 500 }
    );
  }
}
