import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {
  organisation: { acronym: string, name: string, organisationUnits: { acronym: string, name: string }[] },
  assignedUnit: {
    id: string,
    name: string,
    acronym: string,
    role: string
  }[]
};

type OutboundPayloadType = {
  organisationUnitAcronym: string
};
type StepPayloadType = {
  organisationUnitAcronym: string,
  organisation: { acronym: string, name: string, organisationUnits: { acronym: string, name: string }[] },
  assignedUnit: {
    id: string,
    name: string,
    acronym: string,
    role: string
  }[]
};


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let CHANGE_ORGANISATION_USER_UNIT: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'organisationUnitAcronym',
        dataType: 'radio-group',
        label: 'Please select the new organisation unit',
        validations: { isRequired: [true, 'Unit is required'] },
        items: []
      }]
    }),
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    organisation: data.organisation,
    organisationUnitAcronym: data.assignedUnit[0].acronym,
    assignedUnit: data.assignedUnit
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    organisationUnitAcronym: data.organisationUnitAcronym
  };
}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];
  const unitsList = data.organisation.organisationUnits?.filter(unit => (data.organisationUnitAcronym === unit?.acronym));

  toReturn.push(
    { label: 'New Organisation Unit', value: unitsList.length ? unitsList[0]?.name : '', editStepNumber: 1 }
  );

  return toReturn;
}
