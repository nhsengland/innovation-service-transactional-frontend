import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';
import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';
import { areasItems, careSettingsItems, categoriesItems, clinicalAreasItems, hasFinalProductItems, mainCategoryItems, mainPurposeItems, supportTypesItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'What is the name of your innovation?',
  l2: 'Please provide a short description of your innovation',
  l3: 'Where are you developing your innovation?',
  l4: 'Do you have a working product, service or prototype?',
  l5: 'Choose all categories that can be used to describe your innovation',
  l6: 'If you had to select one primary category to describe your innovation, which one would it be?',
  l7: 'Is your innovation relevant to any of the following areas?',
  l8: 'Which clinical areas does your innovation impact on?',
  l9: 'In which care settings is your innovation relevant?',
  l10: 'What\'s the main purpose of your innovation?',
  l11: 'What type of support are you currently looking for?',
  l12: 'Provide further information about what support you are seeking from the NHS Innovation Service.'
};


// Types.
type InboundPayloadType = {
  name: string;
  description: string;
  location: string;
  postcode: null | string;
  countryName: string;
  hasFinalProduct: null | 'YES' | 'NO';
  categories: ('MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER')[];
  otherCategoryDescription: string;
  mainCategory: null | 'MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER';
  otherMainCategoryDescription: string;
  areas: ('COVID_19' | 'DATA_ANALYTICS_AND_RESEARCH' | 'DIGITALISING_SYSTEM' | 'IMPROVING_SYSTEM_FLOW' | 'INDEPENDENCE_AND_PREVENTION' | 'OPERATIONAL_EXCELLENCE' | 'PATIENT_ACTIVATION_AND_SELF_CARE' | 'PATIENT_SAFETY' | 'WORKFORCE_OPTIMISATION')[];
  clinicalAreas: ('ACUTE' | 'AGEING' | 'CANCER' | 'CARDIO_ENDOCRINE_METABOLIC' | 'CHILDREN_AND_YOUNG' | 'DISEASE_AGNOSTIC' | 'GASTRO_KDNEY_LIVER' | 'INFECTION_INFLAMATION' | 'MATERNITY_REPRODUCTIVE_HEALTH' | 'MENTAL_HEALTH' | 'NEUROLOGY' | 'POPULATION_HEALTH' | 'RESPIRATORY' | 'UROLOGY' | 'WORKFORCE_AND_EDUCATION')[];
  careSettings: ('AMBULANCE_OR_PARAMEDIC' | 'COMMUNITY' | 'HOSPITAL_INPATIENT' | 'HOSPITAL_OUTPATIENT' | 'MENTAL_HEALTH' | 'PATIENT_HOME' | 'PHARMACY' | 'PRIMARY_CARE' | 'SOCIAL_CARE')[];
  mainPurpose: 'PREVENT_CONDITION' | 'PREDICT_CONDITION' | 'DIAGNOSE_CONDITION' | 'MONITOR_CONDITION' | 'PROVIDE_TREATMENT' | 'MANAGE_CONDITION' | 'ENABLING_CARE';
  supportTypes: ('ADOPTION' | 'ASSESSMENT' | 'PRODUCT_MIGRATION' | 'CLINICAL_TESTS' | 'COMMERCIAL' | 'PROCUREMENT' | 'DEVELOPMENT' | 'EVIDENCE_EVALUATION' | 'FUNDING' | 'INFORMATION')[];
  moreSupportDescription: string;
};
type StepPayloadType = {
  innovationName: string;
  description: string;
  location: string;
  englandPostCode: null | string;
  locationCountryName: string;
  hasFinalProduct: null | 'YES' | 'NO';
  categories: ('MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER')[];
  otherCategoryDescription: string;
  mainCategory: null | 'MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER';
  otherMainCategoryDescription: string;
  areas: ('COVID_19' | 'DATA_ANALYTICS_AND_RESEARCH' | 'DIGITALISING_SYSTEM' | 'IMPROVING_SYSTEM_FLOW' | 'INDEPENDENCE_AND_PREVENTION' | 'OPERATIONAL_EXCELLENCE' | 'PATIENT_ACTIVATION_AND_SELF_CARE' | 'PATIENT_SAFETY' | 'WORKFORCE_OPTIMISATION')[];
  clinicalAreas: ('ACUTE' | 'AGEING' | 'CANCER' | 'CARDIO_ENDOCRINE_METABOLIC' | 'CHILDREN_AND_YOUNG' | 'DISEASE_AGNOSTIC' | 'GASTRO_KDNEY_LIVER' | 'INFECTION_INFLAMATION' | 'MATERNITY_REPRODUCTIVE_HEALTH' | 'MENTAL_HEALTH' | 'NEUROLOGY' | 'POPULATION_HEALTH' | 'RESPIRATORY' | 'UROLOGY' | 'WORKFORCE_AND_EDUCATION')[];
  careSettings: ('AMBULANCE_OR_PARAMEDIC' | 'COMMUNITY' | 'HOSPITAL_INPATIENT' | 'HOSPITAL_OUTPATIENT' | 'MENTAL_HEALTH' | 'PATIENT_HOME' | 'PHARMACY' | 'PRIMARY_CARE' | 'SOCIAL_CARE')[];
  mainPurpose: 'PREVENT_CONDITION' | 'PREDICT_CONDITION' | 'DIAGNOSE_CONDITION' | 'MONITOR_CONDITION' | 'PROVIDE_TREATMENT' | 'MANAGE_CONDITION' | 'ENABLING_CARE';
  supportTypes: ('ADOPTION' | 'ASSESSMENT' | 'PRODUCT_MIGRATION' | 'CLINICAL_TESTS' | 'COMMERCIAL' | 'PROCUREMENT' | 'DEVELOPMENT' | 'EVIDENCE_EVALUATION' | 'FUNDING' | 'INFORMATION')[];
  moreSupportDescription: string;
};
type OutboundPayloadType = Partial<InboundPayloadType>;


