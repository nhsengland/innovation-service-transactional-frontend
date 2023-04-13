import { UtilsHelper } from '@app/base/helpers';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';
import { InnovationSections } from './catalog.types';
import { DocumentType202209 } from './document.types';

import { environmentalBenefitItems, generalBenefitItems, hasBenefitsItems, patientsCitizensBenefitItems } from './forms.config';


// Labels.
const stepsLabels = {
  l1: 'Have you identified the specific benefits that your innovation would bring?',
  l2: 'What benefits does your innovation create for patients or citizens?',
  l3: 'What benefits does your innovation create for the NHS or social care?',
  l4: 'What environmental sustainability benefits does your innovation create?',
  l5: 'Please explain how you have considered accessibility and the impact of your innovation on health inequalities.',
  l6: 'What steps have you taken to better understand and alleviate potential negative impacts of your solution on accessibility and health inequalities?'
};


// Types.
type InboundPayloadType = DocumentType202209['UNDERSTANDING_OF_BENEFITS'] & { impactPatients?: boolean };
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = DocumentType202209['UNDERSTANDING_OF_BENEFITS'];


export const SECTION_2_2: InnovationSectionConfigType<InnovationSections> = {
  id: 'UNDERSTANDING_OF_BENEFITS',
  title: 'Detailed understanding of benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasBenefits',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasBenefitsItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NOT_YET', 'NOT_SURE'].includes(currentValues.hasBenefits || 'NOT_YET')) {
    delete currentValues.patientsCitizensBenefits;
    // delete currentValues.otherPatientsCitizensBenefit;
    delete currentValues.generalBenefits;
    delete currentValues.otherGeneralBenefit;
    delete currentValues.environmentalBenefits;
    delete currentValues.otherEnvironmentalBenefit;
    delete currentValues.accessibilityImpactDetails;
    delete currentValues.accessibilityStepsDetails;
    return;
  }

  if (!currentValues.impactPatients) {
    delete currentValues.patientsCitizensBenefits;
    // delete currentValues.otherPatientsCitizensBenefit;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'patientsCitizensBenefits',
          dataType: 'checkbox-array',
          label: stepsLabels.l2,
          description: 'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below.',
          validations: { isRequired: [true, 'Choose at least one benefit'] },
          items: patientsCitizensBenefitItems
        }]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'generalBenefits',
        dataType: 'checkbox-array',
        label: stepsLabels.l3,
        description: 'Choose up to 3 benefits',
        validations: { isRequired: [true, 'Choose at least one benefit'], max: [3, 'Choose between 1 and 3 benefit'] },
        items: generalBenefitItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'environmentalBenefits',
        dataType: 'checkbox-array',
        label: stepsLabels.l4,
        description: 'Choose up to 3 benefits',
        validations: { isRequired: [true, 'Choose at least one environmental benefit'], max: [3, 'Choose between 1 and 3 environmental benefit'] },
        items: environmentalBenefitItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'accessibilityImpactDetails',
        dataType: 'textarea',
        label: stepsLabels.l5,
        validations: { isRequired: [true, 'Details are required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'accessibilityStepsDetails',
        dataType: 'textarea',
        label: stepsLabels.l6,
        validations: { isRequired: [true, 'Details are required'] },
        lengthLimit: 'medium'
      }]
    })
  );

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  return {
    impactPatients: data.impactPatients,
    hasBenefits: data.hasBenefits,
    patientsCitizensBenefits: data.patientsCitizensBenefits,
    // otherPatientsCitizensBenefit: data.otherPatientsCitizensBenefit,
    generalBenefits: data.generalBenefits,
    otherGeneralBenefit: data.otherGeneralBenefit,
    environmentalBenefits: data.environmentalBenefits,
    otherEnvironmentalBenefit: data.otherEnvironmentalBenefit,
    accessibilityImpactDetails: data.accessibilityImpactDetails,
    accessibilityStepsDetails: data.accessibilityStepsDetails,
  };

}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasBenefits: data.hasBenefits,
    ...(UtilsHelper.isEmpty(data.patientsCitizensBenefits) && { patientsCitizensBenefits: data.patientsCitizensBenefits }),
    // patientsCitizensBenefits: UtilsHelper.isEmpty(data.patientsCitizensBenefits) ? null : data.patientsCitizensBenefits,
    // otherPatientsCitizensBenefit: data.otherPatientsCitizensBenefit,
    ...(UtilsHelper.isEmpty(data.generalBenefits) && { generalBenefits: data.generalBenefits }),
    otherGeneralBenefit: data.otherGeneralBenefit,
    ...(UtilsHelper.isEmpty(data.environmentalBenefits) && { environmentalBenefits: data.environmentalBenefits }),
    otherEnvironmentalBenefit: data.otherEnvironmentalBenefit,
    accessibilityImpactDetails: data.accessibilityImpactDetails,
    accessibilityStepsDetails: data.accessibilityStepsDetails
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasBenefitsItems.find(item => item.value === data.hasBenefits)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasBenefits || 'NOT_YET')) {
    if (data.impactPatients) {
      toReturn.push({
        label: stepsLabels.l2,
        value: data.patientsCitizensBenefits?.map(benefit => patientsCitizensBenefitItems.find(item => item.value === benefit)?.label).join('\n'),
        editStepNumber: toReturn.length + 1
      });
    }

    toReturn.push({
      label: stepsLabels.l3,
      value: data.generalBenefits?.map(benefit => benefit === 'OTHER' ? data.otherGeneralBenefit : generalBenefitItems.find(item => item.value === benefit)?.label).join('\n'),
      editStepNumber: toReturn.length + 1
    });

    toReturn.push({
      label: stepsLabels.l4,
      value: data.environmentalBenefits?.map(benefit => benefit === 'OTHER' ? data.otherEnvironmentalBenefit : environmentalBenefitItems.find(item => item.value === benefit)?.label).join('\n'),
      editStepNumber: toReturn.length + 1
    });

    toReturn.push({
      label: stepsLabels.l5,
      value: data.accessibilityImpactDetails,
      editStepNumber: toReturn.length + 1
    });

    toReturn.push({
      label: stepsLabels.l6,
      value: data.accessibilityStepsDetails,
      editStepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}
