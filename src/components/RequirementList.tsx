import React, { useState } from 'react';
import {
  RequirementEvaluation,
  UploadedFileRecord,
  Language,
} from '../types';
import { translations } from '../i18n/translations';
import { StatusBadge } from './StatusBadge';
import {
  Calendar,
  X,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
} from 'lucide-react';

interface RequirementListProps {
  evaluations: RequirementEvaluation[];
  uploadedFiles: UploadedFileRecord[];
  submissionDeadline: string;
  language: Language;
  onMatchChange: (requirementId: string, fileId: string | undefined) => void;
  onExpiryDateChange: (requirementId: string, expiryDate: string) => void;
}

export const RequirementList: React.FC<RequirementListProps> = ({
  evaluations,
  uploadedFiles,
  submissionDeadline,
  language,
  onMatchChange,
  onExpiryDateChange,
}) => {
  const t = translations[language];
  const [filterIssuesOnly, setFilterIssuesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered requirements
  const filteredEvaluations = evaluations.filter(ev => {
    if (filterIssuesOnly && ev.status === 'OK') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchEn = ev.requirement.title_en.toLowerCase().includes(q);
      const matchBn = ev.requirement.title_bn.toLowerCase().includes(q);
      const matchFile = ev.matchedFile?.name.toLowerCase().includes(q) || false;
      return matchEn || matchBn || matchFile;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{t.documentRequirement}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {evaluations.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'শর্তাবলী অনুযায়ী নির্ধারিত ক্রমে নথিপত্র সাজানো ও যাচাইকরণ'
              : 'Sequential compliance verification according to requirements.json order'}
          </p>
        </div>

        {/* Search & Filter tools */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 w-44 sm:w-56 transition-all"
            />
          </div>

          <button
            onClick={() => setFilterIssuesOnly(!filterIssuesOnly)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              filterIssuesOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{t.showIssuesOnly}</span>
          </button>
        </div>
      </div>

      {/* Main Table / Row Cards */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-3 sm:px-4 w-12 text-center">
                  #
                </th>
                <th scope="col" className="py-3 px-3 sm:px-4 min-w-[200px]">
                  {t.documentRequirement}
                </th>
                <th scope="col" className="py-3 px-3 sm:px-4 min-w-[240px]">
                  {t.matchedFile}
                </th>
                <th scope="col" className="py-3 px-3 sm:px-4 min-w-[150px]">
                  {t.expiryDate}
                </th>
                <th scope="col" className="py-3 px-3 sm:px-4 min-w-[180px]">
                  {t.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredEvaluations.map(ev => {
                const req = ev.requirement;
                const matchedFile = ev.matchedFile;
                const isMandatory = req.mandatory;
                const docTitle = language === 'bn' ? req.title_bn : req.title_en;

                // Available files for this dropdown:
                // Files not matched to other requirements, OR the currently matched file
                const selectableFiles = uploadedFiles.filter(
                  f => !f.matchedRequirementId || f.matchedRequirementId === req.id
                );

                return (
                  <tr
                    key={req.id}
                    className={`transition-colors ${
                      ev.isBlocking
                        ? 'bg-rose-50/20 hover:bg-rose-50/40'
                        : ev.status === 'OK'
                        ? 'hover:bg-slate-50/60'
                        : 'hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Order Number */}
                    <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-600">
                      <span className="w-6 h-6 rounded-full bg-slate-100 inline-flex items-center justify-center text-xs">
                        {req.order}
                      </span>
                    </td>

                    {/* Document Title & Badges */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        {docTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {language === 'bn' ? req.title_en : req.title_bn}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {isMandatory ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            {t.mandatory}
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {t.optional}
                          </span>
                        )}

                        {req.has_expiry && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            {t.expiryRequired}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Matched File Selector */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={matchedFile ? matchedFile.id : ''}
                          onChange={e => {
                            const val = e.target.value;
                            onMatchChange(req.id, val ? val : undefined);
                          }}
                          className={`w-full text-xs rounded-lg py-1.5 px-2.5 border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            matchedFile
                              ? 'bg-slate-50 border-slate-300 font-medium text-slate-800'
                              : 'bg-white border-dashed border-slate-300 text-slate-500'
                          }`}
                        >
                          <option value="">{t.selectFileToMatch}</option>
                          {selectableFiles.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.pageCount} pgs) {f.isDuplicateOf ? `⚠️ [Duplicate]` : ''}
                            </option>
                          ))}
                        </select>

                        {matchedFile && (
                          <button
                            onClick={() => onMatchChange(req.id, undefined)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                            title={t.unmatch}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {matchedFile && (
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                          <FileCheck2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {matchedFile.pageCount} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}
                          </span>
                          {matchedFile.isDuplicateOf && (
                            <span className="text-amber-700 font-semibold bg-amber-100 px-1 rounded">
                              {t.fileDuplicateBadge}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Expiry Date Input */}
                    <td className="py-3 px-3 sm:px-4">
                      {req.has_expiry ? (
                        <div>
                          <div className="relative">
                            <input
                              type="date"
                              disabled={!matchedFile}
                              value={ev.expiryDate || ''}
                              onChange={e => onExpiryDateChange(req.id, e.target.value)}
                              className={`w-full text-xs rounded-lg py-1.5 px-2 border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                !matchedFile
                                  ? 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed'
                                  : ev.status === 'EXPIRED'
                                  ? 'bg-red-50 border-red-300 text-red-900 font-semibold'
                                  : ev.status === 'EXPIRY_NEEDED'
                                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                                  : 'bg-white border-slate-300 text-slate-800'
                              }`}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {language === 'bn' ? 'সময়সীমা:' : 'Deadline:'} <strong>{submissionDeadline}</strong>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          {language === 'bn' ? 'প্রযোজ্য নয়' : 'Not required'}
                        </span>
                      )}
                    </td>

                    {/* Status Badge & Detailed Reason */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="mb-1">
                        <StatusBadge status={ev.status} language={language} />
                      </div>
                      <div
                        className={`text-[11px] leading-tight ${
                          ev.isBlocking
                            ? 'text-rose-700 font-medium'
                            : ev.status === 'OK'
                            ? 'text-slate-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {language === 'bn' ? ev.statusReasonBn : ev.statusReasonEn}
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredEvaluations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    {language === 'bn'
                      ? 'কোনো তথ্য খুঁজে পাওয়া যায়নি'
                      : 'No matching requirements found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
