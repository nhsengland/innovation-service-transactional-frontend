
import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

const organisationTypes = ['Sole trader', 'Unincorporated association', 'Partnership', 'Limited partnership', 'Trust', 'Limited company', 'Limited liability partnership', 'Community interest company', 'Charitable incorporated organisation', 'Co-operative society', 'Community benefit society'] as const;

type StepPayloadType = {
  innovatorName: string,
  isCompanyOrOrganisation: 'YES' | 'NO',
  organisationName: string;
  organisationType: null | typeof organisationTypes[number],
  organisationSize: null | string,
  hasRegistrationNumber: 'YES' | 'NO',
  organisationRegistrationNumber: null | string, // Add this on BE
  mobilePhone: null | string;
};
type OutboundPayloadType = {
  innovatorName: string,
  mobilePhone: null | string,
  organisation?: {
    name: string,
    type: typeof organisationTypes[number],
    size: string,
    registrationNumber?: string
  }
};

export const FIRST_TIME_SIGNIN_QUESTIONS_TEST: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'innovatorName',
        dataType: 'text',
        label: 'Welcome to the NHS innovation service!',
        description: 'What is your name?',
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),

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
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Company or organisation name', validations: { isRequired: [true, 'Other description is required'], maxLength: 100 } })
          },
          { value: 'NO', label: 'No' }
        ]
      }]
    })
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: () => inboundParsing(),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(2);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = '';
    data.organisationSize = null;
  } else {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationType',
          dataType: 'radio-group',
          label: 'How would you describe your company or organisation?',
          validations: { isRequired: [true, 'Organisation type is required'] },
          items: organisationTypes.map(type => ({ value: type, label: type }))
        }]
      })
    );

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'organisationSize',
          dataType: 'radio-group',
          label: 'What is the size of your company or organisation?',
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

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'hasRegistrationNumber',
          dataType: 'radio-group',
          label: 'Do you have a UK company registration number?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({ id: 'organisationRegistrationNumber', dataType: 'text', label: 'Registration number', validations: { isRequired: [true, 'Registration number is required'], minLength: 8, maxLength: 8 } })
            },
            { value: 'NO', label: 'No' }
          ]
        }]
      })
    )

  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'mobilePhone',
        dataType: 'text',
        label: 'What is your phone number? (optional)',
        description: 'If you would like to be contacted by phone about your innovation, provide a contact number.',
        validations: { maxLength: 20 }
      }]
    })
  );

}

function inboundParsing(): StepPayloadType {

  return {
    innovatorName: '',
    isCompanyOrOrganisation: 'NO',
    organisationName: '',
    organisationSize: null,
    organisationType: null,
    hasRegistrationNumber: 'NO',
    organisationRegistrationNumber: null,
    mobilePhone: null,
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    innovatorName: data.innovatorName,
    mobilePhone: data.mobilePhone,
    ...(data.isCompanyOrOrganisation === 'YES' && {
      organisation: {
        name: data.organisationName ?? '',
        size: data.organisationSize ?? '',
        type: data.organisationType ?? 'Sole trader',
        registrationNumber: (data.hasRegistrationNumber === 'YES' && data.organisationRegistrationNumber) ? data.organisationRegistrationNumber : undefined
      }
    })
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'What is your name?', value: data.innovatorName, editStepNumber: 1 },
    { label: 'Are you creating this innovation as part of a company or organisation?', value: data.isCompanyOrOrganisation === 'YES' ? 'Yes' : 'No', editStepNumber: 2 }
  )

  let lastMarkStep = 2;

  if (data.isCompanyOrOrganisation === 'YES') {
    toReturn.push(
      { label: 'Company', value: data.organisationName, editStepNumber: 2 },
      { label: 'How would you describe your company or organisation?', value: data.organisationType, editStepNumber: 3 },
      { label: 'What is the size of your company or organisation?', value: data.organisationSize, editStepNumber: 4 },
      { label: 'Do you have a UK company registration number?', value: data.hasRegistrationNumber === 'YES' ? 'Yes' : 'No', editStepNumber: 5 },
    );

    if (data.hasRegistrationNumber === 'YES') {
      toReturn.push(
        { label: 'UK company registration number?', value: data.organisationRegistrationNumber, editStepNumber: 5 },
      );
    }

    lastMarkStep = 5;
  }

  toReturn.push(
    { label: 'What is your phone number? (optional)', value: data.mobilePhone, editStepNumber: lastMarkStep + 1 }
  );

  return toReturn;

}
