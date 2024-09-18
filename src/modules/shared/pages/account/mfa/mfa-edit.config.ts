import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { CustomFormGroupValidators } from '@modules/shared/forms/validators/custom-validators';
import { MFAInfoDTO } from '@modules/stores/authentication/authentication.service';
import { SelectComponentInputType } from '@modules/theme/components/search/select.component';
import { fullCountryCodeList } from './mfa-country-lists';
import { CurrentMFAModeType } from './mfa-edit.component';

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

const verificationMethodItems = (isAdmin: boolean) => [
  {
    value: 'EMAIL',
    label: `Email ${isAdmin ? 'them' : 'me'}`,
    description: `We'll send a security code to the email address linked with ${isAdmin ? 'user' : 'your'} account.`
  },
  {
    value: 'PHONE',
    label: `Send ${isAdmin ? 'them' : 'me'} a text message or phone ${isAdmin ? 'them' : 'me'}`,
    description: 'Receive a security code by text message or phone call.'
  }
];

const turnOffItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

// Form validations
const phoneConfirmationValidation = CustomFormGroupValidators.mustMatch(
  'phoneNumber',
  'confirmationPhoneNumber',
  'Phone numbers do not match'
);

// Steps labels

const stepsLabels = {
  l1: {
    label: 'Set up two-step verification',
    description: {
      admin:
        'Each time the user logs in we will send a unique code to enter to add a layer of security to the account. You can choose for them to receive this code via email, text message or phone call.',
      default:
        'Each time you log in we will send you a unique code to enter to add a layer of security to your account. You can choose to receive this code via email, text message or phone call.'
    }
  },
  l2: {
    label: 'Turn off two-step verification?',
    description: {
      admin:
        'By turning off two-step verification, the user will only use a password to log in. This will remove an additional layer of security from their account.',
      default:
        "By turning off two-step verification, you'll only use a password to log in. This will remove an additional layer of security from your account."
    }
  }
};

// Steps

const selectMethodStep = (isAdmin: boolean) =>
  new FormEngineModel({
    label: stepsLabels.l1.label,
    description: stepsLabels.l1.description[isAdmin ? 'admin' : 'default'],
    parameters: [
      {
        id: 'selectMethod',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose one option'] },
        items: verificationMethodItems(isAdmin)
      }
    ]
  });

function turnOffStep(isAdmin: boolean) {
  return new FormEngineModel({
    label: stepsLabels.l2.label,
    description: stepsLabels.l2.description[isAdmin ? 'admin' : 'default'],
    parameters: [
      {
        id: 'turnOff',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose one option'] },
        items: turnOffItems
      }
    ]
  });
}

function getPhoneStep(
  isAdmin: boolean,
  currentMFAMode: CurrentMFAModeType,
  selectedCountryCode?: string
): FormEngineModel {
  return new FormEngineModel({
    label:
      currentMFAMode === 'phone'
        ? `Change ${isAdmin ? 'user' : 'your'} phone number`
        : `${currentMFAMode === 'none' ? 'Set' : 'Change'} two-step verification method to phone`,
    description: isAdmin
      ? 'When user logs in, we can send a security code via text message or phone call. The number you choose will be used to send all future codes.'
      : 'When you log in, we can send you a security code via text message or phone call. The number you choose will be used to send all future codes.',
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
        validations: { isRequired: [true, isAdmin ? 'Phone number is required' : 'Your phone number is required'] }
      },
      {
        id: 'confirmationPhoneNumber',
        dataType: 'number',
        label: 'Confirm phone number',
        validations: {
          isRequired: [true, 'Phone confirmation is required']
        }
      }
    ]
  });
}

function getEmailStep(isAdmin: boolean, userEmail: string, currentMFAMode: CurrentMFAModeType): FormEngineModel {
  return new FormEngineModel({
    label: `${currentMFAMode === 'phone' ? 'Change' : 'Set'} two-step verification method to email`,
    description: isAdmin
      ? `When user logs in, we'll send a security code to the email address linked with the user's account: `
      : `When you log in, we'll send a security code to the email address linked with your account: `,
    parameters: [
      {
        id: 'confirmationEmail',
        dataType: 'text',
        validations: {
          isRequired: [true, isAdmin ? 'Email is required' : 'Your email is required'],
          equalTo: [userEmail, 'The email addresses do not match']
        }
      }
    ]
  });
}

// Wizards

export const MFA_SET_UP = (isAdmin: boolean) =>
  new WizardEngineModel({
    steps: [selectMethodStep(isAdmin), new FormEngineModel({})],
    formValidations: [phoneConfirmationValidation],
    showSummary: false,
    runtimeRules: [
      (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        wizardSetMFARuntimeRules(isAdmin, steps, currentValues, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data)
  });

export const MFA_TURN_OFF = (isAdmin: boolean) =>
  new WizardEngineModel({
    steps: [turnOffStep(isAdmin)],
    showSummary: false,
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data)
  });

export const MFA_EMAIL = (isAdmin: boolean) =>
  new WizardEngineModel({
    steps: [],
    showSummary: false,
    runtimeRules: [
      (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        wizardEmailRuntimeRules(isAdmin, steps, currentValues, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data)
  });

export function MFA_PHONE(isAdmin: boolean): WizardEngineModel {
  return new WizardEngineModel({
    steps: [],
    formValidations: [phoneConfirmationValidation],
    showSummary: false,
    runtimeRules: [
      (steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        wizardPhoneRuntimeRules(isAdmin, steps, currentValues, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data)
  });
}

function wizardPhoneRuntimeRules(
  isAdmin: boolean,
  steps: FormEngineModel[],
  data: StepPayloadType,
  currentStep: number | 'summary'
) {
  steps.splice(0);
  steps.push(getPhoneStep(isAdmin, data.currentMFAMode, data.countryCode));
}

function wizardSetMFARuntimeRules(
  isAdmin: boolean,
  steps: FormEngineModel[],
  data: StepPayloadType,
  currentStep: number | 'summary'
) {
  if (data.selectMethod === 'EMAIL') {
    steps.splice(1);
    steps.push(getEmailStep(isAdmin, data.userEmail, data.currentMFAMode));
  }
  if (data.selectMethod === 'PHONE') {
    steps.splice(1);
    steps.push(getPhoneStep(isAdmin, data.currentMFAMode, data.countryCode));
  }
}

function wizardEmailRuntimeRules(
  isAdmin: boolean,
  steps: FormEngineModel[],
  data: StepPayloadType,
  currentStep: number | 'summary'
) {
  steps.splice(0);
  steps.push(getEmailStep(isAdmin, data.userEmail, data.currentMFAMode));
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
