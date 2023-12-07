import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';

// Labels.
const stepsLabels = {
  l1: "What's the name of the new organisation unit?",
  l2: "What's the acronym of the new organisation unit?"
};

// Types.
type InboundPayloadType = {};
type StepPayloadType = {
  name: string;
  acronym: string;
};
export type OutboundPayloadType = {
  name: string;
  acronym: string;
};

export const NEW_UNIT_CONFIG: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l1,
          description: 'Enter the name of the new unit with a maximum of 100 characters',
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'acronym',
          dataType: 'text',
          label: stepsLabels.l2,
          description: 'Enter the acronym of the unit with a maximum of 10 characters',
          validations: { isRequired: [true, 'Acronym is required'], maxLength: 10 }
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
    name: '',
    acronym: ''
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    name: data.name,
    acronym: data.acronym
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    {
      label: 'Name',
      value: data.name,
      editStepNumber: 1
    },
    {
      label: 'Acronym',
      value: data.acronym,
      editStepNumber: 2
    }
  );

  return toReturn;
}
