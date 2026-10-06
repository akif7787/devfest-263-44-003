import React from 'react';
import { DocumentStatusType, Language } from '../types';
import { CheckCircle2, AlertCircle, Clock, FileQuestion, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: DocumentStatusType;
  language: Language;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, language }) => {
  const isBn = language === 'bn';

  switch (status) {
    case 'OK':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {isBn ? 'ঠিক আছে (OK)' : 'OK'}
        </span>
      );

    case 'MISSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          {isBn ? 'অনুপস্থিত (Missing)' : 'Missing'}
        </span>
      );

    case 'EXPIRY_NEEDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {isBn ? 'মেয়াদ প্রয়োজন' : 'Expiry date needed'}
        </span>
      );

    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
          <MinusCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          {isBn ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}
        </span>
      );

    case 'NOT_PROVIDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <FileQuestion className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {isBn ? 'প্রদান করা হয়নি' : 'Not provided'}
        </span>
      );

    default:
      return null;
  }
};
