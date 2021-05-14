import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, FormEngineParameterModel } from '@modules/shared/forms/engine/models/form-engine.models';
import { SummaryParsingType, WizardEngineModel } from '@modules/shared/forms/engine/models/wizard-engine.models';
import { cloneDeep } from 'lodash';


const stepsLabels = {
  s_1_1_1: 'What type of evidence do you want to submit?',
  s_1_1_2: 'What type of clinical evidence?',
  s_1_1_3: 'What type of economic evidence?',
  s_1_1_4: 'What other type of evidence?',
  s_1_1_5: 'Please write a short summary of the evidence',
  s_1_1_6: 'Please upload any documents that support this evidence'
};


export const evidenceTypeItems = [
  { value: 'clinical', label: 'Clinical evidence' },
  { value: 'economic', label: 'Economic evidence' },
  { value: 'other', label: 'Other evidence of effectiveness' }
];

export const clinicalEvidenceItems = [
  { value: 'DATA_PUBLISHED', label: 'Data published, but not in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_COMPARATIVE_DATA', label: 'Non-randomised comparative data published in a peer reviewed journal' },
  { value: 'NON_RANDOMISED_NON_COMPARATIVE_DATA', label: 'Non-randomised non-comparative data published in a peer reviewed journal' },
  { value: 'CONFERENCE', label: 'Poster or abstract presented at a conference' },
  { value: 'RANDOMISED_CONTROLLED_TRIAL', label: 'Randomised controlled trial published in a peer reviewed journal' },
  { value: 'UNPUBLISHED_DATA', label: 'Unpublished data' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'description', dataType: 'text', validations: { isRequired: true } })
  }
];


export const SECTION_2_EVIDENCES = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      label: stepsLabels.s_1_1_1,
      parameters: [{
        id: 'evidenceType',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: evidenceTypeItems
      }]
    })
  ],
  runtimeRules: [(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
  inboundParsing: (data: any) => inboundParsing(data),
  outboundParsing: (data: any) => outboundParsing(data),
  summaryParsing: (steps: FormEngineModel[], data: any) => summaryParsing(steps, data)

});



// type toType = {
// 'evidenceType': 'EvidenceTypeCatalogue',
// 'clinicalEvidenceType': 'ClinicalEvidenceTypeCatalogue',
// 'description': 'description',
// 'summary': 'summary'
// 'files': ['id', 'id']
// }



// Add/remove new steps for each subgroup defined on step 2.
function runtimeRules(steps: FormEngineModel[], currentValues: MappedObject, currentStep: number): void {

  steps.splice(1);

  switch (currentValues.evidenceType) {
    case 'clinical':
      steps.push(
        new FormEngineModel({
          label: stepsLabels.s_1_1_2,
          parameters: [{
            id: 'clinicalEvidenceType',
            dataType: 'radio-group',
            validations: { isRequired: true },
            items: clinicalEvidenceItems
          }]
        })
      );
      break;

    case 'economic':
      steps.push(
        new FormEngineModel({
          label: stepsLabels.s_1_1_3,
          visibility: { parameter: 'hasEvidence', values: ['economic'] },
          parameters: [{
            id: 'description',
            dataType: 'text',
            validations: { isRequired: true }
          }]
        }),
      );

      delete currentValues.clinicalEvidenceType;
      break;


    case 'other':
      steps.push(
        new FormEngineModel({
          label: stepsLabels.s_1_1_4,
          visibility: { parameter: 'hasEvidence', values: ['other'] },
          parameters: [{
            id: 'description',
            dataType: 'text',
            validations: { isRequired: true }
          }]
        })
      );
      delete currentValues.clinicalEvidenceType;
      break;

    default:
      break;
  }

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_1_1_5,
      description: 'Please provide a short summary including the scope of the study and the key findings. Accessors will read this summary to understand if any particular piece of evidence is of interest in relation to what they can help you with.',
      parameters: [{
        id: 'summary',
        dataType: 'text',
        validations: { isRequired: true }
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_1_1_6,
      description: 'The files must be CSV, XLSX, DOCX or PDF.',
      parameters: [{
        id: 'files',
        dataType: 'file-upload',
        validations: { isRequired: true }
      }],
    })
  );

}



type inboundData = {
  id: string;
  evidenceType?: 'clinical' | 'economic' | 'other';
  clinicalEvidenceType?: string;
  description: null | string;
  summary: string;
  files: { id: string, displayFileName: string, url: string }[];
  createdBy: string;
  createdAt?: string;
  updatedBy: string;
  updatedAt?: string;
};

function inboundParsing(data: inboundData): MappedObject {

  const parsedData = cloneDeep(data);

  return {
    evidenceType: parsedData.evidenceType,
    clinicalEvidenceType: parsedData.clinicalEvidenceType,
    description: parsedData.description,
    summary: parsedData.summary,
    files: (parsedData.files || []).map(item => ({ id: item.id, name: item.displayFileName, url: item.url }))
  };

}



type outboundParsingData = {
  evidenceType?: 'clinical' | 'economic' | 'other';
  clinicalEvidenceType?: string;
  description?: string;
  summary?: string;
  files?: { id: string; name: string; }[];
};

function outboundParsing(data: outboundParsingData): MappedObject {

  return {
    evidenceType: data.evidenceType,
    clinicalEvidenceType: data.clinicalEvidenceType,
    description: data.description,
    summary: data.summary,
    files: (data.files || []).map(item => item.id)
  };

}



type summaryData = {
  evidenceType?: 'clinical' | 'economic' | 'other';
  clinicalEvidenceType?: string;
  description?: string;
  summary?: string;
  files?: ({ id: string, displayFileName: string, url: string } | { id: string, name: string })[];
  // files: { id: string, name: string }[];
  // previousUploadedFiles: { id: string, name: string, url: string }[];
  // createdBy: string;
  // createdAt?: string;
  // updatedBy: string;
  // updatedAt?: string;
};

function summaryParsing(steps: FormEngineModel[], data: summaryData): SummaryParsingType[] {

  const toReturn: any = [];

  toReturn.push({
    label: stepsLabels.s_1_1_1,
    value: evidenceTypeItems.find(item => item.value === data.evidenceType)?.label || '',
    editStepNumber: 1
  });


  switch (data.evidenceType) {
    case 'clinical':
      toReturn.push({
        label: stepsLabels.s_1_1_2,
        value: clinicalEvidenceItems.find(item => item.value === data.clinicalEvidenceType)?.label || '',
        editStepNumber: 2
      });
      break;
    case 'economic':
      toReturn.push({
        label: stepsLabels.s_1_1_3,
        value: data.description,
        editStepNumber: 2
      });
      break;

    case 'other':
      toReturn.push({
        label: stepsLabels.s_1_1_4,
        value: data.description,
        editStepNumber: 2
      });
      break;

    default:
      break;
  }


  toReturn.push({
    label: stepsLabels.s_1_1_5,
    value: data.summary,
    editStepNumber: 3
  });


  const allFiles = (data.files || []).map((item: any) => ({ id: item.id, name: item.name || item.displayFileName, url: item.url }));

  allFiles.forEach((item, i) => {
    toReturn.push({
      label: `Attachment ${i + 1}`,
      value: item.name || 'Unknown',
      editStepNumber: 4
    });
  });

  return toReturn;

}
