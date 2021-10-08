import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasCostKnowledgeItems, patientRangeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know the cost of your innovation?',
  l2: 'What\'s the cost of your innovation?',
  l3: 'How many units of your innovation would you expect to sell per year in the UK?',
  l4: 'Approximately how long is each unit of your innovation intended to be in use?',
};


// Types.
type InboundPayloadType = {
  hasCostKnowledge: null | 'DETAILED_ESTIMATE' | 'ROUGH_IDEA' | 'NO';
  subgroups:
  {
    id: string;
    name: string;
    costDescription: null | string;
    patientsRange: null | 'UP_10000' | 'BETWEEN_10000_500000' | 'MORE_THAN_500000' | 'NOT_SURE' | 'NOT_RELEVANT';
    sellExpectations: null | string;
    usageExpectations: null | string;
  }[];
  costDescription: null | string;
  sellExpectations: null | string;
  usageExpectations: null | string;
};
// [key: string] is needed to support subGroup*_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

type OutboundPayloadType = InboundPayloadType;



export const SECTION_6_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.COST_OF_INNOVATION,
  title: 'Cost of your innovation',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasCostKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'By cost, we mean the cost to the NHS or any care organisation that would implement your innovation.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasCostKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO'].includes(currentValues.hasCostKnowledge || 'NO')) {
    currentValues.subgroups = currentValues.subgroups.map(item => ({
      id: item.id, name: item.name, costDescription: null, patientsRange: null, sellExpectations: null, usageExpectations: null
    }));
    currentValues.costDescription = null;
    currentValues.sellExpectations = null;
    currentValues.usageExpectations = null;
    Object.keys(currentValues).filter(key => key.startsWith('subGroupCostDescription_')).forEach((key) => { delete currentValues[key]; });
    Object.keys(currentValues).filter(key => key.startsWith('subGroupPatientsRange_')).forEach((key) => { delete currentValues[key]; });
    Object.keys(currentValues).filter(key => key.startsWith('subGroupSellExpectations_')).forEach((key) => { delete currentValues[key]; });
    Object.keys(currentValues).filter(key => key.startsWith('subGroupUsageExpectations_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupCostDescription_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].costDescription = currentValues[key];
    delete currentValues[key];
  });
  Object.keys(currentValues).filter(key => key.startsWith('subGroupPatientsRange_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].patientsRange = currentValues[key] as any;
    delete currentValues[key];
  });
  Object.keys(currentValues).filter(key => key.startsWith('subGroupSellExpectations_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].sellExpectations = currentValues[key];
    delete currentValues[key];
  });
  Object.keys(currentValues).filter(key => key.startsWith('subGroupUsageExpectations_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].usageExpectations = currentValues[key];
    delete currentValues[key];
  });


  if (currentValues.subgroups.length === 0) {

    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'costDescription',
          dataType: 'textarea',
          label: stepsLabels.l2,
          description: 'For example, this could be expressed as the annual cost to an organisation in relation to the number of patients or people who would benefit from it.',
          validations: { isRequired: [true, 'Description is required'] }
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'sellExpectations',
          dataType: 'textarea',
          label: stepsLabels.l3,
          description: 'This question forms part of the data required for NICE guidance.',
          validations: { isRequired: [true, 'Sell expectations description is required'] }
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'usageExpectations',
          dataType: 'textarea',
          label: stepsLabels.l4,
          description: 'This question forms part of the data required for NICE guidance.',
          validations: { isRequired: [true, 'Usage expectations description is required'] }
        }]
      })
    );

  } else {

    (currentValues.subgroups || []).forEach((item, i) => {

      steps.push(
        new FormEngineModel({
          parameters: [{
            id: `subGroupCostDescription_${i}`,
            dataType: 'textarea',
            label: `What's the cost of your innovation for ${item.name}?`,
            description: 'For example, this could be expressed as the annual cost to an organisation in relation to the number of patients or people who would benefit from it.',
            validations: { isRequired: [true, 'Cost description is required'] }
          }]
        }),
        new FormEngineModel({
          parameters: [{
            id: `subGroupPatientsRange_${i}`,
            dataType: 'radio-group',
            label: `Roughly how many patients in ${item.name} would be eligible for your innovation?`,
            description: 'This question forms part of the data required for NICE guidance.',
            validations: { isRequired: [true, 'Choose one option'] },
            items: patientRangeItems
          }]
        })
      );
      currentValues[`subGroupCostDescription_${i}`] = item.costDescription;
      currentValues[`subGroupPatientsRange_${i}`] = item.patientsRange;


      if (['NOT_RELEVANT'].includes(item.patientsRange as string)) {
        item.sellExpectations = null;
        item.usageExpectations = null;
      } else {
        steps.push(
          new FormEngineModel({
            parameters: [{
              id: `subGroupSellExpectations_${i}`,
              dataType: 'textarea',
              label: `How many units of your innovation would you expect to sell per year in the UK for ${item.name}?`,
              description: 'This question forms part of the data required for NICE guidance.',
              validations: { isRequired: [true, 'Sell expectations description is required'] }
            }]
          }),
          new FormEngineModel({
            parameters: [{
              id: `subGroupUsageExpectations_${i}`,
              dataType: 'textarea',
              label: `Approximately how long is each unit of your innovation intended to be in use for ${item.name}?`,
              description: 'This question forms part of the data required for NICE guidance.',
              validations: { isRequired: [true, 'Usage expectations description is required'] }
            }]
          })
        );
        currentValues[`subGroupSellExpectations_${i}`] = item.sellExpectations;
        currentValues[`subGroupUsageExpectations_${i}`] = item.usageExpectations;
      }

    });
  }

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  (parsedData.subgroups || []).forEach((item, i) => {
    parsedData[`subGroupCostDescription_${i}`] = item.costDescription;
    parsedData[`subGroupPatientsRange_${i}`] = item.patientsRange;
    parsedData[`subGroupSellExpectations_${i}`] = item.sellExpectations;
    parsedData[`subGroupUsageExpectations_${i}`] = item.usageExpectations;
  });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasCostKnowledge: data.hasCostKnowledge,
    subgroups: data.subgroups,
    costDescription: data.costDescription,
    sellExpectations: data.sellExpectations,
    usageExpectations: data.usageExpectations
  };

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasCostKnowledgeItems.find(item => item.value === data.hasCostKnowledge)?.label,
    editStepNumber: 1
  });

  if (!['NO'].includes(data.hasCostKnowledge || 'NO')) {

    if (data.subgroups.length === 0) {

      toReturn.push(
        { label: stepsLabels.l2, value: data.costDescription, editStepNumber: toReturn.length + 1 },
        { label: stepsLabels.l3, value: data.sellExpectations, editStepNumber: toReturn.length + 1 },
        { label: stepsLabels.l4, value: data.usageExpectations, editStepNumber: toReturn.length + 1 }
      );

    } else {

      data.subgroups.forEach((subgroup, i) => {

        toReturn.push({
          label: `Group ${subgroup.name} innovation cost`,
          value: subgroup.costDescription,
          editStepNumber: toReturn.length + 1
        });
        toReturn.push({
          label: `Group ${subgroup.name} eligible patients`,
          value: patientRangeItems.find(item => item.value === subgroup.patientsRange)?.label,
          editStepNumber: toReturn.length + 1
        });

        if (!['NOT_RELEVANT'].includes(subgroup.patientsRange as string)) {
          toReturn.push({
            label: `Group ${subgroup.name} sell expectations`,
            value: subgroup.sellExpectations,
            editStepNumber: toReturn.length + 1
          });
          toReturn.push({
            label: `Group ${subgroup.name} usage expectations`,
            value: subgroup.usageExpectations,
            editStepNumber: toReturn.length + 1
          });
        }

      });
    }
  }

  return toReturn;

}
