import { FormEngineModel, FormEngineParameterModel } from '@shared-module/forms';

export const TRIAGE_INNOVATOR_PACK_QUESTIONS: FormEngineModel[] = [
  new FormEngineModel({
    label: 'What size is your organisation?',
    description: 'Your answer will help us prepare for an initial conversation id you choose to sign up for this service.',
    parameters: [
      {
        id: 'organisationSize',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Organisation size is required'] },
        items: [
          { value: '1 to 5 employees', label: '1 to 5 employees' },
          { value: '6 to 25 employees', label: '6 to 25 employees' },
          { value: '26 to 100 employees', label: '26 to 100 employees' },
          { value: 'I do not belong to an organisation', label: 'I do not belong to an organisation' },
          { value: 'I\'m a distributor or consultant working on behalf of an organisation', label: 'I\'m a distributor or consultant working on behalf of an organisation' },
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Which categories can be used to describe your innovation?',
    description: 'Please tick all that apply.',
    parameters: [
      {
        id: 'categories',
        dataType: 'checkbox-array',
        validations: { isRequired: [true, 'Choose at least one category that describes your innovation'] },
        items: [
          { value: 'Medical device', label: 'Medical device' },
          { value: 'Pharmaceutical', label: 'Pharmaceutical' },
          { value: 'Digital (including apps, platforms, software)', label: 'Digital (including apps, platforms, software)' },
          { value: 'Artificial intelligence (AI)', label: 'Artificial intelligence (AI)' },
          {
            value: 'New ways of delivering care',
            label: 'New ways of delivering care',
            description: 'This includes care pathways, frameworks and service redesign'
          },
          { value: 'Education or training of workforce', label: 'Education or training of workforce' },
          { value: 'Personal protective equipment (PPE)', label: 'Personal protective equipment (PPE)' },
          {
            value: 'Other',
            label: 'Other',
            // conditionalField: new FormFieldModel({ id: 'categories-other-option' })
          }
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Which category best describes the main part of your innovation?',
    // description: '',
    parameters: [
      {
        id: 'categoryDescribesInnovation',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose the category that best describes your innovation'] },
        items: [
          { value: 'Medical device', label: 'Medical device' },
          { value: 'Pharmaceutical', label: 'Pharmaceutical' },
          { value: 'Digital (including apps, platforms, software)', label: 'Digital (including apps, platforms, software)' },
          { value: 'Artificial intelligence (AI)', label: 'Artificial intelligence (AI)' },
          {
            value: 'New ways of delivering care',
            label: 'New ways of delivering care',
            description: 'This includes care pathways, frameworks and service redesign'
          },
          { value: 'Education or training of workforce', label: 'Education or training of workforce' },
          { value: 'Personal protective equipment (PPE)', label: 'Personal protective equipment (PPE)' },
          {
            value: 'Other',
            label: 'Other',
            // conditionalField: new FormFieldModel({ id: 'categories-other-option' })
          }
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Have you identified what problem the innovation will tackle?',
    // description: '',
    details: {
      title: 'What do we mean by this?',
      content: `<p>This is an expandable explanation of what is meant by value proposition.</p>
      <p>May have lists of items like the one below:</p>
      <ul>
        <li>prescriptions</li>
        <li>test results</li>
        <li>hospital referral letters</li>
        <li>appointment letters</li>
      </ul>
      <p>TODO: review this text!.</p>`
    },
    parameters: [
      {
        id: 'identifiedTheProblem',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'Not sure', label: 'I\'m not sure' }
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Have you done market research so that you understand the need for your innovation in the UK?',
    // description: '',
    details: {
      title: 'What do we mean by this?',
      content: `<p>This is an expandable explanation of what types of market research are expected.</p>
      <p>TODO: review this text!.</p>`
    },
    parameters: [
      {
        id: 'doneMarketResearch',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'Not sure', label: 'I\'m not sure' }
        ]
      }
    ]
  }),

  new FormEngineModel({
    label: 'Have you identified the specific benefits that your innovation would bring?',
    // description: '',
    details: {
      title: 'What do we mean by this?',
      content: `<p>This is an expandable explanation of what types of market research are expected.</p>
      <p>TODO: review this text!.</p>`
    },
    parameters: [
      {
        id: 'identifiedSpecificBenefits',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'Not sure', label: 'I\'m not sure' }
        ]
      }
    ]
  })

];
