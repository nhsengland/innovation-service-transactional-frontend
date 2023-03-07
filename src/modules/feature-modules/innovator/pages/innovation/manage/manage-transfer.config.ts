import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

// Types.
type InboundPayloadType = {
  email: string;
  isCollaborator: boolean;
};

type StepPayloadType = {
  email: string,
  isCollaborator: string,
  collaboratorEmail?: string

};

type OutboundPayloadType = {
  email: string,
  isCollaborator: boolean,
};


export const NO_COLLABORATORS_TRANSFERS: WizardEngineModel = new WizardEngineModel({
  steps: [    
    new FormEngineModel({
      label: 'Transfer ownership of this innovation',
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: 'Who do you want to transfer ownership to?',
        description: 'Enter new owner\'s email',
        validations: {
          isRequired: [true, 'Email is required'],
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        }
      }]
    }),
    new FormEngineModel({
      label: 'Do you want to continue to collaborate on this innovation?',
      parameters: [{
        id: 'isCollaborator',
        dataType: 'radio-group',
        label: 'This means you can work on the innovation but are not the owner and do not have owner privileges.', 
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NO', label: 'No' }
        ]
      }]
    })
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const COLLABORATORS_TRANSFERS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      label: 'Transfer ownership of this innovation',
      parameters: [{
        id: 'collaboratorEmail',
        dataType: 'radio-group',
        label: 'Who do you want to transfer ownership to?',
        description: 'Choose a collaborator or enter another person\'s email',
        validations: { isRequired: [true, 'Email is required'] },
        items: []
      }]
    }),
    new FormEngineModel({
      label: 'Do you want to continue to collaborate on this innovation?',
      parameters: [{
        id: 'isCollaborator',
        dataType: 'radio-group',
        label: 'This means you can work on the innovation but are not the owner and do not have owner privileges.', 
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NO', label: 'No' }
        ]
      }]
    }) 
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const otherEmailItem = {
  value: 'other',
  label: 'Other',
  conditional: new FormEngineParameterModel({ 
    id: 'email', 
    dataType: 'text', 
    label: 'Enter new owner\'s email', 
    validations: {
      isRequired: [true, 'Email is required'],
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
    }
  })
};

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    email: '',
    isCollaborator: '',
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  const email = data.collaboratorEmail && data.collaboratorEmail !== 'other' ? data.collaboratorEmail : data.email;
  
  return {
    email: email,
    isCollaborator: data.isCollaborator === 'YES',
  };
}

