import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { UserContextType } from '@modules/stores';

// Types.
type InboundPayloadType = Required<UserContextType>['user'];

type StepPayloadType = {
  givenName: string;
  surname: string;
  jobTitle: string | null;
};

type OutboundPayloadType = {
  givenName: string;
  surname: string;
  jobTitle: string | null;
};

export const ACCOUNT_DETAILS_ACCESSOR: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'givenName',
          dataType: 'text',
          label: 'What is your given name?',
          validations: { isRequired: [true, 'Given name is required'], maxLength: 100 }
        },
        {
          id: 'surname',
          dataType: 'text',
          label: 'What is your surname?',
          validations: { isRequired: [true, 'Surname is required'], maxLength: 100 }
        },
        {
          id: 'jobTitle',
          dataType: 'text',
          label: 'What is your job title?',
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
    givenName: data.givenName,
    surname: data.surname,
    jobTitle: data.jobTitle
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    givenName: data.givenName,
    surname: data.surname,
    jobTitle: data.jobTitle
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Given name', value: data.givenName, editStepNumber: 1 },
    { label: 'Surname', value: data.surname, editStepNumber: 1 },
    { label: 'Job title', value: data.jobTitle, editStepNumber: 1 }
  );

  return toReturn;
}
