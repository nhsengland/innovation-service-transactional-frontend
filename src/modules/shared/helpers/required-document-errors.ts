import type { SchemaContextStore } from '@modules/stores';
import { InnovationErrorsEnum } from '../enums/innovation-errors.enum';
import type { FileDownloadType } from '../services/file-scan.types';

export type RequiredDocumentIssue = {
  section: string;
  contextId: string;
  contextName: string;
  filename?: string;
  fileId?: string;
  scanState: string;
};
type Translations = ReturnType<SchemaContextStore['getIrSchemaTranslationsMap']>;

const messages: Record<string, string> = {
  scanning: 'Scanning. Wait for the security check to finish, then refresh this page.',
  delayed: 'Scan delayed. Try again later. Contact support if the delay continues.',
  rejected: 'Rejected. Malware detected. Remove this file and upload a replacement.',
  scan_failed: 'Scan failed. The security check could not finish. Try again later or replace the file.',
  not_scanned: 'Not scanned. This file has not been checked for malware. Replace it or contact support.',
  removed: 'File removed. This file is no longer in storage. Remove its entry and upload a replacement.',
  unavailable: 'Unavailable. We could not check this file. Try again later or contact support.',
  missing: 'Supporting document missing. Upload a document to continue.'
};

export function isEligibleRequiredDocument(file: FileDownloadType): boolean {
  return file.scanState === 'ready' || file.scanState === 'legacy_allowed';
}

export function buildRequiredDocumentAlert(
  innovationId: string,
  issues: RequiredDocumentIssue[],
  translations?: Translations
) {
  const baseUrl = `/innovator/innovations/${encodeURIComponent(innovationId)}`;
  const sectionNames: Record<string, string> = {
    EVIDENCE_OF_EFFECTIVENESS: 'Evidence of impact and benefit',
    REGULATIONS_AND_STANDARDS: 'Regulatory approvals, standards and certifications'
  };
  // Group by section and context; preserve the order of files within each group.
  const ordered = [...issues].sort((a, b) =>
    `${a.section}:${a.contextId}`.localeCompare(`${b.section}:${b.contextId}`)
  );
  return {
    message: 'You cannot complete this section or submit your innovation until you resolve these document issues.',
    width: 'full' as const,
    itemsList: ordered.map(issue => {
      const sectionName = translations?.subsections.get(issue.section) || sectionNames[issue.section] || issue.section;
      const contextName =
        issue.section === 'REGULATIONS_AND_STANDARDS'
          ? translations?.questions.get('standards')?.items?.get(issue.contextId)?.label ||
            issue.contextName.replace(/_/g, ' ')
          : issue.contextName;
      const sectionUrl = `${baseUrl}/record/sections/${issue.section}`;
      return {
        title: [sectionName, contextName, issue.filename].filter(Boolean).join(': '),
        description: messages[issue.scanState] ?? messages['unavailable'],
        callback:
          issue.section === 'EVIDENCE_OF_EFFECTIVENESS' && issue.contextId
            ? `${sectionUrl}/evidences/${encodeURIComponent(issue.contextId)}`
            : issue.section === 'REGULATIONS_AND_STANDARDS' && issue.contextId
              ? `${sectionUrl}/regulations/${encodeURIComponent(issue.contextId)}`
              : sectionUrl
      };
    })
  };
}

export function requiredDocumentErrorAlert(
  error: unknown,
  innovationId: string,
  translations?: Translations
): ReturnType<typeof buildRequiredDocumentAlert> | null {
  const response = (error as { error?: { error?: string; details?: { files?: RequiredDocumentIssue[] } } })?.error;
  if (
    response?.error !== InnovationErrorsEnum.INNOVATION_REQUIRED_DOCUMENTS_INVALID ||
    !Array.isArray(response.details?.files)
  )
    return null;
  const issues = response.details.files.filter(
    issue =>
      issue &&
      ['EVIDENCE_OF_EFFECTIVENESS', 'REGULATIONS_AND_STANDARDS'].includes(issue.section) &&
      typeof issue.contextId === 'string' &&
      typeof issue.contextName === 'string' &&
      typeof issue.scanState === 'string'
  );
  return issues.length ? buildRequiredDocumentAlert(innovationId, issues, translations) : null;
}
