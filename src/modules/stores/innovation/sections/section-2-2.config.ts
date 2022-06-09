import { FormEngineModel, WizardSummaryType, WizardEngineModel, WizardStepType } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { environmentalBenefitItems, generalBenefitItems, hasBenefitsItems, patientsCitizensBenefitItems } from './catalogs.config';


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
type InboundPayloadType = {
  impactPatients: boolean;
  hasBenefits: null | 'YES' | 'NO' | 'NOT_SURE';
  patientsCitizensBenefits: null | ('REDUCE_MORTALITY' | 'REDUCE_FURTHER_TREATMENT' | 'REDUCE_ADVERSE_EVENTS' | 'ENABLE_EARLIER_DIAGNOSIS' | 'REDUCE_RISKS' | 'PREVENTS_CONDITION_OCCURRING' | 'AVOIDS_UNNECESSARY_TREATMENT' | 'ENABLES_NON_INVASIVELY_TEST' | 'INCREASES_SELF_MANAGEMENT' | 'INCREASES_LIFE_QUALITY' | 'ENABLES_SHARED_CARE' | 'OTHER')[];
  otherPatientsCitizensBenefit: null | string;
  generalBenefits: null | ('REDUCE_LENGTH_STAY' | 'REDUCE_CRITICAL_CARE' | 'REDUCE_EMERGENCY_ADMISSIONS' | 'CHANGES_DELIVERY_SECONDARY_TO_PRIMARY' | 'CHANGES_DELIVERY_INPATIENT_TO_DAY_CASE' | 'INCREASES_COMPLIANCE' | 'IMPROVES_COORDINATION' | 'REDUCES_REFERRALS' | 'LESS_TIME' | 'FEWER_STAFF' | 'FEWER_APPOINTMENTS' | 'COST_SAVING' | 'INCREASES_EFFICIENCY' | 'IMPROVES_PERFORMANCE' | 'OTHER')[];
  otherGeneralBenefit: null | string;
  environmentalBenefits: null | ('NO_SIGNIFICANT_BENEFITS' | 'LESS_ENERGY' | 'LESS_RAW_MATERIALS' | 'REDUCES_GAS_EMISSIONS' | 'REDUCES_PLASTICS_USE' | 'MINIMISES_WASTE' | 'LOWER_ENVIRONMENTAL_IMPACT' | 'OPTIMIZES_FINITE_RESOURCE_USE' | 'USES_RECYCLED_MATERIALS' | 'OTHER')[];
  otherEnvironmentalBenefit: null | string;
  accessibilityImpactDetails: null | string;
  accessibilityStepsDetails: null | string;
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = Omit<InboundPayloadType, 'impactPatients'>;


export const SECTION_2_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS,
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
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  })
};


function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NOT_YET', 'NOT_SURE'].includes(currentValues.hasBenefits || 'NOT_YET')) {
    currentValues.patientsCitizensBenefits = null;
    currentValues.otherPatientsCitizensBenefit = null;
    currentValues.generalBenefits = null;
    currentValues.otherGeneralBenefit = null;
    currentValues.environmentalBenefits = null;
    currentValues.otherEnvironmentalBenefit = null;
    currentValues.accessibilityImpactDetails = null;
    currentValues.accessibilityStepsDetails = null;
    return;
  }

  if (!currentValues.impactPatients) {
    currentValues.patientsCitizensBenefits = null;
    currentValues.otherPatientsCitizensBenefit = null;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'patientsCitizensBenefits',
          dataType: 'checkbox-array',
          label: stepsLabels.l2,
          description: 'If your innovation has more than one population or subgroup, please keep this in mind when choosing from the options below',
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
        validations: { isRequired: [true, 'Accessibility impact details are required'] },
        lengthLimit: 'medium'
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'accessibilityStepsDetails',
        dataType: 'textarea',
        label: stepsLabels.l6,
        validations: { isRequired: [true, 'Accessibility steps details are required'] },
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
    otherPatientsCitizensBenefit: data.otherPatientsCitizensBenefit,
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
    patientsCitizensBenefits: data.patientsCitizensBenefits,
    otherPatientsCitizensBenefit: data.otherPatientsCitizensBenefit,
    generalBenefits: data.generalBenefits,
    otherGeneralBenefit: data.otherGeneralBenefit,
    environmentalBenefits: data.environmentalBenefits,
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
        value: data.patientsCitizensBenefits?.map(benefit => benefit === 'OTHER' ? data.otherPatientsCitizensBenefit : patientsCitizensBenefitItems.find(item => item.value === benefit)?.label).join('\n'),
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
