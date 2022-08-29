import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type organisationsListType = {
  acronym: string, name: string, units: { acronym: string, name: string }[]
}[];

export type InboundPayloadType = {
  organisationsList: organisationsListType
};

type StepPayloadType = {
  name: string,
  acronym: string,
  doAssociateUnits: 'YES' | 'NO',
  createUnitNumber: number,
  organisationsList: organisationsListType,
  organisationNamesList: string[],
  organisationUnitNamesList: string[],
} & { [key: string]: null | number | string | string[] | organisationsListType };

export type OutboundPayloadType = {
  name: string,
  acronym: string,
  units: { name: string, acronym: string }[]
};


export let CREATE_NEW_ORGANISATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: `What's the name of the new organisation?`,
        validations: {
          isRequired: [true, 'Name is required'],
          pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
          maxLength: 100
        }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'acronym',
        dataType: 'text',
        label: `What's the acronym of the new organisation?`,
        validations: {
          isRequired: [true, 'Acronym is required'],
          pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
          maxLength: 10
        }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'doAssociateUnits',
        dataType: 'radio-group',
        label: 'Do you want to associate units to this organisation?',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NO', label: 'No' }
        ]
      }]
    })
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

  const chosenUnitNames = Object.entries(data).filter(([key]) => key.startsWith(`unitName-`)).map(([_key, value]) => value as string);
  const chosenUnitAcronyms = Object.entries(data).filter(([key]) => key.startsWith('unitAcronym-')).map(([_key, value]) => value as string);

  steps.splice(3);


  if (data.doAssociateUnits === 'NO') {

    Object.keys(data).filter(key => key.startsWith('unitName-') || key.startsWith('unitAcronym-')).forEach(key => { delete data[key]; });

  } else {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: `createUnitNumber`,
          dataType: 'number',
          label: 'How many units do you want to create?',
          validations: {
            isRequired: [true, 'A number is required'],
            min: [2, 'At least 2 units required']
          },
        }]
      })
    )

    for (let i = 1; i <= data.createUnitNumber; i++) {

      steps.push(
        new FormEngineModel({
          parameters: [{
            id: `unitName-${i}`,
            dataType: 'text',
            label: `Provide the name for unit number ${i}`,
            validations: {
              isRequired: [true, 'Unit name is required'],
              pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
              maxLength: 100,
              existsIn: [ // Excludes current value from validation.
                [...data.organisationNamesList, ...chosenUnitNames.filter(item => item !== data[`unitName-${i}`])],
                'Unit name already exists'
              ]
            }
          }]
        }),
        new FormEngineModel({
          parameters: [{
            id: `unitAcronym-${i}`,
            dataType: 'text',
            label: `Provide the acronym for unit number ${i}`,
            validations: {
              isRequired: [true, 'Unit acronym is required'],
              pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
              maxLength: 10,
              existsIn: [ // Excludes current value from validation.
                [...data.organisationUnitNamesList, ...chosenUnitAcronyms.filter(item => item !== data[`unitAcronym-${i}`])],
                'Unit acronym already exists'
              ]
            }
          }]
        })
      );

    }

  }

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    name: '',
    acronym: '',
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
    units: Object.entries(data).filter(([key]) => key.startsWith(`unitName-`)).map(([key, value]) => ({
      name: value as string,
      acronym: data[key.replace('unitName-', 'unitAcronym-')] as string
    }))
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Organisation', value: `${data.name} (${data.acronym})`, editStepNumber: 1 }
  );

  if (data.doAssociateUnits === 'YES') {

    Object.keys(data).filter(key => key.startsWith('unitName-')).forEach((key, index) => {
      toReturn.push(
        {
          label: `Unit ${index + 1}`,
          value: `${data[key]} (${data[key.replace('unitName-', 'unitAcronym-')]})`, editStepNumber: 5 + (index * 2)
        }
      );
    });

  }

  return toReturn;

}
