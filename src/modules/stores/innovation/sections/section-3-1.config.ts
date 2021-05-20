import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_3_1_1: 'Have you done market research so that you understand the need for your innovation in the UK?',
  s_3_1_2: 'Please describe the market research you\'ve done, or are doing, within the UK market landscape',
};


const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'in_progress', label: 'I\'m currently doing market research' },
  { value: 'not_yet', label: 'Not yet' }
];


export const SECTION_3_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.MARKET_RESEARCH,
  title: 'Market research',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_3_1_1,
        parameters: [{
          id: 'hasMarketResearch',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      }),
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: any, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: any) => summaryParsing(data)
  })
};



type runtimeData = {
  id?: string;
  hasMarketResearch: 'yes' | 'in_progress' | 'not_yet';
  marketResearch?: string;
};

function runtimeRules(steps: FormEngineModel[], currentValues: runtimeData, currentStep: number): void {

  steps.splice(1);

  if (['not_yet'].includes(currentValues.hasMarketResearch)) {
    delete currentValues.marketResearch;
    return;
  }

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_3_1_2,
      parameters: [{ id: 'marketResearch', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );

}



type summaryData = {
  id?: string;
  hasMarketResearch: 'yes' | 'in_progress' | 'not_yet';
  marketResearch: string;
};

function summaryParsing(data: summaryData): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_3_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasMarketResearch)?.label || '',
    editStepNumber: 1
  });

  if (['yes', 'in_progress'].includes(data.hasMarketResearch)) {
    toReturn.push({
      label: stepsLabels.s_3_1_2,
      value: data.marketResearch,
      editStepNumber: 2
    });
  }

  return toReturn;

}
