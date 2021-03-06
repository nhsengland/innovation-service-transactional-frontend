import { FormEngineModel, WizardSummaryType, WizardEngineModel, WizardStepType } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { hasProblemTackleKnowledgeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Have you identified what problem the innovation will tackle (also known as \'value proposition\')?',
  l2: 'What problem does your innovation tackle?',
  l3: 'What are the consequences of the problem?',
  l4: 'What\'s the intervention?',
  l5: 'What\'s the impact of the intervention?'
};


// Types.
type InboundPayloadType = {
  hasProblemTackleKnowledge: null | 'YES' | 'NOT_YET' | 'NOT_SURE';
  problemsTackled: null | string;
  problemsConsequences: null | string;
  intervention: null | string;
  interventionImpact: null | string;
};
type StepPayloadType = InboundPayloadType;


export const SECTION_1_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.VALUE_PROPOSITION,
  title: 'Value proposition',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasProblemTackleKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'This is a simple statement that summarises your innovation, shows how it\'s different and documents the value that it brings to the customer.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasProblemTackleKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};



function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NOT_YET', 'NOT_SURE'].includes(currentValues.hasProblemTackleKnowledge || 'NO')) {
    currentValues.problemsTackled = null;
    currentValues.problemsConsequences = null;
    currentValues.intervention = null;
    currentValues.interventionImpact = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'problemsTackled',
        dataType: 'textarea',
        label: stepsLabels.l2,
        description: 'Example problem description:<br />The process of checking a patient???s pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate.',
        validations: { isRequired: [true, 'A description of problems tackled is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'problemsConsequences',
        dataType: 'textarea',
        label: stepsLabels.l3,
        description: 'Example consequence description:<br />Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.',
        validations: { isRequired: [true, 'A description of what are the consequences of the problem is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'intervention',
        dataType: 'textarea',
        label: stepsLabels.l4,
        description: 'Describe your improvement. What will happen differently? How might that lead to a reduction of the consequences of the problem?',
        validations: { isRequired: [true, 'Improvement description is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'interventionImpact',
        dataType: 'textarea',
        label: stepsLabels.l5,
        description: 'Example impact description:<br />A 20% reduction in emergency referrals from care homes to the Emergency Department. For a mid-sized Clinical Commissioning Group covering a population of 250,000, this would equate to 150-200 referrals per year.',
        validations: { isRequired: [true, 'A description of the impact of the intervention is required'] },
        lengthLimit: 'medium'
      }]
    })
  );

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasProblemTackleKnowledgeItems.find(item => item.value === data.hasProblemTackleKnowledge)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasProblemTackleKnowledge || 'NO')) {
    toReturn.push(
      {
        label: stepsLabels.l2,
        value: data.problemsTackled,
        editStepNumber: 2
      },
      {
        label: stepsLabels.l3,
        value: data.problemsConsequences,
        editStepNumber: 3
      },
      {
        label: stepsLabels.l4,
        value: data.intervention,
        editStepNumber: 4
      },
      {
        label: stepsLabels.l5,
        value: data.interventionImpact,
        editStepNumber: 5
      }
    );
  }

  return toReturn;

}
