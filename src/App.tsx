import React, { useState, useMemo, useEffect } from 'react';
import {
  RequirementsData,
  UploadedFileRecord,
  Language,
  RequirementMatchState,
  RequirementEvaluation,
} from './types';
import { translations } from './i18n/translations';
import {
  OFFICIAL_SAMPLE_REQUIREMENTS,
  createOfficialSamplePdfFiles,
} from './utils/sampleData';
import {
  parsePdfMetadata,
  identifyDuplicates,
} from './utils/fileValidation';
import {
  evaluateRequirement,
  calculatePackageReadiness,
} from './utils/statusLogic';
import { exportChecklistToCsv } from './utils/csvExporter';
import { Header } from './components/Header';
import { TenderSummary } from './components/TenderSummary';
import { UploadedFiles } from './components/UploadedFiles';
import { RequirementList } from './components/RequirementList';
import { ReadinessPanel } from './components/ReadinessPanel';
import { PackagePreviewModal } from './components/PackagePreviewModal';
import { HelpModal } from './components/HelpModal';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  // Requirements data (defaults to Official Contest Sample)
  const [data, setData] = useState<RequirementsData>(OFFICIAL_SAMPLE_REQUIREMENTS);

  // Uploaded files list
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRecord[]>([]);

  // Match states: requirementId -> { requirementId, matchedFileId, expiryDate }
  const [matches, setMatches] = useState<Record<string, RequirementMatchState>>({});

  // UI state
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Auto-dismiss notices after 5 seconds
  useEffect(() => {
    if (successNotice) {
      const timer = setTimeout(() => setSuccessNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successNotice]);

  // Evaluated status for each requirement
  const evaluations: RequirementEvaluation[] = useMemo(() => {
    return data.requirements
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(req => {
        const match = matches[req.id];
        const matchedFile = match?.matchedFileId
          ? uploadedFiles.find(f => f.id === match.matchedFileId)
          : undefined;

        return evaluateRequirement(
          req,
          matchedFile,
          match?.expiryDate,
          data.tender.submission_deadline
        );
      });
  }, [data, uploadedFiles, matches]);

  // Overall readiness
  const readiness = useMemo(() => {
    return calculatePackageReadiness(evaluations, uploadedFiles);
  }, [evaluations, uploadedFiles]);

  // Handler: Load custom requirements.json file
  const handleLoadRequirementsJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.tender || !parsed.requirements || !Array.isArray(parsed.requirements)) {
        throw new Error('Missing tender or requirements array');
      }

      // Validate required keys
      const { tender, requirements } = parsed;
      if (!tender.tender_id || !tender.submission_deadline) {
        throw new Error('Tender object must have tender_id and submission_deadline');
      }

      // Sort requirements by order
      requirements.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      setData(parsed);
      setMatches({});
      // Clear matches on existing files
      setUploadedFiles(prev =>
        prev.map(f => ({ ...f, matchedRequirementId: undefined }))
      );

      setSuccessNotice(
        t.jsonLoadedSuccess.replace('{id}', tender.tender_id)
      );
      setErrorNotice(null);
    } catch (err: any) {
      console.error('JSON parsing error:', err);
      setErrorNotice(`${t.jsonInvalid}: ${err.message}`);
    }
  };

  // Handler: Load Official Contest Sample Pack
  const handleLoadSamplePack = async () => {
    setIsLoadingSample(true);
    setErrorNotice(null);

    try {
      setData(OFFICIAL_SAMPLE_REQUIREMENTS);

      // Generate the official sample mock PDF files
      const sampleFiles = await createOfficialSamplePdfFiles();

      const processedRecords: UploadedFileRecord[] = [];
      for (const file of sampleFiles) {
        const meta = await parsePdfMetadata(file);
        processedRecords.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount: meta.pageCount,
          hash: meta.hash,
          arrayBuffer: meta.arrayBuffer,
          duplicateIds: [],
          isCorruptOrEncrypted: meta.isCorruptOrEncrypted,
          errorMessage: meta.errorMessage,
        });
      }

      // Identify duplicates
      const indexedFiles = identifyDuplicates(processedRecords);

      // Setup matches to demonstrate the real contest problem scenarios:
      // Notice: Trade_License_2024_Expired.pdf expires on 2025-06-30 (demonstrating expired detection!)
      // While Trade_License_2026_Valid.pdf is also provided so the user can resolve the issue!
      // Bank_Solvency_Certificate.pdf is valid until 2026-12-31.
      const initialMatches: Record<string, RequirementMatchState> = {};

      for (const f of indexedFiles) {
        if (f.name === 'Trade_License_2024_Expired.pdf') {
          // Matched to R01 with its actual expiry date of 2025-06-30 -> triggers Expired status!
          initialMatches['R01'] = {
            requirementId: 'R01',
            matchedFileId: f.id,
            expiryDate: '2025-06-30',
          };
          f.matchedRequirementId = 'R01';
        } else if (f.name === 'TIN_Certificate.pdf') {
          initialMatches['R02'] = {
            requirementId: 'R02',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R02';
        } else if (f.name === 'VAT_Registration_Certificate.pdf') {
          initialMatches['R03'] = {
            requirementId: 'R03',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R03';
        } else if (f.name === 'Bank_Solvency_Certificate.pdf') {
          // Solvency is valid until 2026-12-31
          initialMatches['R04'] = {
            requirementId: 'R04',
            matchedFileId: f.id,
            expiryDate: '2026-12-31',
          };
          f.matchedRequirementId = 'R04';
        } else if (f.name === 'Experience_Certificate.pdf') {
          initialMatches['R05'] = {
            requirementId: 'R05',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R05';
        } else if (f.name === 'Technical_Proposal.pdf') {
          initialMatches['R08'] = {
            requirementId: 'R08',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R08';
        } else if (f.name === 'Financial_Proposal.pdf') {
          initialMatches['R09'] = {
            requirementId: 'R09',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R09';
        } else if (f.name === 'Signed_Declaration.pdf') {
          initialMatches['R10'] = {
            requirementId: 'R10',
            matchedFileId: f.id,
          };
          f.matchedRequirementId = 'R10';
        }
      }

      setUploadedFiles(indexedFiles);
      setMatches(initialMatches);
      setSuccessNotice(t.sampleLoadedSuccess);
    } catch (err: any) {
      console.error('Error loading sample pack:', err);
      setErrorNotice('Failed to generate sample pack: ' + err.message);
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Handler: Upload multiple files (with validation and duplicate check)
  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const newRecords: UploadedFileRecord[] = [];
    const rejectedNames: string[] = [];

    for (const file of filesArray) {
      // Reject non-PDF files as strictly required
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        rejectedNames.push(file.name);
        continue;
      }

      const meta = await parsePdfMetadata(file);
      newRecords.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount: meta.pageCount,
        hash: meta.hash,
        arrayBuffer: meta.arrayBuffer,
        duplicateIds: [],
        isCorruptOrEncrypted: meta.isCorruptOrEncrypted,
        errorMessage: meta.errorMessage,
      });
    }

    if (rejectedNames.length > 0) {
      setErrorNotice(
        rejectedNames
          .map(name => t.nonPdfRejected.replace('{name}', name))
          .join(' | ')
      );
    }

    if (newRecords.length > 0) {
      setUploadedFiles(prev => {
        const combined = [...prev, ...newRecords];
        return identifyDuplicates(combined);
      });
      if (rejectedNames.length === 0) {
        setErrorNotice(null);
      }
    }
  };

  // Handler: Remove uploaded file
  const handleRemoveFile = (fileId: string) => {
    // Unmatch any requirement pointing to this file
    setMatches(prev => {
      const next = { ...prev };
      for (const reqId in next) {
        if (next[reqId].matchedFileId === fileId) {
          next[reqId] = {
            ...next[reqId],
            matchedFileId: undefined,
          };
        }
      }
      return next;
    });

    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.id !== fileId);
      return identifyDuplicates(filtered);
    });
  };

  // Handler: Match / Change / Undo match
  const handleMatchChange = (requirementId: string, fileId: string | undefined) => {
    // If selecting a file, make sure it is unlinked from any other requirement
    setMatches(prev => {
      const next = { ...prev };

      if (fileId) {
        for (const rId in next) {
          if (next[rId].matchedFileId === fileId && rId !== requirementId) {
            next[rId] = {
              ...next[rId],
              matchedFileId: undefined,
            };
          }
        }
      }

      next[requirementId] = {
        ...next[requirementId],
        requirementId,
        matchedFileId: fileId,
      };

      return next;
    });

    // Update matchedRequirementId on uploaded files
    setUploadedFiles(prev =>
      prev.map(file => {
        if (file.id === fileId) {
          return { ...file, matchedRequirementId: requirementId };
        } else if (file.matchedRequirementId === requirementId) {
          return { ...file, matchedRequirementId: undefined };
        }
        return file;
      })
    );
  };

  // Handler: Update Expiry Date
  const handleExpiryDateChange = (requirementId: string, expiryDate: string) => {
    setMatches(prev => ({
      ...prev,
      [requirementId]: {
        ...prev[requirementId],
        requirementId,
        expiryDate,
      },
    }));
  };

  // Handler: Auto-Match Suggestion (Bonus task)
  const handleAutoMatch = () => {
    let matchedCount = 0;
    const currentMatches = { ...matches };
    const updatedFiles = [...uploadedFiles];

    for (const req of data.requirements) {
      if (currentMatches[req.id]?.matchedFileId) continue; // already matched

      // Normalize requirement title keywords
      const titleWords = req.title_en
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')
        .split(' ')
        .filter(w => w.length > 2);

      // Find best unmatched file (excluding duplicate copies and expired if alternative exists)
      const candidate = updatedFiles.find(f => {
        if (f.matchedRequirementId) return false;
        if (f.isDuplicateOf) return false; // don't auto-match duplicate files!
        const fileNameNorm = f.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        return titleWords.some(word => fileNameNorm.includes(word));
      });

      if (candidate) {
        currentMatches[req.id] = {
          ...currentMatches[req.id],
          requirementId: req.id,
          matchedFileId: candidate.id,
        };
        candidate.matchedRequirementId = req.id;
        matchedCount++;
      }
    }

    setMatches(currentMatches);
    setUploadedFiles(identifyDuplicates(updatedFiles));
    setSuccessNotice(
      language === 'bn'
        ? `${matchedCount} টি ফাইলের সাথে শর্তাদি সফলভাবে অটো-ম্যাচ করা হয়েছে`
        : `Auto-matched ${matchedCount} file(s) to requirements.`
    );
  };

  // Handler: Reset All
  const handleResetAll = () => {
    if (
      window.confirm(
        language === 'bn'
          ? 'আপনি কি নিশ্চিত যে সকল আপলোড এবং ম্যাচিং রিসেট করতে চান?'
          : 'Are you sure you want to reset all uploaded files and matches?'
      )
    ) {
      setUploadedFiles([]);
      setMatches({});
      setErrorNotice(null);
      setSuccessNotice(null);
    }
  };

  // Handler: Export CSV
  const handleExportCsv = () => {
    exportChecklistToCsv(data.tender, evaluations, language);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Application Header */}
      <Header
        tender={data.tender}
        language={language}
        onLanguageChange={setLanguage}
        onLoadRequirementsJson={handleLoadRequirementsJson}
        onLoadSamplePack={handleLoadSamplePack}
        onResetAll={handleResetAll}
        onOpenHelp={() => setIsHelpOpen(true)}
        onExportCsv={handleExportCsv}
        isLoadingSample={isLoadingSample}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Error Notification Banner */}
        {errorNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Success Notification Banner */}
        {successNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-400 hover:text-emerald-700 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tender Summary & Overall Progress */}
        <TenderSummary
          tender={data.tender}
          readiness={readiness}
          language={language}
        />

        {/* Workspace Layout: Left Content & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Work Area (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Uploaded Files Manager */}
            <UploadedFiles
              files={uploadedFiles}
              requirements={data.requirements}
              language={language}
              onUploadFiles={handleUploadFiles}
              onRemoveFile={handleRemoveFile}
              onAutoMatch={handleAutoMatch}
            />

            {/* Document Requirements Table & Matching */}
            <RequirementList
              evaluations={evaluations}
              uploadedFiles={uploadedFiles}
              submissionDeadline={data.tender.submission_deadline}
              language={language}
              onMatchChange={handleMatchChange}
              onExpiryDateChange={handleExpiryDateChange}
            />

          </div>

          {/* Right Sidebar: Readiness & Generation (col-span-4) */}
          <div className="lg:col-span-4">
            <ReadinessPanel
              readiness={readiness}
              language={language}
              onGenerateClick={() => setIsPreviewOpen(true)}
              isCompiling={false}
            />
          </div>

        </div>

      </main>

      {/* Package Preview & Compilation Modal */}
      <PackagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tender={data.tender}
        evaluations={evaluations}
        language={language}
      />

      {/* Office User Handbook / Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            AI DevFest 2026 • <strong>Tender Document Package Builder</strong>
          </div>
          <div className="text-slate-400">
            {language === 'bn'
              ? 'সম্পূর্ণরূপে ব্রাউজারে অফলাইনে প্রক্রিয়াযোগ্য • নিরাপদ ও বিশ্বস্ত'
              : 'Browser-native client PDF processing • Secure & private'}
          </div>
        </div>
      </footer>

    </div>
  );
}
