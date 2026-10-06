import { PDFDocument } from 'pdf-lib';
import { UploadedFileRecord } from '../types';

/**
 * Calculates SHA-256 hex hash of an ArrayBuffer in browser using Web Crypto API.
 */
export async function calculateBufferHash(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Safely parses a PDF file to extract page count and check integrity.
 */
export async function parsePdfMetadata(
  file: File
): Promise<{
  pageCount: number;
  arrayBuffer: ArrayBuffer;
  hash: string;
  isCorruptOrEncrypted: boolean;
  errorMessage?: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const hash = await calculateBufferHash(arrayBuffer);

  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    const pageCount = pdfDoc.getPageCount();
    return {
      pageCount: Math.max(1, pageCount),
      arrayBuffer,
      hash,
      isCorruptOrEncrypted: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const isEncrypted = message.toLowerCase().includes('encrypt') || message.toLowerCase().includes('password');
    return {
      pageCount: 1,
      arrayBuffer,
      hash,
      isCorruptOrEncrypted: true,
      errorMessage: isEncrypted
        ? 'Password-protected or encrypted PDF'
        : 'Corrupted or unreadable PDF structure',
    };
  }
}

/**
 * Re-indexes all uploaded files to identify exact duplicates by SHA-256 content hash.
 */
export function identifyDuplicates(files: UploadedFileRecord[]): UploadedFileRecord[] {
  const hashGroups = new Map<string, UploadedFileRecord[]>();
  for (const f of files) {
    const list = hashGroups.get(f.hash) || [];
    list.push(f);
    hashGroups.set(f.hash, list);
  }

  return files.map(file => {
    const group = hashGroups.get(file.hash) || [];
    if (group.length > 1) {
      // Find the first uploaded file in the group as the primary
      const primary = group[0];
      const isDuplicate = file.id !== primary.id;
      return {
        ...file,
        isDuplicateOf: isDuplicate ? primary.name : undefined,
        duplicateIds: group.filter(item => item.id !== file.id).map(item => item.id),
      };
    } else {
      return {
        ...file,
        isDuplicateOf: undefined,
        duplicateIds: [],
      };
    }
  });
}

/**
 * Formats bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
