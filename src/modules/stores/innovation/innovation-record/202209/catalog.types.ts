// Sections.
export const InnovationSections = [
  'INNOVATION_DESCRIPTION',
  'VALUE_PROPOSITION',
  'UNDERSTANDING_OF_NEEDS',
  'UNDERSTANDING_OF_BENEFITS',
  'EVIDENCE_OF_EFFECTIVENESS',
  'MARKET_RESEARCH',
  'INTELLECTUAL_PROPERTY',
  'REGULATIONS_AND_STANDARDS',
  'CURRENT_CARE_PATHWAY',
  'TESTING_WITH_USERS',
  'COST_OF_INNOVATION',
  'COMPARATIVE_COST_BENEFIT',
  'REVENUE_MODEL',
  'IMPLEMENTATION_PLAN'
] as const;
export type InnovationSections = (typeof InnovationSections)[number];

// Shared.
export const catalogYesNo = ['YES', 'NO'] as const;
export type catalogYesNo = (typeof catalogYesNo)[number];

export const catalogYesNotYetNotSure = ['YES', 'NOT_YET', 'NOT_SURE'] as const;
export type catalogYesNotYetNotSure = (typeof catalogYesNotYetNotSure)[number];

export const catalogYesNoNotSure = ['YES', 'NO', 'NOT_SURE'] as const;
export type catalogYesNoNotSure = (typeof catalogYesNoNotSure)[number];

export const catalogYesInProgressNotYet = ['YES', 'IN_PROGRESS', 'NOT_YET'] as const;
export type catalogYesInProgressNotYet = (typeof catalogYesInProgressNotYet)[number];

export const catalogYesInProcessNotYet = ['YES', 'IN_PROCESS', 'NOT_YET'] as const;
export type catalogYesInProcessNotYet = (typeof catalogYesInProcessNotYet)[number];

export const catalogYesNoNotRelevant = ['YES', 'NO', 'NOT_RELEVANT'] as const;
export type catalogYesNoNotRelevant = (typeof catalogYesNoNotRelevant)[number];

// Section 1.
// Section 1.1.
export const catalogCategory = [
  'MEDICAL_DEVICE',
  'PHARMACEUTICAL',
  'DIGITAL',
  'AI',
  'EDUCATION',
  'PPE',
  'OTHER'
] as const;
export type catalogCategory = (typeof catalogCategory)[number];

export const catalogAreas = [
  'WORKFORCE',
  'ECONOMIC_GROWTH',
  'EVIDENCE_GENERATION',
  'TRANSFORMED_OUT_OF_HOSPITAL_CARE',
  'REDUCIND_PRESSURE_EMERGENCY_HOSPITAL_SERVICES',
  'CONTROL_OVER_THEIR_OWN_HEALTH',
  'DIGITALLY_ENABLING_PRIMARY_CARE',
  'CANCER',
  'MENTAL_HEALTH',
  'CHILDREN_AND_YOUNG_PEOPLE',
  'LEARNING_DISABILITIES_AND_AUTISM',
  'CARDIOVASCULAR_DISEASE',
  'STROKE_CARE',
  'DIABETES',
  'RESPIRATORY',
  'RESEARCH_INNOVATION_DRIVE_FUTURE_OUTCOMES',
  'GENOMICS',
  'WIDER_SOCIAL_IMPACT',
  'REDUCING_VARIATION_ACROSS_HEALTH_SYSTEM',
  'FINANCIAL_PLANNING_ASSUMPTIONS',
  'COVID_19',
  'DATA_ANALYTICS_AND_RESEARCH',
  'IMPROVING_SYSTEM_FLOW',
  'INDEPENDENCE_AND_PREVENTION',
  'OPERATIONAL_EXCELLENCE',
  'PATIENT_ACTIVATION_AND_SELF_CARE',
  'PATIENT_SAFETY',
  'GREATER_SUPPORT_AND_RESOURCE_PRIMARY_CARE'
] as const;
export type catalogAreas = (typeof catalogAreas)[number];

export const catalogCareSettings = [
  'STP_ICS',
  'CCGS',
  'ACUTE_TRUSTS_INPATIENT',
  'ACUTE_TRUSTS_OUTPATIENT',
  'PRIMARY_CARE',
  'MENTAL_HEALTH',
  'AMBULANCE',
  'SOCIAL_CARE',
  'INDUSTRY',
  'COMMUNITY',
  'ACADEMIA',
  'DOMICILIARY_CARE',
  'PHARMACY',
  'URGENT_AND_EMERGENCY',
  'OTHER'
] as const;
export type catalogCareSettings = (typeof catalogCareSettings)[number];

export const catalogMainPurpose = [
  'PREVENT_CONDITION',
  'PREDICT_CONDITION',
  'DIAGNOSE_CONDITION',
  'MONITOR_CONDITION',
  'PROVIDE_TREATMENT',
  'MANAGE_CONDITION',
  'ENABLING_CARE'
] as const;
export type catalogMainPurpose = (typeof catalogMainPurpose)[number];

export const catalogsupportTypes = [
  'ADOPTION',
  'ASSESSMENT',
  'PRODUCT_MIGRATION',
  'CLINICAL_TESTS',
  'COMMERCIAL',
  'PROCUREMENT',
  'DEVELOPMENT',
  'EVIDENCE_EVALUATION',
  'FUNDING',
  'INFORMATION'
] as const;
export type catalogsupportTypes = (typeof catalogsupportTypes)[number];

// Section 2.
// // Section 2.1.

