import { FormEngineModel, FormEngineParameterModel } from '@shared-module/forms';

export const TRIAGE_INNOVATOR_PACK_QUESTIONS: FormEngineModel[] = [

  // Question 01
  new FormEngineModel({
    parameters: [
      {
        id: 'categories',
        dataType: 'checkbox-array',
        label: 'Choose all categories that can be used to describe your innovation',
        description: 'Your answer will help us to establish your primary point of contact if you choose to create an account with the innovation service.',
        validations: { isRequired: [true, 'Choose at least one category that describes your innovation'] },
        items: [
          { value: 'MEDICAL_DEVICE', label: 'Medical device' },
          { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
          { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
          { value: 'AI', label: 'Artificial intelligence (AI)' },
          { value: 'EDUCATION', label: 'Education or training of workforce' },
          { value: 'PPE', label: 'Personal protective equipment (PPE)' },
          {
            value: 'OTHER',
            label: 'Other',
            conditional: new FormEngineParameterModel({ id: 'otherCategoryDescription', dataType: 'text', label: 'Other category', validations: { isRequired: [true, 'Other description is required'] } })
          }
        ]
      }
    ]
  }),

  // Question 02
  new FormEngineModel({
    parameters: [
      {
        id: 'mainCategory',
        dataType: 'radio-group',
        label: 'If you had to select one primary category to describe your innovation, which one would it be?',
        description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
        validations: { isRequired: [true, 'Choose the category that best describes your innovation'] },
        items: [
          { value: 'MEDICAL_DEVICE', label: 'Medical device' },
          { value: 'PHARMACEUTICAL', label: 'Pharmaceutical' },
          { value: 'DIGITAL', label: 'Digital (including apps, platforms, software)' },
          { value: 'AI', label: 'Artificial intelligence (AI)' },
          { value: 'EDUCATION', label: 'Education or training of workforce' },
          { value: 'PPE', label: 'Personal protective equipment (PPE)' },
          {
            value: 'OTHER',
            label: 'Other',
            conditional: new FormEngineParameterModel({ id: 'otherMainCategoryDescription', dataType: 'text', label: 'Other main category', validations: { isRequired: [true, 'Other description is required'] } })
          }
        ]
      }
    ]
  }),

  // Question 03
  new FormEngineModel({
    parameters: [
      {
        id: 'hasProblemTackleKnowledge',
        dataType: 'radio-group',
        label: 'Have you identified what problem the innovation will tackle (also known as \'value proposition\')?',
        description: 'This is a simple statement that summarises your innovation, shows how it\'s different and documents the value that it brings to the customer.',
        validations: { isRequired: [true, 'Choose the option that best identifies what problem the innovation will tackle'] },
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
    parameters: [
      {
        id: 'hasMarketResearch',
        dataType: 'radio-group',
        label: 'Have you done market research so that you understand the need for your innovation in the UK?',
        description: 'For example, information and insight on your customers and competitors gathered from interviews, focus groups, pricing research or competitive analysis.',
        validations: { isRequired: [true, 'Choose if you have done market research'] },
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
    parameters: [
      {
        id: 'hasWhoBenefitsKnowledge',
        dataType: 'radio-group',
        label: 'Have you identified who would benefit from your innovation?',
        description: 'This can include specific patient groups, clinicians, nurses, administrative staff and wider organisations.',
        validations: { isRequired: [true, 'Choose if you identified who would benefit from your innovation'] },
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
    parameters: [
      {
        id: 'hasBenefits',
        dataType: 'radio-group',
        label: 'Have you identified the specific benefits that your innovation would bring?',
        description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
        validations: { isRequired: [true, 'Choose if you identified the specific benefits that your innovation would bring'] },
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
    parameters: [
      {
        id: 'hasTests',
        dataType: 'radio-group',
        label: 'Have you tested the innovation with users?',
        description: 'Depending on the context of your innovation, this can include device prototyping and testing, laboratory studies, clinical trials, amongst others.',
        validations: { isRequired: [true, 'Choose if you tested the innovation with users'] },
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
    parameters: [
      {
        id: 'hasRelevanteCertifications',
        dataType: 'radio-group',
        label: 'Have you achieved all relevant certifications?',
        description: 'There are different certifications for different types of innovations. For example, different types of medical devices need different levels of CE and/or UKCA certification.',
        validations: { isRequired: [true, 'Choose if you have achieved all relevant certifications'] },
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
    parameters: [
      {
        id: 'hasEvidence',
        dataType: 'radio-group',
        label: 'Do you have evidence to show that your innovation is safe to use and effective?',
        description: 'For example, data from clinical trials published in a peer reviewed journal.',
        validations: { isRequired: [true, 'Choose if you have evidences regarding your innovation safety'] },
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
    parameters: [
      {
        id: 'hasCostEvidence',
        dataType: 'radio-group',
        label: 'Do you have evidence on the costs and benefits of your innovation when used in practice?',
        description: 'For example, an Economic Value Analysis by an external health economics consultant?',
        validations: { isRequired: [true, 'Choose if you have evidences regarding your innovation costs and benefits'] },
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
    parameters: [
      {
        id: 'supportTypes',
        dataType: 'checkbox-array',
        label: 'What type of support are you currently looking for?',
        description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
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
          { value: '', label: 'SEPARATOR' },
          { value: 'INFORMATION', label: 'I\'m only looking for information right now' }
        ]
      }
    ]
  })

];
