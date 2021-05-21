import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Have you done market research so that you understand the need for your innovation in the UK?',
  l2: 'Please describe the market research you\'ve done, or are doing, within the UK market landscape',
};


// Catalogs.
const hasMarketResearchItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m currently doing market research' },
  { value: 'NOT_YET', label: 'Not yet' }
];


// Types.
type InboundPayloadType = {
  hasMarketResearch: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
  marketResearch: null | string;
};

type StepPayloadType = InboundPayloadType;



export const SECTION_3_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.MARKET_RESEARCH,
  title: 'Market research',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        parameters: [{ id: 'hasMarketResearch', dataType: 'radio-group', validations: { isRequired: true }, items: hasMarketResearchItems }]
      }),
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number): void {

  steps.splice(1);

  if (['NOT_YET'].includes(currentValues.hasMarketResearch || 'NOT_YET')) {
    currentValues.marketResearch = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l2,
      parameters: [{ id: 'marketResearch', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasMarketResearchItems.find(item => item.value === data.hasMarketResearch)?.label,
    editStepNumber: 1
  });

  if (['YES', 'IN_PROGRESS'].includes(data.hasMarketResearch || 'NOT_YET')) {
    toReturn.push({
      label: stepsLabels.l2,
      value: data.marketResearch,
      editStepNumber: 2
    });
  }

  return toReturn;

}
