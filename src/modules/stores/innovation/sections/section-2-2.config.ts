import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_1_1_1: 'Have you identified the specific benefits that your innovation would bring?',
  s_1_1_last: 'What benefits does your innovation create for the NHS or social care?'
};


const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notRelevant', label: 'Not relevant' }
];


export const SECTION_2_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS,
  title: 'Detailed understanding of benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_1_1_1,
        description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
        parameters: [{
          id: 'hasBenefits',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: any) => inboundParsing(data),
    outboundParsing: (data: any) => outboundParsing(data),
    summaryParsing: (steps: FormEngineModel[], data: any) => summaryParsing(steps, data)
  })
};


// type toType = {
//   id: string;
//   hasBenefits: 'yes' | 'no' | 'notRelevant';
//   subgroups: {
//     id: string;
//     name: string;
//     benefits: string;
//   }[];
// }

// Add/remove new steps for each subgroup defined on step 2.
function runtimeRules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

  if (['no', 'notRelevant'].includes(currentValues.hasBenefits)) {
    steps.splice(1);
    currentValues.subgroups = currentValues.subgroups.map((item: any) => {
      item.benefits = '';
      return item;
    });
    currentValues.benefits = '';

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      delete currentValues[key];
    });
    return;
  }


  if (currentStep > 1) { // Updates subgroups.benefits value.

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      const index = Number(key.split('_')[1]);
      currentValues.subgroups[index].benefits = currentValues[key];
    });

    return;
  }

  // Here, we are on step 2, where most things can change.

  // // Removes all steps behond step 2, and removes root parameters 'subGroupName_*' values.
  steps.splice(1);
  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete currentValues[key];
  });

  (currentValues.subgroups as { id: string, name: string, benefits: string }[] || []).forEach((item, i) => {

    const dynamicStep = new FormEngineModel({
      label: `What benefits does your innovation create for patients or citizens of ${item.name}?`,
      parameters: [{ id: `subGroupName_${i}`, dataType: 'textarea', validations: { isRequired: true } }]
    });

    steps.push(dynamicStep);
    currentValues[`subGroupName_${i}`] = item.benefits;

  });


  const lastStep = new FormEngineModel({
    label: stepsLabels. s_1_1_last,
    parameters: [{ id: 'benefits', dataType: 'textarea', validations: { isRequired: true } }]
  });
  steps.push(lastStep);

}


function inboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  (parsedData.subgroups as { id: string, name: string, benefits: string }[] || []).forEach((item, i) => {
    parsedData[`subGroupName_${i}`] = item.benefits;
  });

  return parsedData;

}


function outboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete parsedData[key];
  });

  return parsedData;

}



type summaryData = {
  id?: string;
  hasBenefits: 'yes' | 'no' | 'notRelevant';
  subgroups: { id: string; name: string; benefits: string; }[];
  benefits: string;
};

function summaryParsing(steps: FormEngineModel[], data: summaryData): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_1_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasBenefits)?.label || '',
    editStepNumber: 1
  });

  if (['yes'].includes(data.hasBenefits)) {

    (data.subgroups as { id: string, name: string, benefits: string }[]).forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} benefit`, value: item.benefits, editStepNumber: i + 2 });
    });

    toReturn.push({
      label: stepsLabels. s_1_1_last,
      value: data.benefits,
      editStepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}

