import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core';
import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

export const SECTION_2_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS,
  title: 'Detailed understanding of benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: 'Have you identified the specific benefits that your innovation would bring?',
        description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
        parameters: [{
          id: 'hasBenefits',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'notRelevant', label: 'Not relevant' }
          ]
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number) => group_2_2_rules(steps, currentValues, currentStep)],
    inboundParsing: (data: any) => group_2_2_inboundParsing(data),
    outboundParsing: (data: any) => group_2_2_outboundParsing(data),
    summaryParsing: (steps: FormEngineModel[], data: any) => group_2_2_summaryParsing(steps, data)
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
function group_2_2_rules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

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
    label: 'What benefits does your innovation create for the NHS or social care?',
    parameters: [{ id: 'benefits', dataType: 'textarea', validations: { isRequired: true } }]
  });
  steps.push(lastStep);

}


function group_2_2_inboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  (parsedData.subgroups as { id: string, name: string, benefits: string }[] || []).forEach((item, i) => {
    parsedData[`subGroupName_${i}`] = item.benefits;
  });

  // console.log('DATA', parsedData);
  return parsedData;

}


function group_2_2_outboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete parsedData[key];
  });

  return parsedData;

}

function group_2_2_summaryParsing(steps: FormEngineModel[], data: any): { label: string, value: string, editStepNumber: number }[] {

  const toReturn = [];

  toReturn.push({
    label: SECTION_2_2.wizard.steps[0].label || '',
    value: SECTION_2_2.wizard.steps[0].parameters[0].items?.find(item => item.value === data.hasBenefits)?.label || '',
    editStepNumber: 1
  });

  if (['yes'].includes(data.hasBenefits)) {

    (data.subgroups as { id: string, name: string, benefits: string }[]).forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} benefit`, value: item.benefits, editStepNumber: i + 2 });
    });

    toReturn.push({
      label: 'What benefits does your innovation create for the NHS or social care?',
      value: data.benefits,
      editStepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}

