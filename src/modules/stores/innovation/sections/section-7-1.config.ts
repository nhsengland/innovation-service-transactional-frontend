import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Do you have a model for generating revenue from your innovation?',
  l2: 'What\'s the revenue model for your innovation?',
  l3: 'Which NHS or social care organisation and department would pay for the innovation?',
  l4: 'Which NHS or social care organisation and department would benefit from the innovation?',
  l5: 'Have you secured funding for the next stage of development?',
  l6: 'Please describe what funding you have secured for the next stage of development'
};


// Catalogs.
const hasRevenueModelItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

const revenuesItems = [
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'DIRECT_PRODUCT_SALES', label: 'Direct product sales' },
  { value: 'FEE_FOR_SERVICE', label: 'Fee for service' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'SALES_OF_CONSUMABLES_OR_ACCESSORIES', label: 'Sales of consumables or accessories' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  {
    value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRevenueDescription', dataType: 'text', validations: { isRequired: true } })
  }
];

const hasFundindItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];


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
        label: stepsLabels.l1,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about creating a revenue model.',
        parameters: [{ id: 'hasRevenueModel', dataType: 'radio-group', validations: { isRequired: true }, items: hasRevenueModelItems }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: InboundPayloadType, currentStep: number): void {

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
      label: stepsLabels.l2,
      parameters: [{ id: 'revenues', dataType: 'checkbox-array', validations: { isRequired: true }, items: revenuesItems }]
    }),
    new FormEngineModel({
      label: stepsLabels.l3,
      description: 'The more specific you can be with your answer, the better.',
      parameters: [{ id: 'payingOrganisations', dataType: 'textarea', validations: { isRequired: true } }]
    }),
    new FormEngineModel({
      label: stepsLabels.l4,
      description: 'The more specific you can be with your answer, the better.',
      parameters: [{ id: 'benefittingOrganisations', dataType: 'textarea', validations: { isRequired: true } }]
    }),
    new FormEngineModel({
      label: stepsLabels.l5,
      parameters: [{ id: 'hasFunding', dataType: 'radio-group', validations: { isRequired: true }, items: hasFundindItems }]
    })
  );

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasFunding || 'NO')) {
    currentValues.fundingDescription = null;
  } else {
    steps.push(
      new FormEngineModel({
        label: stepsLabels.l6,
        parameters: [{ id: 'fundingDescription', dataType: 'textarea', validations: { isRequired: true } }]
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
        value: data.revenues?.map(v => v === 'OTHER' ? data.otherRevenueDescription : revenuesItems.find(item => item.value === v)?.label).join('<br />'),
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
