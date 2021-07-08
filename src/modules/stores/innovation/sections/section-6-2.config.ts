import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { costComparisonItems, hasCostKnowledgeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know what cost savings your innovation would create?',
  l2: 'Do you know the cost of care as it\'s currently given?',
  l3: 'What are the costs associated with use of your innovation, compared to current practice in the UK?'
};


// Types.
type InboundPayloadType = {
  hasCostSavingKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  hasCostCareKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  costComparison: null | 'CHEAPER' | 'COSTS_MORE_WITH_SAVINGS' | 'COSTS_MORE' | 'NOT_SURE';
  subgroups: {
    id: string;
    name: string;
    costComparison: null | 'CHEAPER' | 'COSTS_MORE_WITH_SAVINGS' | 'COSTS_MORE' | 'NOT_SURE';
  }[];
};
// [key: string] is needed to support subGroupName_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

type OutboundPayloadType = InboundPayloadType;



export const SECTION_6_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.COMPARATIVE_COST_BENEFIT,
  title: 'Comparative cost benefit',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [{ id: 'hasCostSavingKnowledge', dataType: 'radio-group', validations: { isRequired: true }, items: hasCostKnowledgeItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l2,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [{ id: 'hasCostCareKnowledge', dataType: 'radio-group', validations: { isRequired: true }, items: hasCostKnowledgeItems }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number): void {

  steps.splice(2);

  if (['NO'].includes(currentValues.hasCostCareKnowledge || 'NO')) {
    currentValues.subgroups = currentValues.subgroups.map(item => ({ id: item.id, name: item.name, costComparison: null }));
    currentValues.costComparison = null;
    Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].costComparison = currentValues[key] as any;
    delete currentValues[key];
  });


  if (currentValues.subgroups.length === 0) {

    steps.push(
      new FormEngineModel({
        label: stepsLabels.l3,
        description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
        parameters: [{ id: 'costComparison', dataType: 'radio-group', validations: { isRequired: true }, items: costComparisonItems }]
      })
    );

  } else {

    (currentValues.subgroups || []).forEach((item, i) => {
      steps.push(
        new FormEngineModel({
          label: `What are the costs associated with use of your innovation, compared to current practice in the UK for ${item.name}?`,
          description: 'See [link to section in starter/advanced guide] (opens in new window) for more information about comparative cost benefit.',
          parameters: [{ id: `subGroupCostComparison_${i}`, dataType: 'radio-group', validations: { isRequired: true }, items: costComparisonItems }]
        })
      );
      currentValues[`subGroupCostComparison_${i}`] = item.costComparison;
    });

  }

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  (parsedData.subgroups || []).forEach((item, i) => { parsedData[`subGroupCostComparison_${i}`] = item.costComparison; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasCostSavingKnowledge: data.hasCostSavingKnowledge,
    hasCostCareKnowledge: data.hasCostCareKnowledge,
    costComparison: data.costComparison,
    subgroups: data.subgroups
  };

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostSavingKnowledge)?.label,
    editStepNumber: 1
  });

  toReturn.push({
    label: stepsLabels.l2,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostCareKnowledge)?.label,
    editStepNumber: 2
  });

  if (!['NO'].includes(data.hasCostCareKnowledge || 'NO')) {

    if (data.subgroups.length === 0) {

      toReturn.push({
        label: stepsLabels.l3,
        value: costComparisonItems.find(item => item.value === data.costComparison)?.label,
        editStepNumber: toReturn.length + 1
      });

    } else {

      data.subgroups?.forEach(subgroup => {
        toReturn.push({
          label: `Group ${subgroup.name} innovation cost`,
          value: costComparisonItems.find(item => item.value === subgroup.costComparison)?.label,
          editStepNumber: toReturn.length + 1
        });
      });

    }
  }

  return toReturn;

}