// // Section 2.2.
export const catalogPatientsCitizensBenefit = [
  'REDUCE_MORTALITY',
  'REDUCE_FURTHER_TREATMENT',
  'REDUCE_ADVERSE_EVENTS',
  'ENABLE_EARLIER_DIAGNOSIS',
  'REDUCE_RISKS',
  'PREVENTS_CONDITION_OCCURRING',
  'AVOIDS_UNNECESSARY_TREATMENT',
  'ENABLES_NON_INVASIVELY_TEST',
  'INCREASES_SELF_MANAGEMENT',
  'INCREASES_LIFE_QUALITY',
  'ENABLES_SHARED_CARE'
] as const;
export type catalogPatientsCitizensBenefit = (typeof catalogPatientsCitizensBenefit)[number];

export const catalogGeneralBenefit = [
  'REDUCE_LENGTH_STAY',
  'REDUCE_CRITICAL_CARE',
  'REDUCE_EMERGENCY_ADMISSIONS',
  'CHANGES_DELIVERY_SECONDARY_TO_PRIMARY',
  'CHANGES_DELIVERY_INPATIENT_TO_DAY_CASE',
  'INCREASES_COMPLIANCE',
  'IMPROVES_COORDINATION',
  'REDUCES_REFERRALS',
  'LESS_TIME',
  'FEWER_STAFF',
  'FEWER_APPOINTMENTS',
  'COST_SAVING',
  'INCREASES_EFFICIENCY',
  'IMPROVES_PERFORMANCE',
  'OTHER'
] as const;
export type catalogGeneralBenefit = (typeof catalogGeneralBenefit)[number];

export const catalogEnvironmentalBenefit = [
  'NO_SIGNIFICANT_BENEFITS',
  'LESS_ENERGY',
  'LESS_RAW_MATERIALS',
  'REDUCES_GAS_EMISSIONS',
  'REDUCES_PLASTICS_USE',
  'MINIMISES_WASTE',
  'LOWER_ENVIRONMENTAL_IMPACT',
  'OPTIMIZES_FINITE_RESOURCE_USE',
  'USES_RECYCLED_MATERIALS',
  'OTHER'
] as const;
export type catalogEnvironmentalBenefit = (typeof catalogEnvironmentalBenefit)[number];

// // Section 2.3. Evidences.
export const catalogEvidenceType = ['CLINICAL', 'ECONOMIC', 'OTHER'] as const;
export type catalogEvidenceType = (typeof catalogEvidenceType)[number];

export const catalogClinicalEvidence = [
  'DATA_PUBLISHED',
  'NON_RANDOMISED_COMPARATIVE_DATA',
  'NON_RANDOMISED_NON_COMPARATIVE_DATA',
  'CONFERENCE',
  'RANDOMISED_CONTROLLED_TRIAL',
  'UNPUBLISHED_DATA',
  'OTHER'
] as const;
export type catalogClinicalEvidence = (typeof catalogClinicalEvidence)[number];

// Section 3.
// // Section 3.2.
export const catalogHasPatents = ['HAS_AT_LEAST_ONE', 'APPLIED_AT_LEAST_ONE', 'HAS_NONE'] as const;
export type catalogHasPatents = (typeof catalogHasPatents)[number];

// Section 4.
// // Section 4.1.
export const catalogHasRegulationKnowledge = ['YES_ALL', 'YES_SOME', 'NO', 'NOT_RELEVANT'] as const;
export type catalogHasRegulationKnowledge = (typeof catalogHasRegulationKnowledge)[number];

export const catalogStandardsType = [
  'CE_UKCA_NON_MEDICAL',
  'CE_UKCA_CLASS_I',
  'CE_UKCA_CLASS_II_A',
  'CE_UKCA_CLASS_II_B',
  'CE_UKCA_CLASS_III',
  'IVD_GENERAL',
  'IVD_SELF_TEST',
  'IVD_ANNEX_LIST_A',
  'IVD_ANNEX_LIST_B',
  'MARKETING',
  'CQC',
  'DTAC',
  'OTHER'
] as const;
export type catalogStandardsType = (typeof catalogStandardsType)[number];

// Section 5.
// // Section 5.1.
export const catalogPathwayKnowledge = ['PATHWAY_EXISTS_AND_CHANGED', 'PATHWAY_EXISTS_AND_FITS', 'NO_PATHWAY'] as const;
export type catalogPathwayKnowledge = (typeof catalogPathwayKnowledge)[number];

export const catalogCarePathway = [
  'ONLY_OPTION',
  'BETTER_OPTION',
  'EQUIVALENT_OPTION',
  'FIT_LESS_COSTS',
  'NO_KNOWLEDGE'
] as const;
export type catalogCarePathway = (typeof catalogCarePathway)[number];

// Section 6.
// // Section 6.1.
export const catalogHasCostKnowledge = ['DETAILED_ESTIMATE', 'ROUGH_IDEA', 'NO'] as const;
export type catalogHasCostKnowledge = (typeof catalogHasCostKnowledge)[number];

export const catalogPatientRange = [
  'UP_10000',
  'BETWEEN_10000_500000',
  'MORE_THAN_500000',
  'NOT_SURE',
  'NOT_RELEVANT'
] as const;
export type catalogPatientRange = (typeof catalogPatientRange)[number];

export const catalogCostComparison = ['CHEAPER', 'COSTS_MORE_WITH_SAVINGS', 'COSTS_MORE', 'NOT_SURE'] as const;
export type catalogCostComparison = (typeof catalogCostComparison)[number];

// Section 7.
// // Section 7.1.
export const catalogRevenues = [
  'ADVERTISING',
  'DIRECT_PRODUCT_SALES',
  'FEE_FOR_SERVICE',
  'LEASE',
  'SALES_OF_CONSUMABLES_OR_ACCESSORIES',
  'SUBSCRIPTION',
  'OTHER'
] as const;
export type catalogRevenues = (typeof catalogRevenues)[number];
