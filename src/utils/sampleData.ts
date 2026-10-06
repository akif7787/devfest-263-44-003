import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { RequirementsData } from '../types';

function createPdfFile(bytes: Uint8Array, filename: string): File {
  return new File([bytes as unknown as BlobPart], filename, {
    type: 'application/pdf',
  });
}

export const OFFICIAL_SAMPLE_REQUIREMENTS: RequirementsData = {
  tender: {
    tender_id: "T-2026-0417",
    title: "Supply of IT Equipment",
    procuring_entity: "Directorate of Sample Services",
    bidder: "Meghna Tech Solutions Ltd.",
    submission_deadline: "2026-10-20"
  },
  requirements: [
    {
      id: "R01",
      order: 1,
      title_en: "Trade License",
      title_bn: "ট্রেড লাইসেন্স",
      mandatory: true,
      has_expiry: true
    },
    {
      id: "R02",
      order: 2,
      title_en: "TIN Certificate",
      title_bn: "টিআইএন সনদ",
      mandatory: true,
      has_expiry: false
    },
    {
      id: "R03",
      order: 3,
      title_en: "VAT Registration Certificate",
      title_bn: "ভ্যাট নিবন্ধন সনদ",
      mandatory: true,
      has_expiry: false
    },
    {
      id: "R04",
      order: 4,
      title_en: "Bank Solvency Certificate",
      title_bn: "ব্যাংক সচ্ছলতা সনদ",
      mandatory: true,
      has_expiry: true
    },
    {
      id: "R05",
      order: 5,
      title_en: "Experience Certificate",
      title_bn: "অভিজ্ঞতার সনদ",
      mandatory: true,
      has_expiry: false
    },
    {
      id: "R06",
      order: 6,
      title_en: "Audited Financial Statement",
      title_bn: "নিরীক্ষিত আর্থিক বিবরণী",
      mandatory: false,
      has_expiry: false
    },
    {
      id: "R07",
      order: 7,
      title_en: "Manufacturer's Authorization",
      title_bn: "প্রস্তুতকারকের অনুমোদনপত্র",
      mandatory: false,
      has_expiry: true
    },
    {
      id: "R08",
      order: 8,
      title_en: "Technical Proposal",
      title_bn: "কারিগরি প্রস্তাব",
      mandatory: true,
      has_expiry: false
    },
    {
      id: "R09",
      order: 9,
      title_en: "Financial Proposal",
      title_bn: "আর্থিক প্রস্তাব",
      mandatory: true,
      has_expiry: false
    },
    {
      id: "R10",
      order: 10,
      title_en: "Signed Declaration",
      title_bn: "স্বাক্ষরিত ঘোষণাপত্র",
      mandatory: true,
      has_expiry: false
    }
  ]
};

/**
 * Creates a synthetic PDF document in memory using pdf-lib for testing or sample loading.
 */
