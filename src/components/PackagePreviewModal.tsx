import React, { useState } from 'react';
import {
  TenderInfo,
  RequirementEvaluation,
  Language,
} from '../types';
import {
  compileTenderPackagePdf,
  GeneratedPackageResult,
  GenerationProgress,
} from '../utils/pdfGenerator';
import { translations } from '../i18n/translations';
import {
  X,
  FileDown,
  FileText,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Calendar,
  Building,
  User,
} from 'lucide-react';

interface PackagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: TenderInfo;
  evaluations: RequirementEvaluation[];
  language: Language;
}

export const PackagePreviewModal: React.FC<PackagePreviewModalProps> = ({
  isOpen,
  onClose,
  tender,
  evaluations,
  language,
}) => {
  const t = translations[language];
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [result, setResult] = useState<GeneratedPackageResult | null>(null);

  if (!isOpen) return null;

  // Filter matched OK documents in requirement order
  const validEvaluations = evaluations
    .filter(ev => ev.matchedFile && ev.status === 'OK')
    .sort((a, b) => a.requirement.order - b.requirement.order);

  // Calculate projected total pages (Page 1 cover + document pages)
  let projectedTotalPages = 1; // Page 1 is cover
  const docStartPages: { ev: RequirementEvaluation; startPage: number; pages: number }[] = [];

  for (const ev of validEvaluations) {
    const pageCount = ev.matchedFile?.pageCount || 1;
    docStartPages.push({
      ev,
      startPage: projectedTotalPages + 1,
      pages: pageCount,
    });
    projectedTotalPages += pageCount;
  }

  const handleCompile = async () => {
    setIsCompiling(true);
    setProgress({ step: 'Starting compiler...', percent: 5 });
    try {
      const generated = await compileTenderPackagePdf(
        tender,
        evaluations,
        prog => setProgress(prog)
      );
      setResult(generated);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Check console for details.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.blobUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {t.packageModalTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {tender.tender_id} • {validEvaluations.length} {language === 'bn' ? 'টি নথি অন্তর্ভুক্ত' : 'documents included'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-slate-50/50">
          
          {/* Top Specification Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-500">
                {language === 'bn' ? 'মোট নথি ও পৃষ্ঠা' : 'Included Documents & Pages'}
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {validEvaluations.length} {language === 'bn' ? 'টি নথি' : 'files'} • {projectedTotalPages} {language === 'bn' ? 'মোট পৃষ্ঠা' : 'total pages'}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-500">
                {language === 'bn' ? 'ফুটার লেবেল' : 'Statutory Footer Format'}
              </div>
              <div className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded mt-1 truncate">
                {tender.tender_id} | Page X of {projectedTotalPages}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-medium text-slate-500">
                {language === 'bn' ? 'ফাইলের নাম' : 'Output Filename'}
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded mt-1 truncate">
                {tender.tender_id}_Package.pdf
              </div>
            </div>
          </div>

          {/* Section 6.1: English Cover Page Structure Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t.coverPagePreviewTitle}</span>
              </h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Mandatory English Output (Section 6.1)
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-sm border-b pb-1">
                TENDER SUBMISSION PACKAGE: {tender.title}
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Tender ID:</strong> {tender.tender_id}</div>
                <div><strong>Procuring Entity:</strong> {tender.procuring_entity}</div>
                <div><strong>Bidder Name:</strong> {tender.bidder}</div>
                <div><strong>Submission Deadline:</strong> {tender.submission_deadline}</div>
                <div><strong>Package Creation Date:</strong> {new Date().toISOString().split('T')[0]}</div>
                <div><strong>Included Documents:</strong> {validEvaluations.length} documents</div>
              </div>
            </div>
          </div>

          {/* Table of Contents / Document Sequence (Section 6.2) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{t.tableOfContentsTitle}</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <div className="w-12 text-center">Order</div>
                <div className="flex-1 px-3">Document Title (English / বাংলা)</div>
                <div className="w-48 text-left">Matched File</div>
                <div className="w-20 text-right">Pages</div>
                <div className="w-24 text-right">Starts At</div>
              </div>

              {/* Cover Page entry */}
              <div className="py-2.5 flex items-center justify-between text-slate-700 bg-blue-50/40 rounded px-2">
                <div className="w-12 text-center font-bold text-blue-600">--</div>
                <div className="flex-1 px-3 font-semibold text-blue-900">
                  Official Cover Page (English)
                </div>
                <div className="w-48 text-left text-blue-600 italic">Generated Cover</div>
                <div className="w-20 text-right font-medium">1 page</div>
                <div className="w-24 text-right font-bold text-blue-700">Page 1</div>
              </div>

              {/* Documents */}
              {docStartPages.map(({ ev, startPage, pages }) => (
                <div key={ev.requirement.id} className="py-2 flex items-center justify-between text-slate-700 hover:bg-slate-50 px-2 rounded">
                  <div className="w-12 text-center font-bold text-slate-600">
                    {ev.requirement.order}
                  </div>
                  <div className="flex-1 px-3">
                    <div className="font-semibold text-slate-800">{ev.requirement.title_en}</div>
                    <div className="text-[10px] text-slate-400">{ev.requirement.title_bn}</div>
                  </div>
                  <div className="w-48 text-left truncate text-slate-600 font-mono text-[11px]">
                    {ev.matchedFile?.name}
                  </div>
                  <div className="w-20 text-right text-slate-600">
                    {pages} {pages === 1 ? 'page' : 'pages'}
                  </div>
                  <div className="w-24 text-right font-semibold text-slate-900">
                    Page {startPage}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compilation progress indicator */}
          {isCompiling && progress && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1.5">
                <span>{progress.step}</span>
                <span>{progress.percent}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Generated Result Success Box */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-emerald-900 text-sm">
                    {language === 'bn' ? 'প্যাকেজ পিডিএফ সফলভাবে প্রস্তুত হয়েছে!' : 'Package PDF successfully generated!'}
                  </div>
                  <div className="text-xs text-emerald-700">
                    {result.filename} • {result.totalPages} {language === 'bn' ? 'মোট পৃষ্ঠা' : 'pages total'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{t.downloadPackage}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            {t.close}
          </button>

          <div className="flex items-center gap-2">
            {!result ? (
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>{isCompiling ? t.generatingPackage : t.generatePackage}</span>
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>{t.downloadPackage}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
