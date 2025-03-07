import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { INPUT_LENGTH_LIMIT } from '@modules/shared/forms/engine/config/form-engine.config';
import { organisationStepsDescriptions } from './organisation-edit.config';
import { organisationUnitStepsDescriptions } from './organisation-unit-new/organisation-unit-new.config';

// Types.
type organisationsListType = {
  acronym: string;
  name: string;
  units: { acronym: string; name: string }[];
}[];

export type InboundPayloadType = {
  organisationsList: organisationsListType;
};

type StepPayloadType = {
  name: string;
  acronym: string;
  summary: string;
  website: string;
  doAssociateUnits: 'YES' | 'NO';
  createUnitNumber: number;
  organisationsList: organisationsListType;
  organisationNamesList: string[];
  organisationUnitNamesList: string[];
} & Record<string, null | number | string | string[] | organisationsListType>;

export type OutboundPayloadType = {
  name: string;
  acronym: string;
  summary: string;
  website: string;
  units: { name: string; acronym: string }[];
};

export const CREATE_NEW_ORGANISATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'name',
          dataType: 'text',
          label: `Add the name of the new organisation`,
          description: organisationStepsDescriptions.l1,
          validations: {
            isRequired: [true, 'Name is required'],
            pattern: ['^[a-zA-Z() ]*$', 'Organisation names must not include numbers or brackets'],
            maxLength: 100
          }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'acronym',
          dataType: 'text',
          label: `Add an acronym for this organisation`,
          description: organisationStepsDescriptions.l2,
          validations: {
            isRequired: [true, 'Acronym is required'],
            pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
            maxLength: 10
          }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'website',
          dataType: 'text',
          label: 'Website',
          description: organisationStepsDescriptions.l3,
          validations: {
            isRequired: [true, 'Website url is required'],
            urlFormat: { maxLength: INPUT_LENGTH_LIMIT.xs }
          },
          lengthLimit: 'xs'
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'summary',
          dataType: 'textarea',
          label: 'Organisation summary',
          description: organisationStepsDescriptions.l4,
          validations: {
            isRequired: [true, 'Summary is required']
          },
          lengthLimit: 'xxl'
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'doAssociateUnits',
          dataType: 'radio-group',
          label: 'Do you want to associate units to this organisation?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  ],
  runtimeRules: [
    (steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') =>
      runtimeRules(steps, data, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {
  const chosenUnitNames = Object.entries(data)
    .filter(([key]) => key.startsWith(`unitName-`))
    .map(([key, value]) => value as string);
  const chosenUnitAcronyms = Object.entries(data)
    .filter(([key]) => key.startsWith('unitAcronym-'))
    .map(([key, value]) => value as string);
  const unitsToCreate = Object.keys(data).filter(key => key.startsWith('unitName-'));

  steps.splice(5);

  if (data.doAssociateUnits === 'NO') {
    Object.keys(data)
      .filter(key => key.startsWith('unitName-') || key.startsWith('unitAcronym-'))
      .forEach(key => {
        delete data[key];
      });
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: `createUnitNumber`,
            dataType: 'number',
            label: 'How many units do you want to create?',
            validations: {
              isRequired: [true, 'A number is required'],
              min: [2, 'At least 2 units required'],
              max: [10, 'Maximum 10 units on creation']
            }
          }
        ]
      })
    );

    for (let i = unitsToCreate.length; i > data.createUnitNumber; i--) {
      delete data[`unitName-${i}`];
      delete data[`unitAcronym-${i}`];
    }

    for (let i = 1; i <= data.createUnitNumber; i++) {
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: `unitName-${i}`,
              dataType: 'text',
              label: `Add a name for unit number ${i}`,
              description: organisationUnitStepsDescriptions.l1,
              validations: {
                isRequired: [true, 'Unit name is required'],
                pattern: ['^[a-zA-Z() ]*$', 'Unit names must not include numbers or brackets'],
                maxLength: 100,
                existsIn: [
                  // Excludes current value from validation.
                  [...data.organisationNamesList, ...chosenUnitNames.filter(item => item !== data[`unitName-${i}`])],
                  'Unit name already exists'
                ]
              }
            }
          ]
        }),
        new FormEngineModel({
          parameters: [
            {
              id: `unitAcronym-${i}`,
              dataType: 'text',
              label: `Add an acronym for unit number ${i}`,
              description: organisationUnitStepsDescriptions.l2,
              validations: {
                isRequired: [true, 'Unit acronym is required'],
                pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
                maxLength: 10,
                existsIn: [
                  // Excludes current value from validation.
                  [
                    ...data.organisationUnitNamesList,
                    ...chosenUnitAcronyms.filter(item => item !== data[`unitAcronym-${i}`])
                  ],
                  'Unit acronym already exists'
                ]
              }
            }
          ]
        })
      );
    }
  }
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    name: '',
    acronym: '',
    summary: '',
    website: '',
    doAssociateUnits: 'NO',
    createUnitNumber: 2,
    organisationsList: data.organisationsList,
    organisationNamesList: data.organisationsList.flatMap(o => o.units.map(u => u.name)),
    organisationUnitNamesList: data.organisationsList.flatMap(o => o.units.map(u => u.acronym))
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    name: data.name,
    acronym: data.acronym,
    summary: data.summary,
    website: data.website,
    units: Object.entries(data)
      .filter(([key]) => key.startsWith(`unitName-`))
      .map(([key, value]) => ({
        name: value as string,
        acronym: data[key.replace('unitName-', 'unitAcronym-')] as string
      }))
  };
}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push({ label: 'Organisation', value: `${data.name} (${data.acronym})`, editStepNumber: 1 });
  toReturn.push({ label: 'Website', value: data.website, editStepNumber: 3 });
  toReturn.push({ label: 'Summary', value: data.summary, editStepNumber: 4 });

  if (data.doAssociateUnits === 'YES') {
    Object.keys(data)
      .filter(key => key.startsWith('unitName-'))
      .forEach((key, index) => {
        toReturn.push({
          label: `Unit ${index + 1}`,
          value: `${data[key]} (${data[key.replace('unitName-', 'unitAcronym-')]})`,
          editStepNumber: 7 + index * 2
        });
      });
  }

  return toReturn;
}
