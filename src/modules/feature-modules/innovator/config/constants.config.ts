import { FormEngineModel, FormEngineParameterModel } from '@shared-module/forms';

export const FIRST_TIME_SIGNIN_QUESTIONS: FormEngineModel[] = [
  new FormEngineModel({
    label: 'Welcome to the NHS innovation service!',
    description: 'What\'s your name?',
    parameters: [
      {
        id: 'innovatorName',
        dataType: 'text',
        label: 'Full name',
        validations: { isRequired: true }
      }
    ]
  }),

  new FormEngineModel({
    label: 'What should we call your innovation?',
    parameters: [
      {
        id: 'innovationName',
        dataType: 'text',
        label: 'Innovation name',
        validations: { isRequired: true }
      }
    ]
  }),

  new FormEngineModel({
    label: 'Please provide a short description of your innovation',
    parameters: [
      {
        id: 'innovationDescription',
        dataType: 'textarea',
        label: 'Enter a description',
        validations: { isRequired: true }
      }
    ]
  }),

  new FormEngineModel({
    label: 'Are you creating this innovation as part of a company or organisation?',
    parameters: [
      {
        id: 'isCompanyOrOrganisation',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          {
            value: 'yes',
            label: 'Yes',
            conditional: new FormEngineParameterModel({ id: 'organisationName', dataType: 'text', label: 'Company or organisation name', validations: { isRequired: true } })
          },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'What\'s the size of your company or organisation?',
    parameters: [
      {
        id: 'organisationSize',
        dataType: 'radio-group',
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
    label: 'Where are you based?',
    parameters: [
      {
        id: 'location',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          {
            value: 'England',
            label: 'England',
            conditional: new FormEngineParameterModel({ id: 'englandPostCode', dataType: 'text', label: 'First part of your postcode', description: 'For example SW1', validations: { isRequired: true } })
          },
          { value: 'Scotland', label: 'Scotland' },
          { value: 'Wales', label: 'Wales' },
          { value: 'Northern Ireland', label: 'Northern Ireland' },
          { value: '', label: 'SEPARATOR' },
          {
            value: 'Based outside UK',
            label: 'I\'m based outside of the UK',
            conditional: new FormEngineParameterModel({ id: 'locationCountryName', dataType: 'text', label: 'Country', validations: { isRequired: true } })
          },
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Finally, choose your data sharing preferences',
    description: '<a href="/" target="_blank">What does each organisation do? (opens in a new window)</a>',
    parameters: [
      {
        id: 'organisationShares',
        dataType: 'checkbox-array',
        validations: { isRequired: true },
        items: []
      }
    ]
  }),

];
