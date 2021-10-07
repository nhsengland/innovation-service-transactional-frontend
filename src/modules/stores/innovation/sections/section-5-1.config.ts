import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { carePathwayItems, hasUKPathwayKnowledgeItems, innovationPathwayKnowledgeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know what the current care pathway (current practice) is across the UK?',
  l2: 'What is the current care pathway in relation to your innovation?',
  l3: 'Please describe the potential care pathway with your innovation in use'
};


// Types.
type InboundPayloadType = {
  hasUKPathwayKnowledge: null | 'YES' | 'NO' | 'NOT_RELEVANT';
  innovationPathwayKnowledge: null | 'PATHWAY_EXISTS_AND_CHANGED' | 'PATHWAY_EXISTS_AND_FITS' | 'NO_PATHWAY'
  potentialPathway: null | string;
  subgroups: {
    id: string;
    name: string;
    carePathway: null | 'ONLY_OPTION' | 'BETTER_OPTION' | 'EQUIVALENT_OPTION' | 'FIT_LESS_COSTS' | 'NO_KNOWLEDGE';
  }[];
};

// [key: string] is needed to support subGroupName_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | 'ONLY_OPTION' | 'BETTER_OPTION' | 'EQUIVALENT_OPTION' | 'FIT_LESS_COSTS' | 'NO_KNOWLEDGE' };

type OutboundPayloadType = InboundPayloadType;



export const SECTION_5_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.CURRENT_CARE_PATHWAY,
  title: 'Current care pathway',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasUKPathwayKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'For example, your innovation could help reduce cost, benefit the public, improve the quality of healthcare or address a specific issue.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasUKPathwayKnowledgeItems
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

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasUKPathwayKnowledge || 'NO')) {
    currentValues.innovationPathwayKnowledge = null;
    currentValues.potentialPathway = null;
    currentValues.subgroups = currentValues.subgroups.map(item => ({
      id: item.id, name: item.name, carePathway: null
    }));
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
    currentValues.subgroups[Number(key.split('_')[1])].carePathway = currentValues[key];
    delete currentValues[key];
  });

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'innovationPathwayKnowledge',
        dataType: 'radio-group',
        label: stepsLabels.l2,
        validations: { isRequired: [true, 'Choose one option'] },
        items: innovationPathwayKnowledgeItems
      }]
    }),
    new FormEngineModel({
      parameters: [{
        id: 'potentialPathway',
        dataType: 'textarea',
        label: stepsLabels.l3,
        validations: { isRequired: [true, 'Description is required'] },
        items: innovationPathwayKnowledgeItems
      }]
    })
  );

  (currentValues.subgroups || []).forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: `subGroupName_${i}`,
          dataType: 'radio-group',
          label: `Thinking about the current care pathway in the UK for ${item.name}, which option best describes your innovation?`,
          validations: { isRequired: [true, 'Choose one option'] },
          items: carePathwayItems
        }]
      })
    );
    currentValues[`subGroupName_${i}`] = item.carePathway;
  });

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  (parsedData.subgroups || []).forEach((item, i) => { parsedData[`subGroupName_${i}`] = item.carePathway; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  const parsedData = cloneDeep(data);

  if (['NO', 'NOT_RELEVANT'].includes(parsedData.hasUKPathwayKnowledge || 'NO')) {
    parsedData.innovationPathwayKnowledge = null;
    parsedData.potentialPathway = null;
    parsedData.subgroups = parsedData.subgroups.map(item => ({
      id: item.id, name: item.name, carePathway: null
    }));
  }

  Object.keys(parsedData).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete parsedData[key]; });

  return parsedData;

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasUKPathwayKnowledgeItems.find(item => item.value === data.hasUKPathwayKnowledge)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasUKPathwayKnowledge || 'NO')) {

    toReturn.push(
      {
        label: stepsLabels.l2,
        value: innovationPathwayKnowledgeItems.find(item => item.value === data.innovationPathwayKnowledge)?.label,
        editStepNumber: 2
      },
      {
        label: stepsLabels.l3,
        value: data.potentialPathway,
        editStepNumber: 3
      }
    );

    data.subgroups?.forEach((subgroup, i) => {
      toReturn.push({
        label: `Group ${subgroup.name} care pathway`,
        value: carePathwayItems.find(item => item.value === subgroup.carePathway)?.label,
        editStepNumber: toReturn.length + 1
      });
    });

  }

  return toReturn;

}
