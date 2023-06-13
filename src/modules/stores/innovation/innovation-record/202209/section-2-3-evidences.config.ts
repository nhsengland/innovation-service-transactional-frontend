import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { clinicalEvidenceItems, evidenceTypeItems } from './forms.config';


// Labels.
const stepsLabels = {
  l1: 'What type of evidence do you want to submit?',
  l2: 'What type of clinical evidence?',
  l3: 'What type of economic evidence?',
  l4: 'What other type of evidence?',
  l5: 'Please write a short summary of the evidence',
  l6: 'Please upload any documents that support this evidence'
};


// Types.
type BaseType = {
  id: string;
  evidenceType: null | 'CLINICAL' | 'ECONOMIC' | 'OTHER';
  clinicalEvidenceType: null | 'DATA_PUBLISHED' | 'NON_RANDOMISED_COMPARATIVE_DATA' | 'NON_RANDOMISED_NON_COMPARATIVE_DATA' | 'CONFERENCE' | 'RANDOMISED_CONTROLLED_TRIAL' | 'UNPUBLISHED_DATA' | 'OTHER';
  description: string;
  summary: string;
  files: { id: string, displayFileName: string, url: string }[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

type InboundPayloadType = Partial<BaseType>;

type StepPayloadType = Omit<BaseType, 'id' | 'files' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'> & { files: { id: string; name: string; url: string; }[] };

type OutboundPayloadType = Omit<StepPayloadType, 'files'> & { files: string[] };

type SummaryPayloadType = Omit<StepPayloadType, 'files'> & { files: ({ id: string, displayFileName: string, url: string } | { id: string, name: string })[] };



export const SECTION_2_EVIDENCES = new WizardEngineModel({
  steps: [
    new FormEngineModel({

      parameters: [{
        id: 'evidenceType',
        dataType: 'radio-group',
        label: stepsLabels.l1,
        validations: { isRequired: [true, 'Choose one option'] },
        items: evidenceTypeItems
      }]
    })
  ],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: SummaryPayloadType) => summaryParsing(data)
});



function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  switch (currentValues.evidenceType) {
    case 'CLINICAL':
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'clinicalEvidenceType',
            dataType: 'radio-group',
            label: stepsLabels.l2,
            validations: { isRequired: [true, 'Choose one option'] },
            items: clinicalEvidenceItems
          }]
        })
      );
      break;

    case 'ECONOMIC':
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'description',
            dataType: 'text',
            label: stepsLabels.l3,
            validations: { isRequired: [true, 'A description is required'] }
          }]
        }),
      );
      currentValues.clinicalEvidenceType = null;
      break;

    case 'OTHER':
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: 'description',
            dataType: 'text',
            label: stepsLabels.l4,
            validations: { isRequired: [true, 'Other description is required'] }
          }]
        })
      );
      currentValues.clinicalEvidenceType = null;
      break;

    default:
      break;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'summary',
        dataType: 'textarea',
        label: stepsLabels.l5,
        description: 'Please provide a short summary including the scope of the study and the key findings. Accessors will read this summary to understand if any particular piece of evidence is of interest in relation to what they can help you with.',
        validations: { isRequired: [true, 'Summary is required'] },
        lengthLimit: 's'
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'files',
        dataType: 'file-upload-array',
        label: stepsLabels.l6,
        description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB.'
      }],
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    evidenceType: data.evidenceType ?? null,
    clinicalEvidenceType: data.clinicalEvidenceType ?? null,
    description: data.description ?? '',
    summary: data.summary ?? '',
    files: (data.files || []).map(item => ({ id: item.id, name: item.displayFileName, url: item.url }))
  };
}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    evidenceType: data.evidenceType,
    clinicalEvidenceType: data.clinicalEvidenceType,
    description: data.description,
    summary: data.summary,
    files: (data.files || []).map(item => item.id)
  };
}


function summaryParsing(data: SummaryPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: evidenceTypeItems.find(item => item.value === data.evidenceType)?.label,
    editStepNumber: 1
  });


  switch (data.evidenceType) {
    case 'CLINICAL':
      toReturn.push({
        label: stepsLabels.l2,
        value: clinicalEvidenceItems.find(item => item.value === data.clinicalEvidenceType)?.label,
        editStepNumber: 2
      });
      break;
    case 'ECONOMIC':
      toReturn.push({
        label: stepsLabels.l3,
        value: data.description,
        editStepNumber: 2
      });
      break;

    case 'OTHER':
      toReturn.push({
        label: stepsLabels.l4,
        value: data.description,
        editStepNumber: 2
      });
      break;

    default:
      break;
  }


  toReturn.push({
    label: stepsLabels.l5,
    value: data.summary,
    editStepNumber: 3
  });


  const allFiles = (data.files || []).map((item: any) => ({ id: item.id, name: item.name || item.displayFileName, url: item.url }));
  allFiles.forEach((item, i) => {
    toReturn.push({
      label: `Attachment ${i + 1}`,
      value: `<a href='${item.url}'>${item.name}</a>` || 'Unknown',
      editStepNumber: 4,
      allowHTML: true,
      isFile: true,
    });
  });

  return toReturn;

}
