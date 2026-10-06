import {
  RequirementItem,
  UploadedFileRecord,
  DocumentStatusType,
  RequirementEvaluation,
  ReadinessSummary,
} from '../types';

/**
 * Evaluates the status of a single requirement according to Official Contest Section 5 Rules:
 *
 * 1. Missing: Required document, no file matched. (Blocking)
 * 2. Expiry date needed: has_expiry = true and a file is matched, but no expiry date entered. (Blocking)
 * 3. Expired: The expiry date is before the submission deadline. (Blocking)
 * 4. Not provided: Optional document, no file matched. (Not blocking)
 * 5. OK: File matched, and (if has_expiry) the expiry date is on or after the submission deadline. (Not blocking)
 * Note: If expiry date equals submission deadline, status is OK.
 */
export function evaluateRequirement(
  req: RequirementItem,
  matchedFile: UploadedFileRecord | undefined,
  expiryDateStr: string | undefined,
  submissionDeadlineStr: string
): RequirementEvaluation {
  // If file is not matched
  if (!matchedFile) {
    if (req.mandatory) {
      return {
        requirement: req,
        status: 'MISSING',
        isBlocking: true,
        matchedFile: undefined,
        expiryDate: undefined,
        statusReasonEn: 'Missing — Mandatory document has no matched file',
        statusReasonBn: 'অনুপস্থিত — আবশ্যকীয় নথিটি এখনো সংযুক্ত করা হয়নি',
      };
    } else {
      return {
        requirement: req,
        status: 'NOT_PROVIDED',
        isBlocking: false,
        matchedFile: undefined,
        expiryDate: undefined,
        statusReasonEn: 'Not provided — Optional document without matched file',
        statusReasonBn: 'প্রদান করা হয়নি — ঐচ্ছিক নথি সংযুক্ত করা হয়নি (অনুমোদিত)',
      };
    }
  }

  // If file is matched, check expiry rules
  if (req.has_expiry) {
    if (!expiryDateStr || expiryDateStr.trim() === '') {
      return {
        requirement: req,
        status: 'EXPIRY_NEEDED',
        isBlocking: true,
        matchedFile,
        expiryDate: undefined,
        statusReasonEn: 'Expiry date needed — Date must be entered for verification',
        statusReasonBn: 'মেয়াদ উত্তীর্ণের তারিখ প্রয়োজন — যাচাইয়ের জন্য তারিখ প্রবেশ করান',
      };
    }

    // Compare expiry date with submission deadline (both formatted YYYY-MM-DD)
    // Lexicographical comparison for YYYY-MM-DD format is accurate and avoids timezone shifts
    const expiry = expiryDateStr.trim();
    const deadline = submissionDeadlineStr.trim();

    if (expiry < deadline) {
      return {
        requirement: req,
        status: 'EXPIRED',
        isBlocking: true,
        matchedFile,
        expiryDate: expiry,
        statusReasonEn: `Expired — Valid until ${expiry} (Deadline: ${deadline})`,
        statusReasonBn: `মেয়াদোত্তীর্ণ — বৈধতার মেয়াদ ${expiry} (দাখিলের সময়সীমা: ${deadline})`,
      };
    } else {
      return {
        requirement: req,
        status: 'OK',
        isBlocking: false,
        matchedFile,
        expiryDate: expiry,
        statusReasonEn: `OK — Valid until ${expiry} (Deadline: ${deadline})`,
        statusReasonBn: `ঠিক আছে — মেয়াদের তারিখ ${expiry} (সময়সীমা: ${deadline})`,
      };
    }
  }

  // File is matched and no expiry required
  return {
    requirement: req,
    status: 'OK',
    isBlocking: false,
    matchedFile,
    expiryDate: undefined,
    statusReasonEn: 'OK — File attached and valid',
    statusReasonBn: 'ঠিক আছে — ফাইল সংযুক্ত ও বৈধ',
  };
}

/**
 * Calculates overall package readiness metrics and identifies all blocking issues.
 */
export function calculatePackageReadiness(
  evaluations: RequirementEvaluation[],
  uploadedFiles: UploadedFileRecord[]
): ReadinessSummary {
  let totalRequired = 0;
  let totalOptional = 0;
  let readyRequired = 0;
  let readyOptional = 0;
  let totalProblems = 0;
  const blockingReasonsEn: string[] = [];
  const blockingReasonsBn: string[] = [];

  // Check duplicate match conflicts: if multiple documents are matched to identical duplicate files
  const matchedFileHashes = new Map<string, string[]>(); // hash -> list of req titles
  for (const ev of evaluations) {
    if (ev.matchedFile) {
      const list = matchedFileHashes.get(ev.matchedFile.hash) || [];
      list.push(ev.requirement.title_en);
      matchedFileHashes.set(ev.matchedFile.hash, list);
    }
  }

  for (const [hash, titles] of matchedFileHashes.entries()) {
    if (titles.length > 1) {
      const reasonEn = `Duplicate conflict: Identical PDF content matched to multiple requirements (${titles.join(', ')})`;
      const reasonBn = `ডুপ্লিকেট ফাইল দ্বন্দ্ব: একই কন্টেন্টের পিডিএফ একাধিক নথিতে সংযুক্ত (${titles.join(', ')})`;
      blockingReasonsEn.push(reasonEn);
      blockingReasonsBn.push(reasonBn);
      totalProblems++;
    }
  }

  // Check if any matched file is corrupt or encrypted
  for (const ev of evaluations) {
    if (ev.matchedFile && ev.matchedFile.isCorruptOrEncrypted) {
      const reasonEn = `Unreadable PDF for "${ev.requirement.title_en}": ${ev.matchedFile.errorMessage || 'Corrupt or encrypted'}`;
      const reasonBn = `"${ev.requirement.title_bn}" এর জন্য অকার্যকর পিডিএফ: ফাইলটি পাসওয়ার্ড সুরক্ষিত বা ক্ষতিগ্রস্ত`;
      blockingReasonsEn.push(reasonEn);
      blockingReasonsBn.push(reasonBn);
      totalProblems++;
    }
  }

  // Check requirement status
  for (const ev of evaluations) {
    if (ev.requirement.mandatory) {
      totalRequired++;
      if (ev.status === 'OK') {
        readyRequired++;
      } else {
        totalProblems++;
        blockingReasonsEn.push(`${ev.requirement.title_en}: ${ev.statusReasonEn}`);
        blockingReasonsBn.push(`${ev.requirement.title_bn}: ${ev.statusReasonBn}`);
      }
    } else {
      totalOptional++;
      if (ev.status === 'OK') {
        readyOptional++;
      } else if (ev.isBlocking) {
        // e.g. Optional doc was matched, but expired or missing expiry
        totalProblems++;
        blockingReasonsEn.push(`${ev.requirement.title_en} (Optional): ${ev.statusReasonEn}`);
        blockingReasonsBn.push(`${ev.requirement.title_bn} (ঐচ্ছিক): ${ev.statusReasonBn}`);
      }
    }
  }

  const isReady = totalProblems === 0 && readyRequired === totalRequired;

  return {
    totalRequired,
    totalOptional,
    readyRequired,
    readyOptional,
    totalProblems,
    isReady,
    blockingReasonsEn,
    blockingReasonsBn,
  };
}
