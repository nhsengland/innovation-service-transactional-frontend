import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {
  organisationsList: { acronym: string, name: string, units: { acronym: string, name: string }[] }[],
};

type StepPayloadType = {
  email: string,
  name: string,
  type: null | 'ADMIN',
};

type OutboundPayloadType = {
  email: string,
  name: string,
  type: 'ADMIN',
};


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let CREATE_NEW_USER_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    // new FormEngineModel({
    //   parameters: [{
    //     id: 'type',
    //     dataType: 'radio-group',
    //     label: 'Select user type',
    //     validations: { isRequired: [true, 'Choose one option'] },
    //     items: [
    //       { value: 'ASSESSMENT', label: 'Needs Assessor' },
    //       { value: 'QUALIFYING_ACCESSOR', label: 'Qualifying Accessor' },
    //       { value: 'ACCESSOR', label: 'Accessor' }
    //     ]
    //   }]
    // }),

    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: 'Provide the new admin\'s email address',
        validations: {
          isRequired: [true, 'Email is required'],
          pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
        }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'Name of the new admin',
        description: 'Include the first name and surname of the user, their name will appear on the service as it is written here.',
        validations: { isRequired: [true, 'Name is required'] }
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
    email: '',
    name: '',
    type: null,

  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.name,
    email: data.email,
    type: 'ADMIN'
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push(
    { label: 'Email', value: data.email, editStepNumber: 1 },
    { label: 'User Name', value: data.name, editStepNumber: 2 },
  );

  const lastMarkStep = 2;

  return toReturn;
}
