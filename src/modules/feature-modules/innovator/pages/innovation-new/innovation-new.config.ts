import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { locationItems } from '@stores-module/innovation/config/innovation-catalog.config';


// Types.
type InboundPayloadType = {};

type StepPayloadType = {
  innovationName: string;
  innovationDescription: string;
  location: string;
  englandPostCode: string;
  locationCountryName: string;
  organisationShares: string[];
};

type OutboundPayloadType = {
  name: string;
  description: string;
  countryName: string;
  postcode: string;
  organisationShares: string[];
};



export const NEW_INNOVATION_QUESTIONS: WizardEngineModel = new WizardEngineModel({
  steps: [

    new FormEngineModel({
      label: 'Register a new innovation',
      description: 'We\'ll ask you for the name and a brief description of the innovation.',
      parameters: []
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
        description: 'Enter a description',
        validations: { isRequired: [true, 'Innovation short description is required'] }
      }]
    }),

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
        id: 'organisationShares',
        dataType: 'checkbox-array',
        label: 'Finally, choose your data sharing preferences',
        description: '<a href="/about-the-service/who-we-are" target="_blank" rel="noopener noreferrer"> What does each organisation do? (opens in a new window) </a>',
        validations: { isRequired: [true, 'Choose at least one organisation'] },
        items: []
      }]
    })

  ],
  inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
  outboundParsing: (data: StepPayloadType) => outboundParsing(data)
});



function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    innovationName: '',
    innovationDescription: '',
    location: '',
    englandPostCode: '',
    locationCountryName: '',
    organisationShares: []
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    name: data.innovationName,
    description: data.innovationDescription,
    countryName: data.locationCountryName || data.location,
    postcode: data.englandPostCode || '',
    organisationShares: data.organisationShares,
  };

}
