import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';

// Types.
type InboundPayloadType = {
  name: string;
  acronym: string;
};

type OutboundPayloadType = InboundPayloadType;
type StepPayloadType = InboundPayloadType;

export const organisationStepsDescriptions = {
  l1: "If the organisation has an official acronym, write it in brackets next to the organisation's name. For example, National Institute for Health and Care Excellence (NICE).",
  l2: 'This will be used for tags on the service. If the organisation does not have an official acronym you must create one. Before you create one, check that it could not be confused with an existing acronym for another support organisation.'
};

// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let EDIT_ORGANISATIONS_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: 'Organisation name',
          description: organisationStepsDescriptions.l1,
          validations: {
            isRequired: [true, 'Name is required'],
            pattern: ['^[a-zA-Z() ]*$', 'Organisation names must not include numbers or brackets'],
            maxLength: 100
          }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'acronym',
          dataType: 'text',
          label: 'Organisation acronym',
          description: organisationStepsDescriptions.l2,
          validations: {
            isRequired: [true, 'Acronym is required'],
            pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
            maxLength: 10
          }
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, data, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    name: data.name,
    acronym: data.acronym
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    name: data.name,
    acronym: data.acronym
  };
}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Name', value: data.name, editStepNumber: 1 },
    { label: 'Acronym', value: data.acronym, editStepNumber: 2 }
  );

  return toReturn;
}
