import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import { CurrentMFAModeType } from './mfa-edit.component';
import { fullCountryCodeList } from './mfa-country-lists';

// Payloads definitions

export type MFAWizardModeType = 'set-mfa' | 'turn-off' | 'phone' | 'email';

type InboundPayloadType = {
  userEmail: string;
  wizardMode: MFAWizardModeType;
  currentMFAMode: CurrentMFAModeType;
};

type StepPayloadType = {
  userEmail: string;
  wizardMode: MFAWizardModeType;
  currentMFAMode: CurrentMFAModeType;
  turnOff?: 'YES' | 'NO';
  selectMethod?: 'EMAIL' | 'PHONE';
  confirmationEmail?: string;
  countryCode?: string;
  phoneNumber?: number;
  confirmationPhoneNumber?: number;
};

// Consts

const selectCountryList: SelectComponentInputType[] = fullCountryCodeList.map(country => ({
  key: country.code,
  text: `${country.name} ${country.code}`
}));

const verificationMethodItems = [
  {
    value: 'EMAIL',
    label: 'Email me',
    description: "We'll send a security code to the email address linked with your account."
  },
  {
    value: 'PHONE',
    label: 'Send me a text message or phone me',
    description: 'Receive a security code by text message or phone call.'
  }
];

const turnOffItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

// Steps labels

const stepsLabels = {
  l1: {
    label: 'Set uptwo-step verification',
    description:
      'Each time you log in we will send you a unique code to enter to add a layer of security to your account. You can choose to receive this code via email, text message or phone call. '
  },
  l2: {
    label: 'Turn off two-step verification?',
    description:
      "By turning off two-step verification, you'll only use a password to log in. This will remove an additional layer of security from your account."
  }
};

// Steps

const selectMethodStep = new FormEngineModel({
  label: stepsLabels.l1.label,
  description: stepsLabels.l1.description,
  parameters: [
    {
      id: 'selectMethod',
      dataType: 'radio-group',
      validations: { isRequired: [true, 'Choose one option'] },
      items: verificationMethodItems
    }
  ]
});

const turnOffStep = new FormEngineModel({
  label: stepsLabels.l2.label,
  description: stepsLabels.l2.description,
  parameters: [
    {
      id: 'turnOff',
      dataType: 'radio-group',
      validations: { isRequired: [true, 'Choose one option'] },
      items: turnOffItems
    }
  ]
});

function getPhoneStep(currentMFAMode: CurrentMFAModeType, selectedCountryCode?: string): FormEngineModel {
  return new FormEngineModel({
    label:
      currentMFAMode === 'phone'
        ? 'Change your phone number'
        : `${currentMFAMode === 'none' ? 'Set' : 'Change'} two-step verification method to phone`,
    description:
      'When you log in, we can send you a security code via text message or phone call. The number you choose will be used to send all future codes.',
    parameters: [
      {
        id: 'countryCode',
        dataType: 'select-component',
        label: 'Country code',
        selectItems: { selectList: selectCountryList, defaultKey: selectedCountryCode ?? '+44' }
      },
      {
        id: 'phoneNumber',
        dataType: 'number',
        label: 'Enter phone number',
        validations: { isRequired: [true, 'Your phone number is required'] }
      },
      {
        id: 'confirmationPhoneNumber',
        dataType: 'number',
        label: 'Confirm phone number',
        validations: {
          isRequired: [true, 'Phone confirmation is required'],
          equalToField: ['phoneNumber', 'Phone numbers do not match']
        }
      }
    ]
  });
}

function getEmailStep(userEmail: string, currentMFAMode: CurrentMFAModeType): FormEngineModel {
  return new FormEngineModel({
    label: `${currentMFAMode === 'phone' ? 'Change' : 'Set'} two-step verification method to email`,
    description: `When you log in, we'll send a security code to the email address linked with your account: ${userEmail}`,
    parameters: [
      {
        id: 'confirmationEmail',
        dataType: 'text',
        label: 'Enter your email to confirm',
        validations: {
          isRequired: [true, 'Your email is required'],
          equalTo: [userEmail, 'The email addresses do not match']
        }
      }
    ]
  });
}

// Wizards

export const MFA_SET_UP: WizardEngineModel = new WizardEngineModel({
  steps: [selectMethodStep, new FormEngineModel({})],
  showSummary: false,
  runtimeRules: [
    (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      wizardSetMFARuntimeRules(steps, currentValues, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const MFA_TURN_OFF: WizardEngineModel = new WizardEngineModel({
  steps: [turnOffStep],
  showSummary: false,
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const MFA_EMAIL: WizardEngineModel = new WizardEngineModel({
  steps: [],
  showSummary: false,
  runtimeRules: [
    (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      wizardEmailRuntimeRules(steps, currentValues, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

export const MFA_PHONE: WizardEngineModel = new WizardEngineModel({
  steps: [],
  showSummary: false,
  runtimeRules: [
    (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
      wizardPhoneRuntimeRules(steps, currentValues, currentStep)
  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});

function wizardPhoneRuntimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') {
  steps.splice(0);
  steps.push(getPhoneStep(data.currentMFAMode, data.countryCode));
}

function wizardSetMFARuntimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') {
  if (data.selectMethod === 'EMAIL') {
    steps.splice(1);
    steps.push(getEmailStep(data.userEmail, data.currentMFAMode));
  }
  if (data.selectMethod === 'PHONE') {
    steps.splice(1);
    steps.push(getPhoneStep(data.currentMFAMode, data.countryCode));
  }
}

function wizardEmailRuntimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary') {
  steps.splice(0);
  steps.push(getEmailStep(data.userEmail, data.currentMFAMode));
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    userEmail: data.userEmail,
    wizardMode: data.wizardMode,
    currentMFAMode: data.currentMFAMode
  };
}

function outboundParsing(data: StepPayloadType): { mfaInfo: MFAInfoDTO; turnOff: boolean } {
  const parsedPhone = `${data.countryCode} ${data.phoneNumber}`;

  return {
    mfaInfo: data.phoneNumber
      ? { type: 'phone', phoneNumber: parsedPhone }
      : { type: data.confirmationEmail ? 'email' : 'none' },
    turnOff: data.turnOff === 'YES' ? true : false ?? false
  };
}
