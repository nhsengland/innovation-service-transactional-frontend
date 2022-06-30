import { FormEngineModel, WizardSummaryType, WizardEngineModel, WizardStepType } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { carePathwayItems, hasUKPathwayKnowledgeItems, innovationPathwayKnowledgeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know what the current care pathway (current practice) is across the UK?',
  l2: 'What is the current care pathway in relation to your innovation?',
  l3: 'Please describe the potential care pathway with your innovation in use.',
  l4: 'Thinking about the current care pathway in the UK, which option best describes your innovation?'
};


// Types.
type InboundPayloadType = {
  hasUKPathwayKnowledge: null | 'YES' | 'NO' | 'NOT_RELEVANT';
  innovationPathwayKnowledge: null | 'PATHWAY_EXISTS_AND_CHANGED' | 'PATHWAY_EXISTS_AND_FITS' | 'NO_PATHWAY';
  potentialPathway: null | string;
  carePathway: null | 'ONLY_OPTION' | 'BETTER_OPTION' | 'EQUIVALENT_OPTION' | 'FIT_LESS_COSTS' | 'NO_KNOWLEDGE';
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = InboundPayloadType;


export const SECTION_5_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.CURRENT_CARE_PATHWAY,
  title: 'Current care pathway',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasUKPathwayKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'This means mapping out the entire patient journey and the work done in different parts of the healthcare system. It\'s also key to understand the existing routines of clinical and care professionals, administrators, and anyone else who will be affected by your innovation.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasUKPathwayKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasUKPathwayKnowledge || 'NO')) {
    currentValues.innovationPathwayKnowledge = null;
    currentValues.potentialPathway = null;
    currentValues.carePathway = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'innovationPathwayKnowledge',
        dataType: 'radio-group',
        label: stepsLabels.l2,
        validations: { isRequired: [true, 'Choose one option'] },
        items: innovationPathwayKnowledgeItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'potentialPathway',
        dataType: 'textarea',
        label: stepsLabels.l3,
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'medium',
        items: innovationPathwayKnowledgeItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'carePathway',
        dataType: 'radio-group',
        label: stepsLabels.l4,
        description: 'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below',
        validations: { isRequired: [true, 'Choose one option'] },
        items: carePathwayItems
      }]
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    hasUKPathwayKnowledge: data.hasUKPathwayKnowledge,
    innovationPathwayKnowledge: data.innovationPathwayKnowledge,
    potentialPathway: data.potentialPathway,
    carePathway: data.carePathway,
  };

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasUKPathwayKnowledge: data.hasUKPathwayKnowledge,
    innovationPathwayKnowledge: data.innovationPathwayKnowledge,
    potentialPathway: data.potentialPathway,
    carePathway: data.carePathway,
  };

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasUKPathwayKnowledgeItems.find(item => item.value === data.hasUKPathwayKnowledge)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasUKPathwayKnowledge || 'NO')) {

    toReturn.push(
      {
        label: stepsLabels.l2,
        value: innovationPathwayKnowledgeItems.find(item => item.value === data.innovationPathwayKnowledge)?.label,
        editStepNumber: 2
      },
      {
        label: stepsLabels.l3,
        value: data.potentialPathway,
        editStepNumber: 3
      },
      {
        label: stepsLabels.l4,
        value: carePathwayItems.find(item => item.value === data.carePathway)?.label,
        editStepNumber: 4
      }
    );

  }

  return toReturn;

}
