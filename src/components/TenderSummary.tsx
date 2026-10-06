import React from 'react';
import { TenderInfo, ReadinessSummary, Language } from '../types';
import { translations } from '../i18n/translations';
import { Building2, User, Calendar, Tag, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react';

interface TenderSummaryProps {
  tender: TenderInfo;
  readiness: ReadinessSummary;
  language: Language;
}

export const TenderSummary: React.FC<TenderSummaryProps> = ({
  tender,
  readiness,
  language,
}) => {
  const t = translations[language];

  const totalReq = readiness.totalRequired;
  const readyReq = readiness.readyRequired;
  const progressPercent = totalReq > 0 ? Math.round((readyReq / totalReq) * 100) : 0;
  const isAllReady = readiness.isReady;

  const progressLabel = t.progressReadyText
    .replace('{ready}', readyReq.toString())
    .replace('{total}', totalReq.toString());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 lg:p-7 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Column: Tender Identity & Meta (col-span-8) */}
        <div className="lg:col-span-8">
          
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-white shadow-2xs">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span>{tender.tender_id}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.submissionDeadline}: <strong>{tender.submission_deadline}</strong></span>
            </span>
          </div>

          {/* Tender Title: Primary Visual Focal Point */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
            {tender.title}
          </h2>

          {/* Entity & Bidder Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {t.procuringEntity}
                </div>
                <div className="font-bold text-slate-900 text-sm leading-snug mt-0.5 truncate" title={tender.procuring_entity}>
                  {tender.procuring_entity}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {t.bidderName}
                </div>
                <div className="font-bold text-slate-900 text-sm leading-snug mt-0.5 truncate" title={tender.bidder}>
                  {tender.bidder}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Compliance Progress Gauge (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {language === 'bn' ? 'আবশ্যক নথির অগ্রগতি' : 'Mandatory Progress'}
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar with high visibility */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-3.5 p-0.5 border border-slate-300/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllReady
                  ? 'bg-emerald-500 shadow-sm'
                  : progressPercent > 50
                  ? 'bg-blue-600 shadow-sm'
                  : 'bg-amber-500 shadow-sm'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              {isAllReady ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{progressLabel}</span>
            </div>

            {readiness.totalProblems > 0 ? (
              <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 text-xs">
                {readiness.totalProblems} {language === 'bn' ? 'ত্রুটি' : 'Issues'}
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-xs">
                {isAllReady ? (language === 'bn' ? 'প্রস্তুত' : 'Ready') : (language === 'bn' ? 'চলমান' : 'In Progress')}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
