import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core';
import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


export const SECTION_2_CONFIG: InnovationSectionConfigType = {
  title: 'Needs, benefits and effectiveness',
  sections: [
    {
      id: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS,
      title: 'Detailed understanding of needs',
      wizard: new WizardEngineModel({
        steps: [
          new FormEngineModel({
            label: 'Do you know yet what patient population or subgroup your innovation will affect?',
            description: 'We\'re asking this to get a better understanding of who would benefit from your innovation.',
            parameters: [{
              id: 'hasSubgroups',
              dataType: 'radio-group',
              validations: { isRequired: true },
              items: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'notRelevant', label: 'Not relevant' }
              ]
            }]
          }),
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
        ],
        runtimeRules: [(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number) => group_2_1_rules(steps, currentValues, currentStep)],
        inboundParsing: (data: any) => group_2_1_inboundParsing(data),
        outboundParsing: (data: any) => group_2_1_outboundParsing(data),
        summaryParsing: (steps: FormEngineModel[], data: any) => group_2_1_summaryParsing(steps, data)
      })
    },

    {
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
    },

    {
      id: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS,
      title: 'Evidence of effectiveness',
      wizard: new WizardEngineModel({
        steps: [
          // new FormEngineModel({
          //   label: 'Do you have evidence of effectiveness for your innovation?',
          //   parameters: [{
          //     id: 'hasEvidence',
          //     dataType: 'radio-group',
          //     validations: { isRequired: true },
          //     items: [
          //       { value: 'yes', label: 'Yes' },
          //       { value: 'no', label: 'No' }
          //     ]
          //   }]
          // }),

          new FormEngineModel({
            label: 'Please upload any documents that support this evidence ',
            // description: 'We\'re asking this to get a better understanding of who would benefit from your innovation.',
            parameters: [{
              id: 'evidenceUpload',
              dataType: 'file-upload',
              validations: { isRequired: true },
              // fileUploadConfig: {allowedExtensions: [''], fileConfig}

            }]
          })
        ],
      })
    }
  ]
};



// type coiso = {
//   id: string;
//   hasSubgroups: 'yes' | 'no' | 'notRelevant';
//   subgroups: {
//     id: string;
//     name: string;
//     conditions: string;
//   }[];
// }

// Add/remove new steps for each subgroup defined on step 2.
function group_2_1_rules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

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


function group_2_1_inboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  (parsedData.subgroups as { id: string, name: string, conditions: string }[] || []).forEach((item, i) => {
    parsedData[`subGroupName_${i}`] = item.conditions;
  });

  // console.log('DATA', parsedData);
  return parsedData;

}


function group_2_1_outboundParsing(data: any): MappedObject {

  const parsedData = cloneDeep(data);

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete parsedData[key];
  });

  return parsedData;

}

function group_2_1_summaryParsing(steps: FormEngineModel[], data: any): { label: string, value: string, stepNumber: number }[] {

  const toReturn = [];

  toReturn.push({
    label: SECTION_2_CONFIG.sections[0].wizard.steps[0].label || '',
    value: SECTION_2_CONFIG.sections[0].wizard.steps[0].parameters[0].items?.find(item => item.value === data.hasSubgroups)?.label || '',
    stepNumber: 1
  });

  if (['yes'].includes(data.hasSubgroups)) {
    toReturn.push({
      label: SECTION_2_CONFIG.sections[0].wizard.steps[1].label || '',
      value: (data.subgroups as { id: string, name: string, conditions: string }[])?.map(group => group.name).join('<br />'),
      stepNumber: 2
    });

    (data.subgroups as { id: string, name: string, conditions: string }[]).forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} condition`, value: item.conditions, stepNumber: i + 3 });
    });

  }

  return toReturn;

}






// type coiso = {
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

function group_2_2_summaryParsing(steps: FormEngineModel[], data: any): { label: string, value: string, stepNumber: number }[] {

  const toReturn = [];

  toReturn.push({
    label: SECTION_2_CONFIG.sections[1].wizard.steps[0].label || '',
    value: SECTION_2_CONFIG.sections[1].wizard.steps[0].parameters[0].items?.find(item => item.value === data.hasBenefits)?.label || '',
    stepNumber: 1
  });

  if (['yes'].includes(data.hasBenefits)) {

    (data.subgroups as { id: string, name: string, benefits: string }[]).forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} benefit`, value: item.benefits, stepNumber: i + 2 });
    });

    toReturn.push({
      label: 'What benefits does your innovation create for the NHS or social care?',
      value: data.benefits,
      stepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}
