import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Labels.
const stepsLabels = {
  l1: 'What type of evidence do you want to submit?',
  l2: 'What type of clinical evidence?',
  l3: 'What type of economic evidence?',
  l4: 'What other type of evidence?',
  l5: 'Please write a short summary of the evidence',
  l6: 'Please upload any documents that support this evidence'
};


// Catalogs.
export const evidenceTypeItems = [
  { value: 'CLINICAL', label: 'Clinical evidence' },
  { value: 'ECONOMIC', label: 'Economic evidence' },
  { value: 'OTHER', label: 'Other evidence of effectiveness' }
];

export const clinicalEvidenceItems = [
  { value: 'DATA_PUBLISHED', label: 'Data published, but not in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_COMPARATIVE_DATA', label: 'Non-randomised comparative data published in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_NON_COMPARATIVE_DATA', label: 'Non-randomised non-comparative data published in a peer reviewed journal' },
  { value: 'CONFERENCE', label: 'Poster or abstract presented at a conference' },
  { value: 'RANDOMISED_CONTROLLED_TRIAL', label: 'Randomised controlled trial published in a peer reviewed journal' },
  { value: 'UNPUBLISHED_DATA', label: 'Unpublished data' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'description', dataType: 'text', label: 'Other clinical evidence', validations: { isRequired: [true, 'Other description is required'] } })
  }
];


// Types.
type InboundPayloadType = {
  id: string;
  evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER';
  clinicalEvidenceType: null | 'DATA_PUBLISHED' | 'NON_RANDOMISED_COMPARATIVE_DATA' | 'NON_RANDOMISED_NON_COMPARATIVE_DATA' | 'CONFERENCE' | 'RANDOMISED_CONTROLLED_TRIAL' | 'UNPUBLISHED_DATA' | 'OTHER';
  description: string;
  summary: string;
  files: { id: string, displayFileName: string, url: string }[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

type StepPayloadType = Omit<InboundPayloadType, 'id' | 'files' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'> & { files: { id: string; name: string; url: string; }[] };

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
  runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: SummaryPayloadType) => summaryParsing(data)
});



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number): void {

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
            validations: { isRequired: [true, 'Description is required'] }
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
        dataType: 'text',
        label: stepsLabels.l5,
        description: 'Please provide a short summary including the scope of the study and the key findings. Accessors will read this summary to understand if any particular piece of evidence is of interest in relation to what they can help you with.',
        validations: { isRequired: [true, 'Summary is required'] }
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'files',
        dataType: 'file-upload',
        label: stepsLabels.l6,
        description: 'The files must be CSV, XLSX, DOCX or PDF.',
        validations: { isRequired: [true, 'Upload at least one file'] }
      }],
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    evidenceType: data.evidenceType,
    clinicalEvidenceType: data.clinicalEvidenceType,
    description: data.description,
    summary: data.summary,
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


function summaryParsing(data: SummaryPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

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
      editStepNumber: 4
    });
  });

  return toReturn;

}
