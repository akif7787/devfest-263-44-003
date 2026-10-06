# devfest-263-44-003 — Tender Document Package Builder

- **Participant Name:** Mohammed Ahanaf Akif Rahman
- **Registration Number:** 263-44-003
- **Contest:** AI DevFest 2026 – AI Vibe-Coding Contest
- **Repository URL:** [https://github.com/akif7787/devfest-263-44-003](https://github.com/akif7787/devfest-263-44-003)
- **Live Production URL:** [https://devfest-263-44-003.vercel.app/](https://devfest-263-44-003.vercel.app/)
- **License:** [MIT License](LICENSE)

---

## 1. Project Overview

**Tender Document Package Builder** is a browser-based compliance verification tool and combined PDF compiler designed for government and enterprise procurement workflows. It streamlines the preparation of tender submission packages by verifying document completeness, validating expiration dates against tender deadlines, preventing content duplication, enforcing page order, and generating combined PDF packages with standardized cover pages, tables of contents, and sequential footers.

The entire application runs **100% client-side** in modern web browsers with zero backend dependencies, preserving privacy and ensuring offline functionality once loaded.

---

## 2. Live Demo

- **Live Production URL:** [https://devfest-263-44-003.vercel.app/](https://devfest-263-44-003.vercel.app/)

---

## 3. GitHub Repository

- **Repository URL:** [https://github.com/akif7787/devfest-263-44-003](https://github.com/akif7787/devfest-263-44-003)

---

## 4. Main Features

- **Requirements Management:** Pre-configured with official tender `T-2026-0417` (*Supply of IT Equipment*, Procuring Entity: *Directorate of Sample Services*, Bidder: *Meghna Tech Solutions Ltd.*, Deadline: *2026-10-20*). Also supports loading any custom `requirements.json`.
- **Multi-File PDF Upload:** Restricts uploads strictly to `.pdf` files up to a maximum of 30 files and 50 MB total volume.
- **Client-Side PDF Parsing:** Uses `pdf-lib` to extract page counts directly in the browser with error handling for corrupt or encrypted files.
- **Duplicate Content Detection:** Computes SHA-256 byte hashes using the browser Web Crypto API to prevent identical files from fulfilling multiple requirements.
- **Statutory Status Evaluation (Section 5):** Evaluates `OK`, `Missing`, `Expiry date needed`, `Expired`, and `Not provided` with immediate UI updates.
- **Automated PDF Package Compilation (Section 6):** Compiles an official Page 1 Cover Sheet with TOC and starting page numbers, followed by documents in sequential order, stamped with `<tender_id> | Page X of Y` footers.
- **Bilingual Interface (EN / বাংলা):** Seamless toggle between English and Bangla across the entire application interface and document titles (`title_en` and `title_bn`).

---

## 5. Bonus Features Implemented

- **One-Click Official Sample Pack:** Instantly populates synthetic PDF files demonstrating expired vs. valid trade licenses, solvency certificates, proposals, and duplicate detection.
- **Bilingual CSV Compliance Export:** One-click export of structured evaluation tables (`checklist.csv`).
- **Interactive Enterprise Hero:** Light enterprise styling with word-by-word magnetic cursor physics and accessibility support (`prefers-reduced-motion`).

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Execution
```bash
# Clone the repository
git clone https://github.com/akif7787/devfest-263-44-003.git
cd devfest-263-44-003

# Install dependencies
npm install --legacy-peer-deps

# Type check
npx tsc --noEmit

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 7. Usage Instructions

1. **Load Requirements:** Click *"Load Official Contest Sample"* to populate the official requirements (`T-2026-0417`) and test PDF files, or click *"Load requirements.json"* to upload custom tender specifications.
2. **Review Tender Summary:** Inspect the procuring entity, bidder, and submission deadline (`2026-10-20`).
3. **Upload PDF Documents:** Drag and drop your bid documents into the upload dropzone (accepts only `.pdf`, up to 30 files and 50 MB total).
4. **Match Documents:** Use the dropdown on each requirement row to match files, or click *"Auto-Match Files"* for automatic filename detection.
5. **Set Expiry Dates:** For documents requiring validity verification (e.g., Trade License, Bank Solvency), enter the expiration date. Status dynamically updates to `OK`, `Expired`, or `Expiry date needed`.
6. **Resolve Conflicts:** If duplicate PDF content or expired certificates are detected, resolve them by unmatching or matching valid alternatives.
7. **Generate & Download Package:** When all blocking issues are resolved, click *"Generate Package PDF"* to compile the complete submission package with cover page, TOC, and stamped page footers.
8. **Export Checklist:** Click *"Export Checklist (CSV)"* for an audit record of document statuses.

---

## 8. Known Problems / Limitations

- **Client-Side Memory Limits:** All PDF merging is conducted in the browser's JavaScript runtime memory. Browsers handle packages up to the 50 MB / 30-file limit reliably, but devices with strict RAM limitations may experience processing delays with very large PDFs.
- **Interactive Expiry Date Confirmation:** Expiry dates for matched certificates are entered/confirmed by the user via interactive date pickers to ensure statutory legal compliance.

---

## 9. AI Tools Used

- **AI Tools Used:** Google Gemini / Antigravity Agent

---

## 10. Most Useful AI Prompt

> *"Build the Tender Document Package Builder from the official Problem Statement, Rulebook, requirements.json, and sample documents with bilingual UI (English + Bangla), PDF upload, validation, matching, status logic, duplicate detection, and browser-based package generation with standardized cover page, table of contents, and sequential footer stamping."*

---

## 11. Technology Stack

- **Framework:** React 19, TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **PDF Engine:** `pdf-lib` (pure browser-based WebAssembly/JavaScript PDF compilation)
- **Deployment Platform:** Vercel (Frontend-only static deployment)

---

## 12. Contest Submission Information

- **Contest:** AI DevFest 2026 – AI Vibe-Coding Contest
- **Participant Name:** Mohammed Ahanaf Akif Rahman
- **Registration Number:** 263-44-003
- **Repository URL:** [https://github.com/akif7787/devfest-263-44-003](https://github.com/akif7787/devfest-263-44-003)
- **Live Production URL:** [https://devfest-263-44-003.vercel.app/](https://devfest-263-44-003.vercel.app/)
- **Final Output Artifact:** `output/T-2026-0417_Package.pdf`
- **Verification Screenshot:** `screenshots/document_statuses.png`
