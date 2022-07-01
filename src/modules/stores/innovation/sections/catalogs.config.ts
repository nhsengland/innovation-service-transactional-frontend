import { FormEngineParameterModel } from '@modules/shared/forms';

// Innovation.
export const maturityLevelItems = [
  { value: 'DISCOVERY', label: 'Discovery or early development' },
  { value: 'ADVANCED', label: 'Advanced development and testing' },
  { value: 'READY', label: 'Ready or nearly ready for adoption and scale' }
];

export const yesPartiallyNoItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'PARTIALLY', label: 'Partially' },
  { value: 'NO', label: 'No' }
];



// Section 1.
// // Section 1.1
export const hasFinalProductItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];
export const categoriesItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherCategoryDescription', dataType: 'text', label: 'Other category', validations: { isRequired: [true, 'Other category description is required'] } }) }
];
export const mainCategoryItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherMainCategoryDescription', dataType: 'text', label: 'Other main category', validations: { isRequired: [true, 'Other main category description is required'] } }) }
];
export const areasItems = [
  { value: 'COVID_19', label: 'COVID-19' },
  { value: 'DATA_ANALYTICS_AND_RESEARCH', label: 'Data, analytics and research' },
  { value: 'DIGITALISING_SYSTEM', label: 'Digitalising the system' },
  { value: 'IMPROVING_SYSTEM_FLOW', label: 'Improving system flow' },
  { value: 'INDEPENDENCE_AND_PREVENTION', label: 'Independence and prevention' },
  { value: 'OPERATIONAL_EXCELLENCE', label: 'Operational excellence' },
  { value: 'PATIENT_ACTIVATION_AND_SELF_CARE', label: 'Patient activation and self-care' },
  { value: 'PATIENT_SAFETY', label: 'Patient safety and quality improvement' },
  { value: 'WORKFORCE_OPTIMISATION', label: 'Workforce resource optimisation' }
];
export const clinicalAreasItems = [
  { value: 'ACUTE', label: 'Acute and emergency services' },
  { value: 'AGEING', label: 'Ageing' },
  { value: 'CANCER', label: 'Cancer' },
  { value: 'CARDIO_ENDOCRINE_METABOLIC', label: 'Cardiovascular, endocrine & metabolic (cardiometabolic)' },
  { value: 'CHILDREN_AND_YOUNG', label: 'Children and young people' },
  { value: 'DISEASE_AGNOSTIC', label: 'Disease agnostic solution' },
  { value: 'GASTRO_KDNEY_LIVER', label: 'Gastroenterology, kidney and liver' },
  { value: 'INFECTION_INFLAMATION', label: 'Infection and inflammation' },
  { value: 'MATERNITY_REPRODUCTIVE_HEALTH', label: 'Maternity and reproductive health' },
  { value: 'MENTAL_HEALTH', label: 'Mental health' },
  { value: 'NEUROLOGY', label: 'Neurology' },
  { value: 'POPULATION_HEALTH', label: 'Population health' },
  { value: 'RESPIRATORY', label: 'Respiratory' },
  { value: 'UROLOGY', label: 'Urology' },
  { value: 'WORKFORCE_AND_EDUCATION', label: 'Workforce and education' }
];
export const careSettingsItems = [
  { value: 'AMBULANCE_OR_PARAMEDIC', label: 'Ambulance or paramedic' },
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'HOSPITAL_INPATIENT', label: 'Hospital - inpatient' },
  { value: 'HOSPITAL_OUTPATIENT', label: 'Hospital - outpatient' },
  { value: 'MENTAL_HEALTH', label: 'Mental health' },
  { value: 'PATIENT_HOME', label: 'Patient\'s home' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'PRIMARY_CARE', label: 'Primary care' },
  { value: 'SOCIAL_CARE', label: 'Social care' }
];
export const mainPurposeItems = [
  { value: 'PREVENT_CONDITION', label: 'Preventing a condition or symptom from happening or worsening' },
  { value: 'PREDICT_CONDITION', label: 'Predicting the occurence of a condition or symptom' },
  { value: 'DIAGNOSE_CONDITION', label: 'Diagnosing a condition' },
  { value: 'MONITOR_CONDITION', label: 'Monitoring a condition, treatment or therapy' },
  { value: 'PROVIDE_TREATMENT', label: 'Providing treatment or therapy' },
  { value: 'MANAGE_CONDITION', label: 'Managing a condition' },
  { value: 'ENABLING_CARE', label: 'Enabling care, services or communication' }
];
export const supportTypesItems = [
  { value: 'ADOPTION', label: 'Adoption' },
  { value: 'ASSESSMENT', label: 'Health technology assessment' },
  { value: 'PRODUCT_MIGRATION', label: 'Bringing my product to or from the UK' },
  { value: 'CLINICAL_TESTS', label: 'Clinical trials and testing' },
  { value: 'COMMERCIAL', label: 'Commercial support and advice' },
  { value: 'PROCUREMENT', label: 'Procurement' },
  { value: 'DEVELOPMENT', label: 'Product development and regulatory advice' },
  { value: 'EVIDENCE_EVALUATION', label: 'Real-world evidence and evaluation' },
  { value: 'FUNDING', label: 'Understanding funding channels' },
  { value: '', label: 'SEPARATOR' },
  { value: 'INFORMATION', label: 'I\'m only looking for information right now' }
];

