// Export utilities - PDF + DOCX

import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

// ============== PDF Export ==============
export function exportToPDF(content: string, filename: string = "document.pdf") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set Thai-compatible font (Sarabun) — fallback to helvetica
  doc.setFont("helvetica");
  doc.setFontSize(11);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - 2 * margin;
  const lineHeight = 6;
  let y = margin;

  // Parse markdown และ render
  const lines = content.split("\n");

  for (const line of lines) {
    // Heading detection
    if (line.startsWith("# ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace("# ", ""));
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 8 + 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("## ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace("## ", ""));
      const wrapped = doc.splitTextToSize(text, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 7 + 3;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("### ")) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const text = stripMarkdown(line.replace("### ", ""));
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
      // Normal text
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

  // Footer page number
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

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^>\s*/, "")
    .trim();
}

// ============== DOCX Export ==============
export async function exportToDOCX(content: string, filename: string = "document.docx") {
  const lines = content.split("\n");
  const children: Paragraph[] = [];

  for (const line of lines) {
    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          text: stripMarkdown(line.replace("# ", "")),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          alignment: AlignmentType.LEFT,
        })
      );
    } else if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          text: stripMarkdown(line.replace("## ", "")),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        })
      );
    } else if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          text: stripMarkdown(line.replace("### ", "")),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 150, after: 100 },
        })
      );
    } else if (line.startsWith("---")) {
      children.push(
        new Paragraph({
          text: "─".repeat(50),
          spacing: { before: 100, after: 100 },
        })
      );
    } else if (line.trim() === "") {
      children.push(new Paragraph({ text: "" }));
    } else {
      // Parse inline markdown
      const parts = parseInlineMarkdown(line);
      children.push(
        new Paragraph({
          children: parts,
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    creator: "KruAI",
    title: "เอกสารจาก KruAI",
    description: "สร้างโดย KruAI - ผู้ช่วยครูไทย",
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

function parseInlineMarkdown(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const cleanText = stripMarkdown(text);

  // Check for **bold**
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.slice(lastIndex, match.index).replace(/\*\*/g, ""),
        })
      );
    }
    runs.push(
      new TextRun({
        text: match[1],
        bold: true,
      })
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex).replace(/\*\*/g, "") }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text: cleanText }));
  }

  return runs;
}
