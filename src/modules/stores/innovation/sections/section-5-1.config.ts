import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_5_1_1: 'Do you know what the current care pathway (current practice) is across the UK?',
  s_5_1_2: 'What is the current care pathway in relation to your innovation?',
  s_5_1_3: 'Please describe the potential care pathway with your innovation in use'
};


const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const innovationPathwayKnowledgeItems = [
  { value: 'PATHWAY_EXISTS_AND_CHANGED', label: 'There is a pathway, and my innovation changes it' },
  { value: 'PATHWAY_EXISTS_AND_FITS', label: 'There is a pathway, and my innovation fits in it' },
  { value: 'NO_PATHWAY', label: 'There is no current care pathway' }
];

const carePathwayItems = [
  { value: 'ONLY_OPTION', label: 'The only option, or first of its kind' },
  { value: 'BETTER_OPTION', label: 'A better option to those that already exist' },
  { value: 'EQUIVALENT_OPTION', label: 'An equivalent option to those that already exist' },
  { value: 'FIT_LESS_COSTS', label: 'Fit for purpose and costs less' },
  { value: 'NO_KNOWLEDGE', label: 'I don\'t know' }
];


type apiPayload = {
  id?: string;
  hasUKPathwayKnowledge: 'yes' | 'no';
  innovationPathwayKnowledge: null | 'PATHWAY_EXISTS_AND_CHANGED' | 'PATHWAY_EXISTS_AND_FITS' | 'NO_PATHWAY'
  potentialPathway: null | string;
  subgroups: {
    id: string;
    name: string;
    carePathway: null | 'ONLY_OPTION' | 'BETTER_OPTION' | 'EQUIVALENT_OPTION' | 'FIT_LESS_COSTS' | 'NO_KNOWLEDGE';
  }[];
};

// [key: string] is needed to support subGroupName_${number} properties.
type stepPayload = apiPayload & { [key: string]: null | 'ONLY_OPTION' | 'BETTER_OPTION' | 'EQUIVALENT_OPTION' | 'FIT_LESS_COSTS' | 'NO_KNOWLEDGE' };



export const SECTION_5_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.CURRENT_CARE_PATHWAY,
  title: 'Current care pathway',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_5_1_1,
        description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
        parameters: [{
          id: 'hasUKPathwayKnowledge',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: apiPayload) => inboundParsing(data),
    outboundParsing: (data: stepPayload) => outboundParsing(data),
    summaryParsing: (data: stepPayload) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number): void {

  if (['no'].includes(currentValues.hasUKPathwayKnowledge)) {
    steps.splice(1);
    currentValues.innovationPathwayKnowledge = null;
    currentValues.subgroups = currentValues.subgroups.map(item => {
      item.carePathway = null;
      return item;
    });

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      delete currentValues[key];
    });
    return;
  }

  if (currentStep > 3) { // Updates subgroups.carePathway value.

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      const index = Number(key.split('_')[1]);
      currentValues.subgroups[index].carePathway = currentValues[key];
    });

    return;
  }

  // // Removes all steps behond step 2, and removes root parameters 'subGroupName_*' values.
  steps.splice(1);
  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete currentValues[key];
  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_5_1_2,
      parameters: [
        {
          id: 'innovationPathwayKnowledge',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: innovationPathwayKnowledgeItems
        }
      ]
    })
  );

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_5_1_3,
      parameters: [
        {
          id: 'potentialPathway',
          dataType: 'textarea',
          validations: { isRequired: true },
          items: innovationPathwayKnowledgeItems
        }
      ]
    })
  );

  (currentValues.subgroups || []).forEach((item, i) => {

    const dynamicStep = new FormEngineModel({
      label: `Thinking about the current care pathway in the UK ${item.name}, which option best describes your innovation?`,
      parameters: [
        {
          id: `subGroupName_${i}`,
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: carePathwayItems
        }
      ]
    });

    steps.push(dynamicStep);
    currentValues[`subGroupName_${i}`] = item.carePathway;

  });

}


function inboundParsing(data: apiPayload): MappedObject {

  const parsedData = cloneDeep(data) as stepPayload;

  (parsedData.subgroups || []).forEach((item, i) => {
    parsedData[`subGroupName_${i}`] = item.carePathway;
  });

  return parsedData;

}


function outboundParsing(data: stepPayload): MappedObject {

  const parsedData = cloneDeep(data);

  if (['no'].includes(data.hasUKPathwayKnowledge)) {

    data.innovationPathwayKnowledge = null;
    data.potentialPathway = null;
    data.subgroups = data.subgroups.map(item => {
      item.carePathway = null;
      return item;
    });

  }

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete parsedData[key];
  });

  return parsedData;

}


function summaryParsing(data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_5_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasUKPathwayKnowledge)?.label || '',
    editStepNumber: 1
  });

  if (['yes'].includes(data.hasUKPathwayKnowledge)) {

    toReturn.push({
      label: stepsLabels.s_5_1_2,
      value: innovationPathwayKnowledgeItems.find(item => item.value === data.innovationPathwayKnowledge)?.label || '',
      editStepNumber: 2
    });

    toReturn.push({
      label: stepsLabels.s_5_1_3,
      value: data.potentialPathway || '',
      editStepNumber: 3
    });

    data.subgroups.forEach((subgroup, i) => {
      toReturn.push({
        label: `Group ${subgroup.name} care pathway`,
        value: carePathwayItems.find(item => item.value === subgroup.carePathway)?.label || '',
        editStepNumber: i + 4
      });
    });

  }

  return toReturn;

}
