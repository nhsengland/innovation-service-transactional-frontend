import { cloneDeep } from 'lodash';

import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_4_1_1: 'Do you know which standards and certifications apply to your innovation?',
  s_4_1_2: 'Which standards and certifications apply to your innovation?',

  s_4_1_last: 'Please upload any documents demonstrating your certifications',
};


const yesOrNoItems = [ // ALTERADO!!!!!!!!!!!!!!!!!!!!!
  { value: 'YES_ALL', label: 'Yes, I know all of them' },
  { value: 'YES_SOME', label: 'Yes, I know some of them' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_RELEVANT', label: 'Not relevant' }
];

const standardsTypeItems = [
  { value: 'CE_UKCA_NON_MEDICAL', label: 'CE/UKCA Non-medical device' },
  { value: 'CE_UKCA_CLASS_I', label: 'CE/UKCA Class I medical device' },
  { value: 'CE_UKCA_CLASS_II_A', label: 'CE/UKCA Class IIa medical device' },
  { value: 'CE_UKCA_CLASS_II_B', label: 'CE/UKCA Class IIb medical device' },
  { value: 'CE_UKCA_CLASS_III', label: 'CE/UKCA Class III medical device' },
  { value: 'DTAC', label: 'Digital Technology Assessment Criteria (DTAC)' },
  { value: 'OTHER', label: 'OTHER', conditional: new FormEngineParameterModel({ id: 'hasOtherIntellectual', dataType: 'text', validations: { isRequired: true } }) }
];

const standardsHasMetItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'IN_PROGRESS', label: 'I\'m in the process of gaining approval' },
  { value: 'NOT_YET', label: 'Not yet' },
];


type apiPayload = {
  id?: string;
  hasRegulationKnowledge: null | 'YES_ALL' | 'YES_SOME' | 'NO';
  standards: {
    id: null | string;
    type: null | 'CE_UKCA_NON_MEDICAL' | 'CE_UKCA_CLASS_I' | 'CE_UKCA_CLASS_II_A' | 'CE_UKCA_CLASS_II_B' | 'CE_UKCA_CLASS_III' | 'DTAC' | 'OTHER';
    hasMet: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
  }[];
  otherRegulationDescription: null | string;
  files: { id: string; name?: string; displayFileName?: string; url: string }[];
};

// [key: string] is needed to support standardHasMet_${number} properties.
type stepPayload = apiPayload & { standardsType?: string[] } & { [key: string]: null | string };



export const SECTION_4_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.REGULATIONS_AND_STANDARDS,
  title: 'Standards and certifications',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_4_1_1,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about regulations and standards.',
        parameters: [{
          id: 'hasRegulationKnowledge',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: apiPayload) => inboundParsing(data),
    outboundParsing: (data: stepPayload) => outboundParsing(data),
    summaryParsing: (data: stepPayload) => summaryParsing(data)
  })
};




function runtimeRules(steps: FormEngineModel[], currentValues: stepPayload, currentStep: number): void {

  if (['NO'].includes(currentValues.hasRegulationKnowledge || 'NO')) {
    steps.splice(1);
    currentValues.standards = currentValues.standards.map(item => ({
      id: item.id, type: null, hasMet: null
    }));
    currentValues.otherRegulationDescription = null;
    currentValues.files = [];

    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
      delete currentValues[key];
    });
    return;
  }


  if (currentStep > 2) { // Updates subgroups.carePathway value.

    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
      currentValues.standards[Number(key.split('_')[1])].hasMet = currentValues[key] as any;
    });

    return;
  }

  // // Removes all steps behond step 2, and removes root parameters 'standardHasMet_*' values.
  steps.splice(1);
  Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
    delete currentValues[key];
  });


  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_4_1_2,
      parameters: [{
        id: 'standardsType',
        dataType: 'checkbox-array',
        validations: { isRequired: true },
        items: standardsTypeItems
      }]
    })
  );

  currentValues.standards = (currentValues.standardsType || []).map(s => {
    return currentValues.standards.find(item => item.type === s) || { id: null, type: s, hasMet: null } as apiPayload['standards'][0];
  });


  (currentValues.standards || []).forEach((standard, i) => {

    const dynamicStep = new FormEngineModel({
      label: `Have you achieved certification for ${standardsTypeItems.find(item => item.value === standard.type)?.label}`,
      parameters: [
        {
          id: `standardHasMet_${i}`,
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: standardsHasMetItems
        }
      ]
    });

    steps.push(dynamicStep);
    currentValues[`standardHasMet_${i}`] = standard.hasMet;

  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_4_1_last,
      description: 'The files must be CSV, XLSX, DOCX or PDF.',
      parameters: [{
        id: 'files',
        dataType: 'file-upload',
        validations: { isRequired: true }
      }],
    })
  );

}


function inboundParsing(data: apiPayload): MappedObject {

  const parsedData = cloneDeep(data) as stepPayload;

  parsedData.standardsType = [];

  (parsedData.standards || []).forEach((item, i) => {
    parsedData.standardsType?.push(item.type as string);
    parsedData[`standardHasMet_${i}`] = item.hasMet;
  });


  parsedData.files = (parsedData.files || []).map((item: any) => ({ id: item.id, name: item.displayFileName, url: item.url }));

  return parsedData;

}


function outboundParsing(data: stepPayload): MappedObject {

  const parsedData = cloneDeep(data);

  if (['NO'].includes(parsedData.hasRegulationKnowledge || 'NO')) {
    parsedData.innovationPathwayKnowledge = null;
    parsedData.standards = [];
    parsedData.otherRegulationDescription = null;
    parsedData.files = [];
  }

  delete parsedData.standardsType;

  parsedData.files = (data.files || []).map((item: any) => item.id);

  Object.keys(parsedData).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
    delete parsedData[key];
  });


  console.log('DATA', data, parsedData);

  return parsedData;

}


function summaryParsing(data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_4_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasRegulationKnowledge)?.label || '',
    editStepNumber: 1
  });

  if (!['NO'].includes(data.hasRegulationKnowledge || 'NO')) {

    toReturn.push({
      label: stepsLabels.s_4_1_2,
      value: data.standards.map(v => standardsTypeItems.find(item => item.value === v.type)?.label).join('<br />'),
      editStepNumber: 2
    });

    data.standards.forEach(standard => {
      toReturn.push({
        label: `${standardsTypeItems.find(item => item.value === standard.type)?.label} certification`,
        value: standardsHasMetItems.find(item => item.value === standard.hasMet)?.label || '',
        editStepNumber: toReturn.length + 1
      });
    });

    const allFiles = (data.files || []).map((item: any) => ({ id: item.id, name: item.name || item.displayFileName, url: item.url }));

    allFiles.forEach((item, i) => {
      toReturn.push({
        label: `Attachment ${i + 1}`,
        value: item.name || 'Unknown',
        editStepNumber: toReturn.length + 1
      });
    });

  }

  return toReturn;

}
