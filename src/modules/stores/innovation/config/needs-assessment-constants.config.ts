import { FormEngineParameterModel } from '@shared-module/forms';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';

export const NEEDS_ASSESSMENT_QUESTIONS: {
  innovation: FormEngineParameterModel[],
  innovator: FormEngineParameterModel[],
  summary: FormEngineParameterModel[],
  organisationUnits: FormEngineParameterModel[]
} = {
  innovation: [
    new FormEngineParameterModel({
      id: 'description',
      dataType: 'textarea',
      label: 'Please provide a brief description of the innovation',
      description: 'Consider if anything provided by the innovator needs clarification, such as the innovation category or company location.',
      validations: { isRequired: [true, 'Innovation description is required'] },
      lengthLimit: 'large'
    }),
    new FormEngineParameterModel({
      id: 'maturityLevel',
      dataType: 'radio-group',
      label: 'What\'s the approximate level of maturity of this innovation?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: maturityLevelItems
    }),
    new FormEngineParameterModel({
      id: 'hasRegulatoryApprovals',
      dataType: 'radio-group',
      label: 'Does it have all regulatory approvals, appropriate for the intended use?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasRegulatoryApprovalsComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    }),
    new FormEngineParameterModel({
      id: 'hasEvidence',
      dataType: 'radio-group',
      label: 'Does it have evidence to prove efficacy?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasEvidenceComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    }),
    new FormEngineParameterModel({
      id: 'hasValidation',
      dataType: 'radio-group',
      label: 'Does it have a real-world validation of organisational & financial benefit?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasValidationComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    })
  ],

  innovator: [
    new FormEngineParameterModel({
      id: 'hasProposition',
      dataType: 'radio-group',
      label: 'Do they have a well-defined value proposition?',
      description: 'This should be founded on a understanding of the value of the product to NHS patients, staff, services and organisations, gained through detailed market research',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasPropositionComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    }),
    new FormEngineParameterModel({
      id: 'hasCompetitionKnowledge',
      dataType: 'radio-group',
      label: 'Do they have a good insight into competitors, alternatives, and the market landscape?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasCompetitionKnowledgeComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    }),
    new FormEngineParameterModel({
      id: 'hasImplementationPlan',
      dataType: 'radio-group',
      label: 'Do they have a well-defined implementation plan?',
      description: 'An implementation plan should consider things like customer job roles affected, pathway redesign, route to reach market, understanding of the complexity and change management required.',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasImplementationPlanComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    }),
    new FormEngineParameterModel({
      id: 'hasScaleResource',
      dataType: 'radio-group',
      label: 'Do they have the resource to scale the innovation, or a viable plan to do this?',
      validations: { isRequired: [true, 'Choose one option'] },
      items: yesPartiallyNoItems,
      additional: [new FormEngineParameterModel({ id: 'hasScaleResourceComment', dataType: 'text', label: '', description: 'Comment (optional)' })]
    })
  ],

  summary: [
    new FormEngineParameterModel({
      id: 'summary',
      dataType: 'textarea',
      label: 'Please outline what type of support is currently needed',
      validations: { isRequired: [true, 'Description of type of support currently needed is required'] },
      lengthLimit: 'large'
    })
  ],

  organisationUnits: [
    new FormEngineParameterModel({
      id: 'organisationUnits',
      dataType: 'grouped-checkbox-array',
      label: 'Suggest organisations for support',
      validations: { isRequired: [true, 'Choose at least one organisation unit'] },
      groupedItems: []
    })
  ]

};
