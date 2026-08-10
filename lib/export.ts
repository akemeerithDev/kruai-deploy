// Export utilities - PDF + DOCX
// ⭐ DOCX ใช้ TH Sarabun New ทั้งเล่ม 100%
// ⭐ PDF ใช้ html2pdf.js render HTML เพื่อรองรับภาษาไทย

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  Footer,
  Header,
  PageNumber,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

// ⭐ Font หลัก: TH Sarabun New
const FONT_NAME = "TH Sarabun New";

// Size (docx ใช้หน่วย half-points: 16pt = 32)
const SIZE_BODY = 32; // 16pt
const SIZE_HEADING3 = 36; // 18pt
const SIZE_HEADING1 = 72; // 36pt

// ============== DOCX Export ==============
export async function exportToDOCX(
  content: string,
  filename: string = "document.docx",
  metadata?: { title?: string; subject?: string; type?: string }
) {
  // Parse content เป็น blocks
  const blocks = parseMarkdownToBlocks(content);

  const children: (Paragraph | Table)[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const nextBlock = blocks[i + 1];

    if (block.type === "h1_multiline") {
      // H1 พร้อม 4 บรรทัด header (สำหรับแผนการสอน) — 36pt Bold Center
      // บรรทัดแรก (ชื่อเรื่อง) = 36pt Bold
      // บรรทัดถัดไป = 16pt regular
      const lines = block.text.split("\n");
      const title = lines[0];
      const subLines = lines.slice(1);

      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 120, line: 360 },
          children: [
            new TextRun({
              text: title,
              font: FONT_NAME,
              size: SIZE_HEADING1,
              bold: true,
            }),
          ],
        })
      );

      for (const sub of subLines) {
        if (!sub.trim()) continue;
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { line: 360 },
            children: [
              new TextRun({
                text: sub,
                font: FONT_NAME,
                size: SIZE_BODY,
              }),
            ],
          })
        );
      }
    } else if (block.type === "h1") {
      // หัวเรื่องใหญ่ — 36pt Bold Center + page break ก่อน (ยกเว้นอันแรก)
      if (children.length > 0) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240, line: 360 },
          children: [
            new TextRun({
              text: block.text,
              font: FONT_NAME,
              size: SIZE_HEADING1,
              bold: true,
            }),
          ],
        })
      );
    } else if (block.type === "h2") {
      // หัวข้อรอง — 36pt Bold Center
      if (children.length > 0) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240, line: 360 },
          children: [
            new TextRun({
              text: block.text,
              font: FONT_NAME,
              size: SIZE_HEADING1,
              bold: true,
            }),
          ],
        })
      );
    } else if (block.type === "h3") {
      // หัวข้อย่อย — 18pt Bold
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 120, line: 360 },
          children: [
            new TextRun({
              text: block.text,
              font: FONT_NAME,
              size: SIZE_HEADING3,
              bold: true,
            }),
          ],
        })
      );
    } else if (block.type === "h4") {
      // หัวข้อย่อยมาก
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 180, after: 80, line: 360 },
          children: [
            new TextRun({
              text: block.text,
              font: FONT_NAME,
              size: SIZE_BODY,
              bold: true,
            }),
          ],
        })
      );
    } else if (block.type === "table" && block.rows) {
      // Markdown table → Word table
      children.push(createWordTable(block.rows));
      children.push(
        new Paragraph({ spacing: { line: 360 }, children: [new TextRun({ text: "", font: FONT_NAME, size: SIZE_BODY })] })
      );
    } else if (block.type === "divider") {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120, line: 360 },
          children: [
            new TextRun({ text: "─".repeat(50), font: FONT_NAME, size: SIZE_BODY }),
          ],
        })
      );
    } else if (block.type === "empty") {
      children.push(
        new Paragraph({
          spacing: { line: 360 },
          children: [new TextRun({ text: "", font: FONT_NAME, size: SIZE_BODY })],
        })
      );
    } else {
      // เนื้อหา
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 60, after: 60, line: 360 },
          children: parseInlineMarkdown(block.text),
        })
      );
    }
  }

  const doc = new Document({
    creator: "KruAI",
    title: metadata?.title || "เอกสารจาก KruAI",
    description: `${metadata?.type || "เอกสารการศึกษา"} - สร้างด้วย KruAI`,
    styles: {
      default: {
        document: {
          run: { font: FONT_NAME, size: SIZE_BODY },
          paragraph: { spacing: { line: 360 } },
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
                    size: 24,
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
                  new TextRun({ children: ["หน้า ", PageNumber.CURRENT], font: FONT_NAME, size: SIZE_BODY }),
                  new TextRun({ children: ["/", PageNumber.TOTAL_PAGES], font: FONT_NAME, size: SIZE_BODY }),
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

// ============== PDF Export - ใช้ html2pdf.js (dynamic import) ==============
export async function exportToPDF(
  content: string,
  filename: string = "document.pdf",
  metadata?: { title?: string; subject?: string; type?: string }
) {
  // dynamic import — ใช้ได้เฉพาะ client-side
  const html2pdf = (await import("html2pdf.js")).default;

  // แปลง markdown → HTML (พร้อม styling)
  const html = markdownToHtml(content, metadata?.title);

  // สร้าง container ชั่วคราว
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.fontFamily = "'TH Sarabun New', 'Sarabun', sans-serif";
  container.style.fontSize = "16pt";
  container.style.lineHeight = "1.5";
  container.style.color = "#000";
  container.style.padding = "0";
  container.style.maxWidth = "100%";
  document.body.appendChild(container);

  const opt: any = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } catch (err) {
    console.error("PDF export error:", err);
    alert("สร้าง PDF ไม่สำเร็จ: " + (err instanceof Error ? err.message : ""));
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

// ============== Markdown → HTML (สำหรับ PDF) ==============
function markdownToHtml(content: string, title?: string): string {
  const blocks = parseMarkdownToBlocks(content);
  const parts: string[] = [];

  parts.push(`<div style="font-family: 'TH Sarabun New', 'Sarabun', sans-serif; font-size: 16pt; line-height: 1.5; color: #000; max-width: 100%;">`);
  if (title) {
    parts.push(`<h1 style="text-align: center; font-size: 24pt; font-weight: bold; margin: 0 0 20px 0;">${escapeHtml(title)}</h1>`);
  }

  for (const block of blocks) {
    if (block.type === "h1" || block.type === "h2") {
      parts.push(
        `<h1 style="text-align: center; font-size: 24pt; font-weight: bold; margin: 24px 0 16px 0; page-break-before: always;">${escapeHtml(block.text)}</h1>`
      );
    } else if (block.type === "h3") {
      parts.push(
        `<h3 style="font-size: 18pt; font-weight: bold; margin: 18px 0 8px 0; color: #1e3a8a;">${escapeHtml(block.text)}</h3>`
      );
    } else if (block.type === "h4") {
      parts.push(
        `<h4 style="font-size: 16pt; font-weight: bold; margin: 14px 0 6px 0;">${escapeHtml(block.text)}</h4>`
      );
    } else if (block.type === "table" && block.rows) {
      parts.push(blockToHtmlTable(block.rows));
    } else if (block.type === "divider") {
      parts.push(`<hr style="border: none; border-top: 1px dashed #999; margin: 12px 0;" />`);
    } else if (block.type === "empty") {
      parts.push(`<div style="height: 8px;"></div>`);
    } else {
      parts.push(
        `<p style="text-align: justify; margin: 6px 0; text-indent: 2em;">${escapeHtml(block.text)}</p>`
      );
    }
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

function blockToHtmlTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  let html = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14pt;">`;
  rows.forEach((row, idx) => {
    const isHeader = idx === 0;
    const tag = isHeader ? "th" : "td";
    const style = isHeader
      ? `background: #2563eb; color: white; font-weight: bold; padding: 8px; border: 1px solid #1e40af; text-align: center;"`
      : `padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top;`;
    html += "<tr>";
    row.forEach((cell) => {
      html += `<${tag} style="${style}">${escapeHtml(cell)}</${tag}>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============== Markdown → Blocks (สำหรับทั้ง DOCX + HTML) ==============
type BlockType = "h1" | "h1_multiline" | "h2" | "h3" | "h4" | "p" | "empty" | "divider" | "table";
type Block = { type: BlockType; text: string; rows?: string[][] };

export function parseMarkdownToBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      // H1: รวม 4 บรรทัดถัดไปที่ไม่ใช่ # (สำหรับแผนการสอน)
      const h1Lines: string[] = [stripMarkdown(line.replace("# ", ""))];
      let j = i + 1;
      // เก็บบรรทัดที่ไม่ว่าง และไม่ขึ้นต้นด้วย # ให้รวมเป็นส่วนหนึ่งของ H1
      while (j < lines.length && h1Lines.length < 5) {
        const next = lines[j];
        if (next.trim() === "") break;
        if (next.startsWith("#")) break;
        h1Lines.push(next);
        j++;
      }
      blocks.push({ type: "h1_multiline", text: h1Lines.join("\n") });
      i = j;
      continue;
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: stripMarkdown(line.replace("## ", "")) });
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: stripMarkdown(line.replace("### ", "")) });
    } else if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: stripMarkdown(line.replace("#### ", "")) });
    } else if (line.startsWith("---")) {
      blocks.push({ type: "divider", text: "" });
    } else if (line.trim() === "") {
      blocks.push({ type: "empty", text: "" });
    } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      // Table — รวมหลายบรรทัด
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const currentLine = lines[i].trim();
        if (/^\|[\s\-:|]+\|$/.test(currentLine)) {
          i++;
          continue;
        }
        const cells = currentLine
          .slice(1, -1)
          .split("|")
          .map((c) => stripMarkdown(c.trim()));
        tableRows.push(cells);
        i++;
      }
      i--;
      blocks.push({ type: "table", text: "", rows: tableRows });
    } else {
      blocks.push({ type: "p", text: line });
    }
    i++;
  }

  return blocks;
}

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
      new TextRun({ text: stripMarkdown(text), font: FONT_NAME, size: SIZE_BODY })
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

// ============== Helper: Create Word Table ==============
function createWordTable(rows: string[][]): Table {
  const tableRows: TableRow[] = rows.map((row, idx) => {
    const isHeader = idx === 0;
    return new TableRow({
      tableHeader: isHeader,
      children: row.map(
        (cell) =>
          new TableCell({
            width: {
              size: Math.floor(100 / row.length),
              type: WidthType.PERCENTAGE,
            },
            shading: isHeader
              ? { fill: "2563eb", color: "auto" }
              : idx % 2 === 0
              ? { fill: "f1f5f9", color: "auto" }
              : undefined,
            children: [
              new Paragraph({
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: { before: 40, after: 40, line: 320 },
                children: [
                  new TextRun({
                    text: cell,
                    font: FONT_NAME,
                    size: SIZE_BODY,
                    bold: isHeader,
                    color: isHeader ? "FFFFFF" : "000000",
                  }),
                ],
              }),
            ],
          })
      ),
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "cbd5e1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "cbd5e1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "cbd5e1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "cbd5e1" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "cbd5e1" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "cbd5e1" },
    },
  });
}
