import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';
import { innovationImpactItems } from './catalogs.config';


const stepsLabels = {
  l1: 'Who does your innovation impact?',
  l2: 'What patient population or subgroup does this affect?',
  l3: 'Please specify the groups of clinicians, carers or administrative staff that your innovation impacts'
};


// Types.
type InboundPayloadType = {
  impactPatients: boolean;
  impactClinicians: boolean;
  subgroups: {
    id: null | string;
    name: string;
    conditions: null | string;
    otherCondition: null | string; // NOT being used for now!
  }[];
  cliniciansImpactDetails: null | string;
};

// [key: string] is needed to support subgroups_${number} properties.
type StepPayloadType = InboundPayloadType & { impacts?: null | ('PATIENTS' | 'CLINICIANS')[] } & { [key: string]: null | string };

type OutboundPayloadType = InboundPayloadType;

export const SECTION_2_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.UNDERSTANDING_OF_NEEDS,
  title: 'Detailed understanding of needs',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'We\'re asking this to understand if we should ask you specific questions about patients and/or healthcare professionals. Your answer will impact which questions we ask in other sections.',
        parameters: [{ id: 'impacts', dataType: 'checkbox-array', validations: { isRequired: true }, items: innovationImpactItems }]
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

  // PATIENTS.
  if (!currentValues.impacts?.includes('PATIENTS')) { // Removes all subgroups if no PATIENTS has been selected.

    currentValues.subgroups = [];
    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });

  } else {

    if (currentStep > 2) { // Updates subgroups.conditions value.
      Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => {
        currentValues.subgroups[Number(key.split('_')[1])].conditions = currentValues[key];
      });
    }

    Object.keys(currentValues).filter(key => key.startsWith('subGroupName_')).forEach((key) => { delete currentValues[key]; });

    steps.push(
      new FormEngineModel({
        label: stepsLabels.l2,
        description: 'We\'ll ask you further questions about each answer you provide here. If there are key distinctions between how your innovation affects different populations, be as specific as possible. If not, consider providing as few answers as possible.',
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

  // CLINICIANS.
  if (currentValues.impacts?.includes('CLINICIANS')) {
    steps.push(
      new FormEngineModel({
        label: stepsLabels.l3,
        parameters: [{ id: 'cliniciansImpactDetails', dataType: 'textarea', validations: { isRequired: true } }]
      })
    );
  }

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  let parsedData = cloneDeep(data) as StepPayloadType;

  parsedData.impacts = [];
  if (parsedData.impactPatients) { parsedData.impacts.push('PATIENTS'); }
  if (parsedData.impactClinicians) { parsedData.impacts.push('CLINICIANS'); }

  parsedData.subgroups.forEach((item, i) => { parsedData[`subGroupName_${i}`] = item.conditions; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    impactPatients: data.impacts?.includes('PATIENTS') || false,
    impactClinicians: data.impacts?.includes('CLINICIANS') || false,
    subgroups: data.subgroups,
    cliniciansImpactDetails: data.cliniciansImpactDetails
  };

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  if (data.impacts === undefined) {
    data.impacts = [];
    if (data.impactPatients) { data.impacts?.push('PATIENTS'); }
    if (data.impactClinicians) { data.impacts?.push('CLINICIANS'); }
  }

  toReturn.push({
    label: stepsLabels.l1,
    value: data.impacts?.map(impact => innovationImpactItems.find(item => item.value === impact)?.label).join('<br />'),
    editStepNumber: toReturn.length + 1
  });


  if (data.impacts?.includes('PATIENTS') || data.impactPatients) {
    toReturn.push({
      label: stepsLabels.l2,
      value: data.subgroups?.map(group => group.name).join('<br />'),
      editStepNumber: toReturn.length + 1
    });
    data.subgroups.forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} condition`, value: item.conditions, editStepNumber: toReturn.length + 1 });
    });
  }


  if (data.impacts?.includes('CLINICIANS') || data.impactClinicians) {
    toReturn.push({
      label: stepsLabels.l3,
      value: data.cliniciansImpactDetails,
      editStepNumber: toReturn.length + 1
    });
  }

  return toReturn;

}
