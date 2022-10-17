import { categoriesItems, hasBenefitsItems, hasEvidenceItems, hasMarketResearchItems, hasProblemTackleKnowledgeItems, hasTestsItems, mainCategoryItems, supportTypesItems, yesNotYetNotSureItems } from '@modules/stores/innovation/sections/catalogs.config';
import { FormEngineModel } from '@modules/shared/forms';

export const TRIAGE_INNOVATOR_PACK_QUESTIONS: { question: FormEngineModel, summary: { [key: string]: null | string } }[] = [

  // Question 01
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'categories',
          dataType: 'checkbox-array',
          label: 'Choose all categories that can be used to describe your innovation',
          description: 'Your answer will help us to establish your primary point of contact if you choose to create an account with the innovation service.',
          validations: { isRequired: [true, 'Choose at least one category that describes your innovation'] },
          items: categoriesItems
        }
      ]
    }),
    summary: {}
  },

  // Question 02
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'mainCategory',
          dataType: 'radio-group',
          label: 'If you had to select one primary category to describe your innovation, which one would it be?',
          description: 'Your innovation may be a combination of various categories. Selecting the primary category will help us find the right people to support you.',
          validations: { isRequired: [true, 'Choose the category that best describes your innovation'] },
          items: mainCategoryItems
        }
      ]
    }),
    summary: {}
  },

  // Question 03
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasProblemTackleKnowledge',
          dataType: 'radio-group',
          label: 'Have you identified what problem the innovation will tackle (also known as \'value proposition\')?',
          description: 'This is a simple statement that summarises your innovation, shows how it\'s different and documents the value that it brings to the customer.',
          validations: { isRequired: [true, 'Choose the option that best identifies what problem the innovation will tackle'] },
          items: hasProblemTackleKnowledgeItems
        }
      ]
    }),
    summary: {
      YES: null,
      NOT_YET: '<a href="/innovation-guides/advanced-innovation-guide/creation-advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> refine your value proposition (opens in a new window) </a>',
      NOT_SURE: '<a href="/innovation-guides/starter-innovation-guide/step-1-creation#Identify%20a%20need%20and%20market%20value" target="_blank" rel="noopener noreferrer"> identify the problem your innovation will tackle (opens in a new window) </a>'
    }
  },

  // Question 04
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasMarketResearch',
          dataType: 'radio-group',
          label: 'Have you done market research so that you understand the need for your innovation in the UK?',
          description: 'For example, information and insight on your customers and competitors gathered from interviews, focus groups, pricing research or competitive analysis.',
          validations: { isRequired: [true, 'Choose if you have done market research'] },
          items: hasMarketResearchItems
        }
      ]
    }),
    summary: {
      YES: null,
      IN_PROGRESS: '<a href="/innovation-guides/advanced-innovation-guide/development-advanced-innovation-guide#Market%20research" target="_blank" rel="noopener noreferrer"> make sure you have considered all options for market research (opens in a new window) </a>',
      NOT_YET: '<a href="/innovation-guides/advanced-innovation-guide/development-advanced-innovation-guide#Market%20research" target="_blank" rel="noopener noreferrer"> consider doing some market research (opens in a new window) </a>'
    }
  },

  // Question 05
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasWhoBenefitsKnowledge',
          dataType: 'radio-group',
          label: 'Have you identified who would benefit from your innovation?',
          description: 'This can include specific patient groups, clinicians, nurses, administrative staff and wider organisations.',
          validations: { isRequired: [true, 'Choose if you identified who would benefit from your innovation'] },
          items: yesNotYetNotSureItems
        }
      ]
    }),
    summary: {
      YES: null,
      NOT_YET: '<a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> consider all the groups who might benefit from your innovation (opens in a new window) </a>',
      NOT_SURE: '<a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> consider all the groups who might benefit from your innovation (opens in a new window) </a>'
    }
  },

  // Question 06
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasBenefits',
          dataType: 'radio-group',
          label: 'Have you identified the specific benefits that your innovation would bring?',
          description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
          validations: { isRequired: [true, 'Choose if you identified the specific benefits that your innovation would bring'] },
          items: hasBenefitsItems
        }
      ]
    }),
    summary: {
      YES: null,
      NOT_YET: '<a href="/innovation-guides/advanced-innovation-guide/step-3-evidence#Presenting%20evidence" target="_blank" rel="noopener noreferrer"> consider which benefits different groups will want you to demonstrate (opens in a new window) </a>',
      NOT_SURE: '<a href="/innovation-guides/starter-innovation-guide/step-1-creation#Outcome%20measures" target="_blank" rel="noopener noreferrer"> consider which benefits different groups will want to see (opens in a new window) </a>'
    }
  },

  // Question 07
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasTests',
          dataType: 'radio-group',
          label: 'Have you tested the innovation with users?',
          description: 'Depending on the context of your innovation, this can include device prototyping and testing, laboratory studies, clinical trials, amongst others.',
          validations: { isRequired: [true, 'Choose if you tested the innovation with users'] },
          items: hasTestsItems
        }
      ]
    }),
    summary: {
      YES: null,
      IN_PROCESS: '<a href="/innovation-guides/advanced-innovation-guide/step-3-evidence" target="_blank" rel="noopener noreferrer"> consider all types testing you might want to conduct (opens in a new window) </a>',
      NOT_YET: '<a href="/innovation-guides/starter-innovation-guide/step-1-creation#Finding%20patients%20and%20users%20to%20test%20with%20(PPI)" target="_blank" rel="noopener noreferrer"> plan to test with real users of your innovation (opens in a new window) </a>'
    }
  },

  // Question 08
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasRelevantCertifications',
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
    summary: {
      YES: null,
      NOT_YET: '<a href="/innovation-guides/advanced-innovation-guide/step-4-evaluation" target="_blank" rel="noopener noreferrer"> understand which certifications might apply to your innovation (opens in a new window) </a>',
      NO_KNOWLEDGE: '<a href="/innovation-guides/starter-innovation-guide/step-3-regulation" target="_blank" rel="noopener noreferrer"> understand which certifications might apply to your innovation (opens in a new window) </a>',
      NOT_APPLICABLE: null
    }
  },

  // Question 09
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'hasEvidence',
          dataType: 'radio-group',
          label: 'Do you have evidence to show that your innovation is safe to use and effective?',
          description: 'For example, data from clinical trials published in a peer reviewed journal.',
          validations: { isRequired: [true, 'Choose if you have evidences regarding your innovation safety'] },
          items: hasEvidenceItems
        }
      ]
    }),
    summary: {
      YES: null,
      IN_PROGRESS: '<a href="/innovation-guides/advanced-innovation-guide/step-3-evidence" target="_blank" rel="noopener noreferrer"> check that you have considered all types of evidence (opens in a new window) </a>',
      NOT_YET: '<a href="/innovation-guides/starter-innovation-guide/step-2-development#Testing" target="_blank" rel="noopener noreferrer"> plan studies, trials or other tests to show your innovation is safe and effective (opens in a new window) </a>'
    }
  },

  // Question 10
  {
    question: new FormEngineModel({
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
    summary: {
      YES: null,
      IN_PROGRESS: '<a href="/innovation-guides/starter-innovation-guide/step-5-commissioning-and-adoption#Assessing%20benefits%20in%20NHS%20business%20cases" target="_blank" rel="noopener noreferrer"> check that you have considered all types of costs and benefits of your innovation (opens in a new window) </a>',
      NOT_YET: '<a href="/innovation-guides/starter-innovation-guide/step-5-commissioning-and-adoption#Assessing%20benefits%20in%20NHS%20business%20cases" target="_blank" rel="noopener noreferrer"> plan how you will demonstrate the costs and benefits of your innovation (opens in a new window) </a>'
    }
  },

  // Question 11
  {
    question: new FormEngineModel({
      parameters: [
        {
          id: 'supportTypes',
          dataType: 'checkbox-array',
          label: 'What type of support are you currently looking for?',
          description: 'Select up to 5 options. Your answer will help us to establish your primary point of contact if you choose to sign up for the innovation service.',
          validations: {
            isRequired: [true, 'Choose between 1 and 5 types of support'],
            max: [5, 'Choose between 1 and 5 types of support']
          },
          items: supportTypesItems
        }
      ]
    }),
    summary: {}
  }

];
