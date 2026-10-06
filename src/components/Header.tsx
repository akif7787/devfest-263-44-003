import React, { useRef } from 'react';
import { TenderInfo, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  FileStack,
  Globe,
  HelpCircle,
  Upload,
  FolderOpen,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
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
      e.target.value = ''; // reset so same file can be reloaded if needed
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <FileStack className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {tender.tender_id || 'PRO-2026'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hidden JSON input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleJsonSelect}
            />

            {/* Load Official Sample Pack */}
            <button
              onClick={onLoadSamplePack}
              disabled={isLoadingSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
              title={language === 'bn' ? 'অফিসিয়াল নমুনা টেন্ডার ও পিডিএফ লোড করুন' : 'Load official contest sample pack with test PDFs'}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{isLoadingSample ? (language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...') : t.loadSamplePack}</span>
            </button>

            {/* Load custom requirements.json */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Load custom requirements.json file"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.loadRequirements}</span>
            </button>

            {/* Export CSV Checklist */}
            <button
              onClick={onExportCsv}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Export status checklist as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">{t.exportChecklist}</span>
            </button>

            {/* Reset All */}
            <button
              onClick={onResetAll}
              className="inline-flex items-center p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-colors"
              title={t.resetAll}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1 text-slate-500" />
              <span className="hidden sm:inline">{t.resetAll}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('bn')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'bn'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Help Button */}
            <button
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={t.help}
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