// // Section 1.2
export const hasProblemTackleKnowledgeItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


// Section 2
// // Section 2.1
export const innovationImpactItems = [
  { value: 'PATIENTS', label: 'Patients or citizens' },
  { value: 'CLINICIANS', label: 'Clinicians, carers or administrative staff' }
];

// // Section 2.2
export const hasBenefitsItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NOT_YET', label: 'Not yet' },
  { value: 'NOT_SURE', label: 'Not sure' }
];
export const patientsCitizensBenefitItems = [
  { value: 'REDUCE_MORTALITY', label: 'Reduces mortality' },
  { value: 'REDUCE_FURTHER_TREATMENT', label: 'Reduces need for further treatment' },
  { value: 'REDUCE_ADVERSE_EVENTS', label: 'Reduces adverse events' },
  { value: 'ENABLE_EARLIER_DIAGNOSIS', label: 'Enables earlier or more accurate diagnosis' },
  { value: 'REDUCE_RISKS', label: 'Reduces risks, side effects or complications' },
  { value: 'PREVENTS_CONDITION_OCCURRING', label: 'Prevents a condition occurring or exacerbating' },
  { value: 'AVOIDS_UNNECESSARY_TREATMENT', label: 'Avoids a test, procedure or unnecessary treatment' },
  { value: 'ENABLES_NON_INVASIVELY_TEST', label: 'Enables a test, procedure or treatment to be done non-invasively' },
  { value: 'INCREASES_SELF_MANAGEMENT', label: 'Increases self-management' },
  { value: 'INCREASES_LIFE_QUALITY', label: 'Increases quality of life' },
  { value: 'ENABLES_SHARED_CARE', label: 'Enables shared care' },
  // {
  //   value: 'OTHER',
  //   label: 'Other',
  //   conditional: new FormEngineParameterModel({ id: 'otherPatientsCitizensBenefit', dataType: 'text', label: 'Other patients or citizens benefit', validations: { isRequired: [true, 'Other patients or citizens benefit is required'] } })
  // }
];
export const generalBenefitItems = [
  { value: 'REDUCE_LENGTH_STAY', label: 'Reduces the length of stay or enables earlier discharge' },
  { value: 'REDUCE_CRITICAL_CARE', label: 'Reduces need for adult or paediatric critical care' },
  { value: 'REDUCE_EMERGENCY_ADMISSIONS', label: 'Reduces emergency admissions' },
  { value: 'CHANGES_DELIVERY_SECONDARY_TO_PRIMARY', label: 'Changes delivery of care from secondary care (e.g. hospitals) to primary care (e.g. GP or community services)' },
  { value: 'CHANGES_DELIVERY_INPATIENT_TO_DAY_CASE', label: 'Change in delivery of care from inpatient to day case' },
  { value: 'INCREASES_COMPLIANCE', label: 'Increases compliance' },
  { value: 'IMPROVES_COORDINATION', label: 'Improves patient management or coordination of care or services' },
  { value: 'REDUCES_REFERRALS', label: 'Reduces referrals' },
  { value: 'LESS_TIME', label: 'Takes less time' },
  { value: 'FEWER_STAFF', label: 'Uses no staff or a lower grade of staff' },
  { value: 'FEWER_APPOINTMENTS', label: 'Leads to fewer appointments' },
  { value: 'COST_SAVING', label: 'Is cost saving' },
  { value: 'INCREASES_EFFICIENCY', label: 'Increases efficiency' },
  { value: 'IMPROVES_PERFORMANCE', label: 'Improves performance' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherGeneralBenefit', dataType: 'text', label: 'Other NHS or social care benefit', validations: { isRequired: [true, 'Other MHS pr social care benefit is required'] } }) }
];
export const environmentalBenefitItems = [
  { value: 'NO_SIGNIFICANT_BENEFITS', label: 'There are no significant environmental sustainability benefits associated with my technology' },
  { value: 'LESS_ENERGY', label: 'Less energy is used' },
  { value: 'LESS_RAW_MATERIALS', label: 'Less raw materials are used' },
  { value: 'REDUCES_GAS_EMISSIONS', label: 'Reduces greenhouse gas emissions (including CO2 emissions)' },
  { value: 'REDUCES_PLASTICS_USE', label: 'Reduces the use of single use plastics' },
  { value: 'MINIMISES_WASTE', label: 'Minimises waste' },
  { value: 'LOWER_ENVIRONMENTAL_IMPACT', label: 'Lower environmental impact (e.g. less travel, better use of NHS resources)' },
  { value: 'OPTIMIZES_FINITE_RESOURCE_USE', label: 'Reduces or optimizes finite resource use (e.g. water, metals)' },
  { value: 'USES_RECYCLED_MATERIALS', label: 'Can be readily recycled or uses recycled materials' },
  {
    value: 'OTHER',
    label: 'Other',
    conditional: new FormEngineParameterModel({ id: 'otherEnvironmentalBenefit', dataType: 'text', label: 'Other environmental sustainability benefit', validations: { isRequired: [true, 'Other environmental sustainability benefit is required'] } })
  }
];

// // Section 2.3
export const hasEvidenceItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'NOT_YET', label: 'Not yet' }
];


