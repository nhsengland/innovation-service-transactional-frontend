import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasFundindItems, hasRevenueModelItems, revenuesItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: { label: 'Do you have a model for generating revenue from your innovation?' },
  q2: { label: 'What is the revenue model for your innovation?' },
  q3: {
    label: 'Which NHS or social care organisation and department do you think would pay for the innovation?',
    description: 'Be as specific as you can.'
  },
  q4: {
    label: 'Which NHS or social care organisation and department would benefit from the innovation?',
    description: 'Be as specific as you can.'
  },
  q5: { label: 'Have you secured funding for the next stage of development?' },
  q6: {
    label: 'Describe the funding you have secured for the next stage of development',
    description: 'For example, venture capital, angel investor, seed funding, grant funding, government funding or similar.'
  }
};


// Types.
type InboundPayloadType = DocumentType202304['REVENUE_MODEL'];
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = DocumentType202304['REVENUE_MODEL'];


// Logic.
export const SECTION_6_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'REVENUE_MODEL',
  title: 'Revenue model',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasRevenueModel', dataType: 'radio-group', label: stepsLabels.q1.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasRevenueModelItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: InboundPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO', 'DONT_KNOW'].includes(currentValues.hasRevenueModel || 'NO')) {
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
      parameters: [{
        id: 'revenues', dataType: 'checkbox-array', label: stepsLabels.q2.label,
        validations: { isRequired: [true, 'Choose at least one revenue model'] },
        items: [
          ...revenuesItems,
          { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRevenueDescription', dataType: 'text', label: 'Other revenue model', validations: { isRequired: [true, 'Other revenue model is required'], maxLength: 100 } }) }
        ]
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'payingOrganisations', dataType: 'textarea', label: stepsLabels.q3.label, description: stepsLabels.q3.description,
        validations: { isRequired: [true, 'A description is required'] },
        lengthLimit: 'mediumUp'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'benefittingOrganisations', dataType: 'textarea', label: stepsLabels.q4.label, description: stepsLabels.q4.description,
        validations: { isRequired: [true, 'A description is required'] },
        lengthLimit: 'mediumUp'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'hasFunding', dataType: 'radio-group', label: stepsLabels.q5.label,
        validations: { isRequired: [true, 'Choose one option'] },
        items: hasFundindItems
      }]
    })
  );

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasFunding || 'NO')) {
    delete currentValues.fundingDescription;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'fundingDescription', dataType: 'textarea', label: stepsLabels.q6.label, description: stepsLabels.q6.description,
          validations: { isRequired: [true, 'A description is required'] },
          lengthLimit: 'medium'
        }]
      })
    );
  }

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    ...(data.hasRevenueModel && { hasRevenueModel: data.hasRevenueModel }),
    ...((data.revenues ?? []).length > 0 && { revenues: data.revenues }),
    ...(data.otherRevenueDescription && { otherRevenueDescription: data.otherRevenueDescription }),
    ...(data.payingOrganisations && { payingOrganisations: data.payingOrganisations }),
    ...(data.benefittingOrganisations && { benefittingOrganisations: data.benefittingOrganisations }),
    ...(data.hasFunding && { hasFunding: data.hasFunding }),
    ...(data.fundingDescription && { fundingDescription: data.fundingDescription })
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.q1.label,
    value: hasRevenueModelItems.find(item => item.value === data.hasRevenueModel)?.label,
    editStepNumber: 1
  });


  if (['YES'].includes(data.hasRevenueModel || 'NO')) {
    toReturn.push(
      {
        label: stepsLabels.q2.label,
        value: data.revenues?.map(v => v === 'OTHER' ? data.otherRevenueDescription : revenuesItems.find(item => item.value === v)?.label).join('\n'),
        editStepNumber: 2
      },
      {
        label: stepsLabels.q3.label,
        value: data.payingOrganisations,
        editStepNumber: 3
      },
      {
        label: stepsLabels.q4.label,
        value: data.benefittingOrganisations,
        editStepNumber: 4
      },
      {
        label: stepsLabels.q5.label,
        value: hasFundindItems.find(item => item.value === data.hasFunding)?.label,
        editStepNumber: 5
      }
    );

    if (['YES'].includes(data.hasFunding || 'NO')) {
      toReturn.push({
        label: stepsLabels.q6.label,
        value: data.fundingDescription,
        editStepNumber: 6
      });
    }

  }

  return toReturn;

}
