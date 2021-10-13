import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasFundindItems, hasRevenueModelItems, revenuesItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you have a model for generating revenue from your innovation?',
  l2: 'What\'s the revenue model for your innovation?',
  l3: 'Which NHS or social care organisation and department would pay for the innovation?',
  l4: 'Which NHS or social care organisation and department would benefit from the innovation?',
  l5: 'Have you secured funding for the next stage of development?',
  l6: 'Please describe what funding you have secured for the next stage of development'
};


// Types.
type InboundPayloadType = {
  hasRevenueModel: null | 'YES' | 'NO';
  revenues: null | ('ADVERTISING' | 'DIRECT_PRODUCT_SALES' | 'FEE_FOR_SERVICE' | 'LEASE' | 'SALES_OF_CONSUMABLES_OR_ACCESSORIES' | 'SUBSCRIPTION' | 'OTHER')[];
  otherRevenueDescription: null | string;
  payingOrganisations: null | string;
  benefittingOrganisations: null | string;
  hasFunding: null | 'YES' | 'NO' | 'NOT_RELEVANT';
  fundingDescription: null | string;
};

type StepPayloadType = InboundPayloadType;



export const SECTION_7_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.REVENUE_MODEL,
  title: 'Revenue model',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasRevenueModel',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a> for more information about creating a revenue model.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasRevenueModelItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: InboundPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO'].includes(currentValues.hasRevenueModel || 'NO')) {
    currentValues.revenues = [];
    currentValues.otherRevenueDescription = null;
    currentValues.payingOrganisations = null;
    currentValues.benefittingOrganisations = null;
    currentValues.hasFunding = null;
    currentValues.fundingDescription = null;
    return;
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'revenues',
        dataType: 'checkbox-array',
        label: stepsLabels.l2,
        validations: { isRequired: [true, 'Choose at least one revenue model'] },
        items: revenuesItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'payingOrganisations',
        dataType: 'textarea',
        label: stepsLabels.l3,
        description: 'The more specific you can be with your answer, the better.',
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'benefittingOrganisations',
        dataType: 'textarea',
        label: stepsLabels.l4,
        description: 'The more specific you can be with your answer, the better.',
        validations: { isRequired: [true, 'Description is required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'hasFunding',
        dataType: 'radio-group',
        label: stepsLabels.l5,
        validations: { isRequired: [true, 'Choose one option'] },
        items: hasFundindItems
      }]
    })
  );

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasFunding || 'NO')) {
    currentValues.fundingDescription = null;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'fundingDescription',
          dataType: 'textarea',
          label: stepsLabels.l6,
          validations: { isRequired: [true, 'Description is required'] },
          lengthLimit: 'medium'
        }]
      })
    );
  }

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasRevenueModelItems.find(item => item.value === data.hasRevenueModel)?.label,
    editStepNumber: 1
  });


  if (['YES'].includes(data.hasRevenueModel || 'NO')) {
    toReturn.push(
      {
        label: stepsLabels.l2,
        value: data.revenues?.map(v => v === 'OTHER' ? data.otherRevenueDescription : revenuesItems.find(item => item.value === v)?.label).join('\n'),
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
