import {
  FormEngineModel,
  FormEngineParameterModel,
  WizardEngineModel,
  WizardStepType,
  WizardSummaryType
} from '@modules/shared/forms';

import { evidenceSubmitTypeItems, evidenceTypeItems } from './evidences-forms.config';
import { DocumentType202405 } from './evidences-document.types';

// Labels.
export const stepsLabels = {
  q1: {
    label: 'What type of evidence or research do you want to submit?',
    description: `
    <p>Evidence can include clinical and economic evidence, as well as service evaluation, environmental and social impact or other proven benefits such as staff and system benefits. You will be able to add several pieces of evidence one at a time.</p>
    <p>We will ask about user testing and regulatory approval in later sections.</p>`,
    conditional: true
  },
  q2: {
    label: 'What type of evidence do you have?',
    conditional: true
  },
  q3: {
    label: 'What type of economic evidence do you have?',
    conditional: true
  },
  q4: {
    label: 'What other type of evidence do you have?',
    conditional: true
  },
  q5: {
    label: 'Write a short summary of the evidence',
    description:
      'Give a brief overview that covers the scope of the study and its key findings. Organisations will read this summary to see if any evidence is relevant to what they can help you with.',
    conditional: true
  }
  // q6: {
  //   label: 'Upload any documents that support this evidence',
  //   description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.',
  //   conditional: true
  // }
};

const stepsChildParentRelations = {
  evidenceType: 'evidenceSubmitType',
  description: 'evidenceSubmitType'
};

// Types.
type StepPayloadType = Omit<Required<DocumentType202405>['evidences'][number], 'id'>;
type OutboundPayloadType = Omit<Required<DocumentType202405>['evidences'][number], 'id'>;

// Logic.
export const SECTION_2_EVIDENCES = new WizardEngineModel({
  stepsChildParentRelations: stepsChildParentRelations,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'evidenceSubmitType',
          dataType: 'radio-group',
          label: stepsLabels.q1.label,
          description: stepsLabels.q1.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: evidenceSubmitTypeItems
        }
      ]
    })
  ],
  showSummary: true,
  runtimeRules: [
    (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, currentValues, currentStep)
  ],
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(1);

  switch (currentValues.evidenceSubmitType) {
    case 'CLINICAL_OR_CARE':
    case 'PRE_CLINICAL':
    case 'REAL_WORLD':
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: 'evidenceType',
              dataType: 'radio-group',
              label: stepsLabels.q2.label,
              validations: { isRequired: [true, 'Choose one option'] },
              items: [
                ...evidenceTypeItems,
                {
                  value: 'OTHER',
                  label: 'Other',
                  conditional: new FormEngineParameterModel({
                    id: 'description',
                    dataType: 'text',
                    label: 'Other evidence type',
                    validations: { isRequired: [true, 'Other evidence type is required'], maxLength: 50 }
                  })
                }
              ]
            }
          ]
        })
      );
      break;

    case 'COST_IMPACT_OR_ECONOMIC':
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: 'description',
              dataType: 'text',
              label: stepsLabels.q3.label,
              validations: { isRequired: [true, 'A description is required'], maxLength: 50 }
            }
          ]
        })
      );
      delete currentValues.evidenceType;
      break;

    case 'OTHER_EFFECTIVENESS':
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: 'description',
              dataType: 'text',
              label: stepsLabels.q4.label,
              validations: { isRequired: [true, 'Other description is required'], maxLength: 50 }
            }
          ]
        })
      );
      delete currentValues.evidenceType;
      break;

    default:
      break;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'summary',
          dataType: 'textarea',
          label: stepsLabels.q5.label,
          description: stepsLabels.q5.description,
          validations: { isRequired: [true, 'Summary is required'] },
          lengthLimit: 'm'
        }
      ]
    })
  );
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    evidenceSubmitType: data.evidenceSubmitType,
    ...(data.evidenceType && { evidenceType: data.evidenceType }),
    ...(data.description && { description: data.description }),
    summary: data.summary
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push({
    label: stepsLabels.q1.label,
    value: evidenceSubmitTypeItems.find(item => item.value === data.evidenceSubmitType)?.label,
    editStepNumber: editStepNumber++
  });

  switch (data.evidenceSubmitType) {
    case 'CLINICAL_OR_CARE':
    case 'PRE_CLINICAL':
    case 'REAL_WORLD':
      toReturn.push({
        label: stepsLabels.q2.label,
        value:
          data.evidenceType === 'OTHER'
            ? data.description
            : evidenceTypeItems.find(item => item.value === data.evidenceType)?.label,
        editStepNumber: editStepNumber++
      });
      break;
    case 'COST_IMPACT_OR_ECONOMIC':
      toReturn.push({
        label: stepsLabels.q3.label,
        value: data.description,
        editStepNumber: editStepNumber++
      });
      break;

    case 'OTHER_EFFECTIVENESS':
      toReturn.push({
        label: stepsLabels.q4.label,
        value: data.description,
        editStepNumber: editStepNumber++
      });
      break;

    default:
      break;
  }

  toReturn.push({
    label: stepsLabels.q5.label,
    value: data.summary,
    editStepNumber: editStepNumber++
  });

  return toReturn;
}
