import {
  FormEngineModel,
  FormEngineParameterModel,
  WizardEngineModel,
  WizardStepType,
  WizardSummaryType
} from '@modules/shared/forms';
import { FileUploadType, INPUT_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';
import { InnovationRecordSchemaInfoType } from '@modules/stores/ctx/schema/schema.types';
import { getIrSchemaQuestionItemsValueAndLabel } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema-translation.helper';

const stepsLabels = {
  q1: {
    label: 'What is the name of your innovation?',
    description: 'Enter the name of your innovation with a maximum of 100 characters'
  },
  q2: {
    label: 'Provide a short description of your innovation',
    description:
      'Provide a high-level overview of your innovation. You will have the opportunity to explain its impact, target population, testing and revenue model later in the innovation record.'
  },
  q3: {
    label: 'Where is your head office located?',
    description: `
      <p>If your head office is overseas but you have a UK office, use the UK address.</p>
      <p>If you are not part of a company or organisation, put where you are based.</p>
      <p>We ask this to identify the organisations and people who are in the best position to support you.</p>`
  },
  q4: { label: 'What is your head office postcode?' },
  q5: { label: 'Which country is your head office located in?' },
  q6: { label: 'Does your innovation have a website?' },
  q7: { label: 'Does your innovation have a video that explains how it works ?' }
};

// Types.
type NewInnovationStepPayloadType = {
  name: string;
  description?: string;
  officeLocation: string;
  countryLocation: null | string[];
  postcode?: string;
  hasWebsite: string;
  website?: string;
  hasVideoDemonstration?: string;
  videoDemonstrationUrl?: string;
};

type ImportInnovationStepPayloadType = {
  file: FileUploadType;
};

type NewInnovationOutboundPayloadType = {
  name: string;
  description: string;
  officeLocation: string;
  countryLocation?: string;
  postcode?: string;
  website?: string;
  hasWebsite: string;
  hasVideoDemonstration?: string;
  videoDemonstrationUrl?: string;
};

export function getImportInnovationQuestionsWizard(): WizardEngineModel {
  return new WizardEngineModel({
    showSummary: false,
    steps: [
      new FormEngineModel({
        label: 'Register a new innovation',
        parameters: []
      }),
      new FormEngineModel({
        label: 'Import an existing innovation',

        parameters: [
          {
            id: 'file',
            dataType: 'file-upload',
            validations: { isRequired: [true, 'You need to upload 1 file'] }
          }
        ]
      })
    ],
    outboundParsing: (data: ImportInnovationStepPayloadType) => ImportInnovationOutboundParsing(data),

  });
}

export function getNewInnovationQuestionsWizard(currentSchema: InnovationRecordSchemaInfoType): WizardEngineModel {
  return new WizardEngineModel({
    showSummary: true,
    steps: [
      new FormEngineModel({
        label: 'Register a new innovation',
        parameters: []
      }),

      new FormEngineModel({
        parameters: [
          {
            id: 'name',
            dataType: 'text',
            label: stepsLabels.q1.label,
            description: stepsLabels.q1.description,
            validations: { isRequired: [true, 'Innovation name is required'], maxLength: 100 }
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'description',
            dataType: 'textarea',
            label: stepsLabels.q2.label,
            description: stepsLabels.q2.description,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 's'
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'officeLocation',
            dataType: 'radio-group',
            label: stepsLabels.q3.label,
            description: stepsLabels.q3.description,
            validations: { isRequired: [true, 'Choose one option'] },
            items: translateOfficeLocationListFromV3(
              getIrSchemaQuestionItemsValueAndLabel(currentSchema, 'officeLocation')
            )
          }
        ]
      })
    ],
    runtimeRules: [
      (
        steps: WizardStepType[],
        currentValues: NewInnovationStepPayloadType,
        currentStep: number | 'summary',
        schema?: InnovationRecordSchemaInfoType
      ) => runtimeRules(steps, currentValues, currentStep, currentSchema)
    ],
    outboundParsing: (data: NewInnovationStepPayloadType) => NewInnovationOutboundParsing(data),
    summaryParsing: (data: NewInnovationStepPayloadType) => summaryParsing(data)
  });
}

function runtimeRules(
  steps: WizardStepType[],
  currentValues: NewInnovationStepPayloadType,
  currentStep: number | 'summary',
  schema?: InnovationRecordSchemaInfoType
): void {
  steps.splice(4);

  if (currentValues.officeLocation !== 'Based outside UK') {
    currentValues.countryLocation = null;

    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'postcode',
            dataType: 'text',
            label: stepsLabels.q4.label,
            validations: { isRequired: [true, 'Postcode is required'], maxLength: 8, postcodeFormat: true }
          }
        ]
      })
    );
  } else {
    delete currentValues.postcode;

    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'countryLocation',
            dataType: 'autocomplete-array',
            label: stepsLabels.q5.label,
            validations: { isRequired: [true, 'You must choose one country'], max: [1, 'Only 1 country is allowed'] },
            items: schema ? getIrSchemaQuestionItemsValueAndLabel(schema, 'countryLocation') : []
          }
        ]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'hasWebsite',
          dataType: 'radio-group',
          label: stepsLabels.q6.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({
                id: 'website',
                dataType: 'text',
                label: 'Website',
                validations: {
                  isRequired: [true, 'Website url is required'],
                  urlFormat: { maxLength: INPUT_LENGTH_LIMIT.xxs }
                }
              })
            },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  );

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'hasVideoDemonstration',
          dataType: 'radio-group',
          label: stepsLabels.q7.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({
                id: 'videoDemonstrationUrl',
                dataType: 'text',
                label: 'Link',
                validations: {
                  urlFormat: { maxLength: 2000 }
                }
              })
            },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  );
}

