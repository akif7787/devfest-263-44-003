export const translations = {
  en: {
    appTitle: 'Tender Document Package Builder',
    appSubtitle: 'Enterprise Tender Document Verification & Combined PDF Compiler',
    tenderIdLabel: 'Tender ID',
    tenderDetails: 'Tender Details',
    procuringEntity: 'Procuring Entity',
    bidderName: 'Bidder Name',
    submissionDeadline: 'Submission Deadline',
    tenderTitle: 'Tender Title',
    
    // Product Hero
    heroBadge: 'TENDER DOCUMENT PACKAGE BUILDER',
    heroHeadlinePart1: 'Build.',
    heroHeadlinePart2: 'Verify.',
    heroHeadlinePart3: 'Package.',
    heroSupporting: 'Turn tender documents into a complete, verified PDF package — faster and with confidence.',
    heroCtaStart: 'Start Building',
    heroCtaRequirements: 'View Requirements',
    heroFeature1: 'Sequential document verification',
    heroFeature2: 'Expiry & duplicate checks',
    heroFeature3: 'Browser-native PDF packaging',
    
    // Actions & Buttons
    loadRequirements: 'Load requirements.json',
    loadSamplePack: 'Load Official Contest Sample',
    resetAll: 'Reset All',
    uploadPdfs: 'Upload PDF Documents',
    choosePdfs: 'Choose PDF files',
    dragDropText: 'Drag and drop PDF files here, or click to browse',
    dragDropSubtext: 'Accepts PDF files only • Max 30 files • Up to 50 MB total',
    autoMatch: 'Auto-Match Files',
    generatePackage: 'Generate Package PDF',
    generatingPackage: 'Generating Package...',
    downloadPackage: 'Download Package PDF',
    previewPackage: 'Preview & Compile',
    exportChecklist: 'Export Checklist (CSV)',
    saveProject: 'Save Session',
    loadProject: 'Open Session',
    help: 'Instructions & Rules',
    
    // Statuses
    statusOk: 'OK',
    statusMissing: 'Missing',
    statusExpiryNeeded: 'Expiry date needed',
    statusExpired: 'Expired',
    statusNotProvided: 'Not provided',
    
    // Badges & Labels
    mandatory: 'Mandatory',
    optional: 'Optional',
    expiryRequired: 'Expiry date required',
    orderNumber: 'Order',
    documentRequirement: 'Document Requirement',
    matchedFile: 'Matched File',
    pages: 'Pages',
    expiryDate: 'Expiry Date',
    status: 'Status',
    actions: 'Action',
    selectFileToMatch: '-- Select uploaded PDF --',
    unmatch: 'Unmatch',
    
    // Progress & Summary
    progressReadyText: '{ready} of {total} required documents ready',
    readinessTitle: 'Package Readiness',
    metricRequired: 'Required',
    metricReady: 'Ready',
    metricProblems: 'Blocking Issues',
    metricOptional: 'Optional Included',
    
    // Checklist
    checkRequiredMatched: 'Required documents matched',
    checkExpiryDatesValid: 'Expiry dates verified & not expired',
    checkNoBlocking: 'No blocking status problems',
    checkNoDuplicates: 'No duplicate content conflicts',
    
    // Readiness states
    packageReadyNotice: 'All requirements satisfied. Package is ready to generate!',
    packageBlockedNotice: 'Package cannot be generated due to blocking issues:',
    
    // Uploaded files section
    uploadedFilesTitle: 'Uploaded Documents',
    noUploadedFiles: 'No documents uploaded yet. Upload your PDF tender files above.',
    unmatchedFilesNotice: '{count} file(s) currently unassigned',
    allFilesMatchedNotice: 'All uploaded files are matched',
    fileDuplicateBadge: 'Duplicate File',
    duplicateWarning: 'Duplicate content identical to "{file}". Duplicates cannot be matched.',
    fileCorruptBadge: 'Invalid / Encrypted PDF',
    removeFile: 'Remove',
    matchedTo: 'Matched to: {target}',
    unassigned: 'Unassigned',
    
    // Errors & Validations
    nonPdfRejected: 'Rejected "{name}": Only .pdf files are accepted.',
    fileLimitExceeded: 'Upload limit exceeded: Maximum 30 files allowed.',
    sizeLimitExceeded: 'File size limit exceeded: Total files cannot exceed 50 MB.',
    jsonInvalid: 'Invalid requirements.json file format. Please check the structure.',
    jsonLoadedSuccess: 'Loaded requirements for Tender: {id}',
    sampleLoadedSuccess: 'Loaded official AI DevFest 2026 sample pack!',
    expiryBeforeDeadlineReason: 'Expired — valid until {date} (Deadline: {deadline})',
    expiryValidReason: 'Valid until {date} (Deadline: {deadline})',
    expiryMissingReason: 'Expiry date is missing for this document',
    missingRequiredReason: 'Required document has no matched file',
    optionalNotProvidedReason: 'Optional document not provided (allowed)',
    
    // Package generation modal
    packageModalTitle: 'Tender Package Preview & Compilation',
    coverPagePreviewTitle: 'Page 1: English Cover Page',
    tableOfContentsTitle: 'Package Document Order & Index',
    totalPagesCount: 'Total Pages: {pages}',
    footerPreview: 'Footer layout on every page: "{tenderId} | Page X of {total}"',
    compileAndDownload: 'Compile & Download {filename}',
    close: 'Close',
    
    // Office help modal
    helpTitle: 'Procurement Officer Handbook',
    helpClose: 'Got it, let\'s proceed',
    
    // Filter & search
    allRequirements: 'All Requirements',
    showIssuesOnly: 'Show Issues Only',
    searchPlaceholder: 'Search document requirement...'
  },
  bn: {
    appTitle: 'টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার',
    appSubtitle: 'টেন্ডার নথিপত্র যাচাইকরণ ও সমন্বিত পিডিএফ প্যাকেজ প্রস্তুতকারক',
    tenderIdLabel: 'টেন্ডার আইডি',
    tenderDetails: 'টেন্ডার বিবরণ',
    procuringEntity: 'সংগ্রহকারী কর্তৃপক্ষ',
    bidderName: 'দরদাতা প্রতিষ্ঠান',
    submissionDeadline: 'দাখিলের শেষ সময়সীমা',
    tenderTitle: 'টেন্ডারের শিরোনাম',
    
    // Product Hero
    heroBadge: 'টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার',
    heroHeadlinePart1: 'সংকলন।',
    heroHeadlinePart2: 'যাচাই।',
    heroHeadlinePart3: 'প্যাকেজ।',
    heroSupporting: 'টেন্ডার নথিপত্রকে রূপান্তর করুন পূর্ণাঙ্গ ও যাচাইকৃত পিডিএফ প্যাকেজে — দ্রুততর এবং আত্মবিশ্বাসের সাথে।',
    heroCtaStart: 'শুরু করুন',
    heroCtaRequirements: 'শর্তাবলী দেখুন',
    heroFeature1: 'শর্তাবলী অনুযায়ী পর্যায়ক্রমিক যাচাই',
    heroFeature2: 'মেয়াদোত্তীর্ণ ও ডুপ্লিকেট কন্টেন্ট সুরক্ষা',
    heroFeature3: 'নিরাপদ ক্লায়েন্ট-সাইড পিডিএফ সংকলন',
    
    // Actions & Buttons
    loadRequirements: 'requirements.json লোড করুন',
    loadSamplePack: 'অফিসিয়াল নমুনা প্যাক লোড করুন',
    resetAll: 'রিসেট করুন',
    uploadPdfs: 'পিডিএফ ফাইল আপলোড করুন',
    choosePdfs: 'পিডিএফ নির্বাচন করুন',
    dragDropText: 'পিডিএফ ফাইলগুলো এখানে ড্রপ করুন অথবা নির্বাচন করতে ক্লিক করুন',
    dragDropSubtext: 'শুধুমাত্র পিডিএফ ফাইল অনুমোদিত • সর্বোচ্চ ৩০টি ফাইল • মোট ৫০ এমবি পর্যন্ত',
    autoMatch: 'অটো-ম্যাচ ফাইল',
    generatePackage: 'প্যাকেজ পিডিএফ তৈরি করুন',
    generatingPackage: 'প্যাকেজ তৈরি হচ্ছে...',
    downloadPackage: 'প্যাকেজ পিডিএফ ডাউনলোড করুন',
    previewPackage: 'প্রিভিউ ও কম্পাইল',
    exportChecklist: 'চেকলিস্ট এক্সপোর্ট (CSV)',
    saveProject: 'সেশন সংরক্ষণ করুন',
    loadProject: 'সেশন খুলুন',
    help: 'ব্যবহার নির্দেশিকা ও নিয়মাবলী',
    
    // Statuses
    statusOk: 'ঠিক আছে (OK)',
    statusMissing: 'অনুপস্থিত (Missing)',
    statusExpiryNeeded: 'মেয়াদ উত্তীর্ণের তারিখ প্রয়োজন',
    statusExpired: 'মেয়াদোত্তীর্ণ (Expired)',
    statusNotProvided: 'প্রদান করা হয়নি (Not provided)',
    
    // Badges & Labels
    mandatory: 'বাধ্যতামূলক',
    optional: 'ঐচ্ছিক',
    expiryRequired: 'মেয়াদ যাচাই প্রযোজ্য',
    orderNumber: 'ক্রমিক',
    documentRequirement: 'প্রয়োজনীয় নথিপত্র',
    matchedFile: 'সংযুক্ত ফাইল',
    pages: 'পৃষ্ঠা',
    expiryDate: 'মেয়াদের তারিখ',
    status: 'অবস্থা',
    actions: 'পদক্ষেপ',
    selectFileToMatch: '-- আপলোড করা ফাইল নির্বাচন করুন --',
    unmatch: 'সংযোগ বাতিল',
    
    // Progress & Summary
    progressReadyText: '{total} টির মধ্যে {ready} টি আবশ্যক নথি প্রস্তুত',
    readinessTitle: 'প্যাকেজ প্রস্তুতি স্থিতি',
    metricRequired: 'আবশ্যক',
    metricReady: 'প্রস্তুত',
    metricProblems: 'বাধা সৃষ্টিকারী সমস্যা',
    metricOptional: 'ঐচ্ছিক অন্তর্ভুক্ত',
    
    // Checklist
    checkRequiredMatched: 'সকল আবশ্যক নথি সংযুক্ত হয়েছে',
    checkExpiryDatesValid: 'মেয়াদের তারিখ নির্ভুল ও মেয়াদ আছে',
    checkNoBlocking: 'কোনো বাধা সৃষ্টিকারী ত্রুটি নেই',
    checkNoDuplicates: 'কোনো ডুপ্লিকেট কন্টেন্ট দ্বন্দ্ব নেই',
    
    // Readiness states
    packageReadyNotice: 'সকল শর্ত পূরণ হয়েছে। প্যাকেজ পিডিএফ প্রস্তুতের জন্য প্রস্তুত!',
    packageBlockedNotice: 'বাধা সৃষ্টিকারী সমস্যার কারণে প্যাকেজ তৈরি করা যাবে না:',
    
    // Uploaded files section
    uploadedFilesTitle: 'আপলোডকৃত নথিপত্র',
    noUploadedFiles: 'এখনও কোনো নথি আপলোড করা হয়নি। উপরে পিডিএফ ফাইল আপলোড করুন।',
    unmatchedFilesNotice: '{count} টি ফাইল এখনও কোনো তথ্যে নির্ধারিত হয়নি',
    allFilesMatchedNotice: 'সকল আপলোডকৃত ফাইল যথাযথ সংযুক্ত করা হয়েছে',
    fileDuplicateBadge: 'হুবহু ডুপ্লিকেট ফাইল',
    duplicateWarning: 'এই ফাইলের কন্টেন্ট "{file}" এর অনুরূপ। ডুপ্লিকেট নথি ম্যাচ করা যাবে না।',
    fileCorruptBadge: 'অকার্যকর / পাসওয়ার্ড সুরক্ষিত পিডিএফ',
    removeFile: 'মুছুন',
    matchedTo: 'নির্ধারিত: {target}',
    unassigned: 'অনির্ধারিত',
    
    // Errors & Validations
    nonPdfRejected: 'বাতিল করা হয়েছে "{name}": শুধুমাত্র .pdf ফাইল গ্রহণযোগ্য।',
    fileLimitExceeded: 'ফাইল আপলোডের সীমা অতিক্রম করেছে: সর্বোচ্চ ৩০টি ফাইল অনুমোদিত।',
    sizeLimitExceeded: 'ফাইলের মোট আকার অতিক্রম করেছে: মোট সাইজ ৫০ এমবি এর বেশি হতে পারবে না।',
    jsonInvalid: 'requirements.json ফাইলের ফরম্যাট সঠিক নয়। অনুগ্রহ করে যাচাই করুন।',
    jsonLoadedSuccess: 'টেন্ডার নথির শর্তাবলী লোড হয়েছে: {id}',
    sampleLoadedSuccess: 'অফিসিয়াল AI DevFest 2026 নমুনা প্যাক সফলভাবে লোড হয়েছে!',
    expiryBeforeDeadlineReason: 'মেয়াদোত্তীর্ণ — বৈধতার মেয়াদ {date} (দাখিলের সময়সীমা: {deadline})',
    expiryValidReason: 'মেয়াদ বৈধ: {date} পর্যন্ত (সময়সীমা: {deadline})',
    expiryMissingReason: 'এই নথির মেয়াদের তারিখ প্রদান করা প্রয়োজন',
    missingRequiredReason: 'আবশ্যকীয় নথিটি এখনো সংযুক্ত করা হয়নি',
    optionalNotProvidedReason: 'ঐচ্ছিক নথি সংযুক্ত করা হয়নি (অনুমোদিত)',
    
    // Package generation modal
    packageModalTitle: 'টেন্ডার প্যাকেজ প্রিভিউ ও কম্পাইলেশন',
    coverPagePreviewTitle: 'পৃষ্ঠা ১: ইংরেজি কভার পেজ',
    tableOfContentsTitle: 'প্যাকেজের নথির ক্রম ও সূচিপত্র',
    totalPagesCount: 'মোট পৃষ্ঠা সংখ্যা: {pages}',
    footerPreview: 'প্রতিটি পৃষ্ঠার নিচের ফুটার: "{tenderId} | Page X of {total}"',
    compileAndDownload: 'কম্পাইল এবং ডাউনলোড {filename}',
    close: 'বন্ধ করুন',
    
    // Office help modal
    helpTitle: 'টেন্ডার ও প্রকিউরমেন্ট কর্মকর্তাদের সহায়িকা',
    helpClose: 'বুঝেছি, কাজ শুরু করুন',
    
    // Filter & search
    allRequirements: 'সকল নথিপত্র',
    showIssuesOnly: 'শুধুমাত্র সমস্যাগুলো দেখুন',
    searchPlaceholder: 'নথিপত্র খুঁজুন...'
  }
};
