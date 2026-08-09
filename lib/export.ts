// Export utilities - PDF + DOCX
// DOCX ใช้ TH Sarabun New ทั้งเล่ม ตามมาตรฐานเอกสารราชการไทย

import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
  Footer,
  PageNumber,
} from "docx";
import { saveAs } from "file-saver";

// TH Sarabun New constants (size หน่วยเป็น half-points * 2)
const FONT_NAME = "TH Sarabun New";
const SIZE_BODY = 32; // 16pt = 32 half-points (size ใน docx คือ half-points)
const SIZE_HEADING2 = 36; // 18pt
const SIZE_HEADING1 = 72; // 36pt
const SIZE_HIGHLIGHT = 36; // 18pt

// ============== DOCX Export ==============
export async function exportToDOCX(content: string, filename: string = "document.docx") {
  const lines = content.split("\n");
  const children: Paragraph[] = [];

  for (const line of lines) {
    if (line.startsWith("# ")) {
      // หัวข้อใหญ่ที่สุด - เช่น "ส่วนที่ 1", "บทที่ 1", "บทคัดย่อ"
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("# ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING1, // 36pt
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("## ")) {
      // หัวข้อรอง - เช่น "บทที่ 1", "เอกสารและงานวิจัยที่เกี่ยวข้อง"
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("## ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING1, // 36pt
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("### ")) {
      // หัวข้อย่อย - เช่น "ความเป็นมาและความสำคัญ"
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("### ", "")),
              font: FONT_NAME,
              size: SIZE_HEADING2, // 18pt
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("#### ")) {
      // หัวข้อย่อยมาก - "ประชากรและกลุ่มตัวอย่าง"
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({
              text: stripMarkdown(line.replace("#### ", "")),
              font: FONT_NAME,
              size: SIZE_BODY, // 16pt
              bold: true,
            }),
          ],
        })
      );
    } else if (line.startsWith("---")) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
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
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360 }, // line spacing 1.5
          children: [new TextRun({ text: "", font: FONT_NAME, size: SIZE_BODY })],
        })
      );
    } else {
      // เนื้อหาปกติ - ใช้ THAI_JUSTIFY
      const parts = parseInlineMarkdown(line);
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 60, after: 60, line: 360 }, // line spacing 1.5
          children: parts,
        })
      );
    }
  }

  const doc = new Document({
    creator: "KruAI",
    title: "เอกสารจาก KruAI",
    description: "สร้างโดย KruAI - ผู้ช่วยครูไทย",
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            size: SIZE_BODY, // default 16pt
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
        heading1: {
          run: {
            font: FONT_NAME,
            size: SIZE_HEADING1,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 240 },
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
            spacing: { before: 360, after: 240 },
          },
        },
        heading3: {
          run: {
            font: FONT_NAME,
            size: SIZE_HEADING2,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 120 },
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

function parseInlineMarkdown(text: string): TextRun[] {
  const runs: TextRun[] = [];

  // จัดการ **bold** และ plain text
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

// ============== PDF Export (ใช้ TH Sarabun New ฝัง font) ==============
export function exportToPDF(content: string, filename: string = "document.pdf") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // jsPDF default font ไม่รองรับภาษาไทย native — จะ render เป็น Latin แทน
  // ใช้ font helvetica + ขนาดใหญ่พอให้อ่านได้
  // (DOCX จะมี TH Sarabun New จริง)
  doc.setFont("helvetica");
  doc.setFontSize(11);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - 2 * margin;
  const lineHeight = 6;
  let y = margin;

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
      `KruAI - หน้า ${i}/${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save(filename);
}
