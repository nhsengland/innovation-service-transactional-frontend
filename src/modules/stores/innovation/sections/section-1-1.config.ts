import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Please provide a short description of your innovation',
  l2: 'Do you have a working product, service or prototype?',
  l3: 'Choose all categories that can be used to describe your innovation',
  l4: 'If you had to select one primary category to describe your innovation, which one would it be?',
  l5: 'Is your innovation relevant to any of the following areas?',
  l6: 'Which clinical areas does your innovation impact on?',
  l7: 'In which care settings is your innovation relevant?',
  l8: 'What\'s the main purpose of your innovation?',
  l9: 'What type of support are you currently looking for?'
};


// Catalogs.
const hasFinalProductItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

const categoriesItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherCategoryDescription', dataType: 'text', validations: { isRequired: true } }) }
];

const mainCategoryItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherMainCategoryDescription', dataType: 'text', validations: { isRequired: true } }) }
];

const areasItems = [
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

const clinicalAreasItems = [
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

const careSettingsItems = [
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

const mainPurposeItems = [
  { value: 'PREVENT_CONDITION', label: 'Preventing a condition or symptom from happening or worsening' },
  { value: 'PREDICT_CONDITION', label: 'Predicting the occurence of a condition or symptom' },
  { value: 'DIAGNOSE_CONDITION', label: 'Diagnosing a condition' },
  { value: 'MONITOR_CONDITION', label: 'Monitoring a condition, treatment or therapy' },
  { value: 'PROVIDE_TREATMENT', label: 'Providing treatment or therapy' },
  { value: 'MANAGE_CONDITION', label: 'Managing a condition' },
  { value: 'ENABLING_CARE', label: 'Enabling care, services or communication' }
];

const supportTypesItems = [
  { value: 'ASSESSMENT', label: 'Adoption and health technology assessment' },
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


// Types.
type InboundPayloadType = {
  description: string;
  hasFinalProduct: null | 'YES' | 'NO';
  categories: ('MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER')[];
  otherCategoryDescription: string;
  mainCategory: null | 'MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER';
  otherMainCategoryDescription: string;
  areas: ('COVID_19' | 'DATA_ANALYTICS_AND_RESEARCH' | 'DIGITALISING_SYSTEM' | 'IMPROVING_SYSTEM_FLOW' | 'INDEPENDENCE_AND_PREVENTION' | 'OPERATIONAL_EXCELLENCE' | 'PATIENT_ACTIVATION_AND_SELF_CARE' | 'PATIENT_SAFETY' | 'WORKFORCE_OPTIMISATION')[];
  clinicalAreas: ('ACUTE' | 'AGEING' | 'CANCER' | 'CARDIO_ENDOCRINE_METABOLIC' | 'CHILDREN_AND_YOUNG' | 'DISEASE_AGNOSTIC' | 'GASTRO_KDNEY_LIVER' | 'INFECTION_INFLAMATION' | 'MATERNITY_REPRODUCTIVE_HEALTH' | 'MENTAL_HEALTH' | 'NEUROLOGY' | 'POPULATION_HEALTH' | 'RESPIRATORY' | 'UROLOGY' | 'WORKFORCE_AND_EDUCATION')[];
  careSettings: ('AMBULANCE_OR_PARAMEDIC' | 'COMMUNITY' | 'HOSPITAL_INPATIENT' | 'HOSPITAL_OUTPATIENT' | 'MENTAL_HEALTH' | 'PATIENT_HOME' | 'PHARMACY' | 'PRIMARY_CARE' | 'SOCIAL_CARE')[];
  mainPurpose: 'PREVENT_CONDITION' | 'PREDICT_CONDITION' | 'DIAGNOSE_CONDITION' | 'MONITOR_CONDITION' | 'PROVIDE_TREATMENT' | 'MANAGE_CONDITION' | 'ENABLING_CARE';
  supportTypes: ('ASSESSMENT' | 'PRODUCT_MIGRATION' | 'CLINICAL_TESTS' | 'COMMERCIAL' | 'PROCUREMENT' | 'DEVELOPMENT' | 'EVIDENCE_EVALUATION' | 'FUNDING' | 'INFORMATION')[];
};

type StepPayloadType = InboundPayloadType;



export const SECTION_1_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.INNOVATION_DESCRIPTION,
  title: 'Description of innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        parameters: [{ id: 'description', dataType: 'textarea', label: 'Enter a description', validations: { isRequired: true } }]
      }),
      new FormEngineModel({
        label: stepsLabels.l2,
        description: 'By this, we mean something that performs the same function that the final product or service would.',
        parameters: [{ id: 'hasFinalProduct', dataType: 'radio-group', validations: { isRequired: true }, items: hasFinalProductItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l3,
        parameters: [{ id: 'categories', dataType: 'checkbox-array', validations: { isRequired: true }, items: categoriesItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l4,
        description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
        parameters: [{ id: 'mainCategory', dataType: 'radio-group', validations: { isRequired: [true, 'Choose the category that best describes your innovation'] }, items: mainCategoryItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l5,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{ id: 'areas', dataType: 'checkbox-array', validations: { isRequired: true }, items: areasItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l6,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{ id: 'clinicalAreas', dataType: 'checkbox-array', validations: { isRequired: true }, items: clinicalAreasItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l7,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{ id: 'careSettings', dataType: 'checkbox-array', validations: { isRequired: true }, items: careSettingsItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l8,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{ id: 'mainPurpose', dataType: 'radio-group', validations: { isRequired: true }, items: mainPurposeItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l9,
        description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
        parameters: [{ id: 'supportTypes', dataType: 'checkbox-array', validations: { isRequired: [true, 'Choose at least one type of support'] }, items: supportTypesItems }]
      })
    ],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  return [
    {
      label: stepsLabels.l1,
      value: data.description,
      editStepNumber: 1
    },
    {
      label: stepsLabels.l2,
      value: hasFinalProductItems.find(item => item.value === data.hasFinalProduct)?.label,
      editStepNumber: 2
    },
    {
      label: stepsLabels.l3,
      value: data.categories.map(v =>
        v === 'OTHER' ? data.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label
      ).join('<br />'),
      editStepNumber: 3
    },
    {
      label: stepsLabels.l4,
      value: data.otherMainCategoryDescription || mainCategoryItems.find(item => item.value === data.mainCategory)?.label,
      editStepNumber: 4
    },
    {
      label: stepsLabels.l5,
      value: data.areas.map(v => areasItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 5
    },
    {
      label: stepsLabels.l6,
      value: data.clinicalAreas.map(v => clinicalAreasItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 6
    },
    {
      label: stepsLabels.l7,
      value: data.careSettings.map(v => careSettingsItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 7
    },
    {
      label: stepsLabels.l8,
      value: mainPurposeItems.find(item => item.value === data.mainPurpose)?.label,
      editStepNumber: 8
    },
    {
      label: stepsLabels.l9,
      value: data.supportTypes.map(v => supportTypesItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 9
    }
  ];

}
