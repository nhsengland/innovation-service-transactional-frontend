import { UserRoleEnum } from '@app/base/enums';
import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {
  organisationsList: {
    id: string,
    name: string,
    units: {
      id: string,
      name: string
    }[]
  }[],
};

type StepPayloadType = {
  email: string,
  name: string,
  role: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR | UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN,
  organisationId?: null | string, // Only for QA, A
  unitIds?: null | string[], // Only for A
  organisationsList: {
    id: string,
    name: string,
    units: {
      id: string,
      name: string
    }[]
  }[]
};

export type OutboundPayloadType = {
  email: string,
  name: string,
  role: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR | UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN,
  organisationId?: null | string,
  unitIds?: null | string[],
};


export const CREATE_NEW_USER_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: `What is the new user's email?`,
        validations: {
          isRequired: [true, 'Email is required'],
          validEmail: true,
          maxLength: 100
        }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'What is the name of the new user?',
        description: 'Enter the first name and surname. This is how their name will appear on the service.',
        validations: {
          isRequired: [true, 'Name is required'],
          maxLength: 100
        }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'role',
        dataType: 'radio-group',
        label: 'What is their role?',
        validations: { isRequired: [true, 'Choose one role'] },
        items: [
          { value: UserRoleEnum.QUALIFYING_ACCESSOR, label: 'Qualifying Accessor' },
          { value: UserRoleEnum.ACCESSOR, label: 'Accessor' },
          { value: UserRoleEnum.ASSESSMENT, label: 'Needs assessor' },
          { value: UserRoleEnum.ADMIN, label: 'Administrator' }
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

  steps.splice(3);

  if (data.role === UserRoleEnum.ASSESSMENT || data.role === UserRoleEnum.ADMIN) {

    data.organisationId = null;
    data.unitIds = null;

  }
  else {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationId',
          dataType: 'radio-group',
          label: 'Which organisation is the user associated to?',
          validations: { isRequired: [true, 'Organisation is required'] },
          items: data !== null && data.organisationsList !== null ? data.organisationsList.map(o => ({ value: o.id, label: o.name })) : []
        }]
      })
    );

    const unitsList = data !== null && data.organisationsList !== null ? data.organisationsList.find(org => org.id === data.organisationId)?.units.map(units => ({ value: units.id, label: units.name })) || [] : [];

    if (unitsList.length === 1) {
      data.unitIds = [unitsList[0].value];
    }
    else {
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'unitIds',
            dataType: 'checkbox-array',
            label: 'Which unit is the user associated to?',
            validations: { isRequired: [true, 'Unit is required'] },
            items: unitsList.sort((a, b) => {
              const x = a.label.toUpperCase();
              const y = b.label.toUpperCase();
              return x === y ? 0 : x > y ? 1 : -1;
              })
          }]
        }),
      );
    }

  }

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    email: '',
    name: '',
    role: null,
    organisationId: null,
    unitIds: null,
    organisationsList: data.organisationsList
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  if (data.role === UserRoleEnum.ADMIN || data.role === UserRoleEnum.ASSESSMENT) {
    return {
      email: data.email,
      name: data.name,
      role: data.role
    };
  }
  return {
    email: data.email,
    name: data.name,
    role: data.role,
    organisationId: data.organisationId,
    unitIds: data.unitIds
  };
}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Email', value: data.email, editStepNumber: 1  },
    { label: 'Name', value: data.name, editStepNumber: 2  }
  );

  if (data.role === UserRoleEnum.ADMIN || data.role === UserRoleEnum.ASSESSMENT) {
    toReturn.push(
      { label: 'Role', value: data.role === UserRoleEnum.ADMIN ? 'Administrator' : 'Needs Assessor'  , editStepNumber: 3 },
    );
  }
  else {
    const role = data.role === UserRoleEnum.QUALIFYING_ACCESSOR ? 'Qualifying Accessor' : 'Accessor';

    const unitsList = data.organisationsList.find((org) => (org.id === data.organisationId))?.units.map(units => ({ value: units.id, label: units.name })) || [];

    const selectedOrganisationUnits = unitsList?.filter((item) => (data.unitIds?.includes(item.value)));

    toReturn.push(
      { label: selectedOrganisationUnits.length > 1 ? 'Roles' : 'Role', value: selectedOrganisationUnits.map(unit => `${role} (${unit.label})`).join('\n'), editStepNumber: unitsList.length > 1 ? 5 : 4 },
    );
  }

  return toReturn;

}

