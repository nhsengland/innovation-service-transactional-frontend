import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_1_1_1: 'What problem does your innovation tackle?',
  s_1_1_2: 'What are the consequences of the problem?',
  s_1_1_3: 'What\'s the intervention?',
  s_1_1_4: 'What\'s the impact of the intervention?'
};


export const SECTION_1_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.VALUE_PROPOSITION,
  title: 'Value proposition',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_1_1_1,
        description: 'Example problem description:<br />The process of checking a patient’s pulse to determine if there is atrial fibrillation using a finger and a watch is inherently inaccurate.',
        parameters: [
          {
            id: 'problemsTrackled',
            dataType: 'textarea',
            label: 'Enter a description',
            validations: { isRequired: true }
          }
        ]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_2,
        description: 'Example consequence description:<br />Using this method approximately 25% of patients are not referred to secondary care who should be (false negative) and 15% of patients who are referred are referred unnecessarily (false positive). For those patients who are not picked up at this stage, their underlying disease will progress before being correctly diagnosed.',
        parameters: [
          {
            id: 'problemsConsequences',
            dataType: 'textarea',
            label: 'Enter a description',
            validations: { isRequired: true }
          }
        ]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_3,
        description: 'Describe your improvement. What will happen differently? How might that lead to a reduction of the consequences of the problem?',
        parameters: [
          {
            id: 'intervention',
            dataType: 'textarea',
            label: 'Enter a description',
            validations: { isRequired: true }
          }
        ]
      }),
      new FormEngineModel({
        label: stepsLabels.s_1_1_4,
        description: 'Example impact description:<br />A 20% reduction in emergency referrals from care homes to the Emergency Department. For a mid-sized Clinical Commissioning Group covering a population of 250,000, this would equate to 150-200 referrals per year.',
        parameters: [
          {
            id: 'interventionImpact',
            dataType: 'textarea',
            label: 'Enter a description',
            validations: { isRequired: true }
          }
        ]
      })
    ],
    summaryParsing: (steps: FormEngineModel[], data: any) => summaryParsing(steps, data)
  })
};



type summaryData = {
  id?: string;
  problemsTrackled: string;
  problemsConsequences: string;
  intervention: string;
  interventionImpact: string;
};

function summaryParsing(steps: FormEngineModel[], data: summaryData): SummaryParsingType[] {

  return [
    {
      label: stepsLabels.s_1_1_1,
      value: data.problemsTrackled,
      editStepNumber: 1
    },
    {
      label: stepsLabels.s_1_1_2,
      value: data.problemsConsequences,
      editStepNumber: 2
    },
    {
      label: stepsLabels.s_1_1_3,
      value: data.intervention,
      editStepNumber: 3
    },
    {
      label: stepsLabels.s_1_1_4,
      value: data.interventionImpact,
      editStepNumber: 4
    }
  ];

}
