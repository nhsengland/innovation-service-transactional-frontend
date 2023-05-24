import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202209 } from './document.types';
import { areasItems, careSettingsItems, categoriesItems, hasFinalProductItems, locationItems, mainCategoryItems, mainPurposeItems, supportTypesItems } from './forms.config';


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
type InboundPayloadType = DocumentType202209['INNOVATION_DESCRIPTION'];
type StepPayloadType = InboundPayloadType & { location: string };
type OutboundPayloadType = InboundPayloadType;


export const SECTION_1_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'INNOVATION_DESCRIPTION',
  title: 'Description of innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l1,
          description: 'Enter the name of your innovation with a maximum of 100 characters',
          validations: { isRequired: [true, 'Innovation name is required'], maxLength: 100 }
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'description',
          dataType: 'textarea',
          label: stepsLabels.l2,
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'location',
          dataType: 'radio-group',
          label: stepsLabels.l3,
          validations: { isRequired: [true, 'Choose one option'] },
          items: locationItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'hasFinalProduct',
          dataType: 'radio-group',
          label: stepsLabels.l4,
          description: 'This means something that performs or demonstrates the same function that the final product or service would.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasFinalProductItems
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
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(5);

  if (currentValues.categories?.length === 0) {
    delete currentValues.mainCategory;
  } else if (currentValues.categories?.length === 1) {
    currentValues.mainCategory = currentValues.categories[0];
  } else {

    const selectedCategories = mainCategoryItems.filter(category => currentValues.categories?.some(e => e === category.value));

    if (currentValues.mainCategory && !currentValues.categories?.includes(currentValues.mainCategory)) {
      delete currentValues.mainCategory;
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
        description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the Innovation Service.',
        validations: { isRequired: [true, 'Choose at least one type of support'], max: [5, 'Maximum 5 options'] },
        items: supportTypesItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'moreSupportDescription',
        dataType: 'textarea',
        label: stepsLabels.l11,
        lengthLimit: 's'
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    ...data,
    location: data.countryName && locationItems.filter(item => !['', 'Based outside UK'].includes(item.value)).map(item => item.value).includes(data.countryName) ? data.countryName : 'Based outside UK'
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.name,
    description: data.description,
    postcode: data.postcode,
    countryName: data.countryName ? data.countryName : data.location,
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
      value: data.name,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l2,
      value: data.description,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l3,
      value: `${data.countryName || data.location}${data.postcode ? ', ' + data.postcode : ''}`,
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

  if (data.categories && data.categories.length > 1) {
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
