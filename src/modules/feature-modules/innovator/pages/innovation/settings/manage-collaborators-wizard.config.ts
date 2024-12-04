import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';

// Labels.
const stepsLabels = {
  l1: `What's the collaborator's email?`,
  l2: `What is the collaborator's role (optional)?`
};

// Types.
type StepPayloadType = { email: string; role: null | string };

export const MANAGE_COLLABORATORS_CONFIG_NEW: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'email',
          dataType: 'text',
          label: stepsLabels.l1,
          validations: {
            isRequired: [true, 'Email is required'],
            validEmail: true
          }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'role',
          dataType: 'text',
          label: stepsLabels.l2,
          description:
            'This will help the needs assessment team and support organisations to understand your team structure and who to direct specific questions to.',
          validations: { maxLength: 25 }
        }
      ]
    })
  ],
  summaryParsing: (data: StepPayloadType) => {
    return [
      { label: stepsLabels.l1, value: data.email, editStepNumber: 1 },
      { label: stepsLabels.l2, value: data.role, editStepNumber: 2 }
    ];
  }
});

export const MANAGE_COLLABORATORS_CONFIG_EDIT: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'role',
          dataType: 'text',
          label: stepsLabels.l2,
          description:
            'This will help the needs assessment team and support organisations understand the your team structure and who to direct specific questions to.',
          validations: { maxLength: 255 }
        }
      ]
    })
  ],
  summaryParsing: (data: StepPayloadType) => {
    return [
      { label: stepsLabels.l1, value: data.email },
      { label: stepsLabels.l2, value: data.role, editStepNumber: 1 }
    ];
  }
});
