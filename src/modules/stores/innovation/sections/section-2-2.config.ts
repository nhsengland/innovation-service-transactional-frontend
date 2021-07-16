import { cloneDeep } from 'lodash';
import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { environmentalBenefitItems, generalBenefitItems, hasBenefitsItems, subgroupBenefitItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Have you identified the specific benefits that your innovation would bring?',
  l3: 'What benefits does your innovation create for the NHS or social care?',
  l4: 'What environmental sustainability benefits does your innovation create?',
  l5: 'Please explain how you have considered accessibility and the impact of your innovation on health inequalities.',
  l6: 'What steps have you taken to better understand and alleviate potential negative impacts of your solution on accessibility and health inequalities?'
};


// Types.
type InboundPayloadType = {
  hasBenefits: null | 'YES' | 'NO' | 'NOT_SURE';
  subgroups: {
    id: string;
    name: string;
    benefits: ('REDUCE_MORTALITY' | 'REDUCE_FURTHER_TREATMENT' | 'REDUCE_ADVERSE_EVENTS' | 'ENABLE_EARLIER_DIAGNOSIS' | 'REDUCE_RISKS' | 'PREVENTS_CONDITION_OCCURRING' | 'AVOIDS_UNNECESSARY_TREATMENT' | 'ENABLES_NON_INVASIVELY_TEST' | 'INCREASES_SELF_MANAGEMENT' | 'INCREASES_LIFE_QUALITY' | 'ENABLES_SHARED_CARE' | 'OTHER')[];
    otherBenefit: null | string;
  }[];
  generalBenefits: null | ('REDUCE_LENGTH_STAY' | 'REDUCE_CRITICAL_CARE' | 'REDUCE_EMERGENCY_ADMISSIONS' | 'CHANGES_DELIVERY_SECONDARY_TO_PRIMARY' | 'CHANGES_DELIVERY_INPATIENT_TO_DAY_CASE' | 'INCREASES_COMPLIANCE' | 'IMPROVES_COORDINATION' | 'REDUCES_REFERRALS' | 'LESS_TIME' | 'FEWER_STAFF' | 'FEWER_APPOINTMENTS' | 'COST_SAVING' | 'INCREASES_EFFICIENCY' | 'IMPROVES_PERFORMANCE' | 'OTHER')[];
  otherGeneralBenefit: null | string;
  environmentalBenefits: null | ('NO_SIGNIFICANT_BENEFITS' | 'LESS_ENERGY' | 'LESS_RAW_MATERIALS' | 'REDUCES_GAS_EMISSIONS' | 'REDUCES_PLASTICS_USE' | 'MINIMISES_WASTE' | 'LOWER_ENVIRONMENTAL_IMPACT' | 'OPTIMIZES_FINITE_RESOURCE_USE' | 'USES_RECYCLED_MATERIALS' | 'OTHER')[];
  otherEnvironmentalBenefit: null | string;
  accessibilityImpactDetails: null | string;
  accessibilityStepsDetails: null | string;
};

// [key: string] is needed to support subgroups_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string[] | string };

type OutboundPayloadType = InboundPayloadType;



export const SECTION_2_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_BENEFITS,
  title: 'Detailed understanding of benefits',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
        parameters: [{ id: 'hasBenefits', dataType: 'radio-group', validations: { isRequired: true }, items: hasBenefitsItems }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number): void {

  steps.splice(1);

  if (['NOT_YET', 'NOT_SURE'].includes(currentValues.hasBenefits || 'NOT_YET')) {
    currentValues.subgroups = currentValues.subgroups.map(item => ({ id: item.id, name: item.name, benefits: [], otherBenefit: null }));
    currentValues.generalBenefits = null;
    currentValues.otherGeneralBenefit = null;
    currentValues.environmentalBenefits = null;
    currentValues.otherEnvironmentalBenefit = null;
    currentValues.accessibilityImpactDetails = null;
    currentValues.accessibilityStepsDetails = null;
    Object.keys(currentValues).filter(key => key.startsWith('subgroupBenefits_')).forEach((key) => { delete currentValues[key]; });
    Object.keys(currentValues).filter(key => key.startsWith('subgroupOtherBenefit_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subgroupBenefits_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].benefits = currentValues[key] as InboundPayloadType['subgroups'][0]['benefits'];
    delete currentValues[key];
  });
  Object.keys(currentValues).filter(key => key.startsWith('subgroupOtherBenefit_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].otherBenefit = currentValues[key] as string;
    delete currentValues[key];
  });


  currentValues.subgroups.forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        label: `What benefits does your innovation create for patients or citizens of ${item.name}?`,
        parameters: [{
          id: `subgroupBenefits_${i}`,
          dataType: 'checkbox-array',
          validations: { isRequired: true },
          items: [...subgroupBenefitItems, ...[{ value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: `subgroupOtherBenefit_${i}`, dataType: 'text', validations: { isRequired: true } }) }]]
        }]
      })
    );
    currentValues[`subgroupBenefits_${i}`] = item.benefits;
    currentValues[`subgroupOtherBenefit_${i}`] = item.otherBenefit;
  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l3,
      parameters: [{ id: 'generalBenefits', dataType: 'checkbox-array', validations: { isRequired: true }, items: generalBenefitItems }]
    }),
    new FormEngineModel({
      label: stepsLabels.l4,
      parameters: [{ id: 'environmentalBenefits', dataType: 'checkbox-array', validations: { isRequired: true }, items: environmentalBenefitItems }]
    }),
    new FormEngineModel({
      label: stepsLabels.l5,
      parameters: [{ id: 'accessibilityImpactDetails', dataType: 'textarea', validations: { isRequired: true } }]
    }),
    new FormEngineModel({
      label: stepsLabels.l6,
      parameters: [{ id: 'accessibilityStepsDetails', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  parsedData.subgroups.forEach((item, i) => {
    parsedData[`subgroupBenefits_${i}`] = item.benefits;
    parsedData[`subgroupOtherBenefit_${i}`] = item.otherBenefit;
  });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasBenefits: data.hasBenefits,
    subgroups: data.subgroups,
    generalBenefits: data.generalBenefits,
    otherGeneralBenefit: data.otherGeneralBenefit,
    environmentalBenefits: data.environmentalBenefits,
    otherEnvironmentalBenefit: data.otherEnvironmentalBenefit,
    accessibilityImpactDetails: data.accessibilityImpactDetails,
    accessibilityStepsDetails: data.accessibilityStepsDetails
  };

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasBenefitsItems.find(item => item.value === data.hasBenefits)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasBenefits || 'NOT_YET')) {

    data.subgroups?.forEach((subGroup, i) => {
      toReturn.push({
        label: `Group ${subGroup.name} benefit`,
        value: subGroup.benefits.map(benefit => benefit === 'OTHER' ? subGroup.otherBenefit : subgroupBenefitItems.find(item => item.value === benefit)?.label).join('<br />'),
        editStepNumber: toReturn.length + 1
      });
    });

    toReturn.push({
      label: stepsLabels.l3,
      value: data.generalBenefits?.map(benefit => benefit === 'OTHER' ? data.otherGeneralBenefit : generalBenefitItems.find(item => item.value === benefit)?.label).join('<br />'),
      editStepNumber: toReturn.length + 1
    });

    toReturn.push({
      label: stepsLabels.l4,
      value: data.environmentalBenefits?.map(benefit => benefit === 'OTHER' ? data.otherEnvironmentalBenefit : environmentalBenefitItems.find(item => item.value === benefit)?.label).join('<br />'),
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
