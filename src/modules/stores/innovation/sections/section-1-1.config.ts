import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { locationItems } from '../config/innovation-catalog.config';
import { areasItems, careSettingsItems, categoriesItems, hasFinalProductItems, mainCategoryItems, mainPurposeItems, supportTypesItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'What is the name of your innovation?',
  l2: 'Please provide a short description of your innovation',
  l3: 'Where are you developing your innovation?',
  l4: 'Do you have a working product, service or prototype?',
  l5: 'Choose all the categories that can be used to describe your innovation',
  l6: 'If you had to select one primary category to describe your innovation, which one would it be?',
  l7: 'Is your innovation relevant to any of the following areas?',
  l8: 'In which care settings is your innovation relevant?',
  l9: 'What\'s the main purpose of your innovation?',
  l10: 'What type of support are you currently looking for?',
  l11: 'Please provide any further information about the support you are seeking from the NHS Innovation Service'
};

// Types.
type BaseType = {
  name: string,
  description: string,
  location: string,
  postcode: null | string,
  countryName: string,
  hasFinalProduct: null | 'YES' | 'NO',
  categories: ('MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER')[],
  otherCategoryDescription: null | string,
  mainCategory: null | 'MEDICAL_DEVICE' | 'PHARMACEUTICAL' | 'DIGITAL' | 'AI' | 'EDUCATION' | 'PPE' | 'OTHER',
  otherMainCategoryDescription: null | string,
  areas: ('WORKFORCE' | 'ECONOMIC_GROWTH' | 'EVIDENCE_GENERATION' | 'TRANSFORMED_OUT_OF_HOSPITAL_CARE' | 'REDUCIND_PRESSURE_EMERGENCY_HOSPITAL_SERVICES' | 'CONTROL_OVER_THEIR_OWN_HEALTH' | 'DIGITALLY_ENABLING_PRIMARY_CARE' | 'CANCER' | 'MENTAL_HEALTH' | 'CHILDREN_AND_YOUNG_PEOPLE' | 'LEARNING_DISABILITIES_AND_AUTISM' | 'CARDIOVASCULAR_DISEASE' | 'STROKE_CARE' | 'DIABETES' | 'RESPIRATORY' | 'RESEARCH_INNOVATION_DRIVE_FUTURE_OUTCOMES' | 'GENOMICS' | 'WIDER_SOCIAL_IMPACT' | 'REDUCING_VARIATION_ACROSS_HEALTH_SYSTEM' | 'FINANCIAL_PLANNING_ASSUMPTIONS' | 'COVID_19' | 'DATA_ANALYTICS_AND_RESEARCH' | 'IMPROVING_SYSTEM_FLOW' | 'INDEPENDENCE_AND_PREVENTION' | 'OPERATIONAL_EXCELLENCE' | 'PATIENT_ACTIVATION_AND_SELF_CARE' | 'PATIENT_SAFETY' | 'GREATER_SUPPORT_AND_RESOURCE_PRIMARY_CARE')[],
  careSettings: ('STP_ICS' | 'CCGS' | 'ACUTE_TRUSTS_INPATIENT' | 'ACUTE_TRUSTS_OUTPATIENT' | 'PRIMARY_CARE' | 'MENTAL_HEALTH' | 'AMBULANCE' | 'SOCIAL_CARE' | 'INDUSTRY' | 'COMMUNITY' | 'ACADEMIA' | 'DOMICILIARY_CARE' | 'PHARMACY' | 'URGENT_AND_EMERGENCY' | 'OTHER')[],
  otherCareSetting: null | string,
  mainPurpose: null | 'PREVENT_CONDITION' | 'PREDICT_CONDITION' | 'DIAGNOSE_CONDITION' | 'MONITOR_CONDITION' | 'PROVIDE_TREATMENT' | 'MANAGE_CONDITION' | 'ENABLING_CARE',
  supportTypes: ('ADOPTION' | 'ASSESSMENT' | 'PRODUCT_MIGRATION' | 'CLINICAL_TESTS' | 'COMMERCIAL' | 'PROCUREMENT' | 'DEVELOPMENT' | 'EVIDENCE_EVALUATION' | 'FUNDING' | 'INFORMATION')[],
  moreSupportDescription: null | string
};

