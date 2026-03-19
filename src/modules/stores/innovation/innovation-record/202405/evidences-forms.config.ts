import { locale } from '@app/config/translations/en';
import { FormSelectableFieldType } from '../ir-versions.types';
import { catalogEvidenceSubmitType, catalogEvidenceType } from './evidences-catalog.types';

const evidenceTranslations = locale.data.shared.catalog.innovation.evidence;

// // Section EVIDENCE_OF_EFFECTIVENESS Evidences.
export const evidenceSubmitTypeItems: FormSelectableFieldType<catalogEvidenceSubmitType> = [
  { value: 'CLINICAL_OR_CARE', label: evidenceTranslations.submitType.CLINICAL_OR_CARE },
  { value: 'COST_IMPACT_OR_ECONOMIC', label: evidenceTranslations.submitType.COST_IMPACT_OR_ECONOMIC },
  { value: 'OTHER_EFFECTIVENESS', label: evidenceTranslations.submitType.OTHER_EFFECTIVENESS },
  { value: 'PRE_CLINICAL', label: evidenceTranslations.submitType.PRE_CLINICAL },
  { value: 'REAL_WORLD', label: evidenceTranslations.submitType.REAL_WORLD }
];

export const evidenceTypeItems: FormSelectableFieldType<catalogEvidenceType> = [
  { value: 'DATA_PUBLISHED', label: 'Data published, but not in a peer reviewed journal' },
  {
    value: 'NON_RANDOMISED_COMPARATIVE_DATA',
    label: 'Non-randomised comparative data published in a peer reviewed journal'
  },
  {
    value: 'NON_RANDOMISED_NON_COMPARATIVE_DATA',
    label: 'Non-randomised non-comparative data published in a peer reviewed journal'
  },
  { value: 'CONFERENCE', label: 'Poster or abstract presented at a conference' },
  { value: 'RANDOMISED_CONTROLLED_TRIAL', label: 'Randomised controlled trial published in a peer reviewed journal' },
  { value: 'UNPUBLISHED_DATA', label: 'Unpublished data' }
];
