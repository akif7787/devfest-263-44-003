import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MinusCircle,
  FileQuestion,
  Copy,
  Layers,
  FileText,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {t.helpTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
          
          {/* Section 1: Workflow */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{language === 'bn' ? 'কার্যপ্রণালী (Workflow)' : 'Document Preparation Workflow'}</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
              <li>
                <strong>{language === 'bn' ? 'শর্তাবলী লোড করুন' : 'Load requirements.json'}:</strong>{' '}
                {language === 'bn'
                  ? 'টেন্ডারের শর্তাবলী ফাইল আপলোড করুন অথবা ডেমো দেখতে "অফিসিয়াল নমুনা প্যাক" চাপুন।'
                  : 'Open the tender requirements file or click "Load Official Contest Sample" for testing.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'পিডিএফ আপলোড করুন' : 'Upload PDFs'}:</strong>{' '}
                {language === 'bn'
                  ? 'সবগুলো দরপত্র পিডিএফ ফাইল ড্র্যাগ করে ছেড়ে দিন।'
                  : 'Drag & drop all bid PDF documents into the upload box.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'ফাইল ম্যাচিং' : 'Match Files'}:</strong>{' '}
                {language === 'bn'
                  ? 'প্রতিটি শর্তের পাশে থাকা ড্রপডাউন থেকে সঠিক ফাইল নির্বাচন করুন (বা অটো-ম্যাচ ব্যবহার করুন)।'
                  : 'Select the right PDF file for each requirement row or click "Auto-Match Files".'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'মেয়াদের তারিখ দিন' : 'Enter Expiry Dates'}:</strong>{' '}
                {language === 'bn'
                  ? 'যেসব নথির মেয়াদ যাচাই প্রয়োজন, সেগুলোর মেয়াদের তারিখ প্রবেশ করান।'
                  : 'For documents marked "has_expiry=true", enter the validity expiry date.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'প্যাকেজ তৈরি ও ডাউনলোড' : 'Generate & Download'}:</strong>{' '}
                {language === 'bn'
                  ? 'সকল বাধা নিরসন হলে "প্যাকেজ পিডিএফ তৈরি করুন" বোতাম সক্রিয় হবে।'
                  : 'When all blocking issues are resolved, click "Generate Package PDF" to download.'}
              </li>
            </ol>
          </div>

          {/* Section 2: Status Rules */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              {language === 'bn' ? 'নথির স্থিতি ও নিয়মাবলী (Section 5)' : 'Statutory Status Rules (Section 5)'}
            </h3>
            <div className="space-y-2.5">
              
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-emerald-900">OK:</strong>{' '}
                  {language === 'bn'
                    ? 'ফাইল সংযুক্ত আছে এবং মেয়াদের তারিখ দাখিলের সময়সীমার সমান বা পরে। (প্যাকেজ তৈরিতে কোনো বাধা নেই)'
                    : 'File is matched and, if expiry applies, expiry date is on or after submission deadline. Non-blocking.'}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/50 border border-rose-200">
                <MinusCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-rose-900">Missing:</strong>{' '}
                  {language === 'bn'
                    ? 'আবশ্যকীয় (Mandatory) নথির কোনো ফাইল সংযুক্ত করা হয়নি। (প্যাকেজ তৈরিতে বাধা দেয়)'
                    : 'Mandatory requirement has no matched file. Blocking.'}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-amber-900">Expiry date needed:</strong>{' '}
                  {language === 'bn'
                    ? 'নথির মেয়াদ যাচাই আবশ্যক এবং ফাইল সংযুক্ত আছে, কিন্তু মেয়াদের তারিখ দেওয়া হয়নি। (বাধা দেয়)'
                    : 'Document has has_expiry=true and file is matched, but expiry date is missing. Blocking.'}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-red-50/50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-red-900">Expired:</strong>{' '}
                  {language === 'bn'
                    ? 'মেয়াদের তারিখ দাখিলের শেষ সময়সীমার পূর্বে। (বাধা দেয়)'
                    : 'Expiry date is before the submission deadline. Blocking.'}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                <FileQuestion className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900">Not provided:</strong>{' '}
                  {language === 'bn'
                    ? 'ঐচ্ছিক (Optional) নথির ফাইল সংযুক্ত করা হয়নি। (প্যাকেজ তৈরিতে বাধা নেই, চূড়ান্ত ফাইলে এটি বাদ যাবে)'
                    : 'Optional requirement has no matched file. Non-blocking (skipped in final package).'}
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Duplicate & Footer Rules */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Copy className="w-4 h-4 text-purple-600" />
              <span>{language === 'bn' ? 'ডুপ্লিকেট ও ফুটার নিয়মাবলী' : 'Duplicate Content & Footer Specifications'}</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li>
                <strong>{language === 'bn' ? 'ডুপ্লিকেট ফাইল' : 'Exact Duplicate Content'}:</strong>{' '}
                {language === 'bn'
                  ? 'SHA-256 হ্যাশ দ্বারা দুটি হুবহু একই কন্টেন্টের ফাইল শনাক্ত করা হয়। এগুলো ভিন্ন নথিতে ম্যাচ করা নিষিদ্ধ।'
                  : 'Files with identical SHA-256 byte contents are flagged. Matching duplicate contents to multiple requirements is prevented.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'কভার পেজ (পৃষ্ঠা ১)' : 'English Cover Page'}:</strong>{' '}
                {language === 'bn'
                  ? 'পৃষ্ঠা ১ সর্বদা ইংরেজিতে প্রস্তুত হয়, যাতে টেন্ডার আইডি, বিবরণ, সত্তা, দরদাতা, সময়সীমা ও নথির তালিকা থাকে।'
                  : 'Page 1 is generated strictly in English with all tender and sequence metadata.'}
              </li>
              <li>
                <strong>{language === 'bn' ? 'ফুটার বিন্যাস' : 'Footer on every page'}:</strong>{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">
                  &lt;tender_id&gt; | Page X of Y
                </code>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {t.helpClose}
          </button>
        </div>

      </div>
    </div>
  );
};
