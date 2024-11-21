import { AuthenticationModel } from '@modules/stores/authentication/authentication.models';

import { UtilsHelper } from '@app/base/helpers';
import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import {
  ContactUserPreferenceEnum,
  PhoneUserPreferenceEnum
} from '@modules/stores/authentication/authentication.service';

const organisationDescriptions = [
  'Sole trader',
  'Unincorporated association',
  'Partnership',
  'Limited partnership',
  'Trust',
  'Limited company',
  'Limited liability partnership',
  'Community interest company',
  'Charitable incorporated organisation',
  'Co-operative society',
  'Community benefit society'
] as const;

// Types.
type InboundPayloadType = Required<AuthenticationModel>['user'];

type StepPayloadType = {
  displayName: string;
  contactPreferences: ContactUserPreferenceEnum[];
  contactByPhoneTimeframe: PhoneUserPreferenceEnum | null;
  mobilePhone: null | string;
  contactDetails: null | string;
  isCompanyOrOrganisation: 'YES' | 'NO';
  organisationName: null | string;
  organisationSize: null | string;
  organisationDescription: null | string;
  hasRegistrationNumber: 'YES' | 'NO';
  organisationRegistrationNumber: null | string;
  organisationAdditionalInformation: { id: string };
};

type OutboundPayloadType = {
  displayName: string;
  contactByPhone: boolean;
  contactByEmail: boolean;
  contactByPhoneTimeframe: PhoneUserPreferenceEnum | null;
  mobilePhone: null | string;
  contactDetails: null | string;
  organisation?: {
    id: string;
    isShadow: boolean;
    name: null | string;
    size: null | string;
    description: null | string;
    registrationNumber: null | string;
  };
};

