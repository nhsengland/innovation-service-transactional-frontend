import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {};

type StepPayloadType = {
  innovatorName: string;
  // mobilePhone?: string;
  isCompanyOrOrganisation: 'YES' | 'NO';
  organisationName: string;
  organisationSize: string;
};

type OutboundPayloadType = StepPayloadType;


export const INNOVATION_TRANSFER: WizardEngineModel = new WizardEngineModel({
  steps: [

    new FormEngineModel({
      label: 'You have an innovation ownership transfer request',
      description: '',
      parameters: []
    }),

    new FormEngineModel({
      parameters: [{
        id: 'innovatorName',
        dataType: 'text',
        label: 'What\'s your full name',
        validations: { isRequired: [true, 'Name is required'] }
      }]
    }),

    // new FormEngineModel({
    //   parameters: [{ id: 'mobilePhone', dataType: 'text', label: 'Phone number' }]
    // }),

    new FormEngineModel({
      parameters: [{
        id: 'isCompanyOrOrganisation',
        dataType: 'radio-group',
        label: 'Are you creating this innovation as part of a company or organisation?',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          {
            value: 'YES',
            label: 'Yes',
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Company or organisation name', validations: { isRequired: [true, 'Company or organisation name is required'] } })
          },
          { value: 'NO', label: 'No' }
        ]
      }]
    })

  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(3);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = '';
    data.organisationSize = '';
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'organisationSize',
        dataType: 'radio-group',
        label: 'What\'s the size of your company or organisation?',
        validations: { isRequired: [true, 'Organisation size is required'] },
        items: [
          { value: '1 to 5 employees', label: '1 to 5 employees' },
          { value: '6 to 25 employees', label: '6 to 25 employees' },
          { value: '26 to 100 employees', label: '26 to 100 employees' },
          { value: 'More than 100 employees', label: 'More than 100 employees' }
        ]
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovatorName: '',
    // mobilePhone?: string;
    isCompanyOrOrganisation: 'NO',
    organisationName: '',
    organisationSize: ''
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    innovatorName: data.innovatorName,
    isCompanyOrOrganisation: data.isCompanyOrOrganisation,
    organisationName: data.organisationName,
    organisationSize: data.organisationSize
  };

}

function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push(
    { label: 'Name', value: data.innovatorName, editStepNumber: 2 },
    // { label: 'Phone', value: data.mobilePhone, editStepNumber: 2 },
    { label: 'Is company or organisation?', value: data.isCompanyOrOrganisation === 'YES' ? 'Yes' : 'No', editStepNumber: 3 }
  );

  if (data.isCompanyOrOrganisation === 'YES') {

    toReturn.push(
      { label: 'Company', value: data.organisationName, editStepNumber: 3 },
      { label: 'Company size', value: data.organisationSize, editStepNumber: 4 }
    );

  }

  return toReturn;

}
