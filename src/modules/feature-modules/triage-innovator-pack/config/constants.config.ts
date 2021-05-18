import { FormEngineModel, FormEngineParameterModel } from '@shared-module/forms';

export const TRIAGE_INNOVATOR_PACK_QUESTIONS: FormEngineModel[] = [

  // Question 01
  new FormEngineModel({
    label: 'Choose all categories that can be used to describe your innovation',
    description: 'Your answer will help us to establish your primary point of contact if you choose to create an account with the innovation service.',
    parameters: [
      {
        id: 'categories',
        dataType: 'checkbox-array',
        validations: { isRequired: [true, 'Choose at least one category that describes your innovation'] },
        items: [
          { value: 'MEDICAL_DEVICE', label: 'Medical device' },
          { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
          { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
          { value: 'AI', label: 'Artificial intelligence (AI)' },
          {
            value: 'New ways of delivering care',
            label: 'New ways of delivering care',
            description: 'This includes care pathways, frameworks and service redesign'
          },
          { value: 'EDUCATION', label: 'Education or training of workforce' },
          { value: 'PPE', label: 'Personal protective equipment (PPE)' },
          {
            value: 'OTHER',
            label: 'Other',
            // conditionalField: new FormFieldModel({ id: 'categories-other-option' })
          }
        ]
      }
    ]
  }),

  // Question 02
  new FormEngineModel({
    label: 'If you had to select one primary category to describe your innovation, which one would it be?',
    description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
    parameters: [
      {
        id: 'mainCategory',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose the category that best describes your innovation'] },
        items: [
          { value: 'MEDICAL_DEVICE', label: 'Medical device' },
          { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
          { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
          { value: 'AI', label: 'Artificial intelligence (AI)' },
          {
            value: 'New ways of delivering care',
            label: 'New ways of delivering care',
            description: 'This includes care pathways, frameworks and service redesign'
          },
          { value: 'EDUCATION', label: 'Education or training of workforce' },
          { value: 'PPE', label: 'Personal protective equipment (PPE)' },
          {
            value: 'OTHER',
            label: 'Other',
            // conditionalField: new FormFieldModel({ id: 'categories-other-option' })
          }
        ]
      }
    ]
  }),

  // Question 03
  new FormEngineModel({
    label: 'Have you identified what problem the innovation will tackle (also known as \'value proposition\')?',
    description: 'This is a simple statement that summarises your innovation, shows how it\'s different and documents the value that it brings to the customer.',
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
        id: 'hasProblemTackleKnowledge',
        dataType: 'radio-group',
        validations: { isRequired: [true, 'Choose one option'] },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NOT_YET', label: 'Not yet' },
          { value: 'NOT_SURE', label: 'I\'m not sure' }
        ]
      }
    ]
  }),

  // Question 04
  new FormEngineModel({
    label: 'Have you done market research so that you understand the need for your innovation in the UK?',
    description: 'For example, information and insight on your customers and competitors gathered from interviews, focus groups, pricing research or competitive analysis.',
    parameters: [
      {
        id: 'hasMarketResearch',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'IN_PROGRESS', label: 'I\'m currently doing market research' },
          { value: 'NOT_YET', label: 'Not yet' }
        ]
      }
    ]
  }),

  // Question 05
  new FormEngineModel({
    label: 'Have you identified who would benefit from your innovation?',
    description: 'This can include specific patient groups, clinicians, nurses, administrative staff and wider organisations.',
    parameters: [
      {
        id: 'hasWhoBenefitsKnowledge',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NOT_YET', label: 'Not yet' },
          { value: 'NOT_SURE', label: 'I\'m not sure' }
        ]
      }
    ]
  }),

  // Question 06
  new FormEngineModel({
    label: 'Have you identified the specific benefits that your innovation would bring?',
    description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
    parameters: [
      {
        id: 'hasBenefits',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NOT_YET', label: 'Not yet' },
          { value: 'NOT_SURE', label: 'I\'m not sure' }
        ]
      }
    ]
  }),

  // Question 07
  new FormEngineModel({
    label: 'Have you tested the innovation with users?',
    description: 'Depending on the context of your innovation, this can include device prototyping and testing, laboratory studies, clinical trials, amongst others',
    parameters: [
      {
        id: 'hasTests',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'IN_PROCESS', label: 'I\'m in the process of testing with users' },
          { value: 'NOT_YET', label: 'Not yet' }
        ]
      }
    ]
  }),

  // Question 08
  new FormEngineModel({
    label: 'Have you achieved all relevant certifications?',
    description: 'There are different regulations for different types of innovations. For example, different types of medical devices need different levels of CE and/or UKCA certification.',
    parameters: [
      {
        id: 'hasRelevanteCertifications',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'NOT_YET', label: 'Not yet' },
          { value: 'NO_KNOWLEDGE', label: 'I\'m not sure which certifications apply to my innovation' },
          { value: 'NOT_APPLICABLE', label: 'Currently not applicable to my innovation' }
        ]
      }
    ]
  }),

  // Question 09
  new FormEngineModel({
    label: 'Do you have evidence to show that your innovation is safe to use and effective?',
    description: 'For example, data from clinical trials published in a peer reviewed journal.',
    parameters: [
      {
        id: 'hasEvidence',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'IN_PROGRESS', label: 'I\'m in the process of gathering this evidence' },
          { value: 'NOT_YET', label: 'Not yet' }
        ]
      }
    ]
  }),

  // Question 10
  new FormEngineModel({
    label: 'Do you have evidence on the costs and benefits of your innovation when used in practice?',
    description: 'For example, an Economic Value Analysis by an external health economics consultant?',
    parameters: [
      {
        id: 'hasCostEvidence',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: [
          { value: 'YES', label: 'Yes' },
          { value: 'IN_PROGRESS', label: 'I\'m in the process of gathering this evidence' },
          { value: 'NOT_YET', label: 'Not yet' }
        ]
      }
    ]
  }),

  // Question 11
  new FormEngineModel({
    label: 'What type of support are you currently looking for?',
    description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
    parameters: [
      {
        id: 'supportTypes',
        dataType: 'checkbox-array',
        validations: { isRequired: [true, 'Choose at least one type of support'] },
        items: [
          { value: 'ASSESSMENT', label: 'Adoption and health technology assessment' },
          { value: 'PRODUCT_MIGRATION', label: 'Bringing my product to or from the UK' },
          { value: 'CLINICAL_TESTS', label: 'Clinical trials and testing' },
          { value: 'COMMERCIAL', label: 'Commercial support and advice' },
          { value: 'PROCUREMENT', label: 'Procurement' },
          { value: 'DEVELOPMENT', label: 'Product development and regulatory advice' },
          { value: 'EVIDENCE_EVALUATION', label: 'Real-world evidence and evaluation' },
          { value: 'FUNDING', label: 'Understanding funding channels' },
          { value: 'INFORMATION', label: 'OR - I\'m only looking for information right now' }
        ]
      }
    ]
  })

];
