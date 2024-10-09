import { catalogEvidenceType, catalogEvidenceSubmitType } from './evidences-catalog.types';

export type DocumentType202405 = {
  version: '202405';
  evidences?: {
    id: string;
    evidenceSubmitType: catalogEvidenceSubmitType; // Similar to previous "evidenceType", but with a new list of options.
    evidenceType?: catalogEvidenceType; // Previous clinicalEvidenteType field.
    description?: string;
    summary: string;
  }[];
};
