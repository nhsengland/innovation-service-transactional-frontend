import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasBenefitsItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Have you identified the specific benefits that your innovation would bring?',
  l_last: 'What benefits does your innovation create for the NHS or social care?'
};


// Types.
type InboundPayloadType = {
  hasBenefits: null | 'YES' | 'NO' | 'NOT_SURE';
  subgroups: {
    id: string;
    name: string;
    benefits: null | string;
  }[];
  benefits: null | string;
};

// [key: string] is needed to support subgroups_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

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
    currentValues.subgroups = currentValues.subgroups.map(item => ({
      id: item.id, name: item.name, benefits: null
    }));
    currentValues.benefits = null;
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].benefits = currentValues[key];
    delete currentValues[key];
  });

  currentValues.subgroups.forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        label: `What benefits does your innovation create for patients or citizens of ${item.name}?`,
        parameters: [{ id: `subGroupName_${i}`, dataType: 'textarea', validations: { isRequired: true } }]
      })
    );
    currentValues[`subGroupName_${i}`] = item.benefits;
  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l_last,
      parameters: [{ id: 'benefits', dataType: 'textarea', validations: { isRequired: true } }]
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  parsedData.subgroups.forEach((item, i) => { parsedData[`subGroupName_${i}`] = item.benefits; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  const parsedData = cloneDeep(data);

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete parsedData[key]; });

  return parsedData;

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasBenefitsItems.find(item => item.value === data.hasBenefits)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasBenefits || 'NOT_YET')) {

    data.subgroups.forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} benefit`, value: item.benefits, editStepNumber: toReturn.length + 1 });
    });

    toReturn.push({
      label: stepsLabels.l_last,
      value: data.benefits,
      editStepNumber: toReturn.length + 1
    });

  }

  return toReturn;

}
