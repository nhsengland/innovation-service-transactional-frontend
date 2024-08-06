import {
  FormEngineModel,
  WizardSummaryType,
  WizardEngineModel,
  WizardStepType,
  FormEngineParameterModel
} from '@modules/shared/forms';
import { InnovationStatusEnum } from '@modules/stores/innovation';

export type ReassessmentSendType = {
  reassessmentReason: ReassessmentReasonsType[];
  otherReassessmentReason?: string;
  description: string;
  whatSupportDoYouNeed: string;
};

export type ReassessmentReasonsType = 'NO_SUPPORT' | 'PREVIOUSLY_ARCHIVED' | 'HAS_PROGRESSED_SIGNIFICANTLY' | 'OTHER';

// Labels.
const stepsLabels = {
  q1: {
    id: 'reassessmentReason',
    label: 'Why do you want a needs reassessment?',
    description:
      'Update your innovation record before you submit for needs reassessment to get access to the right support.<br><br>Select all that apply.'
  },
  q2: {
    id: 'description',
    label: 'Explain any significant changes to your innovation since your last needs assessment',
    description:
      'For example, you have conducted clinical trials, or have obtained regulatory approval.<br><br>Explain changes'
  },
  q3: {
    id: 'whatSupportDoYouNeed',
    label: 'What support do you need next?',
    description: 'Explain support required'
  }
};

// Catalogs.
export const yesNoItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

// Types.
type InboundPayloadType = ReassessmentSendType & { status: InnovationStatusEnum };
type StepPayloadType = ReassessmentSendType & { status: InnovationStatusEnum };
export type OutboundPayloadType = ReassessmentSendType;

export const NEEDS_REASSESSMENT_CONFIG: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [],
  runtimeRules: [
    (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, currentValues, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

export const REASSESSMENT_REASON_ITEMS = [
  { value: 'NO_SUPPORT', label: 'There is no active support for my innovation' },
  {
    value: 'PREVIOUSLY_ARCHIVED',
    label: 'My innovation was previously archived or I stopped working on it for a period of time'
  },
  {
    value: 'HAS_PROGRESSED_SIGNIFICANTLY',
    label: 'My innovation has progressed significantly since my last needs assessment'
  },
  {
    value: 'OTHER',
    label: 'Other',
    conditional: new FormEngineParameterModel({
      id: 'otherReassessmentReason',
      dataType: 'text',
      placeholder: 'Explain',
      validations: { isRequired: [true, 'Add explanation'], maxLength: 100 }
    })
  }
];

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(0);

  if (currentValues.status !== 'ARCHIVED') {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: stepsLabels.q1.id,
            dataType: 'checkbox-array',
            label: stepsLabels.q1.label,
            ...(stepsLabels.q1.description && { description: stepsLabels.q1.description }),
            validations: { isRequired: [true, 'Add explanation'] },
            items: REASSESSMENT_REASON_ITEMS
          }
        ]
      })
    );
  }
  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: stepsLabels.q2.id,
          dataType: 'textarea',
          label: stepsLabels.q2.label,
          ...(stepsLabels.q2.description && { description: stepsLabels.q2.description }),
          validations: { isRequired: [true, 'Add explanation'] },
          lengthLimit: 'l'
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: stepsLabels.q3.id,
          dataType: 'textarea',
          label: stepsLabels.q3.label,
          ...(stepsLabels.q3.description && { description: stepsLabels.q3.description }),
          validations: { isRequired: [true, 'Add explanation'] },
          lengthLimit: 'l'
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    reassessmentReason: [],
    otherReassessmentReason: '',
    description: '',
    whatSupportDoYouNeed: '',
    status: data.status
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    reassessmentReason:
      data.status === InnovationStatusEnum.ARCHIVED ? ['PREVIOUSLY_ARCHIVED'] : data.reassessmentReason,
    ...(data.otherReassessmentReason && { otherReassessmentReason: data.otherReassessmentReason }),
    description: data.description,
    whatSupportDoYouNeed: data.whatSupportDoYouNeed
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];
  let editStepNumber = 1;

  toReturn.push(
    {
      label: stepsLabels.q1.label,
      value:
        data.status === InnovationStatusEnum.ARCHIVED
          ? REASSESSMENT_REASON_ITEMS.find(i => i.value === 'PREVIOUSLY_ARCHIVED')?.label ?? ''
          : data.reassessmentReason
              .map(chosenReason =>
                chosenReason === 'OTHER'
                  ? data.otherReassessmentReason
                  : REASSESSMENT_REASON_ITEMS.find(i => i.value === chosenReason)?.label
              )
              .join('\n'),
      editStepNumber: data.status === InnovationStatusEnum.ARCHIVED ? undefined : editStepNumber++
    },
    {
      label: stepsLabels.q2.label,
      value: data.description,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q3.label,
      value: data.whatSupportDoYouNeed,
      editStepNumber: editStepNumber++
    }
  );

  return toReturn;
}
