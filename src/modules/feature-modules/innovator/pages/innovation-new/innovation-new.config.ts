import {
  FormEngineModel,
  FormEngineParameterModel,
  WizardEngineModel,
  WizardStepType,
  WizardSummaryType
} from '@modules/shared/forms';
import { catalogOfficeLocation } from '@modules/stores/innovation/innovation-record/202304/catalog.types';
import { countriesItems, locationItems } from '@modules/stores/innovation/innovation-record/202304/forms.config';

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
  q6: { label: 'Does your innovation have a website?' }
};

// Types.
type StepPayloadType = {
  name: string;
  description?: string;
  officeLocation: catalogOfficeLocation;
  countryLocation: null | string[];
  countryName?: string;
  postcode?: string;
  hasWebsite: string;
  website?: string;
};

type OutboundPayloadType = {
  name: string;
  description: string;
  countryName: string;
  postcode?: string;
  website?: string;
};

export const NEW_INNOVATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      label: 'Register a new innovation',
      description: "We'll ask you for the name and a brief description of the innovation.",
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
          items: locationItems
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, currentValues, currentStep)
  ],
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
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
            items: countriesItems
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
                validations: { isRequired: [true, 'Website url is required'], maxLength: 100, urlFormat: true }
              })
            },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  );
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    name: data.name.trim(),
    description: data.description ?? '',
    countryName:
      data.officeLocation === 'Based outside UK' && data.countryLocation
        ? data.countryLocation[0]
        : data.officeLocation,
    postcode: data.postcode ?? undefined,
    website: data.website ?? undefined
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
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

  toReturn.push({ label: stepsLabels.q6.label, value: data.website ?? 'No', editStepNumber: editStepNumber++ });

  return toReturn;
}
