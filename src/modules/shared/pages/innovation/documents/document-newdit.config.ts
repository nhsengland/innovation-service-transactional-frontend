import { FileUploadType } from '@app/base/forms';

import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentInfoOutDTO, UpsertInnovationDocumentType } from '@modules/shared/services/innovation-documents.service';
import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';


// Labels.
const stepsLabels = {
  l1: { label: 'Is this document related to any section of your innovation record?' },
  l2: { label: 'Which section of the innovation record does this document support?' },
  l3: {
    label: 'What do you want to name this document?',
    description: 'Enter a name with a maximum of 100 characters.'
  },
  l4: {
    label: 'Write a short description fot his document (optional)',
    description: 'Enter a brief description about this document.'
  },
  l5: { label: 'Upload the document', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.' }
};


// Types.
type InboundPayloadType = InnovationDocumentInfoOutDTO;
type StepPayloadType = {
  contextType?: InnovationDocumentInfoOutDTO['context']['type'],
  section?: string,
  name?: string,
  description?: string,
  file?: FileUploadType
};
export type OutboundPayloadType = UpsertInnovationDocumentType;


// consts.
const relatedWithSectionItems = [
  { value: 'INNOVATION_SECTION', label: 'Yes' },
  { value: 'INNOVATION', label: 'No' }
];
const innovationSectionsItems = getAllSectionsList();


export const DOCUMENT_INNOVATOR_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'contextType', dataType: 'radio-group', label: stepsLabels.l1.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: relatedWithSectionItems
      }]
    })
  ],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

export const DOCUMENT_OTHER_USERS_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'name', dataType: 'text', label: stepsLabels.l3.label, description: stepsLabels.l3.description,
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'description', dataType: 'textarea', label: stepsLabels.l4.label, description: stepsLabels.l4.description,
        lengthLimit: 's'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'file', dataType: 'file-upload', label: stepsLabels.l5.label, description: stepsLabels.l5.description,
        validations: { isRequired: [true, 'You need to upload 1 file'] }
      }]
    })
  ],
  showSummary: true,
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

export const DOCUMENT_EDIT_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'name', dataType: 'text', label: stepsLabels.l3.label, description: stepsLabels.l3.description,
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'description', dataType: 'textarea', label: stepsLabels.l4.label, description: stepsLabels.l4.description,
        lengthLimit: 's'
      }]
    })
  ],
  showSummary: true,
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (currentValues.contextType === 'INNOVATION_SECTION') {

    steps.push(new FormEngineModel({
      parameters: [{
        id: 'section', dataType: 'radio-group', label: stepsLabels.l2.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: innovationSectionsItems
      }]
    }));

  } else {
    delete currentValues.section;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'name', dataType: 'text', label: stepsLabels.l3.label, description: stepsLabels.l3.description,
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'description', dataType: 'textarea', label: stepsLabels.l4.label, description: stepsLabels.l4.description,
        lengthLimit: 's'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'file', dataType: 'file-upload', label: stepsLabels.l5.label, description: stepsLabels.l5.description,
        validations: { isRequired: [true, 'You need to upload 1 file'] }
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    contextType: data.context.type,
    ...(data.context.type === 'INNOVATION_SECTION' && { section: data.context.id }),
    name: data.name,
    description: data.description,
    file: data.file
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    contextType: data.contextType ?? 'INNOVATION',
    section: data.section,
    name: data.name ?? '',
    description: data.description,
    file: data.file
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  if (data.contextType) { // When the user IS NOT an innovator, this question is not asked!
    toReturn.push({
      label: stepsLabels.l1.label,
      value: relatedWithSectionItems.find(item => item.value === data.contextType)?.label,
      editStepNumber: editStepNumber++
    });
  }

  if (data.contextType === 'INNOVATION_SECTION') {
    toReturn.push({
      label: stepsLabels.l2.label,
      value: innovationSectionsItems.find(item => item.value === data.section)?.label,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push(
    {
      label: stepsLabels.l3.label,
      value: data.name,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l4.label,
      value: data.description,
      editStepNumber: editStepNumber++
    },
    {
      label: 'Uploaded document',
      value: `<a href='${data.file?.url}'>${data.file?.name}</a>`,
      editStepNumber: editStepNumber++,
      allowHTML: true
    }
  );

  return toReturn;

}
