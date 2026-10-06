import React, { useRef } from 'react';
import { TenderInfo, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  FileStack,
  HelpCircle,
  FolderOpen,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Tag,
} from 'lucide-react';

interface HeaderProps {
  tender: TenderInfo;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadRequirementsJson: (file: File) => void;
  onLoadSamplePack: () => void;
  onResetAll: () => void;
  onOpenHelp: () => void;
  onExportCsv: () => void;
  isLoadingSample: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  tender,
  language,
  onLanguageChange,
  onLoadRequirementsJson,
  onLoadSamplePack,
  onResetAll,
  onOpenHelp,
  onExportCsv,
  isLoadingSample,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLoadRequirementsJson(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="min-h-[4.5rem] py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          
          {/* Logo & Product Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800 shrink-0">
              <FileStack className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {t.appTitle}
                </h1>
                
                {/* Tender ID Badge: Non-wrapping, cleanly padded */}
                <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900 text-white shadow-2xs border border-slate-800">
                  <Tag className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>{tender.tender_id || 'T-2026-0417'}</span>
                </span>
              </div>
              
              <p className="text-xs text-slate-500 font-medium mt-0.5 leading-normal">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Hidden JSON input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleJsonSelect}
            />

            {/* Primary Action: Load Official Contest Sample */}
            <button
              onClick={onLoadSamplePack}
              disabled={isLoadingSample}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer hover:shadow"
              title={language === 'bn' ? 'অফিসিয়াল নমুনা টেন্ডার ও টেস্ট পিডিএফ লোড করুন' : 'Load official contest sample pack with test PDFs'}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{isLoadingSample ? (language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...') : t.loadSamplePack}</span>
            </button>

            {/* Secondary Action: Load custom requirements.json */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              title="Load custom requirements.json file"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.loadRequirements}</span>
            </button>

            {/* Secondary Action: Export CSV Checklist */}
            <button
              onClick={onExportCsv}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              title="Export compliance checklist as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.exportChecklist}</span>
            </button>

            {/* Reset All Action */}
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent transition-colors whitespace-nowrap cursor-pointer"
              title={t.resetAll}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span>{t.resetAll}</span>
            </button>

            {/* Language Switcher Segmented Control */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Help & Rulebook Guide Button */}
            <button
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title={t.help}
              aria-label={t.help}
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
