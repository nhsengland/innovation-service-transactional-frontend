import { FormEngineModel, FormEngineParameterModel, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

const stepsLabels = {
  s_1_1_1: 'Please provide a short description of your innovation',
  s_1_1_2: 'Do you have a working product, service or prototype?',
  s_1_1_3: 'Choose all categories that can be used to describe your innovation',
  s_1_1_4: 'Is your innovation relevant to any of the following areas?',
  s_1_1_5: 'Which clinical areas does your innovation impact on?',
  s_1_1_6: 'In which care settings is your innovation relevant?',
  s_1_1_7: 'What\'s the main purpose of your innovation?'
};


const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const categoriesItems = [
  { value: 'MEDICAL_DEVICE', label: 'Medical device' },
  { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
  { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
  { value: 'AI', label: 'Artificial intelligence (AI)' },
  { value: 'EDUCATION', label: 'Education or training of workforce' },
  { value: 'PPE', label: 'Personal protective equipment (PPE)' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherCategoryDescription', dataType: 'text', validations: { isRequired: true } })
  }
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

export const SECTION_1_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.INNOVATION_DESCRIPTION,
  title: 'Description of innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_1_1_1,
        parameters: [
          {
            id: 'description',
            dataType: 'textarea',
            label: 'Enter a description',
            validations: { isRequired: true }
          }
        ]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_2,
        description: 'By this, we mean something that performs the same function that the final product or service would.',
        parameters: [{
          id: 'hasFinalProduct',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_3,
        parameters: [{
          id: 'categories',
          dataType: 'checkbox-array',
          validations: { isRequired: true },
          items: categoriesItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_4,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{
          id: 'areas',
          dataType: 'checkbox-array',
          validations: { isRequired: true },
          items: areasItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_5,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{
          id: 'clinicalAreas',
          dataType: 'checkbox-array',
          validations: { isRequired: true },
          items: clinicalAreasItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_6,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{
          id: 'careSettings',
          dataType: 'checkbox-array',
          validations: { isRequired: true },
          items: careSettingsItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_7,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        parameters: [{
          id: 'mainPurpose',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: mainPurposeItems
        }]
      })
    ],
    // runtimeRules: [(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number) => group_2_1_rules(steps, currentValues, currentStep)],
    // inboundParsing: (data: any) => group_2_1_inboundParsing(data),
    // outboundParsing: (data: any) => group_2_1_outboundParsing(data),
    summaryParsing: (steps: FormEngineModel[], data: any) => summaryParsing(steps, data)
  })
};



type summaryData = {
  id?: string;
  description: string;
  hasFinalProduct: string;
  categories: string[];
  otherCategoryDescription: string;
  areas: string[];
  clinicalAreas: string[];
  careSettings: string[];
  mainPurpose: string;
};

function summaryParsing(steps: FormEngineModel[], data: summaryData): { label: string, value: string, editStepNumber: number }[] {

  return [
    {
      label: stepsLabels.s_1_1_1,
      value: data.description,
      editStepNumber: 1
    },
    {
      label: stepsLabels.s_1_1_2,
      value: yesOrNoItems.find(item => item.value === data.hasFinalProduct)?.label || '',
      editStepNumber: 2
    },
    {
      label: stepsLabels.s_1_1_3,
      value: data.categories.map(v => categoriesItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 3
    },
    {
      label: stepsLabels.s_1_1_4,
      value: [
        ...data.areas.map(v => areasItems.find(item => item.value === v)?.label),
        ...[data.otherCategoryDescription]
      ].filter(item => item).join('<br />'),
      editStepNumber: 4
    },
    {
      label: stepsLabels.s_1_1_5,
      value: data.clinicalAreas.map(v => clinicalAreasItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 5
    },
    {
      label: stepsLabels.s_1_1_6,
      value: data.careSettings.map(v => careSettingsItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 6
    },
    {
      label: stepsLabels.s_1_1_6,
      value: mainPurposeItems.find(item => item.value === data.mainPurpose)?.label || '',
      editStepNumber: 7
    }
  ];

}



