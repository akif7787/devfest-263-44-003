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
  Search,
  Filter,
  ListOrdered,
  AlertTriangle,
  Tag,
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
      const matchId = ev.requirement.id.toLowerCase().includes(q);
      const matchFile = ev.matchedFile?.name.toLowerCase().includes(q) || false;
      return matchEn || matchBn || matchId || matchFile;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-6 w-full">
      
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-blue-600" />
            <span>{t.documentRequirement}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {evaluations.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {language === 'bn'
              ? 'শর্তাবলী অনুযায়ী নির্ধারিত ক্রমানুসারে নথিপত্র সাজানো ও বাধ্যতামূলক যাচাই'
              : 'Sequential compliance verification according to requirements.json order'}
          </p>
        </div>

        {/* Search & Filter tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 w-48 sm:w-64 transition-all"
            />
          </div>

          <button
            onClick={() => setFilterIssuesOnly(!filterIssuesOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              filterIssuesOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{t.showIssuesOnly}</span>
          </button>
        </div>
      </div>

      {/* Main Table: Full-width responsive with unclipped columns */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[880px] divide-y divide-slate-200 text-left text-xs table-fixed">
          <colgroup>
            <col style={{ width: '6%' }} />
            <col style={{ width: '31%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          
          <thead>
            <tr className="bg-slate-50/90 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <th scope="col" className="py-3.5 px-3 text-center">
                #
              </th>
              <th scope="col" className="py-3.5 px-4">
                {t.documentRequirement}
              </th>
              <th scope="col" className="py-3.5 px-4">
                {t.matchedFile}
              </th>
              <th scope="col" className="py-3.5 px-4">
                {t.expiryDate}
              </th>
              <th scope="col" className="py-3.5 px-4">
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
                      ? 'bg-rose-50/30 hover:bg-rose-50/50'
                      : ev.status === 'OK'
                      ? 'hover:bg-slate-50/60'
                      : 'hover:bg-slate-50/40'
                  }`}
                >
                  {/* Order Number */}
                  <td className="py-4 px-3 text-center align-top">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 inline-flex items-center justify-center text-xs font-bold text-slate-700">
                      {req.order}
                    </span>
                  </td>

                  {/* Document Title & Badges */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-slate-900 text-sm leading-snug">
                      {docTitle}
                    </div>
                    
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {language === 'bn' ? req.title_en : req.title_bn}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {req.id}
                      </span>

                      {isMandatory ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          {t.mandatory}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {t.optional}
                        </span>
                      )}

                      {req.has_expiry && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          {t.expiryRequired}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Matched File Selector */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={matchedFile ? matchedFile.id : ''}
                        onChange={e => {
                          const val = e.target.value;
                          onMatchChange(req.id, val ? val : undefined);
                        }}
                        className={`w-full text-xs rounded-lg py-2 px-2.5 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer ${
                          matchedFile
                            ? 'bg-slate-50/90 border-slate-300 font-semibold text-slate-800'
                            : 'bg-white border-dashed border-slate-300 text-slate-500 hover:border-slate-400'
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
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                          title={t.unmatch}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {matchedFile && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{matchedFile.pageCount} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                        </span>
                        
                        {matchedFile.isDuplicateOf && (
                          <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                            {t.fileDuplicateBadge}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Expiry Date Input */}
                  <td className="py-4 px-4 align-top">
                    {req.has_expiry ? (
                      <div className="space-y-1">
                        <input
                          type="date"
                          disabled={!matchedFile}
                          value={ev.expiryDate || ''}
                          onChange={e => onExpiryDateChange(req.id, e.target.value)}
                          className={`w-full text-xs rounded-lg py-2 px-2.5 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                            !matchedFile
                              ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                              : ev.status === 'EXPIRED'
                              ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                              : ev.status === 'EXPIRY_NEEDED'
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                              : 'bg-white border-slate-300 text-slate-800 font-medium'
                          }`}
                        />
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">
                          {language === 'bn' ? 'সময়সীমা:' : 'Deadline:'} <strong className="text-slate-700">{submissionDeadline}</strong>
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs font-normal">
                        {language === 'bn' ? 'প্রযোজ্য নয়' : 'Not required'}
                      </span>
                    )}
                  </td>

                  {/* Status Badge & FULL UNCLIPPED Reason Text */}
                  <td className="py-4 px-4 align-top">
                    <div className="mb-1.5">
                      <StatusBadge status={ev.status} language={language} />
                    </div>

                    {/* Unclipped, naturally wrapping multiline explanation */}
                    <div
                      className={`text-xs leading-relaxed font-medium break-words whitespace-normal rounded-lg p-2 ${
                        ev.isBlocking
                          ? 'text-rose-800 bg-rose-50/80 border border-rose-200/80'
                          : ev.status === 'OK'
                          ? 'text-emerald-800 bg-emerald-50/60 border border-emerald-200/60'
                          : ev.status === 'EXPIRY_NEEDED'
                          ? 'text-amber-900 bg-amber-50/80 border border-amber-200/80'
                          : 'text-slate-600 bg-slate-50 border border-slate-200'
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
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold">
                    {language === 'bn'
                      ? 'কোনো তথ্য খুঁজে পাওয়া যায়নি'
                      : 'No matching requirements found.'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'bn'
                      ? 'অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন'
                      : 'Try clearing your search query or issues filter'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
