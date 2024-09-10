import { FormEngineModel, FormEngineParameterModel, WizardEngineModel } from '@modules/shared/forms';

// Types.
type InboundPayloadType = {
  email: string;
  ownerToCollaborator: boolean;
};

type StepPayloadType = {
  email: string;
  ownerToCollaborator: string;
  collaboratorEmail?: string;
};

type OutboundPayloadType = {
  email: string;
  ownerToCollaborator: boolean;
};

export const NO_COLLABORATORS_TRANSFERS = () =>
  new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: 'Transfer ownership of this innovation',
        parameters: [
          {
            id: 'email',
            dataType: 'text',
            label: 'Who do you want to transfer ownership to?',
            description: "Enter new owner's email",
            validations: {
              isRequired: [true, 'Email is required'],
              validEmail: true
            }
          }
        ]
      }),
      new FormEngineModel({
        label: 'Does the current owner wish to continue to collaborate on this innovation?',
        parameters: [
          {
            id: 'ownerToCollaborator',
            dataType: 'radio-group',
            label:
              'This means that they can work on the innovation but are not the owner and do not have owner privileges.',
            validations: { isRequired: [true, 'Choose one option'] },
            items: [
              { value: 'YES', label: 'Yes' },
              { value: 'NO', label: 'No' }
            ]
          }
        ]
      })
    ],
    runtimeRules: [
      (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, data, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data)
  });

export const COLLABORATORS_TRANSFERS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      label: 'Transfer ownership of this innovation',
      parameters: [
        {
          id: 'collaboratorEmail',
          dataType: 'radio-group',
          label: 'Who do you want to transfer ownership to?',
          description: "Choose a collaborator or enter another person's email",
          validations: { isRequired: [true, 'Email is required'] },
          items: []
        }
      ]
    }),
    new FormEngineModel({
      label: 'Does the current owner wish to continue to collaborate on this innovation?',
      parameters: [
        {
          id: 'ownerToCollaborator',
          dataType: 'radio-group',
          label:
            'This means that they can work on the innovation but are not the owner and do not have owner privileges.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, data, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const otherEmailItem = () => ({
  value: 'other',
  label: 'Other',
  conditional: new FormEngineParameterModel({
    id: 'email',
    dataType: 'text',
    label: "Enter new owner's email",
    validations: {
      isRequired: [true, 'Email is required'],
      validEmail: true
    }
  })
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    email: '',
    ownerToCollaborator: ''
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  const email = data.collaboratorEmail && data.collaboratorEmail !== 'other' ? data.collaboratorEmail : data.email;

  return {
    email: email,
    ownerToCollaborator: data.ownerToCollaborator === 'YES'
  };
}
