import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';



const stepsLabels = {
  s_6_2_1: 'Do you know what cost savings your innovation would create?',
  s_6_2_2: 'Do you know the cost of care as it\'s currently given?'
};


const hasCostKnowledgeItems = [
  { value: 'DETAILED_ESTIMATE', label: 'Yes, I have a detailed estimate' },
  { value: 'ROUGH_IDEA', label: 'Yes, I have a rough idea' },
  { value: 'NO', label: 'No' }
];

const costComparisonItems = [
  { value: 'CHEAPER', label: 'My innovation is cheaper to purchase' },
  { value: 'COSTS_MORE_WITH_SAVINGS', label: 'My innovation costs more to purchase but has greater benefits that will lead to overall cost savings' },
  { value: 'COSTS_MORE', label: 'My innovation costs more to purchase and has greater benefits but will lead to higher costs overall' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


type apiPayload = {
  id?: string;
  hasCostSavingKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  hasCostCareKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  subgroups: {
    id: string;
    name: string;
    costComparison: null | 'CHEAPER' | 'COSTS_MORE_WITH_SAVINGS' | 'COSTS_MORE' | 'NOT_SURE';
  }[];
};
// [key: string] is needed to support subGroupName_${number} properties.
type stepPayload = apiPayload & { [key: string]: null | string };



export const SECTION_6_2: InnovationSectionConfigType['sections'][0] = {

  id: InnovationSectionsIds.COMPARATIVE_COST_BENEFIT,
  title: 'Comparative cost benefit',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_6_2_1,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [{
          id: 'hasCostSavingKnowledge',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: hasCostKnowledgeItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_6_2_2,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [{
          id: 'hasCostCareKnowledge',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: hasCostKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: apiPayload) => inboundParsing(data),
    outboundParsing: (data: stepPayload) => outboundParsing(data),
    summaryParsing: (steps: FormEngineModel[], data: stepPayload) => summaryParsing(steps, data)
  })
};




function runtimeRules(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number): void {

  if (['NO'].includes(currentValues.hasCostCareKnowledge || 'NO')) {
    steps.splice(2);
    currentValues.subgroups = currentValues.subgroups.map(item => ({
      id: item.id, name: item.name, costComparison: null
    }));

    Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => { delete currentValues[key]; });

    return;
  }


  // // Removes all steps behond step 2, and removes root parameters 'subGroupName_*' values.
  steps.splice(2);
  Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].costComparison = currentValues[key] as any;
    delete currentValues[key];
  });

  (currentValues.subgroups || []).forEach((item, i) => {

    steps.push(
      new FormEngineModel({
        label: `What are the costs associated with use of your innovation, compared to current practice in the UK for ${item.name}?`,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [
          { id: `subGroupCostComparison_${i}`, dataType: 'radio-group', validations: { isRequired: true }, items: costComparisonItems }
        ]
      })
    );

    currentValues[`subGroupCostComparison_${i}`] = item.costComparison;

  });

}


function inboundParsing(data: apiPayload): MappedObject {

  const parsedData = cloneDeep(data) as stepPayload;

  (parsedData.subgroups || []).forEach((item, i) => {
    parsedData[`subGroupCostComparison_${i}`] = item.costComparison;
  });

  return parsedData;

}


function outboundParsing(data: stepPayload): MappedObject {

  const parsedData = cloneDeep(data);

  Object.keys(parsedData).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => { delete parsedData[key]; });

  return parsedData;

}


function summaryParsing(steps: FormEngineModel[], data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_6_2_1,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostSavingKnowledge)?.label || '',
    editStepNumber: 1
  });

  toReturn.push({
    label: stepsLabels.s_6_2_2,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostCareKnowledge)?.label || '',
    editStepNumber: 2
  });

  if (!['NO'].includes(data.hasCostCareKnowledge || 'NO')) {

    data.subgroups.forEach(subgroup => {
      toReturn.push({
        label: `Group ${subgroup.name} innovation cost`,
        value: costComparisonItems.find(item => item.value === subgroup.costComparison)?.label || '',
        editStepNumber: toReturn.length + 1
      });
    });
  }

  return toReturn;

}
