// Sections.
export const InnovationSections = [
  'INNOVATION_DESCRIPTION',
  'UNDERSTANDING_OF_NEEDS',
  'EVIDENCE_OF_EFFECTIVENESS',
  'MARKET_RESEARCH',
  'CURRENT_CARE_PATHWAY',
  'TESTING_WITH_USERS',
  'REGULATIONS_AND_STANDARDS',
  'INTELLECTUAL_PROPERTY',
  'REVENUE_MODEL',
  'COST_OF_INNOVATION',
  'DEPLOYMENT' // Renamed from 'IMPLEMENTATION_PLAN'
] as const;
export type InnovationSections = (typeof InnovationSections)[number];

// Shared.
export const catalogYesNo = ['YES', 'NO'] as const;
export type catalogYesNo = (typeof catalogYesNo)[number];

export const catalogYesNotYet = ['YES', 'NOT_YET'] as const;
export type catalogYesNotYet = (typeof catalogYesNotYet)[number];

export const catalogYesNotYetNotSure = ['YES', 'NOT_YET', 'NOT_SURE'] as const;
export type catalogYesNotYetNotSure = (typeof catalogYesNotYetNotSure)[number];

export const catalogYesNotYetNo = ['YES', 'NOT_YET', 'NO'] as const;
export type catalogYesNotYetNo = (typeof catalogYesNotYetNo)[number];

export const catalogYesNoNotSure = ['YES', 'NO', 'NOT_SURE'] as const;
export type catalogYesNoNotSure = (typeof catalogYesNoNotSure)[number];

export const catalogYesInProgressNotYet = ['YES', 'IN_PROGRESS', 'NOT_YET'] as const;
export type catalogYesInProgressNotYet = (typeof catalogYesInProgressNotYet)[number];

export const catalogYesNoNotRelevant = ['YES', 'NO', 'NOT_RELEVANT'] as const;
export type catalogYesNoNotRelevant = (typeof catalogYesNoNotRelevant)[number];

// Section 1.
// Section 1.1.
export const catalogOfficeLocation = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Based outside UK'] as const;
export type catalogOfficeLocation = (typeof catalogOfficeLocation)[number];

export const catalogCategory = [
  'MEDICAL_DEVICE',
  'IN_VITRO_DIAGNOSTIC',
  'PHARMACEUTICAL',
  'DIGITAL',
  'AI',
  'EDUCATION',
  'PPE',
  'MODELS_CARE',
  'ESTATES_FACILITIES',
  'TRAVEL_TRANSPORT',
  'FOOD_NUTRITION',
  'DATA_MONITORING',
  'OTHER'
] as const;
export type catalogCategory = (typeof catalogCategory)[number];

export const catalogAreas = [
  'COVID_19',
  'DATA_ANALYTICS_AND_RESEARCH',
  'DIGITALISING_SYSTEM',
  'IMPROVING_SYSTEM_FLOW',
  'INDEPENDENCE_AND_PREVENTION',
  'OPERATIONAL_EXCELLENCE',
  'PATIENT_ACTIVATION_AND_SELF_CARE',
  'PATIENT_SAFETY',
  'WORKFORCE_RESOURCE_OPTIMISATION',
  'NET_ZERO_GREENER_INNOVATION'
] as const;
export type catalogAreas = (typeof catalogAreas)[number];

export const catalogCareSettings = [
  'ACADEMIA',
  'ACUTE_TRUSTS_INPATIENT',
  'ACUTE_TRUSTS_OUTPATIENT',
  'AMBULANCE',
  'CARE_HOMES_CARE_SETTING',
  'END_LIFE_CARE',
  'ICS',
  'INDUSTRY',
  'LOCAL_AUTHORITY_EDUCATION',
  'MENTAL_HEALTH',
  'PHARMACY',
  'PRIMARY_CARE',
  'SOCIAL_CARE',
  'THIRD_SECTOR_ORGANISATIONS',
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
  'ENABLING_CARE',
  'RISKS_CLIMATE_CHANGE'
] as const;
export type catalogMainPurpose = (typeof catalogMainPurpose)[number];

