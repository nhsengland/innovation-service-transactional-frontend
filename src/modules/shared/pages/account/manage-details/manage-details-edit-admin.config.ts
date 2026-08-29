import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { UserContextType } from '@modules/stores';

// Types.
type InboundPayloadType = Required<UserContextType>['user'];

type StepPayloadType = {
  givenName: string;
  surname: string;
};

type OutboundPayloadType = StepPayloadType;

export const ACCOUNT_DETAILS_ADMIN: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'givenName',
          dataType: 'text',
          label: 'What is your given name?',
          validations: { isRequired: [true, 'Given name is required'], maxLength: 64 }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'surname',
          dataType: 'text',
          label: 'What is your surname?',
          validations: { isRequired: [true, 'Surname is required'], maxLength: 64 }
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
    surname: data.surname
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    givenName: data.givenName,
    surname: data.surname
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Given name', value: data.givenName, editStepNumber: 1 },
    { label: 'Surname', value: data.surname, editStepNumber: 2 }
  );

  return toReturn;
}
