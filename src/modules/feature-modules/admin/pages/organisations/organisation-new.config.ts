import { FormEngineModel, WizardSummaryType, WizardEngineModel, FormEngineParameterModel } from '@modules/shared/forms';

// Types.
type organisationsListType = {
  acronym: string, name: string, units: { acronym: string, name: string }[]
}[]

type InboundPayloadType = {
  organisationsList: organisationsListType,
};

type StepPayloadType = {
  name: string,
  acronym: string,
  doAssociateUnits: 'YES' | 'NO',
  createUnitNumber: number,
  units: { name: string, acronym: string }[],
  organisationsList: organisationsListType,
}
& {[key: string]: null | string | Array<string> | number | organisationsListType}

type OutboundPayloadType = {
  name: string,
  acronym: string
  units: {
    name: string,
    acronym: string
  }[];
};

export let CREATE_NEW_ORGANISATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'name',
        dataType: 'text',
        label: 'Provide the organisation name.',
        validations: { isRequired: [true, 'Name is required'],
        pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
        maxLength: 100 },
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'acronym',
        dataType: 'text',
        label: 'Provide the new organisation acronym.',
        validations: {
          isRequired: [true, 'Acronym is required'],
          pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
          maxLength: 10 },
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'doAssociateUnits',
        dataType: 'radio-group',
        label: 'Do you want to associate units to the organization you are creating?',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes'},
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

  console.log(data)

  const currentUnitsName = Object.entries(data).filter(([key, value]) => {
    return (key.startsWith(`unitName-`) && key != steps[(currentStep as number)-1].parameters[0].id)
  }).map(([key, value]) => value as string)
  const currentUnitsAcronym = Object.entries(data).filter(([key, value]) => {
    return (key.startsWith('unitAcronym-') && key != steps[(currentStep as number)-1].parameters[0].id)
  }).map(([key, value]) => value as string)

  const unitsListNames = [...data.organisationsList.flatMap(o => o.units.map(u => u.name)), ...currentUnitsName]
  const unitsListAcronym = [...data.organisationsList.flatMap(o => o.units.map(u => u.acronym)), ...currentUnitsAcronym]

  steps.splice(3);

  if(data.doAssociateUnits === 'NO') {
    data.units = []
  }

  else {
    data.units = []
    //data.units.push({name: '', acronym: ''}) //push object into array

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

    let index = 0
    do {
      steps.push(
        new FormEngineModel({
          parameters: [{
            id: `unitName-${index}`,
            dataType: 'text',
            label: `Provide the name for the unit number ${index + 1}`,
            validations: {
              isRequired: [true, 'Unit name is required'],
              pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
              maxLength: 100,
              existsIn: [unitsListNames, 'Unit name already exists']
            }
          }]
        }),
        new FormEngineModel({
          parameters: [{
            id: `unitAcronym-${index}`,
            dataType: 'text',
            label: `Provide the acronym for unit number ${index + 1}`,
            validations: {
              isRequired: [true, 'Unit acronym is required'],
              pattern: ['^[a-zA-Z ]*$', 'Special characters and numbers are not allowed'],
              maxLength: 10,
              existsIn: [unitsListAcronym, 'Unit acronym already exists']
            },
          }]
        }),
      );
      index++
    } while (index < data.createUnitNumber);

    console.warn(data)
  }
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    name: '',
    acronym: '',
    doAssociateUnits: 'NO',
    createUnitNumber: 2,
    units: [],
    organisationsList: data.organisationsList
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.name,
    acronym: data.acronym,
    units: data.units
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Organisation Name', value: data.name, editStepNumber: 1 },
    { label: 'Organisation Acronym', value: data.acronym, editStepNumber: 2 },
  );

  if(data.doAssociateUnits === 'YES') {

    Object.keys(data).filter(key => key.startsWith('unitName-')).forEach((key: string, index) => {
      toReturn.push(
        { label: `Unit ${index + 1}`, value: `${data[key]} (${data[key.replace('unitName-', 'unitAcronym-')]})`, editStepNumber: 5 + (index *2)}
      );
    });
  }

  return toReturn;
}