export const catalogInvolvedAACProgrammes = [
  'No',
  'Health Innovation Network',
  'Artificial Intelligence in Health and Care Award',
  'Clinical Entrepreneur Programme',
  'Early Access to Medicines Scheme',
  'Innovation for Healthcare Inequalities Programme',
  'Innovation and Technology Payment Programme',
  'NHS Innovation Accelerator',
  'NHS Insights Prioritisation Programme',
  'Pathway Transformation Fund',
  'Rapid Uptake Products Programme',
  'Small Business Research Initiative for Healthcare',
  'Test beds'
] as const;
export type catalogInvolvedAACProgrammes = (typeof catalogInvolvedAACProgrammes)[number];

// Section 2.
// // Section 2.1.
export const catalogCarbonReductionPlan = ['YES', 'WORKING_ON', 'NO'] as const;
export type catalogCarbonReductionPlan = (typeof catalogCarbonReductionPlan)[number];

export const catalogKeyHealthInequalities = [
  'MATERNITY',
  'SEVER_MENTAL_ILLNESS',
  'CHRONIC_RESPIRATORY_DISEASE',
  'EARLY_CANCER_DIAGNOSIS',
  'HYPERTENSION_CASE_FINDING',
  'NONE'
] as const;
export type catalogKeyHealthInequalities = (typeof catalogKeyHealthInequalities)[number];

// // Section 2.2.
export const catalogNeedsSupportAnyArea = [
  'RESEARCH_GOVERNANCE',
  'DATA_SHARING',
  'CONFIDENTIAL_PATIENT_DATA',
  'DO_NOT_NEED_SUPPORT'
] as const;
export type catalogNeedsSupportAnyArea = (typeof catalogNeedsSupportAnyArea)[number];

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

// Section 3.
// // Section 3.1.
export const catalogOptionBestDescribesInnovation = [
  'ONE_OFF_INNOVATION',
  'BETTER_ALTERNATIVE',
  'EQUIVALENT_ALTERNATIVE',
  'COST_EFFECT_ALTERNATIVE',
  'NOT_SURE'
] as const;
export type catalogOptionBestDescribesInnovation = (typeof catalogOptionBestDescribesInnovation)[number];

// // Section 3.2.
export const catalogPathwayKnowledge = [
  'PATHWAY_EXISTS_AND_CHANGED',
  'PATHWAY_EXISTS_AND_FITS',
  'NO_PATHWAY',
  'DONT_KNOW',
  'NOT_PART_PATHWAY'
] as const;
export type catalogPathwayKnowledge = (typeof catalogPathwayKnowledge)[number];

// Section 4.
// // Section 4.1.
export const catalogIntendedUserGroupsEngaged = [
  'CLINICAL_SOCIAL_CARE_WORKING_INSIDE_UK',
  'CLINICAL_SOCIAL_CARE_WORKING_OUTSIDE_UK',
  'NON_CLINICAL_HEALTHCARE',
  'PATIENTS',
  'SERVICE_USERS',
  'CARERS',
  'OTHER'
] as const;
export type catalogIntendedUserGroupsEngaged = (typeof catalogIntendedUserGroupsEngaged)[number];

// Section 5.
// // Section 5.1.
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

// // Section 5.2.
export const catalogHasPatents = ['HAS_AT_LEAST_ONE', 'APPLIED_AT_LEAST_ONE', 'HAS_NONE'] as const;
export type catalogHasPatents = (typeof catalogHasPatents)[number];

// Section 6.
// // Section 6.1.
export const catalogHasRevenueModel = ['YES', 'NO', 'DONT_KNOW'] as const;
export type catalogHasRevenueModel = (typeof catalogHasRevenueModel)[number];

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

// Section 7.
// // Section 7.1.
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