// Section 3
// // Section 3.1
export const hasMarketResearchItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m currently doing market research' },
  { value: 'NOT_YET', label: 'Not yet' }
];

// // Section 3.2
export const hasPatentsItems = [
  { value: 'HAS_AT_LEAST_ONE', label: 'I have one or more patents' },
  { value: 'APPLIED_AT_LEAST_ONE', label: 'I have applied for one or more patents' },
  { value: 'HAS_NONE', label: 'I don\'t have any patents, but believe I have freedom to operate' }
];
export const hasOtherIntellectualItems = [
  { value: 'YES', label: 'Yes', conditional: new FormEngineParameterModel({ id: 'otherIntellectual', dataType: 'text', label: 'Intellectual property name', validations: { isRequired: [true, 'Intellectual property name is required'] } }) },
  { value: 'NO', label: 'No' }
];


// Section 4
// // Section 4.1
export const hasRegulationKnowledgeItems = [
  { value: 'YES_ALL', label: 'Yes, I know all of them' },
  { value: 'YES_SOME', label: 'Yes, I know some of them' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];
export const standardsTypeItems = [
  { value: 'CE_UKCA_NON_MEDICAL', label: 'Non-medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_I', label: 'Class I medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_A', label: 'Class IIa medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_II_B', label: 'Class IIb medical device', group: 'UKCA / CE' },
  { value: 'CE_UKCA_CLASS_III', label: 'Class III medical device', group: 'UKCA / CE' },
  { value: 'IVD_GENERAL', label: 'IVD general', group: 'In-vitro diagnostics' },
  { value: 'IVD_SELF_TEST', label: 'IVD self-test', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_A', label: 'IVD Annex II List A', group: 'In-vitro diagnostics' },
  { value: 'IVD_ANNEX_LIST_B', label: 'IVD Annex II List B', group: 'In-vitro diagnostics' },
  { value: 'MARKETING', label: 'Marketing authorisation' },
  { value: 'CQC', label: 'Care Quality Commission (CQC) registration' },
  { value: 'DTAC', label: 'Digital Technology Assessment Criteria (DTAC)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRegulationDescription', dataType: 'text', label: 'Other standards and certifications that apply', validations: { isRequired: [true, 'Other standards and certifications is required'] } }) }
];
export const standardsHasMetItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m in the process of gaining approval' },
  { value: 'NOT_YET', label: 'Not yet' },
];


