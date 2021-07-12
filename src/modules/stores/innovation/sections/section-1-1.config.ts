import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { areasItems, careSettingsItems, categoriesItems, clinicalAreasItems, hasFinalProductItems, mainCategoryItems, mainPurposeItems, supportTypesItems } from './catalogs.config';


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
      value: data.categories?.map(v =>
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
      value: data.areas?.map(v => areasItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 5
    },
    {
      label: stepsLabels.l6,
      value: data.clinicalAreas?.map(v => clinicalAreasItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 6
    },
    {
      label: stepsLabels.l7,
      value: data.careSettings?.map(v => careSettingsItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 7
    },
    {
      label: stepsLabels.l8,
      value: mainPurposeItems.find(item => item.value === data.mainPurpose)?.label,
      editStepNumber: 8
    },
    {
      label: stepsLabels.l9,
      value: data.supportTypes?.map(v => supportTypesItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 9
    }
  ];

}
