import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';

// Labels.
const stepsLabels = {
  l1: 'Add the name of the new organisation unit',
  l2: 'Add an acronym for this organisation unit'
};

export const organisationUnitStepsDescriptions = {
  l1: "If the unit has an official acronym, write it in brackets next to the organisation's name. For example, National Institute for Health and Care Excellence (NICE).",
  l2: 'This will be used for tags on the service. If the unit does not have an official acronym you must create one. Before you create one, check that it could not be confused with an existing acronym for another support organisation.'
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
          description: organisationUnitStepsDescriptions.l1,
          validations: {
            isRequired: [true, 'Name is required'],
            pattern: ['^[a-zA-Z() ]*$', 'Unit names must not include numbers or brackets'],
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
          label: stepsLabels.l2,
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