type InboundPayloadType = Partial<BaseType>;

type StepPayloadType = Omit<BaseType, 'name' | 'postcode' | 'countryName'> & {
  innovationName: string,
  englandPostCode: null | string,
  locationCountryName: string
};

type OutboundPayloadType = BaseType;


export const SECTION_1_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.INNOVATION_DESCRIPTION,
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
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data),
    showSummary: true
  })
};

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(5);

  if (data.categories.length === 0) {
    data.mainCategory = null;
  } else if (data.categories.length === 1) {
    data.mainCategory = data.categories[0];
  } else {

    const selectedCategories = mainCategoryItems.filter(category => data.categories.some(e => e === category.value));

    if (data.mainCategory !== null && !data.categories.includes(data.mainCategory)) {
      data.mainCategory = null;
    }
    
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'mainCategory',
          dataType: 'radio-group',
          label: stepsLabels.l6,
          description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: selectedCategories
        }]
      })
    );

  }

  steps.push(
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
        id: 'careSettings',
        dataType: 'checkbox-array',
        label: stepsLabels.l8,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        items: careSettingsItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'mainPurpose',
        dataType: 'radio-group',
        label: stepsLabels.l9,
        description: 'We\'re asking this so that we can find the organisations and people who are in the best position to support you.',
        validations: { isRequired: [true, 'Choose one option'] },
        items: mainPurposeItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'supportTypes',
        dataType: 'checkbox-array',
        label: stepsLabels.l10,
        description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
        validations: { isRequired: [true, 'Choose at least one type of support'], max: [5, 'Maximum 5 options'] },
        items: supportTypesItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'moreSupportDescription',
        dataType: 'textarea',
        label: stepsLabels.l11,
        lengthLimit: 'medium'
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovationName: data.name ?? '',
    description: data.description ?? '',
    location: data.countryName && locationItems.filter(item => !['', 'Based outside UK'].includes(item.value)).map(item => item.value).includes(data.countryName) ? data.countryName : 'Based outside UK',
    englandPostCode: data.postcode || null,
    locationCountryName: data.countryName ?? '',
    hasFinalProduct: data.hasFinalProduct ?? null,
    categories: data.categories ?? [],
    otherCategoryDescription: data.otherCategoryDescription ?? null,
    mainCategory: data.mainCategory ?? null,
    otherMainCategoryDescription: data.otherMainCategoryDescription ?? null,
    areas: data.areas ?? [],
    careSettings: data.careSettings ?? [],
    otherCareSetting: data.otherCareSetting ?? null,
    mainPurpose: data.mainPurpose ?? null,
    supportTypes: data.supportTypes ?? [],
    moreSupportDescription: data.moreSupportDescription ?? null
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
    careSettings: data.careSettings,
    otherCareSetting: data.otherCareSetting,
    mainPurpose: data.mainPurpose,
    supportTypes: data.supportTypes,
    moreSupportDescription: data.moreSupportDescription
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push(
    {
      label: stepsLabels.l1,
      value: data.innovationName,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l2,
      value: data.description,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l3,
      value: `${data.locationCountryName || data.location}${data.englandPostCode ? ', ' + data.englandPostCode : ''}`,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l4,
      value: hasFinalProductItems.find(item => item.value === data.hasFinalProduct)?.label,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l5,
      value: data.categories?.map(v => v === 'OTHER' ? data.otherCategoryDescription : categoriesItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: editStepNumber++
    });

  if (data.categories.length > 1) {
    toReturn.push({
      label: stepsLabels.l6,
      value: data.otherMainCategoryDescription || mainCategoryItems.find(item => item.value === data.mainCategory)?.label,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push(
    {
      label: stepsLabels.l7,
      value: data.areas?.map(v => areasItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l8,
      value: data.careSettings?.map(v => careSettingsItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l9,
      value: mainPurposeItems.find(item => item.value === data.mainPurpose)?.label,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l10,
      value: data.supportTypes?.map(v => supportTypesItems.find(item => item.value === v)?.label).join('\n'),
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l11,
      value: data.moreSupportDescription,
      editStepNumber: editStepNumber++
    }
  );

  return toReturn;

}



function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
