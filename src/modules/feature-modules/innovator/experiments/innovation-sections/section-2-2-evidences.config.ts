import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { typeOfEvidenceItems } from './catalog.config';


// Labels.
const stepsLabels = {
  l1: 'What type of evidence or research do you want to submit?',
  l2: 'What type of evidence do you have?',
  l3: 'What type of economic evidence do you have?',
  l4: 'What other type of evidence do you have?',
  l5: 'Write a short summary of the evidence',
  l6: 'Upload any documents that support this evidence '
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
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'description', dataType: 'text', label: 'Other type of evidence', validations: { isRequired: [true, 'Other description is required'] } })
  }
];


// Types.
type BaseType = {
  evidenceType: null | string;
  clinicalEvidenceType: null | string;
  description: string;
  summary: string;
  files: { id: string, displayFileName: string, url: string }[];
};

type InboundPayloadType = Partial<BaseType>;

type StepPayloadType = Omit<BaseType, 'files'> & { files: { id: string; name: string; url: string; }[] };

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
        items: typeOfEvidenceItems
      }]
    })
  ],
  showSummary: true,
  runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: SummaryPayloadType) => summaryParsing(data),
  summaryPDFParsing: (data: SummaryPayloadType) => summaryPDFParsing(data)
});



function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  switch (currentValues.evidenceType) {

    case 'Evidence of clinical or care outcomes':
    case 'Pre-clinical evidence':
    case 'Real world evidence':
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

    case 'Evidence of cost impact, efficiency gains and/or economic modelling':
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

    case 'Other evidence of effectiveness (for example environmental or social)':
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
        lengthLimit: 'medium'
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'files',
        dataType: 'file-upload',
        label: stepsLabels.l6,
        description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 9MB.',
        validations: { isRequired: [true, 'Upload at least one file'] }
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
    value: typeOfEvidenceItems.find(item => item.value === data.evidenceType)?.label,
    editStepNumber: 1
  });


  switch (data.evidenceType) {
    case 'Evidence of clinical or care outcomes':
    case 'Pre-clinical evidence':
    case 'Real world evidence':
      toReturn.push({
        label: stepsLabels.l2,
        value: clinicalEvidenceItems.find(item => item.value === data.clinicalEvidenceType)?.label,
        editStepNumber: 2
      });
      break;
    case 'Evidence of cost impact, efficiency gains and/or economic modelling':
      toReturn.push({
        label: stepsLabels.l3,
        value: data.description,
        editStepNumber: 2
      });
      break;

    case 'Other evidence of effectiveness (for example environmental or social)':
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

function summaryPDFParsing(data: SummaryPayloadType): WizardSummaryType[] {
  const summaryData = summaryParsing(data)
    .filter(item => item.type !== 'button')
    .filter(item => !item.isFile);

  return summaryData.filter(item => item.type !== 'button');
}
