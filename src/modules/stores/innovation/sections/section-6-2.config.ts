import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Do you know what cost savings your innovation would create?',
  l2: 'Do you know the cost of care as it\'s currently given?'
};


// Catalogs.
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


// Types.
type InboundPayloadType = {
  hasCostSavingKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  hasCostCareKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  subgroups: {
    id: string;
    name: string;
    costComparison: null | 'CHEAPER' | 'COSTS_MORE_WITH_SAVINGS' | 'COSTS_MORE' | 'NOT_SURE';
  }[];
};
// [key: string] is needed to support subGroupName_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };



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
    currentValues.subgroups = currentValues.subgroups.map(item => ({
      id: item.id, name: item.name, costComparison: null
    }));
    Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].costComparison = currentValues[key] as any;
    delete currentValues[key];
  });

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


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  (parsedData.subgroups || []).forEach((item, i) => { parsedData[`subGroupCostComparison_${i}`] = item.costComparison; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): any {

  const parsedData = cloneDeep(data);

  if (['NO'].includes(parsedData.hasCostCareKnowledge || 'NO')) {
    parsedData.subgroups = parsedData.subgroups.map(item => ({
      id: item.id, name: item.name, costComparison: null
    }));
  }

  Object.keys(parsedData).filter(key => key.startsWith('subGroupCostComparison_')).forEach((key) => { delete parsedData[key]; });

  return parsedData;

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

    data.subgroups.forEach(subgroup => {
      toReturn.push({
        label: `Group ${subgroup.name} innovation cost`,
        value: costComparisonItems.find(item => item.value === subgroup.costComparison)?.label,
        editStepNumber: toReturn.length + 1
      });
    });
  }

  return toReturn;

}
