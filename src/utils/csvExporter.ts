import { TenderInfo, RequirementEvaluation, Language } from '../types';

export function exportChecklistToCsv(
  tender: TenderInfo,
  evaluations: RequirementEvaluation[],
  language: Language
) {
  const isBn = language === 'bn';
  const headers = isBn
    ? ['ক্রমিক', 'নথির নাম', 'বাধ্যতামূলক/ঐচ্ছিক', 'সংযুক্ত ফাইল', 'পৃষ্ঠা সংখ্যা', 'মেয়াদের তারিখ', 'অবস্থা', 'বিস্তারিত মন্তব্য']
    : ['Order', 'Requirement Title', 'Type', 'Matched File', 'Pages', 'Expiry Date', 'Status', 'Details'];

  const rows = evaluations.map(ev => {
    const title = isBn ? ev.requirement.title_bn : ev.requirement.title_en;
    const type = ev.requirement.mandatory ? (isBn ? 'বাধ্যতামূলক' : 'Mandatory') : (isBn ? 'ঐচ্ছিক' : 'Optional');
    const fileName = ev.matchedFile ? ev.matchedFile.name : (isBn ? 'কোনো ফাইল নেই' : 'None');
    const pages = ev.matchedFile ? ev.matchedFile.pageCount : 0;
    const expiry = ev.expiryDate || (ev.requirement.has_expiry ? (isBn ? 'প্রয়োজন' : 'Needed') : 'N/A');
    const status = ev.status;
    const reason = isBn ? ev.statusReasonBn : ev.statusReasonEn;

    return [
      ev.requirement.order,
      `"${title.replace(/"/g, '""')}"`,
      `"${type}"`,
      `"${fileName.replace(/"/g, '""')}"`,
      pages,
      `"${expiry}"`,
      `"${status}"`,
      `"${reason.replace(/"/g, '""')}"`,
    ];
  });

  const metadataRows = [
    [`"Tender ID"`, `"${tender.tender_id}"`],
    [`"Tender Title"`, `"${tender.title.replace(/"/g, '""')}"`],
    [`"Procuring Entity"`, `"${tender.procuring_entity.replace(/"/g, '""')}"`],
    [`"Bidder"`, `"${tender.bidder.replace(/"/g, '""')}"`],
    [`"Submission Deadline"`, `"${tender.submission_deadline}"`],
    [`"Export Date"`, `"${new Date().toISOString().split('T')[0]}"`],
    [],
  ];

  const csvContent = '\uFEFF' + [
    ...metadataRows.map(r => r.join(',')),
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${tender.tender_id}_Checklist.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
