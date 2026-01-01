import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { UserContextType } from '@modules/stores';

// Types.
type InboundPayloadType = Required<UserContextType>['user'];

type StepPayloadType = {
  displayName: string;
  jobTitle: string | null;
};

type OutboundPayloadType = {
  displayName: string;
  jobTitle: string | null;
};

export const ACCOUNT_DETAILS_ACCESSOR: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'displayName',
          dataType: 'text',
          label: "What's your full name?",
          validations: { isRequired: [true, 'Name is required'] }
        },
        {
          id: 'jobTitle',
          dataType: 'text',
          label: 'What is your job title?',
          description: 'This is displayed to other people you work with on an innovation.',
          validations: { maxLength: 255 }
        }
      ]
    })
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    displayName: data.displayName,
    jobTitle: data.jobTitle
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    displayName: data.displayName,
    jobTitle: data.jobTitle
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Name', value: data.displayName, editStepNumber: 1 },
    { label: 'Job title', value: data.jobTitle, editStepNumber: 1 }
  );

  return toReturn;
}
