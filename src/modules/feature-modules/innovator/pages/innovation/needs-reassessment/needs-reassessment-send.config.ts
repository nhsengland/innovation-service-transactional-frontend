import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { yesNoItems } from '@modules/stores/innovation/sections/catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Have you updated your Innovation record since submitting it to the last needs assessment?',
  l2: 'What has changed with your innovation and what support you need next?'
};


// Types.
type InboundPayloadType = Record<string, never>;
type StepPayloadType = {
  updatedInnovationRecord: '' | 'YES' | 'NO',
  description: string
};
export type OutboundPayloadType = {
  updatedInnovationRecord: string,
  description: string
};


export const NEEDS_REASSESSMENT_CONFIG: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'updatedInnovationRecord',
        dataType: 'radio-group',
        label: stepsLabels.l1,
        validations: { isRequired: [true, 'Choose one option'] },
        items: yesNoItems
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'description',
        dataType: 'textarea',
        label: stepsLabels.l2,
        description: 'Enter your comment',
        validations: { isRequired: [true, 'A comment is required'] },
        lengthLimit: 'small'
      }]
    }),
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    updatedInnovationRecord: '',
    description: ''
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
      label: stepsLabels.l1,
      value: yesNoItems.find(item => item.value === data.updatedInnovationRecord)?.label,
      editStepNumber: 1
    },
    {
      label: stepsLabels.l2,
      value: data.description,
      editStepNumber: 2
    }
  );

  return toReturn;

}
