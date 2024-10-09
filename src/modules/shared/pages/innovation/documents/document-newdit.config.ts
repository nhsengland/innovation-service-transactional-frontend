import { FileUploadType } from '@app/base/forms';

import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import {
  InnovationDocumentInfoOutDTO,
  UpsertInnovationDocumentType
} from '@modules/shared/services/innovation-documents.service';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';
import { getAllSectionsListV3 } from '@modules/stores/innovation/innovation-record/ir-versions.config';

// Labels.
const stepsLabels = {
  l1: { label: 'Is this document related to any section of your innovation record?' },
  l2: { label: 'Which section of the innovation record does this document support?' },
  l3: { label: 'This document relates with the section or is it related to an evidence?' },
  l4: {
    label: 'What do you want to name this document?',
    description: 'Enter a name with a maximum of 100 characters.'
  },
  l5: {
    label: 'Write a short description for this document (optional)',
    description: 'Enter a short description about this document.'
  },
  l6: { label: 'Upload the document', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.' }
};

// Types.
type InboundPayloadType = Partial<InnovationDocumentInfoOutDTO> & {
  innovationId: string;
  wizardType: 'WIZARD_BASE_QUESTIONS' | 'WIZARD_EDIT_QUESTIONS' | 'WIZARD_WITH_LOCATION_QUESTIONS';
  schema: InnovationRecordSchemaInfoType;
};
type StepPayloadType = {
  // Logic fields.
  innovationId: string;
  wizardType: 'WIZARD_BASE_QUESTIONS' | 'WIZARD_EDIT_QUESTIONS' | 'WIZARD_WITH_LOCATION_QUESTIONS';
  contextType: InnovationDocumentInfoOutDTO['context']['type'];
  // evidencesList?: { id: string, name: string, summary: string }[],
  section?: string;
  evidence?: string;
  progressUpdate?: string;
  // Questions fields.
  relatedWithSection?: 'YES' | 'NO';
  name?: string;
  description?: string;
  file?: FileUploadType;
};
export type OutboundPayloadType = UpsertInnovationDocumentType;

// consts.
const relatedWithSectionItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];
// const injector = AppInjector.getInjector();
// const innovationStoreInnovationService = injector?.get(InnovationService); // Needs to have the optional because of tests.
// const evidencesSectionId = 'EVIDENCE_OF_EFFECTIVENESS';

export const WIZARD_BASE_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l4.label,
          description: stepsLabels.l4.description,
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'description',
          dataType: 'textarea',
          label: stepsLabels.l5.label,
          description: stepsLabels.l5.description,
          lengthLimit: 's'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'file',
          dataType: 'file-upload',
          label: stepsLabels.l6.label,
          description: stepsLabels.l6.description,
          validations: { isRequired: [true, 'You need to upload 1 file'] }
        }
      ]
    })
  ],
  showSummary: true,
  inboundParsing: (data: InboundPayloadType) => inboundParsing({ ...data, wizardType: 'WIZARD_BASE_QUESTIONS' }),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[], schema?: InnovationRecordSchemaInfoType) =>
    summaryParsing(data, schema)
});

export const WIZARD_EDIT_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l4.label,
          description: stepsLabels.l4.description,
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'description',
          dataType: 'textarea',
          label: stepsLabels.l5.label,
          description: stepsLabels.l5.description,
          lengthLimit: 's'
        }
      ]
    })
  ],
  showSummary: true,
  inboundParsing: (data: InboundPayloadType) => inboundParsing({ ...data, wizardType: 'WIZARD_EDIT_QUESTIONS' }),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[], schema?: InnovationRecordSchemaInfoType) =>
    summaryParsing(data, schema)
});

export const WIZARD_WITH_LOCATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'relatedWithSection',
          dataType: 'radio-group',
          label: stepsLabels.l1.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: relatedWithSectionItems
        }
      ]
    })
  ],
  showSummary: true,
  runtimeRules: [
    (
      steps: WizardStepType[],
      currentValues: StepPayloadType,
      currentStep: number | 'summary',
      schema?: InnovationRecordSchemaInfoType
    ) => wizardWithLocationRuntimeRules(steps, currentValues, currentStep, schema)
  ],
  inboundParsing: (data: InboundPayloadType) =>
    inboundParsing({ ...data, wizardType: 'WIZARD_WITH_LOCATION_QUESTIONS' }),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[], schema?: InnovationRecordSchemaInfoType) =>
    summaryParsing(data, schema)
});

