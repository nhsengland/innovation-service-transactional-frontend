import { UserRoleEnum } from '@app/base/enums';
import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';


// Labels.
const stepsLabels = {
  l1: `What is the new user's email?`,
  l2: `What is the new user's name?`,
  l3: `What is their role?`
};


// Types.
type StepPayloadType = {
  email: string,
  name: string,
  role: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR
};

type InboundPayloadType = {
  email: string,
  name: string,
  role: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR
}

type OutboundPayloadType = {
  email: string,
  name: string,
  role: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR,
  type: null | UserRoleEnum.QUALIFYING_ACCESSOR | UserRoleEnum.ACCESSOR
};


export const ORGANISATION_UNIT_USER_EDIT: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: stepsLabels.l1,
        validations: {
          isRequired: [true, 'Email is required'],
          pattern: ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$', 'Enter a valid email']
        }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: stepsLabels.l2,
        description: 'Include the first name and surname of the user, their name will appear on the service as it is written here.',
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
        label: stepsLabels.l3,
        validations: { isRequired: [true, 'Choose one role'] },
        items: [
          { value: UserRoleEnum.QUALIFYING_ACCESSOR, label: 'Qualifying Accessor' },
          { value: UserRoleEnum.ACCESSOR, label: 'Accessor' }
        ]
      }]
    }),
  ],
  summaryParsing: (data: StepPayloadType) => summaryParsing(data),
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  return [
    { label: 'Name', value: data.name, editStepNumber: 2 },
    { label: 'Email', value: data.email, editStepNumber: 1 },
    { label: 'Role', value: data.role === UserRoleEnum.QUALIFYING_ACCESSOR ? 'Qualifying Accessor' : data.role === UserRoleEnum.ACCESSOR ? 'Accessor' : null, editStepNumber: 3 }
  ];
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    email: data.email,
    name: data.name,
    role: data.role
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    email: data.email,
    name: data.name,
    role: data.role,
    type: data.role
  };
}
