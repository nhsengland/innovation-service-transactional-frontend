import { URLS } from '@app/base/constants';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';
import { InnovationSections } from './catalog.types';

import { DocumentType202209 } from './document.types';
import { hasFundindItems, hasRevenueModelItems, revenuesItems } from './forms.config';

// Labels.
const stepsLabels = {
  l1: 'Do you have a model for generating revenue from your innovation?',
  l2: "What's the revenue model for your innovation?",
  l3: 'Which NHS or social care organisation and department would pay for the innovation?',
  l4: 'Which NHS or social care organisation and department would benefit from the innovation?',
  l5: 'Have you secured funding for the next stage of development?',
  l6: 'Please describe what funding you have secured for the next stage of development'
};

// Types.
type InboundPayloadType = DocumentType202209['REVENUE_MODEL'];
type StepPayloadType = InboundPayloadType;

export const SECTION_7_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'REVENUE_MODEL',
  title: 'Revenue model',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasRevenueModel',
            dataType: 'radio-group',
            label: stepsLabels.l1,
            description: `See <a href=${URLS.INNOVATION_GUIDES_ADVANCED_GUIDE} target="_blank" rel="noopener noreferrer">Innovation guides (opens in a new window)</a> for more information about creating a revenue model.`,
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasRevenueModelItems
          }
        ]
      })
    ],
    showSummary: true,
    runtimeRules: [
      (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, currentValues, currentStep)
    ],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(
  steps: WizardStepType[],
  currentValues: InboundPayloadType,
  currentStep: number | 'summary'
): void {
  steps.splice(1);

  if (['NO'].includes(currentValues.hasRevenueModel || 'NO')) {
    delete currentValues.revenues;
    delete currentValues.otherRevenueDescription;
    delete currentValues.payingOrganisations;
    delete currentValues.benefittingOrganisations;
    delete currentValues.hasFunding;
    delete currentValues.fundingDescription;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'revenues',
          dataType: 'checkbox-array',
          label: stepsLabels.l2,
          validations: { isRequired: [true, 'Choose at least one revenue model'] },
          items: revenuesItems
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'payingOrganisations',
          dataType: 'textarea',
          label: stepsLabels.l3,
          description: 'The more specific you can be with your answer, the better.',
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'benefittingOrganisations',
          dataType: 'textarea',
          label: stepsLabels.l4,
          description: 'The more specific you can be with your answer, the better.',
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 's'
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'hasFunding',
          dataType: 'radio-group',
          label: stepsLabels.l5,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasFundindItems
        }
      ]
    })
  );

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasFunding || 'NO')) {
    delete currentValues.fundingDescription;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'fundingDescription',
            dataType: 'textarea',
            label: stepsLabels.l6,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 's'
          }
        ]
      })
    );
  }
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasRevenueModelItems.find(item => item.value === data.hasRevenueModel)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasRevenueModel || 'NO')) {
    toReturn.push(
      {
        label: stepsLabels.l2,
        value: data.revenues
          ?.map(v =>
            v === 'OTHER' ? data.otherRevenueDescription : revenuesItems.find(item => item.value === v)?.label
          )
          .join('\n'),
        editStepNumber: 2
      },
      {
        label: stepsLabels.l3,
        value: data.payingOrganisations,
        editStepNumber: 3
      },
      {
        label: stepsLabels.l4,
        value: data.benefittingOrganisations,
        editStepNumber: 4
      },
      {
        label: stepsLabels.l5,
        value: hasFundindItems.find(item => item.value === data.hasFunding)?.label,
        editStepNumber: 5
      }
    );

    if (['YES'].includes(data.hasFunding || 'NO')) {
      toReturn.push({
        label: stepsLabels.l6,
        value: data.fundingDescription,
        editStepNumber: 6
      });
    }
  }

  return toReturn;
}
