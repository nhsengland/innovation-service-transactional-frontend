import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_1_1_1: 'Do you know yet what patient population or subgroup your innovation will affect?',
  s_1_1_2: 'What population or subgroup does this affect?'
};

const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notRelevant', label: 'Not relevant' }
];


export const SECTION_2_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS,
  title: 'Detailed understanding of needs',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_1_1_1,
        description: 'We\'re asking this to get a better understanding of who would benefit from your innovation.',
        parameters: [{
          id: 'hasSubgroups',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_2,
        description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how you innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
        parameters: [{
          id: 'subgroups',
          dataType: 'fields-group',
          // validations: { isRequired: true }
          fieldsGroupConfig: {
            fields: [
              { id: 'id', dataType: 'text', isVisible: false },
              { id: 'name', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } },
              { id: 'conditions', dataType: 'text', isVisible: false }
            ],
            addNewLabel: 'Add new population or subgroup'
          }
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
//   hasSubgroups: 'yes' | 'no' | 'notRelevant';
//   subgroups: {
//     id: string;
//     name: string;
//     conditions: string;
//   }[];
// }

// Add/remove new steps for each subgroup defined on step 2.
function runtimeRules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

  if (['no', 'notRelevant'].includes(currentValues.hasSubgroups)) {
    steps.splice(1);
    currentValues.subgroups = [];
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      delete currentValues[key];
    });
    return;
  }

  if (currentStep > 2) { // Updates subgroups.conditions value.

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      const index = Number(key.split('_')[1]);
      currentValues.subgroups[index].conditions = currentValues[key];
    });

    return;
  }

  // Here, we are on step 2, where most things can change.

  // // Removes all steps behond step 1, and removes root parameters 'subGroupName_*' values.
  steps.splice(1);
  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete currentValues[key];
  });

  steps.push(
    new FormEngineModel({
      label: 'What population or subgroup does this affect?',
      description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how you innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
      parameters: [{
        id: 'subgroups',
        dataType: 'fields-group',
        // validations: { isRequired: true }
        fieldsGroupConfig: {
          fields: [
            { id: 'id', dataType: 'text', isVisible: false },
            { id: 'name', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } },
            { id: 'conditions', dataType: 'text', isVisible: false }
          ],
          addNewLabel: 'Add new population or subgroup'
        }
      }]
    })
  );


  (currentValues.subgroups as { id: string, name: string, conditions: string }[] || []).forEach((item, i) => {

    const dynamicStep = new FormEngineModel({
      label: `What condition best categorises ${item.name}?`,
      parameters: [{ id: `subGroupName_${i}`, dataType: 'text', validations: { isRequired: true } }]
    });

    steps.push(dynamicStep);
    currentValues[`subGroupName_${i}`] = item.conditions;

  });

}


function inboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  (parsedData.subgroups as { id: string, name: string, conditions: string }[] || []).forEach((item, i) => {
    parsedData[`subGroupName_${i}`] = item.conditions;
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
  hasSubgroups: 'yes' | 'no' | 'notRelevant';
  subgroups: { id: string; name: string; conditions: string; }[];
};

function summaryParsing(steps: FormEngineModel[], data: summaryData): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_1_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasSubgroups)?.label || '',
    editStepNumber: 1
  });

  if (['yes'].includes(data.hasSubgroups)) {

    toReturn.push({
      label: stepsLabels.s_1_1_2,
      value: data.subgroups?.map(group => group.name).join('<br />'),
      editStepNumber: 2
    });

    (data.subgroups).forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} condition`, value: item.conditions, editStepNumber: i + 3 });
    });

  }

  return toReturn;

}



