
import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';


// Types.
type InboundPayloadType = {
  innovatorName: string;
  mobilePhone: null | string;
  contactDetails: null | string,
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = InboundPayloadType;


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let FIRST_TIME_SIGNIN_ACCOUNT_ONLY_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [

    new FormEngineModel({
      parameters: [{
        id: 'innovatorName',
        dataType: 'text',
        label: 'What is your name?',
        description: 'Enter your name',
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'mobilePhone',
        dataType: 'number',
        label: 'What is your phone number (optional)',
        description: 'If you would like to be contacted by phone about your innovation, please provide a contact number.',
        validations: { maxLength: 20 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'contactDetails',
        dataType: 'textarea',
        label: 'Is there anything else we should know about communicating with you?',
        description: 'For example, non-working days, visual or hearing impairments, or other accessibility needs.',
        lengthLimit: 'small',
      }]
    }),
  ],
  runtimeRules: [(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, data, currentStep)],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovatorName: '',
    mobilePhone: null,
    contactDetails: null,
  }
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    innovatorName: data.innovatorName,
    mobilePhone: data.mobilePhone,
    contactDetails: data.contactDetails,
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Your name', value: data.innovatorName, editStepNumber: 1 },
    { label: 'Phone number', value: data.mobilePhone, editStepNumber: 2 },
    { label: 'Contact details', value: data.contactDetails, editStepNumber: 3 }
  );

  return toReturn;
}
