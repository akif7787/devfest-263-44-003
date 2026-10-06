import React from 'react';
import { ReadinessSummary, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface ReadinessPanelProps {
  readiness: ReadinessSummary;
  language: Language;
  onGenerateClick: () => void;
  isCompiling: boolean;
}

export const ReadinessPanel: React.FC<ReadinessPanelProps> = ({
  readiness,
  language,
  onGenerateClick,
  isCompiling,
}) => {
  const t = translations[language];

  const hasUnmatchedRequired = readiness.readyRequired < readiness.totalRequired;
  const hasProblems = readiness.totalProblems > 0;
  const isReady = readiness.isReady;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 sm:p-6 sticky top-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>{t.readinessTitle}</span>
        </h3>
        {isReady ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {language === 'bn' ? 'প্রস্তুত' : 'Ready'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            {language === 'bn' ? 'অসম্পূর্ণ' : 'Incomplete'}
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {/* Required */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">{t.metricRequired}</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {readiness.totalRequired}
          </div>
        </div>

        {/* Ready */}
        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-center">
          <div className="text-[11px] text-emerald-700 font-medium">{t.metricReady}</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">
            {readiness.readyRequired}
          </div>
        </div>

        {/* Blocking Problems */}
        <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 text-center">
          <div className="text-[11px] text-rose-700 font-medium">{t.metricProblems}</div>
          <div className="text-xl font-bold text-rose-700 mt-0.5">
            {readiness.totalProblems}
          </div>
        </div>

        {/* Optional */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
          <div className="text-[11px] text-slate-500 font-medium">{t.metricOptional}</div>
          <div className="text-xl font-bold text-slate-700 mt-0.5">
            {readiness.readyOptional} / {readiness.totalOptional}
          </div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="space-y-2.5 mb-5 text-xs">
        {/* 1. Required documents matched */}
        <div className="flex items-center gap-2">
          {!hasUnmatchedRequired ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span className={!hasUnmatchedRequired ? 'text-slate-700' : 'text-slate-500'}>
            {t.checkRequiredMatched}
          </span>
        </div>

        {/* 2. Expiry dates complete */}
        <div className="flex items-center gap-2">
          {!hasProblems ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <span className={!hasProblems ? 'text-slate-700' : 'text-slate-500'}>
            {t.checkExpiryDatesValid}
          </span>
        </div>

        {/* 3. No blocking problems */}
        <div className="flex items-center gap-2">
          {!hasProblems ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span className={!hasProblems ? 'text-slate-700' : 'text-slate-500'}>
            {t.checkNoBlocking}
          </span>
        </div>

        {/* 4. Duplicate check complete */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-700">
            {t.checkNoDuplicates}
          </span>
        </div>
      </div>

      {/* Notice & Reasons Block */}
      {!isReady ? (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 mb-5 text-xs text-rose-900">
          <div className="flex items-start gap-1.5 font-semibold text-rose-800 mb-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{t.packageBlockedNotice}</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700 max-h-40 overflow-y-auto pr-1">
            {(language === 'bn' ? readiness.blockingReasonsBn : readiness.blockingReasonsEn).map(
              (reason, idx) => (
                <li key={idx} className="leading-tight">
                  {reason}
                </li>
              )
            )}
          </ul>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-5 text-xs text-emerald-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{t.packageReadyNotice}</span>
        </div>
      )}

      {/* Generate Package CTA Button */}
      <button
        onClick={onGenerateClick}
        disabled={!isReady || isCompiling}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
          isReady && !isCompiling
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md active:scale-[0.99]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/80'
        }`}
      >
        <FileDown className="w-4 h-4" />
        <span>{isCompiling ? t.generatingPackage : t.generatePackage}</span>
      </button>

      {!isReady && (
        <p className="text-[11px] text-slate-400 text-center mt-2">
          {language === 'bn'
            ? 'সবগুলো আবশ্যক নথি ঠিক না হওয়া পর্যন্ত প্যাকেজ তৈরি বন্ধ থাকবে'
            : 'Button enabled automatically once all mandatory requirements are valid'}
        </p>
      )}

    </div>
  );
};
