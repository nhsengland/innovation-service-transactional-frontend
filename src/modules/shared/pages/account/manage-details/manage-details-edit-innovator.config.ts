
import { AuthenticationModel } from '@modules/stores';

import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';


// Types.
type InboundPayloadType = Required<AuthenticationModel>['user'];

type StepPayloadType = {
  displayName: string;
  // mobilePhone?: string;
  isCompanyOrOrganisation: 'YES' | 'NO';
  organisationName: string;
  organisationSize: null | string;
  organisationAdditionalInformation: {
    id: string;
  };
};

type OutboundPayloadType = {
  displayName: string;
  // mobilePhone?: string;
  organisation?: {
    id: string;
    name: string;
    isShadow: boolean;
    size: null | string;
  };

};


export const ACCOUNT_DETAILS_INNOVATOR: WizardEngineModel = new WizardEngineModel({
  steps: [

    new FormEngineModel({
      parameters: [{
        id: 'displayName',
        dataType: 'text',
        label: 'What\'s your full name?',
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
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Company or organisation name', validations: { isRequired: true } })
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

  steps.splice(2);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = '';
    data.organisationSize = null;
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
    displayName: data.displayName,
    // mobilePhone?: string;
    isCompanyOrOrganisation: !data.organisations[0].isShadow ? 'YES' : 'NO',
    organisationName: data.organisations[0].name,
    organisationSize: data.organisations[0].size,
    organisationAdditionalInformation: {
      id: data.organisations[0].id
    }
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    displayName: data.displayName,
    // mobilePhone: data.mobilePhone,
    organisation: {
      id: data.organisationAdditionalInformation.id,
      name: data.organisationName,
      isShadow: data.isCompanyOrOrganisation === 'NO',
      size: data.organisationSize,
    }
  };

}

function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push(
    { label: 'Name', value: data.displayName, editStepNumber: 1 },
    // { label: 'Phone', value: data.mobilePhone, editStepNumber: 2 },
    { label: 'Is company or organisation?', value: data.isCompanyOrOrganisation === 'YES' ? 'Yes' : 'No', editStepNumber: 2 }
  );

  if (data.isCompanyOrOrganisation === 'YES') {

    toReturn.push(
      { label: 'Company', value: data.organisationName, editStepNumber: 2 },
      { label: 'Company size', value: data.organisationSize, editStepNumber: 3 }
    );

  }

  return toReturn;

}
