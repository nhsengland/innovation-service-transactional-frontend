import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';
import { InnovationSections } from './catalog.types';

import { DocumentType202209 } from './document.types';
import { hasCostKnowledgeItems, patientRangeItems } from './forms.config';

// Labels.
const stepsLabels = {
  l1: 'Do you know the cost of your innovation?',
  l2: "What's the cost of your innovation?",
  l3: 'Roughly how many patients would be eligible for your innovation?',
  l4: 'How many units of your innovation would you expect to sell per year in the UK?',
  l5: 'Approximately how long do you expect each unit of your innovation to be in use?'
};

// Types.
type InboundPayloadType = DocumentType202209['COST_OF_INNOVATION'] & { impactPatients?: boolean };
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = Omit<InboundPayloadType, 'impactPatients'>;

export const SECTION_6_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'COST_OF_INNOVATION',
  title: 'Cost of your innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasCostKnowledge',
            dataType: 'radio-group',
            label: stepsLabels.l1,
            description:
              'This section asks for information that organisations will want to know to calculate cost effectiveness. By cost, we mean the cost to the NHS or any care organisation that would implement your innovation.',
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasCostKnowledgeItems
          }
        ]
      })
    ],
    runtimeRules: [
      (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, currentValues, currentStep)
    ],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(1);

  if (['NO'].includes(currentValues.hasCostKnowledge || 'NO')) {
    delete currentValues.costDescription;
    delete currentValues.patientsRange;
    delete currentValues.sellExpectations;
    delete currentValues.usageExpectations;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'costDescription',
          dataType: 'textarea',
          label: stepsLabels.l2,
          description:
            'If your innovation has more than one population or subgroup, please be as specific as possible in the description text area below.',
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }
      ]
    })
  );

  if (!currentValues.impactPatients) {
    delete currentValues.patientsRange;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'patientsRange',
            dataType: 'radio-group',
            label: stepsLabels.l3,
            description:
              'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below.',
            validations: { isRequired: [true, 'Choose one option'] },
            items: patientRangeItems
          }
        ]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'sellExpectations',
          dataType: 'textarea',
          label: stepsLabels.l4,
          description:
            'If your innovation has more than one population or subgroup, please be as specific as possible in the description text area below.',
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }
      ]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'usageExpectations',
          dataType: 'textarea',
          label: stepsLabels.l5,
          description:
            'If your innovation has more than one population or subgroup, please be as specific as possible in the description text area below.',
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }
      ]
    })
  );
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
