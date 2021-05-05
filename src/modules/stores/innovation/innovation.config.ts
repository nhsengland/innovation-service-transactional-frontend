import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core';
import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionsIds } from './innovation.models';

// Add/remove new steps for each subgroup defined on step 2.
function group_2_1_rules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

  if (currentStep < 2) { return; }

  if (currentStep > 2) { // Updates subgroups.conditions value.

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      const index = Number(key.split('_')[1]);
      currentValues.subgroups[index].conditions = currentValues[key];
    });

    return;
  }

  // Here, we are on step 2, where most things can change.

  // // Removes all steps behond step 2, and removes root parameters 'subGroupName_*' values.
  steps.splice(2);
  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    delete currentValues[key];
  });

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


  // console.log('DATA', parsedData);
  return parsedData;

}




export const INNOVATION_SECTIONS: {
  title: string;
  sections: {
    id: InnovationSectionsIds;
    title: string;
    wizard: WizardEngineModel;
  }[];
}[] = [

    // Section group 01.
    {
      title: 'About your product or service',
      sections: [

        { id: InnovationSectionsIds.INNOVATION_DESCRIPTION, title: 'Description of innovation', wizard: new WizardEngineModel({}) },
        { id: InnovationSectionsIds.VALUE_PROPOSITION, title: 'Value proposition', wizard: new WizardEngineModel({}) }
      ]
    },


    // Section Group 02.
    {
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
            outboundParsing: (data: any) => group_2_1_outboundParsing(data)
          })
        },

        { id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS, title: 'Detailed understanding of benefits', wizard: new WizardEngineModel({}) },
        { id: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS, title: 'Evidence documents', wizard: new WizardEngineModel({}) }
      ]
    }

  ];
