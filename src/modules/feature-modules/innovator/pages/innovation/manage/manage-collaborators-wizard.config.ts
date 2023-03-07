import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';


// Labels.
const stepsLabels = {
  l1: `What's the user's email address?`,
  l2: `New user's role (optional)?`
};


// Types.
// type InboundPayloadType = { email: string, collaboratorRole?: null | string };
type StepPayloadType = { email: string, role: null | string };
// type OutboundPayloadType = { email: string, collaboratorRole: null | string };


export const MANAGE_COLLABORATORS_CONFIG: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'email',
        dataType: 'text',
        label: stepsLabels.l1,
        validations: {
          isRequired: [true, 'Email is required'],
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'role',
        dataType: 'text',
        label: stepsLabels.l2,
        validations: { maxLength: 255 },
      }]
    })
  ],
  // runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  // inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  // outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

// function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

//   steps.splice(0);

//   steps.push(
//     new FormEngineModel({
//       parameters: [{
//         id: 'updatedInnovationRecord',
//         dataType: 'radio-group',
//         label: currentValues.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l1 : stepsLabels.l1,
//         validations: { isRequired: [true, 'Choose one option'] },
//         items: yesNoItems
//       }]
//     }),

//     new FormEngineModel({
//       parameters: [{
//         id: 'description',
//         dataType: 'textarea',
//         label: currentValues.status === InnovationStatusEnum.PAUSED ? stepsLabelsInnovationPaused.l2 : stepsLabels.l2,
//         description: currentValues.status === InnovationStatusEnum.PAUSED ? 'Let us know what has changed and what support you now need with your innovation.' : 'Enter your comment',
//         validations: { isRequired: [true, 'A comment is required'] },
//         lengthLimit: 'small'
//       }]
//     })
//   );

// }

// function inboundParsing(data: InboundPayloadType): StepPayloadType {

//   return {
//     email: data.email,
//     collaboratorRole: data.collaboratorRole ?? null
//   };

// }


// function outboundParsing(data: StepPayloadType): OutboundPayloadType {

//   return {
//     email: data.email,
//     collaboratorRole: data.collaboratorRole
//   };

// }

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: stepsLabels.l1, value: data.email, editStepNumber: 1 },
    { label: stepsLabels.l2, value: data.role, editStepNumber: 2 }
  );

  return toReturn;

}
