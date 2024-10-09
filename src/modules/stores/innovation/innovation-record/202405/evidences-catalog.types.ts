// // Section 2.2. Evidences.
export const catalogEvidenceSubmitType = [
  'CLINICAL_OR_CARE',
  'COST_IMPACT_OR_ECONOMIC',
  'OTHER_EFFECTIVENESS',
  'PRE_CLINICAL',
  'REAL_WORLD'
] as const;
export type catalogEvidenceSubmitType = (typeof catalogEvidenceSubmitType)[number];

export const catalogEvidenceType = [
  'DATA_PUBLISHED',
  'NON_RANDOMISED_COMPARATIVE_DATA',
  'NON_RANDOMISED_NON_COMPARATIVE_DATA',
  'CONFERENCE',
  'RANDOMISED_CONTROLLED_TRIAL',
  'UNPUBLISHED_DATA',
  'OTHER'
] as const;
export type catalogEvidenceType = (typeof catalogEvidenceType)[number];
