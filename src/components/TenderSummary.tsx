import React from 'react';
import { TenderInfo, ReadinessSummary, Language } from '../types';
import { translations } from '../i18n/translations';
import { Building2, User, Calendar, Tag, CheckCircle, AlertTriangle } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Tender Metadata Cards */}
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
              <Tag className="w-3 h-3 text-blue-400" />
              {tender.tender_id}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.submissionDeadline}: <strong className="text-slate-800">{tender.submission_deadline}</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
            {tender.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <Building2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-500 font-medium">{t.procuringEntity}</div>
                <div className="font-semibold text-slate-800 text-sm leading-snug">
                  {tender.procuring_entity}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <User className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-500 font-medium">{t.bidderName}</div>
                <div className="font-semibold text-slate-800 text-sm leading-snug">
                  {tender.bidder}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Overview & Readiness Gauge */}
        <div className="lg:col-span-4 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'bn' ? 'আবশ্যক নথির অগ্রগতি' : 'Mandatory Progress'}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isAllReady
                  ? 'bg-emerald-500'
                  : progressPercent > 50
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              {isAllReady ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{progressLabel}</span>
            </div>
            {readiness.totalProblems > 0 && (
              <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {readiness.totalProblems} {language === 'bn' ? 'ত্রুটি' : 'Issues'}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