export const ACCOUNT_DETAILS_INNOVATOR: WizardEngineModel = new WizardEngineModel({
  steps: [
    new FormEngineModel({
      parameters: [
        {
          id: 'displayName',
          dataType: 'text',
          label: 'What is your name?',
          validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'contactPreferences',
          dataType: 'checkbox-array',
          label: 'If we have any questions about your innovation, how do you want us to contact you?',
          description: 'Select your preferred ways of contact',
          items: [
            {
              value: ContactUserPreferenceEnum.PHONE,
              label: 'By phone',
              conditional: new FormEngineParameterModel({
                id: 'contactByPhoneTimeframe',
                dataType: 'radio-group',
                label: 'Select the best time to reach you on week days (UK time)',
                validations: { isRequired: [true, 'Choose one option'] },
                items: [
                  {
                    value: PhoneUserPreferenceEnum.MORNING,
                    label: 'Morning, 9am to 12pm'
                  },
                  {
                    value: PhoneUserPreferenceEnum.AFTERNOON,
                    label: 'Afternoon, 1pm to 5pm'
                  },
                  {
                    value: PhoneUserPreferenceEnum.DAILY,
                    label: 'Either'
                  }
                ]
              })
            },
            { value: ContactUserPreferenceEnum.EMAIL, label: 'By email' }
          ]
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'mobilePhone',
          dataType: 'number',
          label: 'What is your phone number?',
          description: 'If you’d like to be contacted by phone about your innovation, enter your phone number.',
          validations: { maxLength: 20 }
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'contactDetails',
          dataType: 'textarea',
          label: 'Is there anything else we should know about communicating with you?',
          description: 'For example, non-working days, visual or hearing impairments, or other accessibility needs.',
          lengthLimit: 'xs'
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'isCompanyOrOrganisation',
          dataType: 'radio-group',
          label: 'Are you part of a company or organisation?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({
                id: 'organisationName',
                dataType: 'text',
                label: 'Enter the company or organisation name',
                validations: { isRequired: true, maxLength: 100 }
              })
            },
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
  summaryParsing: (data: StepPayloadType) => summaryParsing(data)
});

function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(5);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = null;
    data.organisationSize = null;
    data.organisationDescription = null;
    data.organisationRegistrationNumber = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'organisationDescription',
          dataType: 'radio-group',
          label: 'How would you describe your company or organisation?',
          validations: { isRequired: [true, 'Organisation description is required'] },
          items: organisationDescriptions.map(description => ({ value: description, label: description }))
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'organisationSize',
          dataType: 'radio-group',
          label: "What's the size of your company or organisation?",
          validations: { isRequired: [true, 'Organisation size is required'] },
          items: [
            { value: '1 to 5 employees', label: '1 to 5 employees' },
            { value: '6 to 25 employees', label: '6 to 25 employees' },
            { value: '26 to 100 employees', label: '26 to 100 employees' },
            { value: 'More than 100 employees', label: 'More than 100 employees' }
          ]
        }
      ]
    }),

    new FormEngineModel({
      parameters: [
        {
          id: 'hasRegistrationNumber',
          dataType: 'radio-group',
          label: 'Do you have a UK company registration number?',
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            {
              value: 'YES',
              label: 'Yes',
              conditional: new FormEngineParameterModel({
                id: 'organisationRegistrationNumber',
                dataType: 'text',
                label: 'Enter the company registration number',
                validations: { isRequired: [true, 'Registration number is required'], minLength: 8, maxLength: 8 }
              })
            },
            { value: 'NO', label: 'No' }
          ]
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    displayName: data.displayName,
    contactPreferences: getContactPreferences(data),
    contactByPhoneTimeframe: data.contactByPhoneTimeframe ?? null,
    mobilePhone: data.phone,
    contactDetails: data.contactDetails,
    isCompanyOrOrganisation: !data.organisations[0].isShadow ? 'YES' : 'NO',
    organisationName: data.organisations[0].name,
    organisationSize: data.organisations[0].size,
    organisationDescription: data.organisations[0].description,
    hasRegistrationNumber: data.organisations[0].registrationNumber !== null ? 'YES' : 'NO',
    organisationRegistrationNumber: data.organisations[0].registrationNumber,
    organisationAdditionalInformation: {
      id: data.organisations[0].id
    }
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    displayName: data.displayName,
    contactByPhone: data.contactPreferences.includes(ContactUserPreferenceEnum.PHONE),
    contactByEmail: data.contactPreferences.includes(ContactUserPreferenceEnum.EMAIL),
    mobilePhone: data.mobilePhone,
    contactByPhoneTimeframe: data.contactByPhoneTimeframe,
    contactDetails: data.contactDetails,
    organisation: {
      id: data.organisationAdditionalInformation.id,
      isShadow: data.isCompanyOrOrganisation === 'NO',
      name: data.organisationName,
      size: data.organisationSize,
      description: data.organisationDescription,
      registrationNumber:
        data.hasRegistrationNumber === 'YES' && data.organisationRegistrationNumber
          ? data.organisationRegistrationNumber
          : null
    }
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Name', value: data.displayName, editStepNumber: 1 },
    {
      label: 'Contact Preference',
      value: UtilsHelper.getContactPreferenceValue(
        data.contactPreferences.includes(ContactUserPreferenceEnum.EMAIL),
        data.contactPreferences.includes(ContactUserPreferenceEnum.PHONE),
        data.contactByPhoneTimeframe
      ),
      editStepNumber: 2
    },
    { label: 'Phone number', value: data.mobilePhone, editStepNumber: 3 },
    { label: 'Contact details', value: data.contactDetails, editStepNumber: 4 },
    {
      label: 'Is company or organisation?',
      value: data.isCompanyOrOrganisation === 'YES' ? `Yes, ${data.organisationName}` : 'No',
      editStepNumber: 5
    }
  );

  if (data.isCompanyOrOrganisation === 'YES') {
    toReturn.push(
      { label: 'Company description', value: data.organisationDescription, editStepNumber: 6 },
      { label: 'Company size', value: data.organisationSize, editStepNumber: 7 },
      {
        label: 'Company UK registration number',
        value: data.hasRegistrationNumber === 'YES' ? `Yes, ${data.organisationRegistrationNumber}` : 'No',
        editStepNumber: 8
      }
    );
  }

  return toReturn;
}

function getContactPreferences(data: InboundPayloadType): ContactUserPreferenceEnum[] {
  const contactPreferences: ContactUserPreferenceEnum[] = [];

  if (data.contactByEmail) {
    contactPreferences.push(ContactUserPreferenceEnum.EMAIL);
  }

  if (data.contactByPhone) {
    contactPreferences.push(ContactUserPreferenceEnum.PHONE);
  }

  return contactPreferences;
}
