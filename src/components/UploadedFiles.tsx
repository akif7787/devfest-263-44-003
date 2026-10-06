import React, { useRef, useState } from 'react';
import { UploadedFileRecord, RequirementItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { formatFileSize } from '../utils/fileValidation';
import {
  FileText,
  Upload,
  Trash2,
  Copy,
  CheckCircle,
  FileWarning,
  Sparkles,
  Files,
  FileCheck2,
} from 'lucide-react';

interface UploadedFilesProps {
  files: UploadedFileRecord[];
  requirements: RequirementItem[];
  language: Language;
  onUploadFiles: (fileList: FileList | File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onAutoMatch: () => void;
}

export const UploadedFiles: React.FC<UploadedFilesProps> = ({
  files,
  requirements,
  language,
  onUploadFiles,
  onRemoveFile,
  onAutoMatch,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const unmatchedCount = files.filter(f => !f.matchedRequirementId).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Files className="w-5 h-5 text-blue-600" />
            <span>{t.uploadedFilesTitle}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {files.length}
            </span>
          </h3>
          
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {unmatchedCount > 0
              ? t.unmatchedFilesNotice.replace('{count}', unmatchedCount.toString())
              : files.length > 0
              ? t.allFilesMatchedNotice
              : t.noUploadedFiles}
          </p>
        </div>

        {/* Auto-Match Action Button */}
        {files.length > 0 && (
          <button
            onClick={onAutoMatch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100/90 text-indigo-700 border border-indigo-200/80 transition-colors cursor-pointer"
            title="Auto-detect matches based on document names"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.autoMatch}</span>
          </button>
        )}
      </div>

      {/* Prominent Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[0.995]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files) {
              onUploadFiles(e.target.files);
              e.target.value = '';
            }
          }}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7" />
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-800">
            {t.dragDropText}
          </p>
          
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[11px] font-semibold">
              PDF only
            </span>
            <span>•</span>
            <span>Up to 30 files</span>
            <span>•</span>
            <span>Up to 50 MB total</span>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white text-slate-800 border border-slate-300 shadow-xs hover:bg-slate-100/90 transition-colors">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{t.choosePdfs}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Files Grid */}
      {files.length > 0 && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {files.map(file => {
            const matchedReq = requirements.find(r => r.id === file.matchedRequirementId);
            const isMatched = !!matchedReq;
            const isDuplicate = !!file.isDuplicateOf;

            return (
              <div
                key={file.id}
                className={`relative flex flex-col justify-between p-4 rounded-xl border text-sm transition-all ${
                  isDuplicate
                    ? 'border-amber-300 bg-amber-50/50 shadow-2xs'
                    : file.isCorruptOrEncrypted
                    ? 'border-rose-300 bg-rose-50/50 shadow-2xs'
                    : isMatched
                    ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    : 'border-blue-200 bg-blue-50/40 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top file meta */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      
                      <div className="min-w-0">
                        <p
                          className="font-bold text-slate-900 truncate text-xs sm:text-sm"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {file.pageCount} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFile(file.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                      title={t.removeFile}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Duplicate warning badge */}
                  {isDuplicate && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-100/80 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2 leading-snug">
                      <Copy className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        {t.duplicateWarning.replace('{file}', file.isDuplicateOf || 'another file')}
                      </span>
                    </div>
                  )}

                  {/* Corrupted / Password error */}
                  {file.isCorruptOrEncrypted && (
                    <div className="mt-3 p-2.5 rounded-lg bg-rose-100/80 border border-rose-300 text-[11px] text-rose-900 flex items-start gap-2 leading-snug">
                      <FileWarning className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                      <span>{file.errorMessage || t.fileCorruptBadge}</span>
                    </div>
                  )}
                </div>

                {/* Bottom match badge */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isMatched ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 truncate max-w-full">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {t.matchedTo.replace(
                          '{target}',
                          language === 'bn' ? matchedReq.title_bn : matchedReq.title_en
                        )}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      <span>{t.unassigned}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
