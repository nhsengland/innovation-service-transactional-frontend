import { locale } from '@app/config/translations/en';
import { FormSelectableFieldType } from '../ir-versions.types';
import { catalogEvidenceSubmitType, catalogEvidenceType } from './evidences-catalog.types';

const evidenceTranslations = locale.data.shared.catalog.innovation.evidence;

// // Section EVIDENCE_OF_EFFECTIVENESS Evidences.
export const evidenceSubmitTypeItems: FormSelectableFieldType<catalogEvidenceSubmitType> = [
  { value: 'CLINICAL_OR_CARE', label: evidenceTranslations.evidenceSubmitType.CLINICAL_OR_CARE },
  { value: 'COST_IMPACT_OR_ECONOMIC', label: evidenceTranslations.evidenceSubmitType.COST_IMPACT_OR_ECONOMIC },
  { value: 'OTHER_EFFECTIVENESS', label: evidenceTranslations.evidenceSubmitType.OTHER_EFFECTIVENESS },
  { value: 'PRE_CLINICAL', label: evidenceTranslations.evidenceSubmitType.PRE_CLINICAL },
  { value: 'REAL_WORLD', label: evidenceTranslations.evidenceSubmitType.REAL_WORLD }
];

export const evidenceTypeItems: FormSelectableFieldType<catalogEvidenceType> = [
  { value: 'DATA_PUBLISHED', label: evidenceTranslations.evidenceType.DATA_PUBLISHED },
  {
    value: 'NON_RANDOMISED_COMPARATIVE_DATA',
    label: evidenceTranslations.evidenceType.NON_RANDOMISED_COMPARATIVE_DATA
  },
  {
    value: 'NON_RANDOMISED_NON_COMPARATIVE_DATA',
    label: evidenceTranslations.evidenceType.NON_RANDOMISED_NON_COMPARATIVE_DATA
  },
  { value: 'CONFERENCE', label: evidenceTranslations.evidenceType.CONFERENCE },
  { value: 'RANDOMISED_CONTROLLED_TRIAL', label: evidenceTranslations.evidenceType.RANDOMISED_CONTROLLED_TRIAL },
  { value: 'UNPUBLISHED_DATA', label:evidenceTranslations.evidenceType.UNPUBLISHED_DATA }
];
