
import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

import { locationItems } from '@modules/stores/innovation/config/innovation-catalog.config';


// Types.
type InboundPayloadType = {
  innovatorName: string;
  innovationName: string;
  innovationDescription: string;
  isCompanyOrOrganisation: 'YES' | 'NO';
  organisationName: string;
  organisationSize: null | string;
  location: string;
  englandPostCode: null | string;
  locationCountryName: string;
  mobilePhone: null | string;
  organisationShares: string[];
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = InboundPayloadType;


// This is a LET variable, because the organisations shares information is updated by the component that uses this variable.
export let FIRST_TIME_SIGNIN_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  showSummary: true,
  steps: [

    new FormEngineModel({
      parameters: [{
        id: 'innovatorName',
        dataType: 'text',
        label: 'Welcome to the NHS innovation service!',
        description: 'What\'s your name?',
        validations: { isRequired: [true, 'Name is required'], maxLength: 100 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'innovationName',
        dataType: 'text',
        label: 'What should we call your innovation?',
        description: 'Enter the name of your innovation with a maximum of 100 characters',
        validations: { isRequired: [true, 'Innovation name is required'], maxLength: 100 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'innovationDescription',
        dataType: 'textarea',
        label: 'Please provide a short description of your innovation',
        validations: { isRequired: [true, 'Innovation description is required'] },
        lengthLimit: 'medium'
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
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data),
  summaryParsing: (data: StepPayloadType, steps?: FormEngineModel[]) => summaryParsing(data, steps || [])
});


function runtimeRules(steps: FormEngineModel[], data: StepPayloadType, currentStep: number | 'summary'): void {

  // Backup current organisation shares items.
  const organisationSharesItems = steps.find(s => s.parameters[0].id === 'organisationShares')?.parameters[0].items;

  steps.splice(4);

  if (data.isCompanyOrOrganisation === 'NO') {
    data.organisationName = '';
    data.organisationSize = null;
  } else {

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

  steps.push(

    new FormEngineModel({
      parameters: [{
        id: 'location',
        dataType: 'radio-group',
        label: 'Where are you developing your innovation?',
        validations: { isRequired: [true, 'Location is required'] },
        items: locationItems
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'mobilePhone',
        dataType: 'number',
        label: 'What\'s your phone number (Optional)',
        description: 'If you\'d like to be contacted by phone about your innovation, please provide a contact number',
        validations: { maxLength: 20 }
      }]
    }),

    new FormEngineModel({
      parameters: [{
        id: 'organisationShares',
        dataType: 'checkbox-array',
        label: 'Finally, choose your data sharing preferences',
        validations: { isRequired: [true, 'Choose at least one organisation'] },
        items: organisationSharesItems,
        description: '<a href="/about-the-service/who-we-are" target="_blank" rel="noopener noreferrer">What does each organisation do? (opens in a new window) </a>'
      }]
    })

  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovatorName: '',
    innovationName: '',
    innovationDescription: '',
    isCompanyOrOrganisation: 'NO',
    organisationName: '',
    organisationSize: null,
    location: '',
    englandPostCode: null,
    locationCountryName: '',
    mobilePhone: null,
    organisationShares: []
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    innovatorName: data.innovatorName,
    innovationName: data.innovationName,
    innovationDescription: data.innovationDescription,
    isCompanyOrOrganisation: data.isCompanyOrOrganisation,
    organisationName: data.organisationName,
    organisationSize: data.organisationSize,
    location: data.location,
    englandPostCode: data.englandPostCode,
    locationCountryName: data.locationCountryName,
    mobilePhone: data.mobilePhone,
    organisationShares: data.organisationShares
  };

}

function summaryParsing(data: StepPayloadType, steps: FormEngineModel[]): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push(
    { label: 'Your name', value: data.innovatorName, editStepNumber: 1 },
    { label: 'Innovation name', value: data.innovationName, editStepNumber: 2 },
    { label: 'Innovation description', value: data.innovationDescription, editStepNumber: 3 },
    { label: 'Is company or organisation?', value: data.isCompanyOrOrganisation === 'YES' ? 'Yes' : 'No', editStepNumber: 4 }
  );


  let lastMarkStep = 4;

  if (data.isCompanyOrOrganisation === 'YES') {

    toReturn.push(
      { label: 'Company', value: data.organisationName, editStepNumber: 4 },
      { label: 'Company size', value: data.organisationSize, editStepNumber: 5 }
    );

    lastMarkStep = 5;

  }

  toReturn.push(
    { label: 'Location', value: `${data.locationCountryName || data.location}${data.englandPostCode ? ', ' + data.englandPostCode : ''}`, editStepNumber: lastMarkStep + 1 }
  );

  toReturn.push(
    { label: 'Phone number', value: data.mobilePhone, editStepNumber: lastMarkStep + 2 }
  );

  toReturn.push(
    {
      label: 'Organisation shares',
      value: data.organisationShares.map(o => steps[steps.length - 1].parameters[0].items?.find(i => i.value === o)?.label).join('\n'),
      editStepNumber: lastMarkStep + 3
    }
  );

  return toReturn;

}
