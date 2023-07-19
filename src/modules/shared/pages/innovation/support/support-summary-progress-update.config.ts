
import { FileUploadType } from '@app/base/forms';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { CreateSupportSummaryProgressUpdateType } from '@modules/shared/services/innovations.dtos';


// Labels.
const stepsLabels = {
  l1: { label: 'Title', description: 'Enter a title with a maximum of 100 characters' },
  l2: { label: 'Description of progress', description: 'Enter your description' },
  l3: { label: 'Do you want to add a document to support this progress update?' },
  l4: { label: 'What do you want to name this document?', description: 'Enter a name with a maximum of 100 characters.' },
  l5: { label: 'Write a short description for this document (optional)', description: 'Enter a short description about this document.' },
  l6: { label: 'Upload the document', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.' }
};


// Types.
type StepPayloadType = {
  progressUpdateTitle?: string,
  progressUpdateDescription?: string,
  addDocument?: 'YES' | 'NO',
  documentName?: string,
  documentDescription?: string,
  documentFile?: FileUploadType
};
export type OutboundPayloadType = CreateSupportSummaryProgressUpdateType;

// consts.
const addDocumentItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

export const SUPPORT_SUMMARY_PROGRESS_UPDATE: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'progressUpdateTitle', dataType: 'text', label: stepsLabels.l1.label, description: stepsLabels.l1.description,
        validations: { isRequired: [true, 'Title is required'], maxLength: 100 }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'progressUpdateDescription', dataType: 'textarea', label: stepsLabels.l2.label, description: stepsLabels.l2.description,
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'xl'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'addDocument', dataType: 'radio-group', label: stepsLabels.l3.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NO', label: 'No' }
        ]
      }]
    })

  ],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});


function runtimeRules(steps: WizardStepType[], data: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(3);

  if (data.addDocument === 'YES') {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'documentName', dataType: 'text', label: stepsLabels.l4.label, description: stepsLabels.l4.description,
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'documentDescription', dataType: 'textarea', label: stepsLabels.l5.label, description: stepsLabels.l5.description,
          lengthLimit: 's'
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'documentFile', dataType: 'file-upload', label: stepsLabels.l6.label, description: stepsLabels.l6.description,
          validations: { isRequired: [true, 'You need to upload 1 file'] }
        }]
      })
    );


  } else {
    delete data.documentName;
    delete data.documentDescription;
    delete data.documentFile;
  }

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    title: data.progressUpdateTitle ?? '',
    description: data.progressUpdateDescription ?? '',
    ...(data.addDocument === 'YES' && {
      document: {
        name: data.documentName ?? '',
        ...(data.documentDescription && { description: data.documentDescription }),
        ...(data.documentFile && {
          file: {
            id: data.documentFile.id,
            name: data.documentFile.name,
            size: data.documentFile.size,
            extension: data.documentFile.extension
          }
        })
      }
    })
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: stepsLabels.l1.label, value: data.progressUpdateTitle, editStepNumber: 1 },
    { label: stepsLabels.l2.label, value: data.progressUpdateDescription, editStepNumber: 2 },
    {
      label: stepsLabels.l3.label,
      value: addDocumentItems.find(item => item.value === data.addDocument)?.label,
      editStepNumber: 3
    }
  );

  if (data.addDocument === 'YES') {
    toReturn.push(
      {
        label: stepsLabels.l4.label,
        value: data.documentName,
        editStepNumber: 4
      },
      {
        label: stepsLabels.l5.label,
        value: data.documentDescription,
        editStepNumber: 5
      },
      {
        label: 'Uploaded document',
        value: `<a href='${data.documentFile?.url}'>${data.documentFile?.name}</a>`,
        editStepNumber: 6,
        allowHTML: true
      }
    );
  }

  return toReturn;

}
