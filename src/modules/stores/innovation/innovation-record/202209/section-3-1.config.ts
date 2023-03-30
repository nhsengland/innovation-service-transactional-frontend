import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { sectionType } from '../shared.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202209 } from './document.types';
import { hasMarketResearchItems } from './forms.config';


// Labels.
const stepsLabels = {
  l1: 'Have you done market research so that you understand the need for your innovation in the UK?',
  l2: 'Please describe the market research you\'ve done, or are doing, within the UK market landscape',
};


// Types.
type InboundPayloadType = DocumentType202209['MARKET_RESEARCH'];
type StepPayloadType = InboundPayloadType;


export const SECTION_3_1: sectionType<InnovationSections> = {
  id: 'MARKET_RESEARCH',
  title: 'Market research',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasMarketResearch',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'What we mean by market research is information gathering via different methodologies to understand the user need for your innovation. For example, in-depth interview, focus groups, telephone interviews, online surveys, Patient Record Forms (PRFs).',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasMarketResearchItems
        }]
      }),
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data)
  })
};



function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NOT_YET'].includes(currentValues.hasMarketResearch || 'NOT_YET')) {
    delete currentValues.marketResearch;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'marketResearch',
        dataType: 'textarea',
        label: stepsLabels.l2,
        validations: { isRequired: [true, 'A description of the market research is required'] },
        lengthLimit: 'medium'
      }]
    })
  );

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

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

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
