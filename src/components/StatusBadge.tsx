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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{isBn ? 'ঠিক আছে (OK)' : 'OK'}</span>
        </span>
      );

    case 'MISSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{isBn ? 'অনুপস্থিত (Missing)' : 'Missing'}</span>
        </span>
      );

    case 'EXPIRY_NEEDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{isBn ? 'মেয়াদ প্রয়োজন' : 'Expiry date needed'}</span>
        </span>
      );

    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-900 border border-red-300 shadow-2xs whitespace-nowrap">
          <MinusCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
          <span>{isBn ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</span>
        </span>
      );

    case 'NOT_PROVIDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs whitespace-nowrap">
          <FileQuestion className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{isBn ? 'প্রদান করা হয়নি' : 'Not provided'}</span>
        </span>
      );

    default:
      return null;
  }
};
