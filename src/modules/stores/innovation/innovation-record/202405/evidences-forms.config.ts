import { FormSelectableFieldType } from '../ir-versions.types';
import { catalogEvidenceSubmitType, catalogEvidenceType } from './evidences-catalog.types';

// // Section EVIDENCE_OF_EFFECTIVENESS Evidences.
export const evidenceSubmitTypeItems: FormSelectableFieldType<catalogEvidenceSubmitType> = [
  { value: 'CLINICAL_OR_CARE', label: 'Evidence of clinical or care outcomes' },
  { value: 'COST_IMPACT_OR_ECONOMIC', label: 'Evidence of cost impact, efficiency gains and/or economic modelling' },
  { value: 'OTHER_EFFECTIVENESS', label: 'Other evidence of effectiveness (for example environmental or social)' },
  { value: 'PRE_CLINICAL', label: 'Pre-clinical evidence' },
  { value: 'REAL_WORLD', label: 'Real world evidence' }
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
