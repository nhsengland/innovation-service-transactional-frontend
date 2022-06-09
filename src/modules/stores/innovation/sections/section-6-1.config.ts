import { FormEngineModel, WizardSummaryType, WizardEngineModel, WizardStepType } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasCostKnowledgeItems, patientRangeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know the cost of your innovation?',
  l2: 'What\'s the cost of your innovation?',
  l3: 'Roughly how many patients would be eligible for your innovation?',
  l4: 'How many units of your innovation would you expect to sell per year in the UK?',
  l5: 'Approximately how long is each unit of your innovation intended to be in use?'
};


// Types.
type InboundPayloadType = {
  impactPatients: boolean;
  hasCostKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  costDescription: null | string;
  patientsRange: null | 'UP_10000' | 'BETWEEN_10000_500000' | 'MORE_THAN_500000' | 'NOT_SURE' | 'NOT_RELEVANT';
  sellExpectations: null | string;
  usageExpectations: null | string;
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = Omit<InboundPayloadType, 'impactPatients'>;


export const SECTION_6_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.COST_OF_INNOVATION,
  title: 'Cost of your innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasCostKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'By cost, we mean the cost to the NHS or any care organisation that would implement your innovation.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasCostKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO'].includes(currentValues.hasCostKnowledge || 'NO')) {
    currentValues.costDescription = null;
    currentValues.patientsRange = null;
    currentValues.sellExpectations = null;
    currentValues.usageExpectations = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'costDescription',
        dataType: 'textarea',
        label: stepsLabels.l2,
        description: 'If your innovation has more than one population or subgroup, please be as scpecific as possible in the description text area below.',
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'medium'
      }]
    })
  );

  if (!currentValues.impactPatients) {
    currentValues.patientsRange = null;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'patientsRange',
          dataType: 'radio-group',
          label: stepsLabels.l3,
          description: 'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: patientRangeItems
        }]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'sellExpectations',
        dataType: 'textarea',
        label: stepsLabels.l4,
        description: 'If your innovation has more than one population or subgroup, please be as scpecific as possible in the description text area below.',
        validations: { isRequired: [true, 'Sell expectations description is required'] },
        lengthLimit: 'medium'
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'usageExpectations',
        dataType: 'textarea',
        label: stepsLabels.l5,
        description: 'If your innovation has more than one population or subgroup, please be as scpecific as possible in the description text area below.',
        validations: { isRequired: [true, 'Usage expectations description is required'] },
        lengthLimit: 'medium'
      }]
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    impactPatients: data.impactPatients,
    hasCostKnowledge: data.hasCostKnowledge,
    costDescription: data.costDescription,
    patientsRange: data.patientsRange,
    sellExpectations: data.sellExpectations,
    usageExpectations: data.usageExpectations
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasCostKnowledge: data.hasCostKnowledge,
    costDescription: data.costDescription,
    patientsRange: data.patientsRange,
    sellExpectations: data.sellExpectations,
    usageExpectations: data.usageExpectations
  };

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostKnowledge)?.label,
    editStepNumber: 1
  });

  if (!['NO'].includes(data.hasCostKnowledge || 'NO')) {

    toReturn.push({ label: stepsLabels.l2, value: data.costDescription, editStepNumber: toReturn.length + 1 });

    if (data.impactPatients) {
      toReturn.push({
        label: stepsLabels.l3,
        value: patientRangeItems.find(item => item.value === data.patientsRange)?.label,
        editStepNumber: toReturn.length + 1
      });
    }

    toReturn.push({ label: stepsLabels.l4, value: data.sellExpectations, editStepNumber: toReturn.length + 1 });
    toReturn.push({ label: stepsLabels.l5, value: data.usageExpectations, editStepNumber: toReturn.length + 1 });

  }

  return toReturn;

}