export const SECTION_1_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.INNOVATION_DESCRIPTION,
  title: 'Description of innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'innovationName',
          dataType: 'text',
          label: stepsLabels.l1,
          description: 'Enter the name of your innovation with a maximum of 100 characters',
          validations: { isRequired: [true, 'Innovation name is required'], maxLength: 100 },
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'description',
          dataType: 'textarea',
          label: stepsLabels.l2,
          validations: { isRequired: [true, 'Description is required'] },
          lengthLimit: 'medium'
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'location',
          dataType: 'radio-group',
          label: stepsLabels.l3,
          validations: { isRequired: [true, 'Choose one option'] }, items: locationItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'hasFinalProduct',
          dataType: 'radio-group',
          label: stepsLabels.l4,
          description: 'By this, we mean something that performs the same function that the final product or service would.',
          validations: { isRequired: [true, 'Choose one option'] }, items: hasFinalProductItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'categories',
          dataType: 'checkbox-array',
          label: stepsLabels.l5,
          validations: { isRequired: [true, 'Choose at least one category'] },
          items: categoriesItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'mainCategory',
          dataType: 'radio-group',
          label: stepsLabels.l6,
          description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
          items: mainCategoryItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'areas',
          dataType: 'checkbox-array',
          label: stepsLabels.l7,
          description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
          items: areasItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'clinicalAreas',
          dataType: 'checkbox-array',
          label: stepsLabels.l8,
          description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
          items: clinicalAreasItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'careSettings',
          dataType: 'checkbox-array',
          label: stepsLabels.l9,
          description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
          items: careSettingsItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'mainPurpose',
          dataType: 'radio-group',
          label: stepsLabels.l10,
          description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: mainPurposeItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'supportTypes',
          dataType: 'checkbox-array',
          label: stepsLabels.l11,
          description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
          validations: { isRequired: [true, 'Choose at least one type of support'] },
          items: supportTypesItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'moreSupportDescription',
          dataType: 'textarea',
          label: stepsLabels.l12,
          lengthLimit: 'medium'
        }]
      })
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovationName: data.name,
    description: data.description,
    location: locationItems.filter(item => !['', 'Based outside UK'].includes(item.value)).map(item => item.value).includes(data.countryName) ? data.countryName : 'Based outside UK',
    englandPostCode: data.postcode ? data.postcode : '',
    locationCountryName: data.countryName,
    hasFinalProduct: data.hasFinalProduct,
    categories: data.categories,
    otherCategoryDescription: data.otherCategoryDescription,
    mainCategory: data.mainCategory,
    otherMainCategoryDescription: data.otherMainCategoryDescription,
    areas: data.areas,
    clinicalAreas: data.clinicalAreas,
    careSettings: data.careSettings,
    mainPurpose: data.mainPurpose,
    supportTypes: data.supportTypes,
    moreSupportDescription: data.moreSupportDescription
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.innovationName,
    description: data.description,
    location: data.location || data.locationCountryName,
    postcode: data.englandPostCode,
    countryName: data.locationCountryName ? data.locationCountryName : data.location,
    hasFinalProduct: data.hasFinalProduct,
    categories: data.categories,
    otherCategoryDescription: data.otherCategoryDescription,
    mainCategory: data.mainCategory,
    otherMainCategoryDescription: data.otherMainCategoryDescription,
    areas: data.areas,
    clinicalAreas: data.clinicalAreas,
    careSettings: data.careSettings,
    mainPurpose: data.mainPurpose,
    supportTypes: data.supportTypes,
    moreSupportDescription: data.moreSupportDescription
  };

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  return [
    {
      label: stepsLabels.l1,
      value: data.innovationName,
      editStepNumber: 1
    },
    {
      label: stepsLabels.l2,
      value: data.description,
      editStepNumber: 2
    },
    {
      label: stepsLabels.l3,
      value: `${data.locationCountryName || data.location}${data.englandPostCode ? ', ' + data.englandPostCode : ''}`,
      editStepNumber: 3
    },
    {
      label: stepsLabels.l4,
      value: hasFinalProductItems.find(item => item.value === data.hasFinalProduct)?.label,
      editStepNumber: 4
    },
    {
      label: stepsLabels.l5,
      value: data.categories?.map(v => v === 'OTHER' ? data.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: 5
    },
    {
      label: stepsLabels.l6,
      value: data.otherMainCategoryDescription || mainCategoryItems.find(item => item.value === data.mainCategory)?.label,
      editStepNumber: 6
    },
    {
      label: stepsLabels.l7,
      value: data.areas?.map(v => areasItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: 7
    },
    {
      label: stepsLabels.l8,
      value: data.clinicalAreas?.map(v => clinicalAreasItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: 8
    },
    {
      label: stepsLabels.l9,
      value: data.careSettings?.map(v => careSettingsItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: 9
    },
    {
      label: stepsLabels.l10,
      value: mainPurposeItems.find(item => item.value === data.mainPurpose)?.label,
      editStepNumber: 10
    },
    {
      label: stepsLabels.l11,
      value: data.supportTypes?.map(v => supportTypesItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: 11
    },
    {
      label: stepsLabels.l12,
      value: data.moreSupportDescription,
      editStepNumber: 12
    }
  ];

}
