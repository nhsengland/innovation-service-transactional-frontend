import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {
  organisationsList: { acronym: string, name: string, units: { acronym: string, name: string }[] }[],
};

type StepPayloadType = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'AUTHORISED_PERSON'// 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string, // Only for A
  organisationsList: { acronym: string, name: string, units: { acronym: string, name: string }[] }[],
};

type OutboundPayloadType = {
  email: string,
  name: string,
  type: null | undefined | 'ASSESSMENT' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string, // Only for A
};


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let CREATE_NEW_USER_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'type',
        dataType: 'radio-group',
        label: 'Select user type',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'ASSESSMENT', label: 'Needs Assessor' },
          { value: 'AUTHORISED_PERSON', label: 'Authorised person' }
        ]
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: 'Provide the new user\'s email address',
        validations: {
          isRequired: [true, 'Email is required'],
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'Name of the new user',
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

  steps.splice(3);

  if (data.type === 'ASSESSMENT') {

    data.organisationAcronym = null;
    data.organisationUnitAcronym = null;
    data.role = null;

  } else { // data.type: 'ACCESSOR' | 'QUALIFYING_ACCESSOR'.

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationAcronym',
          dataType: 'radio-group',
          label: 'Which organisation is the new user associated to?',
          validations: { isRequired: [true, 'Organisation is required'] },
          items: data != null && data.organisationsList != null ? data.organisationsList.map(o => ({ value: o.acronym, label: o.name })) : []
        }]
      })
    );


    const selectedOrganisationUnits = data != null && data.organisationsList != null ? data.organisationsList.find(org => org.acronym === data.organisationAcronym)?.units.map(units => ({ value: units.acronym, label: units.name })) || [] : [];
    if (selectedOrganisationUnits.length === 1) {
      data.organisationUnitAcronym = selectedOrganisationUnits[0].value;
    }
    else {
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'organisationUnitAcronym',
            dataType: 'radio-group',
            label: 'Which unit is the new user associated to?',
            validations: { isRequired: [true, 'Unit is required'] },
            items: selectedOrganisationUnits.sort((a, b) => {
              const x = a.label.toUpperCase();
              const y = b.label.toUpperCase();
              return x === y ? 0 : x > y ? 1 : -1;
              })
          }]
        }),
      );
    }

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'role',
          dataType: 'radio-group',
          label: 'Which role should the new user have within the organisation?',
          validations: { isRequired: [true, 'Choose one role'] },
          items: [
            { value: 'QUALIFYING_ACCESSOR', label: 'Qualifying Accessor' },
            { value: 'ACCESSOR', label: 'Accessor' }
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
    role: null,
    organisationsList: data.organisationsList
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.name,
    email: data.email,
    type: data.type === 'AUTHORISED_PERSON' ? data.role : data.type,
    role: data.role,
    organisationAcronym: data.organisationAcronym,
    organisationUnitAcronym: data.organisationUnitAcronym
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];
  const organisationAcronym = steps.find(s => s.parameters[0].id === 'organisationAcronym')?.parameters[0].items;
  let lastMarkStep;
  if (data.type === 'ASSESSMENT'){
    toReturn.push(
      { label: 'User Type', value: 'Needs Assessor' , editStepNumber: 1 },
      { label: 'Email', value: data.email, editStepNumber: 2  },
      { label: 'User Name', value: data.name, editStepNumber: 3  },
    );
    lastMarkStep = 3 ;
  }

  if (data.type === 'AUTHORISED_PERSON') {

    const unitsList = (data.organisationsList.find((org) => (org.acronym === data.organisationAcronym))?.units.map(units => ({ value: units.acronym, label: units.name })));

    toReturn.push(
      { label: 'User Type', value: 'Authorised person'  , editStepNumber: 1 },
      { label: 'Role', value: data.role === 'QUALIFYING_ACCESSOR' ? 'Qualifying Accessor' : 'Accessor' , editStepNumber: (unitsList as []).length > 1 ? 6 : 5 },
      { label: 'Email', value: data.email, editStepNumber: 2  },
      { label: 'User Name', value: data.name, editStepNumber: 3  },
    );
    const orgAcronym: { [key: string]: any }[0] = organisationAcronym?.filter((item) => (data.organisationAcronym === item.value))[0];

    toReturn.push(
      { label: 'Organisation', value: orgAcronym.label === null ? 'NA' : orgAcronym.label, editStepNumber: 4 },
    );

    if (unitsList !== undefined) {
      if ((unitsList as []).length > 1) {
        const organisationUnitAcronym = steps.find(s => s.parameters[0].id === 'organisationUnitAcronym')?.parameters[0].items;
        const orgUnitAcronym: { [key: string]: any }[0] = organisationUnitAcronym?.filter((item) => (data.organisationUnitAcronym === item.value))[0];
        toReturn.push(
          { label: 'Organisation Unit', value: orgUnitAcronym.label === null ? 'NA' : orgUnitAcronym.label, editStepNumber: 5  }
        );
      }
    }

    lastMarkStep =  (unitsList as []).length > 1 ? 6 : 5 ;
  }
  return toReturn;
}
