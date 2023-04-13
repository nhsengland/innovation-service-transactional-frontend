import { FormEngineModel, WizardSummaryType, WizardEngineModel, WizardStepType } from '@modules/shared/forms';
import { InnovationStatusEnum } from '@modules/stores/innovation';


// Labels.
const stepsLabels = {
  l1: 'Have you updated your Innovation record since submitting it to the last needs assessment?',
  l2: 'What has changed with your innovation and what support you need next?'
};

const stepsLabelsInnovationPaused = {
  l1: 'Have you updated your innovation record since you stopped sharing it?',
  l2: 'How has your innovation changed?'
};


// Catalogs.
export const yesNoItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

// Types.
type InboundPayloadType = { status: InnovationStatusEnum };
type StepPayloadType = {
  updatedInnovationRecord: '' | 'YES' | 'NO',
  description: string,
  status: InnovationStatusEnum
};
export type OutboundPayloadType = {
  updatedInnovationRecord: string,
  description: string
};


export const NEEDS_REASSESSMENT_CONFIG: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [],
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(0);
  
  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'updatedInnovationRecord',
        dataType: 'radio-group',
        label: currentValues.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l1 : stepsLabels.l1,
        validations: { isRequired: [true, 'Choose one option'] },
        items: yesNoItems
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'description',
        dataType: 'textarea',
        label: currentValues.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l2 : stepsLabels.l2,
        description: currentValues.status === InnovationStatusEnum.PAUSED ? 'Let us know what has changed and what support you now need with your innovation.' : 'Enter your comment',
        validations: { isRequired: [true, 'A comment is required'] },
        lengthLimit: 'small'
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    updatedInnovationRecord: '',
    description: '',
    status: data.status
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    updatedInnovationRecord: data.updatedInnovationRecord,
    description: data.description
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    {
      label: data.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l1 : stepsLabels.l1,
      value: yesNoItems.find(item => item.value === data.updatedInnovationRecord)?.label,
      editStepNumber: 1
    },
    {
      label: data.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l2 : stepsLabels.l2,
      value: data.description,
      editStepNumber: 2
    }
  );

  return toReturn;

}
