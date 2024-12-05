import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { UserContextType } from '@modules/stores';

// Types.
type InboundPayloadType = Required<UserContextType>['user'];

type StepPayloadType = {
  displayName: string;
};

type OutboundPayloadType = StepPayloadType;

export const ACCOUNT_DETAILS_ADMIN: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'displayName',
          dataType: 'text',
          label: "What's your full name?",
          description: 'Enter your name with a maximum of 100 characters',
          validations: {
            isRequired: [true, 'Name is required'],
            pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
            maxLength: 100
          }
        }
      ]
    })
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return { displayName: data.displayName };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return { displayName: data.displayName };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push({ label: 'Name', value: data.displayName, editStepNumber: 1 });

  return toReturn;
}