async function createMockPdf(
  title: string,
  pagesCount: number,
  subtitle: string,
  notes: string[] = []
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pagesCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Top banner
    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.12, 0.22, 0.35),
    });

    page.drawText('Meghna Tech Solutions Ltd.', {
      x: 40,
      y: height - 35,
      size: 15,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${title}  •  Tender T-2026-0417`, {
      x: 40,
      y: height - 50,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.9, 0.95),
    });

    page.drawText(`Internal Document Page ${i} of ${pagesCount}`, {
      x: width - 180,
      y: height - 42,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.9, 0.95),
    });

    // Content area
    page.drawText(title.toUpperCase(), {
      x: 40,
      y: height - 110,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.2),
    });

    page.drawText(subtitle, {
      x: 40,
      y: height - 130,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.4),
    });

    // Content box
    page.drawRectangle({
      x: 40,
      y: height - 340,
      width: width - 80,
      height: 190,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
    });

    let currentY = height - 170;
    for (const note of notes) {
      page.drawText(`• ${note}`, {
        x: 60,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.3),
      });
      currentY -= 22;
    }

    // Watermark
    page.drawText('OFFICIAL BID ATTACHMENT', {
      x: 80,
      y: 280,
      size: 32,
      font: fontBold,
      color: rgb(0.92, 0.94, 0.96),
      rotate: degrees(25),
    });

    // Simulated signature block at bottom
    if (i === pagesCount) {
      page.drawLine({
        start: { x: 40, y: 130 },
        end: { x: 220, y: 130 },
        thickness: 1,
        color: rgb(0.4, 0.45, 0.5),
      });
      page.drawText('Rafiq Hasan', {
        x: 40,
        y: 112,
        size: 11,
        font: fontBold,
        color: rgb(0.1, 0.15, 0.2),
      });
      page.drawText('Managing Director, Meghna Tech Solutions Ltd.', {
        x: 40,
        y: 98,
        size: 9,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5),
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Generates sample files representing the official test documents from the prompt:
 * - Trade License 2024-2025 (Expired on 2025-06-30)
 * - Trade License 2026-2027 (Valid until 2027-06-30)
 * - TIN Certificate (1 page)
 * - VAT Registration Certificate (1 page)
 * - Bank Solvency Certificate (Valid until 2026-12-31)
 * - Experience Certificate (2 pages)
 * - Experience Certificate Copy (exact identical duplicate content!)
 * - Audited Financial Statement (4 pages, optional)
 * - Technical Proposal (6 pages)
 * - Financial Proposal (2 pages)
 * - Signed Declaration (1 page)
 */
export async function createOfficialSamplePdfFiles(): Promise<File[]> {
  const files: File[] = [];

  // 1. Trade License Expired (2024-2025, expires 2025-06-30)
  const tlExpiredBytes = await createMockPdf(
    'Trade License (Expired)',
    1,
    'City Corporation Licensing Dept - Fiscal Year 2024-2025',
    [
      'License No: TL-2024-118734',
      'Business Name: Meghna Tech Solutions Ltd.',
      'VALID UNTIL (EXPIRY DATE): 30 June 2025 (2025-06-30)',
      'Status in prompt: EXPIRED relative to submission deadline (2026-10-20)',
    ]
  );
  files.push(createPdfFile(tlExpiredBytes, 'Trade_License_2024_Expired.pdf'));

  // 2. Trade License Valid (2026-2027, expires 2027-06-30)
  const tlValidBytes = await createMockPdf(
    'Trade License (Valid Renewal)',
    1,
    'City Corporation Licensing Dept - Fiscal Year 2026-2027',
    [
      'License No: TL-2026-118734',
      'Business Name: Meghna Tech Solutions Ltd.',
      'VALID UNTIL (EXPIRY DATE): 30 June 2027 (2027-06-30)',
      'Status in prompt: OK (valid after 2026-10-20 deadline)',
    ]
  );
  files.push(createPdfFile(tlValidBytes, 'Trade_License_2026_Valid.pdf'));

  // 3. TIN Certificate
  const tinBytes = await createMockPdf(
    'TIN Certificate',
    1,
    'Sample Revenue Board - Taxpayer Identification Certificate',
    [
      'TIN: 1234-5678-9012',
      'Registered Address: House 12, Road 5, Sample Town, Dhaka',
      'Date of Issue: 2019-03-14 (Does not have an expiry date)',
    ]
  );
  files.push(createPdfFile(tinBytes, 'TIN_Certificate.pdf'));

  // 4. VAT Registration Certificate
  const vatBytes = await createMockPdf(
    'VAT Registration Certificate',
    1,
    'Sample Revenue Board - Business ID (BIN)',
    [
      'BIN: 000123456-0101',
      'Type of Activity: Supply, Service',
      'Effective Date: 2019-04-01 (Remains in force until cancelled)',
    ]
  );
  files.push(createPdfFile(vatBytes, 'VAT_Registration_Certificate.pdf'));

  // 5. Bank Solvency Certificate (expires 2026-12-31)
  const solvencyBytes = await createMockPdf(
    'Bank Solvency Certificate',
    1,
    'Sample Commercial Bank PLC - Sample Town Branch',
    [
      'Ref: SCB/STB/SOL/2026/0981',
      'Financially solvent up to BDT 5,00,00,000 (Five Crore Taka)',
      'VALID UNTIL (EXPIRY DATE): 31 December 2026 (2026-12-31)',
    ]
  );
  files.push(createPdfFile(solvencyBytes, 'Bank_Solvency_Certificate.pdf'));

  // 6. Experience Certificate (2 pages)
  const expBytes = await createMockPdf(
    'Experience Certificate',
    2,
    'Sample University - Office of the Registrar',
    [
      'Contract: Supply and Installation of Computer Lab Equipment',
      'Contract Value: BDT 2,35,40,000',
      'Completion Date: 2026-01-31 (Completed on time and fully satisfied)',
    ]
  );
  files.push(createPdfFile(expBytes, 'Experience_Certificate.pdf'));

  // 7. Duplicate Experience Certificate (Identical bytes to test Task 4.6 duplicate detection!)
  files.push(createPdfFile(expBytes, 'Experience_Certificate_Copy.pdf'));

  // 8. Technical Proposal (6 pages)
  const techBytes = await createMockPdf(
    'Technical Proposal',
    6,
    'Comprehensive Technical Specification & Implementation Plan',
    [
      'Scope: 60 Desktop computers, 25 Laptops, 8 Network printers, 60 UPS, 4 Switches',
      'Specifications: Core i7 13th gen, 16GB DDR5, 512GB NVMe SSD, 3-year warranty',
      'Schedule: 45-day turnkey completion, 24h technical support SLA',
    ]
  );
  files.push(createPdfFile(techBytes, 'Technical_Proposal.pdf'));

  // 9. Financial Proposal (2 pages)
  const finBytes = await createMockPdf(
    'Financial Proposal',
    2,
    'Price Schedule & Payment Terms',
    [
      'Grand Total: BDT 1,21,30,000 (One Crore Twenty-One Lakh Thirty Thousand Taka)',
      'Validity: Valid for 120 days from submission deadline',
      'Terms: 80% on delivery/installation, 20% on user acceptance testing',
    ]
  );
  files.push(createPdfFile(finBytes, 'Financial_Proposal.pdf'));

  // 10. Signed Declaration (1 page)
  const declBytes = await createMockPdf(
    'Signed Declaration',
    1,
    'Tender Compliance and Non-Debarment Declaration',
    [
      'Date: 2026-10-15',
      'Certified: All information is true, bidder is not barred from public procurement',
      'Seal: Meghna Tech Solutions Ltd. Registered Corporate Seal',
    ]
  );
  files.push(createPdfFile(declBytes, 'Signed_Declaration.pdf'));

  return files;
}
