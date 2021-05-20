import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_7_1_1: 'Do you have a model for generating revenue from your innovation?',
  s_7_1_2: 'What\'s the revenue model for your innovation?',
  s_7_1_3: 'Which NHS or social care organisation and department would pay for the innovation?',
  s_7_1_4: 'Which NHS or social care organisation and department would benefit from the innovation?',
  s_7_1_5: 'Have you secured funding for the next stage of development?',
  s_7_1_6: 'Please describe what funding you have secured for the next stage of development'
};


const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const revenuesItems = [
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'DIRECT_PRODUCT_SALES', label: 'Direct product sales' },
  { value: 'FEE_FOR_SERVICE', label: 'Fee for service' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'SALES_OF_CONSUMABLES_OR_ACCESSORIES', label: 'Sales of consumables or accessories' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRevenueDescription ', dataType: 'text', validations: { isRequired: true } })
  }
];

const yesOrNoOtNotRelevantItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_relevant', label: 'Not relevant' }
];

type stepPayload = {
  id?: string;
  hasRevenueModel: null | 'yes' | 'no';
  revenues: ('ADVERTISING' | 'DIRECT_PRODUCT_SALES' | 'FEE_FOR_SERVICE' | 'LEASE' | 'SALES_OF_CONSUMABLES_OR_ACCESSORIES' | 'SUBSCRIPTION' | 'OTHER')[];
  otherRevenueDescription: string;
  payingOrganisations: null | string;
  benefittingOrganisations: null | string;
  hasFunding: null | 'yes' | 'no' | 'not_relevant';
  fundingDescription: null | string;
};


export const SECTION_7_1: InnovationSectionConfigType['sections'][0] = {

  id: InnovationSectionsIds.REVENUE_MODEL,
  title: 'Revenue model',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_7_1_1,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about creating a revenue model.',
        parameters: [{
          id: 'hasRevenueModel',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: stepPayload) => summaryParsing(data)
  })
};




function runtimeRules(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number): void {

  steps.splice(1);

  if (['no'].includes(currentValues.hasRevenueModel || 'no')) {
    currentValues.revenues = [];
    currentValues.payingOrganisations = null;
    currentValues.benefittingOrganisations = null;
    currentValues.hasFunding = null;
    currentValues.fundingDescription = null;
    return;
  }


  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_7_1_2,
      parameters: [{ id: 'revenues', dataType: 'checkbox-array', validations: { isRequired: true }, items: revenuesItems }]
    })
  );

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_7_1_3,
      description: 'The more specific you can be with your answer, the better.',
      parameters: [{ id: 'payingOrganisations', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );
  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_7_1_4,
      description: 'The more specific you can be with your answer, the better.',
      parameters: [{ id: 'benefittingOrganisations', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );
  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_7_1_5,
      parameters: [{ id: 'hasFunding', dataType: 'radio-group', validations: { isRequired: true }, items: yesOrNoOtNotRelevantItems }]
    })
  );


  if (!['yes'].includes(currentValues.hasFunding || 'yes')) {
    currentValues.fundingDescription = null;
  } else {
    steps.push(
      new FormEngineModel({
        label: stepsLabels.s_7_1_6,
        parameters: [{
          id: 'fundingDescription',
          dataType: 'textarea',
          validations: { isRequired: true }
        }]
      })
    );
  }

}


function summaryParsing(data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_7_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasRevenueModel)?.label || '',
    editStepNumber: 1
  });


  if (['yes'].includes(data.hasRevenueModel || 'no')) {

    toReturn.push({
      label: stepsLabels.s_7_1_2,
      value: data.revenues.map(v => revenuesItems.find(item => item.value === v)?.label).join('<br />'),
      editStepNumber: 2
    });
    toReturn.push({
      label: stepsLabels.s_7_1_3,
      value: data.payingOrganisations || '',
      editStepNumber: 3
    });
    toReturn.push({
      label: stepsLabels.s_7_1_4,
      value: data.benefittingOrganisations || '',
      editStepNumber: 4
    });
    toReturn.push({
      label: stepsLabels.s_7_1_5,
      value: yesOrNoOtNotRelevantItems.find(item => item.value === data.hasFunding)?.label || '',
      editStepNumber: 5
    });

    if (['yes'].includes(data.hasFunding || 'no')) {
      toReturn.push({
        label: stepsLabels.s_7_1_6,
        value: data.fundingDescription || '',
        editStepNumber: 6
      });
    }

  }

  return toReturn;

}
