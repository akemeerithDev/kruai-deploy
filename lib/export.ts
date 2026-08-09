// Export utilities - PDF + DOCX
// ⭐ DOCX ใช้ TH Sarabun New ทั้งเล่ม 100% ทุกเอกสาร 5 ประเภท
// - แผนการสอน
// - ใบงาน/ใบความรู้
// - ข้อสอบ + เฉลย
// - เอกสาร PLC
// - วิจัยในชั้นเรียน

import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
  Footer,
  Header,
  PageNumber,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";

// ⭐ Font หลัก: TH Sarabun New (ใช้ทั้งเล่ม)
const FONT_NAME = "TH Sarabun New";
// Fallback สำหรับเครื่องที่ไม่มี font นี้
const FONT_FALLBACK = "Sarabun";

// Size (docx ใช้หน่วย half-points: 16pt = 32)
const SIZE_BODY = 32; // 16pt — เนื้อหาทั่วไป
const SIZE_HEADING3 = 36; // 18pt — หัวข้อระดับ 3
const SIZE_HEADING2 = 40; // 20pt — หัวข้อระดับ 2
const SIZE_HEADING1 = 72; // 36pt — หัวข้อระดับ 1 / ชื่อบท
const SIZE_TITLE = 80; // 40pt — ชื่อเรื่อง

// ============== DOCX Export - ใช้ TH Sarabun New ทั้งเล่ม ==============
export async function exportToDOCX(
  content: string,
  filename: string = "document.docx",
  metadata?: { title?: string; subject?: string; type?: string }
) {
  const lines = content.split("\n");
  const children: Paragraph[] = [];

  for (const line of lines) {
    if (line.startsWith("# ")) {
      // H1 — หัวข้อใหญ่ (36pt Bold Center)
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240, line: 360 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("# ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING1,
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("## ")) {
      // H2 — หัวข้อรอง (36pt Bold Center) - ใช้สำหรับ "บทที่ 1", "เอกสารและงานวิจัย"
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240, line: 360 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("## ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING1,
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("### ")) {
      // H3 — หัวข้อย่อย (18pt Bold)
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 120, line: 360 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("### ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING3,
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("#### ")) {
      // H4 — หัวข้อย่อยมาก (16pt Bold)
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 80, line: 360 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("#### ", "")),
              font: FONT_NAME,
              size: SIZE_BODY,
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("---")) {
      // เส้นคั่น
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120, line: 360 },
          children: [
            new TextRun({
              text: "─".repeat(50),
              font: FONT_NAME,
              size: SIZE_BODY,
            }),
          ],
        })
      );
    } else if (line.trim() === "") {
      // บรรทัดว่าง
      children.push(
        new Paragraph({
          spacing: { line: 360 },
          children: [new TextRun({ text: "", font: FONT_NAME, size: SIZE_BODY })],
        })
      );
    } else {
      // เนื้อหาปกติ - 16pt Justified line spacing 1.5
      const parts = parseInlineMarkdown(line);
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 60, after: 60, line: 360 },
          children: parts,
        })
      );
    }
  }

  const doc = new Document({
    creator: "KruAI",
    title: metadata?.title || "เอกสารจาก KruAI",
    subject: metadata?.subject || "สร้างโดย KruAI - ผู้ช่วยครูไทย",
    description: `${metadata?.type || "เอกสารการศึกษา"} - สร้างด้วย KruAI`,
    // ⭐ ตั้ง default style เป็น TH Sarabun New ทั้งเอกสาร
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            size: SIZE_BODY, // 16pt
          },
          paragraph: {
            spacing: { line: 360 }, // 1.5 line spacing
          },
        },
        // Override heading styles ให้ใช้ TH Sarabun New
        heading1: {
          run: {
            font: FONT_NAME,
            size: SIZE_HEADING1,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 240, line: 360 },
          },
        },
        heading2: {
          run: {
            font: FONT_NAME,
            size: SIZE_HEADING1,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 240, line: 360 },
          },
        },
        heading3: {
          run: {
            font: FONT_NAME,
            size: SIZE_HEADING3,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 120, line: 360 },
          },
        },
        heading4: {
          run: {
            font: FONT_NAME,
            size: SIZE_BODY,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 80, line: 360 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "KruAI - ผู้ช่วยครูไทย",
                    font: FONT_NAME,
                    size: 24, // 12pt
                    color: "888888",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ["หน้า ", PageNumber.CURRENT],
                    font: FONT_NAME,
                    size: SIZE_BODY,
                  }),
                  new TextRun({
                    children: ["/", PageNumber.TOTAL_PAGES],
                    font: FONT_NAME,
                    size: SIZE_BODY,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

// ============== Helper: parse inline markdown (bold) ==============
function parseInlineMarkdown(text: string): TextRun[] {
  const runs: TextRun[] = [];

  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.slice(lastIndex, match.index).replace(/\*\*/g, ""),
          font: FONT_NAME,
          size: SIZE_BODY,
        })
      );
    }
    runs.push(
      new TextRun({
        text: match[1],
        font: FONT_NAME,
        size: SIZE_BODY,
        bold: true,
      })
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.slice(lastIndex).replace(/\*\*/g, ""),
        font: FONT_NAME,
        size: SIZE_BODY,
      })
    );
  }

  if (runs.length === 0) {
    runs.push(
      new TextRun({
        text: stripMarkdown(text),
        font: FONT_NAME,
        size: SIZE_BODY,
      })
    );
  }

  return runs;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^>\s*/, "")
    .trim();
}

// ============== PDF Export ==============
// PDF ไม่รองรับ TH Sarabun New โดยตรง (jsPDF ใช้ built-in fonts เท่านั้น)
// ดังนั้น PDF จะ fallback ใช้ Helvetica + แสดงผลภาษาไทยแบบ Romanized
// แนะนำให้ผู้ใช้ Download .docx เพื่อใช้ TH Sarabun New จริง
export function exportToPDF(
  content: string,
  filename: string = "document.pdf",
  metadata?: { title?: string; subject?: string; type?: string }
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica");
  doc.setFontSize(11);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - 2 * margin;
  const lineHeight = 6;
  let y = margin;

  // Header hint
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("KruAI - Kru Thai AI Assistant", pageWidth - margin, 12, { align: "right" });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  y = 20;

  const lines = content.split("\n");

  for (const line of lines) {
    if (line.startsWith("# ") || line.startsWith("## ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace(/^#+\s/, ""));
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 8 + 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("### ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace("### ", ""));
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 7 + 3;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("#### ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace("#### ", ""));
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 6 + 2;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("---")) {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    } else if (line.trim() === "") {
      y += 3;
    } else {
      const text = stripMarkdown(line);
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      const linesNeeded = wrapped.length;

      if (y + linesNeeded * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.text(wrapped, margin, y);
      y += linesNeeded * lineHeight;
    }
  }

  // Footer
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `KruAI - Halm ${i}/${pageCount} | Download .docx for TH Sarabun New`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save(filename);
}
