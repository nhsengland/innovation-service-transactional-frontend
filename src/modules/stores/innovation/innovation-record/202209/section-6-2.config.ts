import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { sectionType } from '../shared.types';
import { InnovationSections } from './catalog.types';

import { DocumentType202209 } from './document.types';
import { costComparisonItems, hasCostKnowledgeItems } from './forms.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know what cost savings your innovation would create?',
  l2: 'Do you know the cost of care as it\'s currently given?',
  l3: 'What are the costs associated with use of your innovation, compared to current practice in the UK?'
};


// Types.
type InboundPayloadType = DocumentType202209['COMPARATIVE_COST_BENEFIT'];
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = InboundPayloadType;


export const SECTION_6_2: sectionType<InnovationSections> = {
  id: 'COMPARATIVE_COST_BENEFIT',
  title: 'Comparative cost benefit',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasCostSavingKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a> for more information about comparative cost benefit.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasCostKnowledgeItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'hasCostCareKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l2,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a> for more information about comparative cost benefit.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasCostKnowledgeItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data),
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(2);

  if (['NO'].includes(currentValues.hasCostCareKnowledge || 'NO')) {
    delete currentValues.costComparison;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'costComparison',
        dataType: 'radio-group',
        label: stepsLabels.l3,
        description: 'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below.',
        validations: { isRequired: [true, 'Choose one option'] },
        items: costComparisonItems
      }]
    })
  );

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

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

    toReturn.push({
      label: stepsLabels.l3,
      value: costComparisonItems.find(item => item.value === data.costComparison)?.label,
      editStepNumber: 3
    });

  }

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