// Section 5
// // Section 5.1
export const hasUKPathwayKnowledgeItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];
export const innovationPathwayKnowledgeItems = [
  { value: 'PATHWAY_EXISTS_AND_CHANGED', label: 'There is a pathway, and my innovation changes it' },
  { value: 'PATHWAY_EXISTS_AND_FITS', label: 'There is a pathway, and my innovation fits in it' },
  { value: 'NO_PATHWAY', label: 'There is no current care pathway' }
];
export const carePathwayItems = [
  { value: 'ONLY_OPTION', label: 'The only option, or first of its kind' },
  { value: 'BETTER_OPTION', label: 'A better option to those that already exist' },
  { value: 'EQUIVALENT_OPTION', label: 'An equivalent option to those that already exist' },
  { value: 'FIT_LESS_COSTS', label: 'Fit for purpose and costs less' },
  { value: 'NO_KNOWLEDGE', label: 'I don\'t know' }
];

// // Section 5.2
export const hasTestsItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROCESS', label: 'I\'m in the process of testing with users' },
  { value: 'NOT_YET', label: 'Not yet' }
];


// Section 6
// // Section 6.1
export const hasCostKnowledgeItems = [
  { value: 'DETAILED_ESTIMATE', label: 'Yes, I have a detailed estimate' },
  { value: 'ROUGH_IDEA', label: 'Yes, I have a rough idea' },
  { value: 'NO', label: 'No' }
];
export const patientRangeItems = [
  { value: 'UP_10000', label: 'Up to 10,000 per year' },
  { value: 'BETWEEN_10000_500000', label: '10,000 to half a million per year' },
  { value: 'MORE_THAN_500000', label: 'More than half a million per year' },
  { value: 'NOT_SURE', label: 'I\'m not sure' },
  { value: 'NOT_RELEVANT', label: 'Not relevant to my innovation' }
];

// // Section 6.2
export const costComparisonItems = [
  { value: 'CHEAPER', label: 'My innovation is cheaper to purchase' },
  { value: 'COSTS_MORE_WITH_SAVINGS', label: 'My innovation costs more to purchase but has greater benefits that will lead to overall cost savings' },
  { value: 'COSTS_MORE', label: 'My innovation costs more to purchase and has greater benefits but will lead to higher costs overall' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


// Section 7
// // Section 7.1
export const hasRevenueModelItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];
export const revenuesItems = [
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'DIRECT_PRODUCT_SALES', label: 'Direct product sales' },
  { value: 'FEE_FOR_SERVICE', label: 'Fee for service' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'SALES_OF_CONSUMABLES_OR_ACCESSORIES', label: 'Sales of consumables or accessories' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRevenueDescription', dataType: 'text', label: 'Other revenue model', validations: { isRequired: [true, 'Other revenue model is required'] } })
  }
];
export const hasFundindItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];


// Section 8
// // Section 8.1
export const hasDeployPlanItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const hasResourcesToScaleItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];