function NewInnovationOutboundParsing(data: NewInnovationStepPayloadType): NewInnovationOutboundPayloadType {
  return {
    name: data.name.trim(),
    description: data.description ?? '',
    officeLocation: data.officeLocation,
    countryLocation: data.countryLocation ? data.countryLocation[0] : undefined,
    postcode: data.postcode ?? undefined,
    hasWebsite: data.hasWebsite,
    website: data.website ?? undefined,
    hasVideoDemonstration: data.hasVideoDemonstration,
    videoDemonstrationUrl: data.videoDemonstrationUrl ?? undefined
  };
}

function ImportInnovationOutboundParsing (data: ImportInnovationStepPayloadType): ImportInnovationStepPayloadType {
  return {
    file: data.file
  }
}

function summaryParsing(data: NewInnovationStepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 2;

  toReturn.push(
    { label: stepsLabels.q1.label, value: data.name, editStepNumber: editStepNumber++ },
    { label: stepsLabels.q2.label, value: data.description, editStepNumber: editStepNumber++ },
    {
      label: stepsLabels.q3.label,
      value: data.officeLocation,
      editStepNumber: editStepNumber++
    }
  );

  if (data.officeLocation !== 'Based outside UK') {
    toReturn.push({
      label: stepsLabels.q4.label,
      value: data.postcode,
      editStepNumber: editStepNumber++
    });
  } else {
    toReturn.push({
      label: stepsLabels.q5.label,
      value: data.countryLocation ? data.countryLocation[0] : null,
      editStepNumber: editStepNumber++
    });
  }

  toReturn.push({
    label: stepsLabels.q6.label,
    value: data.hasWebsite === 'YES' ? `Yes \n${data.website}` : 'No',
    editStepNumber: editStepNumber++
  });

  toReturn.push({
    label: stepsLabels.q7.label,
    value: data.hasVideoDemonstration === 'YES' ? `Yes \n${data.videoDemonstrationUrl}` : 'No',
    editStepNumber: editStepNumber++
  });

  return toReturn;
}

// Helper to translate new officeLocation format to old IR one
function translateOfficeLocationListFromV3(
  officeLocation: {
    value: string;
    label: string;
  }[]
): {
  value: string;
  label: string;
}[] {
  return officeLocation.map(loc => {
    if (loc.value === '') {
      return { value: '', label: 'SEPARATOR' };
    }
    return loc;
  });
}
