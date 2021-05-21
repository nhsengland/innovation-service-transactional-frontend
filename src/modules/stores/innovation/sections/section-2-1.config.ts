import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Do you know yet what patient population or subgroup your innovation will affect?',
  l2: 'What population or subgroup does this affect?'
};


// Catalogs.
const hasSubgroupsItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];


// Types.
type InboundPayloadType = {
  hasSubgroups: null | 'YES' | 'NO' | 'NOT_RELEVANT';
  subgroups: {
    id: null | string;
    name: string;
    conditions: null | string;
  }[];
};

// [key: string] is needed to support subgroups_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

type OutboundPayloadType = InboundPayloadType;



export const SECTION_2_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS,
  title: 'Detailed understanding of needs',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'We\'re asking this to get a better understanding of who would benefit from your innovation.',
        parameters: [{ id: 'hasSubgroups', dataType: 'radio-group', validations: { isRequired: true }, items: hasSubgroupsItems }]
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

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasSubgroups || 'NO')) {
    currentValues.subgroups = [];
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  if (currentStep > 2) { // Updates subgroups.conditions value.
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
      currentValues.subgroups[Number(key.split('_')[1])].conditions = currentValues[key];
    });
  }

  Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l2,
      description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how you innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
      parameters: [{
        id: 'subgroups',
        dataType: 'fields-group',
        // validations: { isRequired: true }
        fieldsGroupConfig: {
          fields: [
            { id: 'id', dataType: 'text', isVisible: false },
            { id: 'name', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } },
            { id: 'conditions', dataType: 'text', isVisible: false }
          ],
          addNewLabel: 'Add new population or subgroup'
        }
      }]
    })
  );

  currentValues.subgroups.forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        label: `What condition best categorises ${item.name}?`,
        parameters: [{ id: `subGroupName_${i}`, dataType: 'text', validations: { isRequired: true } }]
      })
    );
    currentValues[`subGroupName_${i}`] = item.conditions;
  });

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  parsedData.subgroups.forEach((item, i) => { parsedData[`subGroupName_${i}`] = item.conditions; });

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
    value: hasSubgroupsItems.find(item => item.value === data.hasSubgroups)?.label,
    editStepNumber: 1
  });

  if (['YES'].includes(data.hasSubgroups || 'NO')) {

    toReturn.push({
      label: stepsLabels.l2,
      value: data.subgroups?.map(group => group.name).join('<br />'),
      editStepNumber: 2
    });

    data.subgroups.forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} condition`, value: item.conditions, editStepNumber: toReturn.length + 1 });
    });

  }

  return toReturn;

}
