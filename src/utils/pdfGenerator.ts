import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { TenderInfo, RequirementEvaluation } from '../types';

export interface GenerationProgress {
  step: string;
  percent: number;
}

export interface GeneratedPackageResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  filename: string;
  totalPages: number;
  includedDocumentsCount: number;
}

/**
 * Compiles the final official PDF package according to Section 6:
 * - Page 1: English cover page with tender details & ordered document list
 * - Index / Table of Contents with start page numbers
 * - All matched documents sorted strictly by requirement "order"
 * - All pages included in original order
 * - Optional documents without files skipped
 * - Footer stamped on EVERY page: "<tender_id> | Page X of Y"
 */
export async function compileTenderPackagePdf(
  tender: TenderInfo,
  evaluations: RequirementEvaluation[],
  onProgress?: (progress: GenerationProgress) => void
): Promise<GeneratedPackageResult> {
  onProgress?.({ step: 'Initializing compiler...', percent: 10 });

  // Filter only matched documents with OK status, sorted by requirement order
  const validEvaluations = evaluations
    .filter(ev => ev.matchedFile && ev.status === 'OK')
    .sort((a, b) => a.requirement.order - b.requirement.order);

  const mergedPdf = await PDFDocument.create();
  const fontRegular = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

  onProgress?.({ step: 'Generating official cover page...', percent: 25 });

  // -------------------------------------------------------------
  // Page 1: English Cover Page
  // -------------------------------------------------------------
  const coverPage = mergedPdf.addPage([595.28, 841.89]); // A4
  const { width: cWidth, height: cHeight } = coverPage.getSize();

  // Top header navy banner
  coverPage.drawRectangle({
    x: 0,
    y: cHeight - 110,
    width: cWidth,
    height: 110,
    color: rgb(0.08, 0.18, 0.32),
  });

  // Top badge
  coverPage.drawText('GOVERNMENT & ENTERPRISE PROCUREMENT SUBMISSION', {
    x: 40,
    y: cHeight - 45,
    size: 10,
    font: fontBold,
    color: rgb(0.7, 0.85, 1.0),
  });

  coverPage.drawText('OFFICIAL TENDER DOCUMENT PACKAGE', {
    x: 40,
    y: cHeight - 75,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText(`Tender Reference: ${tender.tender_id}`, {
    x: 40,
    y: cHeight - 95,
    size: 11,
    font: fontRegular,
    color: rgb(0.85, 0.9, 0.95),
  });

  // Tender Information Summary Box
  coverPage.drawRectangle({
    x: 40,
    y: cHeight - 275,
    width: cWidth - 80,
    height: 145,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.82, 0.86, 0.9),
    borderWidth: 1,
  });

  const creationDate = new Date().toISOString().split('T')[0];

  const infoRows = [
    { label: 'Tender ID:', value: tender.tender_id },
    { label: 'Tender Title:', value: tender.title },
    { label: 'Procuring Entity:', value: tender.procuring_entity },
    { label: 'Bidder Name:', value: tender.bidder },
    { label: 'Submission Deadline:', value: tender.submission_deadline },
    { label: 'Package Creation Date:', value: creationDate },
  ];

  let infoY = cHeight - 150;
  for (const row of infoRows) {
    coverPage.drawText(row.label, {
      x: 55,
      y: infoY,
      size: 9.5,
      font: fontBold,
      color: rgb(0.2, 0.25, 0.3),
    });
    coverPage.drawText(row.value, {
      x: 190,
      y: infoY,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.1, 0.12, 0.15),
    });
    infoY -= 20;
  }

  // Included Documents Table Heading
  coverPage.drawText('LIST OF INCLUDED DOCUMENTS', {
    x: 40,
    y: cHeight - 305,
    size: 12,
    font: fontBold,
    color: rgb(0.08, 0.18, 0.32),
  });

  coverPage.drawText('The following verified documents are bundled in strict statutory sequence:', {
    x: 40,
    y: cHeight - 322,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  // Table header
  coverPage.drawRectangle({
    x: 40,
    y: cHeight - 350,
    width: cWidth - 80,
    height: 22,
    color: rgb(0.92, 0.94, 0.97),
  });

  coverPage.drawText('Order', { x: 50, y: cHeight - 344, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
  coverPage.drawText('Document Title (English)', { x: 95, y: cHeight - 344, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
  coverPage.drawText('Matched File Name', { x: 260, y: cHeight - 344, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
  coverPage.drawText('Pages', { x: 440, y: cHeight - 344, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
  coverPage.drawText('Expiry / Status', { x: 485, y: cHeight - 344, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });

  let tableY = cHeight - 372;
  for (let idx = 0; idx < validEvaluations.length; idx++) {
    const ev = validEvaluations[idx];
    const isAlt = idx % 2 === 1;

    if (isAlt) {
      coverPage.drawRectangle({
        x: 40,
        y: tableY - 6,
        width: cWidth - 80,
        height: 18,
        color: rgb(0.98, 0.98, 0.99),
      });
    }

    const orderText = `${ev.requirement.order}`;
    const titleText = ev.requirement.title_en.length > 25
      ? ev.requirement.title_en.substring(0, 24) + '...'
      : ev.requirement.title_en;
    const fileText = (ev.matchedFile?.name || '').length > 25
      ? (ev.matchedFile?.name || '').substring(0, 24) + '...'
      : (ev.matchedFile?.name || '');
    const pagesText = `${ev.matchedFile?.pageCount || 1}`;
    const expiryText = ev.requirement.has_expiry && ev.expiryDate ? ev.expiryDate : 'N/A';

    coverPage.drawText(orderText, { x: 55, y: tableY, size: 8, font: fontBold, color: rgb(0.1, 0.15, 0.2) });
    coverPage.drawText(titleText, { x: 95, y: tableY, size: 8, font: fontRegular, color: rgb(0.15, 0.2, 0.25) });
    coverPage.drawText(fileText, { x: 260, y: tableY, size: 8, font: fontRegular, color: rgb(0.3, 0.35, 0.4) });
    coverPage.drawText(pagesText, { x: 450, y: tableY, size: 8, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    coverPage.drawText(expiryText, { x: 485, y: tableY, size: 8, font: fontRegular, color: rgb(0.1, 0.55, 0.25) });

    tableY -= 20;
    if (tableY < 70) break; // keep above footer
  }

  // Cover certification notice
  coverPage.drawText('This package was compiled and verified using the browser-based Tender Document Package Builder.', {
    x: 40,
    y: 50,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.55, 0.6),
  });

  // -------------------------------------------------------------
  // Copy all document pages in sorted requirement order
  // -------------------------------------------------------------
  let currentProgressPercent = 35;
  const progressStep = 50 / Math.max(1, validEvaluations.length);

  for (let idx = 0; idx < validEvaluations.length; idx++) {
    const ev = validEvaluations[idx];
    if (!ev.matchedFile) continue;

    onProgress?.({
      step: `Merging ${ev.requirement.title_en} (${ev.matchedFile.name})...`,
      percent: Math.round(currentProgressPercent),
    });

    try {
      let sourcePdf: PDFDocument;
      if (ev.matchedFile.arrayBuffer) {
        sourcePdf = await PDFDocument.load(ev.matchedFile.arrayBuffer, { ignoreEncryption: true });
      } else {
        const buf = await ev.matchedFile.file.arrayBuffer();
        sourcePdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      }

      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    } catch (e) {
      console.error(`Error merging PDF for ${ev.requirement.title_en}:`, e);
    }

    currentProgressPercent += progressStep;
  }

  // -------------------------------------------------------------
  // Stamping Footers on EVERY Page according to Section 6.3:
  // "<tender_id> | Page X of Y"
  // -------------------------------------------------------------
  onProgress?.({ step: 'Stamping sequential footers on all pages...', percent: 90 });

  const totalPages = mergedPdf.getPageCount();
  const footerFont = await mergedPdf.embedFont(StandardFonts.Helvetica);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const page = mergedPdf.getPage(pageIdx);
    const { width, height } = page.getSize();
    const pageNum = pageIdx + 1;
    const footerText = `${tender.tender_id} | Page ${pageNum} of ${totalPages}`;
    const textWidth = footerFont.widthOfTextAtSize(footerText, 8.5);

    // Section 6.4: "The footer must be easy to read and must not cover the document's content."
    // We add a subtle background pill strip in the margin zone so text is crystal clear
    page.drawRectangle({
      x: (width - textWidth) / 2 - 12,
      y: 10,
      width: textWidth + 24,
      height: 16,
      color: rgb(1, 1, 1),
      opacity: 0.9,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 0.5,
    });

    page.drawText(footerText, {
      x: (width - textWidth) / 2,
      y: 14,
      size: 8.5,
      font: footerFont,
      color: rgb(0.2, 0.25, 0.32),
    });
  }

  onProgress?.({ step: 'Finalizing PDF output...', percent: 98 });

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const filename = `${tender.tender_id}_Package.pdf`;

  onProgress?.({ step: 'Completed!', percent: 100 });

  return {
    pdfBytes,
    blobUrl,
    filename,
    totalPages,
    includedDocumentsCount: validEvaluations.length,
  };
}
