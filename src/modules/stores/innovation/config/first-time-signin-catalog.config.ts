import { FormEngineModel, FormEngineParameterModel } from '@shared-module/forms';
import { locationItems } from './innovation-catalog.config';


export const FIRST_TIME_SIGNIN_QUESTIONS: FormEngineModel[] = [
  new FormEngineModel({
    parameters: [
      {
        id: 'innovatorName',
        dataType: 'text',
        label: 'Welcome to the NHS innovation service!',
        description: 'What\'s your name?',
        validations: { isRequired: [true, 'Name is required'] }
      }
    ]
  }),

  new FormEngineModel({
    parameters: [
      {
        id: 'innovationName',
        dataType: 'text',
        label: 'What should we call your innovation?',
        validations: { isRequired: [true, 'Innovation name is required'] }
      }
    ]
  }),

  new FormEngineModel({
    parameters: [
      {
        id: 'innovationDescription',
        dataType: 'textarea',
        label: 'Please provide a short description of your innovation',
        validations: { isRequired: [true, 'Innovation short description is required'] }
      }
    ]
  }),

  new FormEngineModel({
    parameters: [
      {
        id: 'isCompanyOrOrganisation',
        dataType: 'radio-group',
        label: 'Are you creating this innovation as part of a company or organisation?',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          {
            value: 'yes',
            label: 'Yes',
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Company or organisation name', validations: { isRequired: [true, 'Other description is required'] } })
          },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  }),

  new FormEngineModel({
    parameters: [
      {
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
      }
    ],
    visibility: {
      parameter: 'isCompanyOrOrganisation',
      values: ['yes']
    }
  }),

  new FormEngineModel({
    parameters: [
      {
        id: 'location',
        dataType: 'radio-group',
        label: 'Where are you based?',
        validations: { isRequired: [true, 'Location is required'] },
        items: locationItems
      }
    ]
  }),

  new FormEngineModel({
    parameters: [
      {
        id: 'organisationShares',
        dataType: 'checkbox-array',
        label: 'Finally, choose your data sharing preferences',
        validations: { isRequired: [true, 'Choose at least one organisation'] },
        items: []
      }
    ]
  }),

];