function wizardWithLocationRuntimeRules(
  steps: WizardStepType[],
  data: StepPayloadType,
  currentStep: number | 'summary',
  schema: InnovationRecordSchemaInfoType | undefined
): void {
  // As we need to do async calls, we do it only one time at the begginning.
  // Response will be received after this method finishes, but that's not a problem as this information is only needed on step 3.
  // if (!data.evidencesList) {
  //   innovationStoreInnovationService.getSectionInfo(data.innovationId, evidencesSectionId, {}).subscribe({
  //     next: response => {
  //       if (response.data.hasEvidence === 'YES') { // Only show evidences if section 2.2 question is YES.
  //         data.evidencesList = ((response.data.evidences as StepPayloadType['evidencesList']) ?? []).map(item => ({ id: item.id, name: item.name, summary: StringsHelper.smartTruncate(item.summary, 150) }));
  //       } else {
  //         data.evidencesList = [];
  //       }
  //     },
  //     error: () => console.error('Error fetching section/evidences information.')
  //   });
  // }

  steps.splice(1);
  const innovationSectionsItems = schema ? getAllSectionsListV3(schema) : [];
  if (data.relatedWithSection === 'YES') {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'section',
            dataType: 'radio-group',
            label: stepsLabels.l2.label,
            description: `If you want to upload evidence of impact and benefit, go to <a href="/innovator/innovations/${data.innovationId}/record/sections/EVIDENCE_OF_EFFECTIVENESS">this section of your innovation record</a>`,
            validations: { isRequired: [true, 'Choose one option'] },
            items: innovationSectionsItems.map(item => ({
              ...item
              // ...(item.value === evidencesSectionId && (data.evidencesList ?? []).length > 0 && {
              //   description: `There's ${data.evidencesList?.length} evidence${data.evidencesList?.length === 1 ? '' : 's'}. Choosing this section we'll ask you more information on the next question.`
              // })
            }))
          }
        ]
      })
    );

    // if (data.section === evidencesSectionId && (data.evidencesList ?? []).length > 0) {

    //   steps.push(new FormEngineModel({
    //     parameters: [{
    //       id: 'evidence', dataType: 'radio-group', label: stepsLabels.l3.label,
    //       validations: { isRequired: [true, 'Choose one option'] },
    //       items: [
    //         ...[{ value: 'NONE', label: `I want to upload this document on section "${innovationSectionsItems.find(item => item.value === evidencesSectionId)?.label}", not an evidence` }],
    //         ...(data.evidencesList ?? []).map(item => ({ value: item.id, label: item.name, description: item.summary }))
    //       ]
    //     }]
    //   }));

    // } else {
    //   delete data.evidence;
    // }
  } else {
    delete data.section;
    // delete data.evidence;
  }

  // Updates contextType as this is defined by questions on 3 first steps!
  // if (data.evidence && data.evidence !== 'NONE') {
  //   data.contextType = 'INNOVATION_EVIDENCE';
  if (data.section) {
    data.contextType = 'INNOVATION_SECTION';
  } else {
    data.contextType = 'INNOVATION';
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: stepsLabels.l4.label,
          description: stepsLabels.l4.description,
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'description',
          dataType: 'textarea',
          label: stepsLabels.l5.label,
          description: stepsLabels.l5.description,
          lengthLimit: 's'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'file',
          dataType: 'file-upload',
          label: stepsLabels.l6.label,
          description: stepsLabels.l6.description,
          validations: { isRequired: [true, 'You need to upload 1 file'] }
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    innovationId: data.innovationId,
    wizardType: data.wizardType,
    contextType: data.context?.type ?? 'INNOVATION',
    ...(data.context?.type === 'INNOVATION_SECTION' && { section: data.context.id }),
    ...(data.context?.type === 'INNOVATION_EVIDENCE' && { evidence: data.context.id }),
    ...(data.context?.type === 'INNOVATION_PROGRESS_UPDATE' && { progressUpdate: data.context.id }),
    name: data.name,
    description: data.description,
    file: data.file
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  let contextId = '';
  switch (data.contextType) {
    case 'INNOVATION':
      contextId = data.innovationId;
      break;
    case 'INNOVATION_SECTION':
      contextId = data.section ?? '';
      break;
    case 'INNOVATION_EVIDENCE':
      contextId = data.evidence ?? '';
      break;
    case 'INNOVATION_PROGRESS_UPDATE':
      contextId = data.progressUpdate ?? '';
      break;
  }

  return {
    context: { type: data.contextType ?? 'INNOVATION', id: contextId },
    name: data.name ?? '',
    ...(data.description && { description: data.description }),
    ...(data.file && {
      file: {
        id: data.file.id,
        name: data.file.name,
        size: data.file.size,
        extension: data.file.extension
      }
    })
  };
}

function summaryParsing(data: StepPayloadType, schema?: InnovationRecordSchemaInfoType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  const innovationSectionsItems = schema ? getAllSectionsListV3(schema) : [];

  if (data.wizardType === 'WIZARD_WITH_LOCATION_QUESTIONS') {
    toReturn.push({
      label: stepsLabels.l1.label,
      value: relatedWithSectionItems.find(item => item.value === data.relatedWithSection)?.label,
      editStepNumber: editStepNumber++
    });

    if (data.contextType === 'INNOVATION_SECTION' || data.contextType === 'INNOVATION_EVIDENCE') {
      toReturn.push({
        label: stepsLabels.l2.label,
        value: innovationSectionsItems.find(item => item.value === data.section)?.label,
        editStepNumber: editStepNumber++
      });

      // if (data.evidence) {
      //   if (data.evidence === 'NONE') { editStepNumber++ }
      //   else {
      //     toReturn.push({
      //       label: 'Which evidence does this document support?',
      //       value: (data.evidencesList ?? []).find(item => item.id === data.evidence)?.name,
      //       editStepNumber: editStepNumber++
      //     });
      //   }
      // }
    }
  }

  toReturn.push(
    {
      label: stepsLabels.l4.label,
      value: data.name,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.l5.label,
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
