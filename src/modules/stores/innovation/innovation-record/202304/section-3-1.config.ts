import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasMarketResearchItems, optionBestDescribesInnovationItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: {
    label: 'Have you conducted market research to determine the demand and need for your innovation in the UK?',
    description: 'By this, we mean any research you have done to determine the market opportunity for your innovation. You will be able to explain any testing you have done with users later in the record.'
  },
  q2: {
    label: 'Describe the market research you have done, or are doing, within the UK market',
    description: `This could include a mix of interviews, focus groups, patient record forms, surveys, ethnography, or other market research methods.`
  },
  q3: { label: 'Which option best describes your innovation?' },
  q4: {
    label: 'What competitors or alternatives exist, or how is the problem addressed in current practice?',
    description: 'Include how your innovation is different to the alternatives in the market.'
  },
};


// Types.
type InboundPayloadType = DocumentType202304['MARKET_RESEARCH'];
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = DocumentType202304['MARKET_RESEARCH'];


// Logic.
export const SECTION_3_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'MARKET_RESEARCH',
  title: 'Market research',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasMarketResearch', dataType: 'radio-group', label: stepsLabels.q1.label, description: stepsLabels.q1.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasMarketResearchItems
        }]
      }),
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NOT_YET'].includes(currentValues.hasMarketResearch || 'NOT_YET')) {
    delete currentValues.marketResearch;
    delete currentValues.optionBestDescribesInnovation;
    delete currentValues.whatCompetitorsAlternativesExist;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'marketResearch', dataType: 'textarea', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
        validations: { isRequired: [true, 'A description is required'] },
        lengthLimit: 'l'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'optionBestDescribesInnovation', dataType: 'radio-group', label: stepsLabels.q3.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: optionBestDescribesInnovationItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'whatCompetitorsAlternativesExist', dataType: 'textarea', label: stepsLabels.q4.label, description: stepsLabels.q4.description,
        validations: { isRequired: [true, 'A description is required'] },
        lengthLimit: 'l'
      }]
    })
  );

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    ...(data.hasMarketResearch && { hasMarketResearch: data.hasMarketResearch }),
    ...(data.marketResearch && { marketResearch: data.marketResearch }),
    ...(data.optionBestDescribesInnovation && { optionBestDescribesInnovation: data.optionBestDescribesInnovation }),
    ...(data.whatCompetitorsAlternativesExist && { whatCompetitorsAlternativesExist: data.whatCompetitorsAlternativesExist })
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.q1.label,
    value: hasMarketResearchItems.find(item => item.value === data.hasMarketResearch)?.label,
    editStepNumber: 1
  });

  if (['YES', 'IN_PROGRESS'].includes(data.hasMarketResearch || 'NOT_YET')) {
    toReturn.push(
      {
        label: stepsLabels.q2.label,
        value: data.marketResearch,
        editStepNumber: 2
      },
      {
        label: stepsLabels.q3.label,
        value: optionBestDescribesInnovationItems.find(item => item.value === data.optionBestDescribesInnovation)?.label,
        editStepNumber: 3
      },
      {
        label: stepsLabels.q4.label,
        value: data.whatCompetitorsAlternativesExist,
        editStepNumber: 4
      }
    );
  }

  return toReturn;

}
