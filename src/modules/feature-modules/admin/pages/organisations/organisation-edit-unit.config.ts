import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { organisationUnitStepsDescriptions } from './organisation-unit-new/organisation-unit-new.config';

// Types.
type InboundPayloadType = {
  name: string;
  acronym: string;
};

type OutboundPayloadType = InboundPayloadType;
type StepPayloadType = InboundPayloadType;

// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let EDIT_ORGANISATION_UNIT_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: 'Unit name',
          description: organisationUnitStepsDescriptions.l1,
          validations: {
            isRequired: [true, 'Name is required'],
            pattern: ['^[a-zA-Z() ]*$', 'Unit names must not include numbers or brackets'],
            maxLength: 255
          }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'acronym',
          dataType: 'text',
          label: 'Unit acronym',
          description: organisationUnitStepsDescriptions.l2,
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
