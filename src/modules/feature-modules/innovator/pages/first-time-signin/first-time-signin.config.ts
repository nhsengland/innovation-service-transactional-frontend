
import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

const organisationDescriptions = ['Sole trader', 'Unincorporated association', 'Partnership', 'Limited partnership', 'Trust', 'Limited company', 'Limited liability partnership', 'Community interest company', 'Charitable incorporated organisation', 'Co-operative society', 'Community benefit society'] as const;

type StepPayloadType = {
  innovatorName: string,
  isCompanyOrOrganisation: 'YES' | 'NO',
  organisationName: string;
  organisationDescription: null | typeof organisationDescriptions[number],
  organisationSize: null | string,
  hasRegistrationNumber: 'YES' | 'NO',
  organisationRegistrationNumber: null | string,
  mobilePhone: null | string;
};
type OutboundPayloadType = {
  innovatorName: string,
  mobilePhone: null | string,
  organisation?: {
    name: string,
    description: typeof organisationDescriptions[number],
    size: string,
    registrationNumber?: string
  }
};

export const FIRST_TIME_SIGNIN_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [
    new FormEngineModel({
      parameters: [{
        id: 'innovatorName',
        dataType: 'text',
        label: 'What is your name?',
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'isCompanyOrOrganisation',
        dataType: 'radio-group',
        label: 'Are you signing up to the service as part of a company or organisation?',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          {
            value: 'YES',
            label: 'Yes',
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Enter the company or organisation name', validations: { isRequired: [true, 'Organisation/Company name is required'], maxLength: 100 } })
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
          id: 'organisationDescription',
          dataType: 'radio-group',
          label: 'How would you describe your company or organisation?',
          validations: { isRequired: [true, 'Organisation description is required'] },
          items: organisationDescriptions.map(description => ({ value: description, label: description }))
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
              conditional: new FormEngineParameterModel({ id: 'organisationRegistrationNumber', dataType: 'text', label: 'Enter the company registration number', validations: { isRequired: [true, 'Registration number is required'], minLength: 8, maxLength: 8 } })
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
        dataType: 'number',
        label: 'What is your phone number? (optional)',
        description: 'If you’d like to be contacted by phone about your innovation, enter your phone number.',
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
    organisationDescription: null,
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
        name: data.organisationName ?? '', // default never happens at this point
        size: data.organisationSize ?? '', // default never happens at this point
        description: data.organisationDescription ?? 'Sole trader', // default never happens at this point
        registrationNumber: (data.hasRegistrationNumber === 'YES' && data.organisationRegistrationNumber) ? data.organisationRegistrationNumber : undefined
      }
    })
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'What is your name?', value: data.innovatorName, editStepNumber: 1 },
    { label: 'Are you signing up to the service as part of a company or organisation?', value: data.isCompanyOrOrganisation === 'YES' ? `Yes, ${data.organisationName}` : 'No', editStepNumber: 2 }
  )

  let lastMarkStep = 2;

  if (data.isCompanyOrOrganisation === 'YES') {
    toReturn.push(
      { label: 'How would you describe your company or organisation?', value: data.organisationDescription, editStepNumber: 3 },
      { label: 'What is the size of your company or organisation?', value: data.organisationSize, editStepNumber: 4 },
      { label: 'Do you have a UK company registration number?', value: data.hasRegistrationNumber === 'YES' ? `Yes, ${data.organisationRegistrationNumber}` : 'No', editStepNumber: 5 },
    );

    lastMarkStep = 5;
  }

  toReturn.push(
    { label: 'What is your phone number? (optional)', value: data.mobilePhone, editStepNumber: lastMarkStep + 1 }
  );

  return toReturn;

}
