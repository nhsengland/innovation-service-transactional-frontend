
import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';

// Types.
type InboundPayloadType = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR' | 'INNOVATOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string // Only for A
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = InboundPayloadType;


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let CREATE_NEW_USER_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [

    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: 'Kindly provide Email Id',
        description: 'emailId?',
        validations: { isRequired: [true, 'Email Id is required'] }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'Kindly provide Name',
        description: 'name?',
        validations: { isRequired: [true, 'Name is required'] }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'type',
        dataType: 'radio-group',
        label: 'Kindly select appropriate user type',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'ASSESSMENT', label: 'Assessment' },
          { value: 'QUALIFYING_ACCESSOR', label: 'Qualifying Accessor'},
          { value: 'ACCESSOR', label: 'Accessor' , },
          { value: 'INNOVATOR', label: 'Innovator' },
        ]
      }]
    })

  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {
  // Backup current organisation shares items.
  const organisationSharesItems = steps.find(s => s.parameters[0].id === 'organisationShares')?.parameters[0].items;

  steps.splice(3);

  if (data.type === 'ASSESSMENT' || data.type === 'INNOVATOR') {
    data.organisationAcronym = null;
    data.organisationUnitAcronym = null;
  } else {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationAcronym',
          dataType: 'radio-group',
          label: 'Kindly select organisation?',
          validations: { isRequired: [true, 'Organisation is required'] },
          items: [
            { value: '1 to 5 employees', label: '1 to 5 employees' },
            { value: '6 to 25 employees', label: '6 to 25 employees' },
            { value: '26 to 100 employees', label: '26 to 100 employees' },
            { value: 'More than 100 employees', label: 'More than 100 employees' }
          ]
        }]
      })
    );
  }
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    email: '',
    name: '',
    type: null,
    organisationAcronym: null,
    organisationUnitAcronym: null,
    role : null
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.name,
    email: data.email,
    type: data.type,
    role: data.role,
    organisationAcronym: data.organisationAcronym,
    organisationUnitAcronym: data.organisationUnitAcronym
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push(
    { label: 'Email Id', value: data.email, editStepNumber: 1 },
    { label: 'User Name', value: data.name, editStepNumber: 2 },
    { label: 'User Type', value: data.type, editStepNumber: 3 }
  );


  let lastMarkStep = 3;

  if (data.type === 'QUALIFYING_ACCESSOR' || data.type === 'ACCESSOR') {

    toReturn.push(
        { label: 'Organisation?', value: data.organisationAcronym === null ? 'NA' : data.organisationAcronym, editStepNumber: 4 },
        { label: 'Organisation Unit?', value: data.organisationUnitAcronym === null ? 'NA' : data.organisationUnitAcronym, editStepNumber: 5 }
    );

    lastMarkStep = 5;

  }
  return toReturn;
}
