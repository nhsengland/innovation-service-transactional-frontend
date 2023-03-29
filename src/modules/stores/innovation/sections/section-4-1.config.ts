import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { cloneDeep } from 'lodash';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { hasRegulationKnowledgeItems, standardsHasMetItems, standardsTypeItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you know which standards and certifications apply to your innovation?',
  l2: 'Which standards and certifications apply to your innovation?',
  l_last: 'Please upload any documents demonstrating your certifications',
};


// Types.
type BaseType = {
  hasRegulationKnowledge: null | 'YES_ALL' | 'YES_SOME' | 'NO' | 'NOT_RELEVANT';
  standards: {
    type: null | 'CE_UKCA_NON_MEDICAL' | 'CE_UKCA_CLASS_I' | 'CE_UKCA_CLASS_II_A' | 'CE_UKCA_CLASS_II_B' | 'CE_UKCA_CLASS_III' | 'IVD_GENERAL' | 'IVD_SELF_TEST' | 'IVD_ANNEX_LIST_A' | 'IVD_ANNEX_LIST_B' | 'MARKETING' | 'CQC' | 'DTAC' | 'OTHER';
    hasMet: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
  }[];
  otherRegulationDescription: null | string;
  files: { id: string, displayFileName: string, url: string }[];
};

type InboundPayloadType = Partial<BaseType>;

// [key: string] is needed to support standardHasMet_${number} properties.
type StepPayloadType = Omit<BaseType, 'files'>
  & { standardsType: string[] }
  & { files: { id: string; name: string; url: string; }[] }
  & { [key: string]: null | string };

type OutboundPayloadType = Omit<BaseType, 'files'> & { files: string[] };

type SummaryPayloadType = Omit<BaseType, 'files'>
  & { standardsType: string[] }
  & { files: ({ id: string, displayFileName: string, url: string } | { id: string, name: string })[] }
  & { [key: string]: null | string };



export const SECTION_4_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.REGULATIONS_AND_STANDARDS,
  title: 'Standards and certifications',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasRegulationKnowledge',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer"> Innovation guides (opens in new window) </a> for more information about regulations and standards.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasRegulationKnowledgeItems
        }]
      })
    ],
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data),
    showSummary: true
  })
};



function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasRegulationKnowledge || 'NO')) {
    currentValues.standards = currentValues.standards.map(() => ({
      type: null, hasMet: null
    }));
    currentValues.otherRegulationDescription = null;
    currentValues.files = [];
    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  if (Number(currentStep) > 2) { // Updates standards.hasMet value.
    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
      currentValues.standards[Number(key.split('_')[1])].hasMet = currentValues[key] as any;
    });
  }

  Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => { delete currentValues[key]; });

  steps.push({

    saveStrategy: 'updateAndWait',

    ...new FormEngineModel({
      parameters: [{
        id: 'standardsType',
        dataType: 'checkbox-array',
        label: stepsLabels.l2,
        validations: { isRequired: [true, 'Choose at least one certification/standard'] },
        items: standardsTypeItems
      }]
    })
  });

  currentValues.standards = (currentValues.standardsType || []).map(s => {
    return currentValues.standards.find(item => item.type === s) || { type: s, hasMet: null } as BaseType['standards'][0];
  });

  (currentValues.standards || []).forEach((standard, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: `standardHasMet_${i}`,
          dataType: 'radio-group',
          label: `Have you achieved certification for ${standard.type === 'OTHER' ? currentValues.otherRegulationDescription : standardsTypeItems.find(item => item.value === standard.type)?.label}`,
          validations: { isRequired: [true, 'Choose one option'] },
          items: standardsHasMetItems
        }]
      })
    );
    currentValues[`standardHasMet_${i}`] = standard.hasMet;
  });

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'files',
        dataType: 'file-upload',
        label: stepsLabels.l_last,
        description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 9MB.',
        validations: { isRequired: [true, 'Upload at least one file'] }
      }],
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep({ ...data, ...{ standardsType: [] as string[], files: [] as any } } as StepPayloadType);

  (parsedData.standards || []).forEach((item, i) => {
    parsedData.standardsType.push(item.type as string);
    parsedData[`standardHasMet_${i}`] = item.hasMet;
  });
  parsedData.files = (data.files || []).map(item => ({ id: item.id, name: item.displayFileName, url: item.url }));

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  const parsedData = cloneDeep({
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    standards: data.standards,
    otherRegulationDescription: data.otherRegulationDescription,
    files: data.files?.map(item => item.id)
  });

  if (['NO', 'NOT_RELEVANT'].includes(parsedData.hasRegulationKnowledge || 'NO')) {
    parsedData.standards = [];
    parsedData.otherRegulationDescription = null;
    parsedData.files = [];
  }

  return parsedData;

}


function summaryParsing(data: SummaryPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasRegulationKnowledgeItems.find(item => item.value === data.hasRegulationKnowledge)?.label,
    editStepNumber: 1
  });

  if (!['NO', 'NOT_RELEVANT'].includes(data.hasRegulationKnowledge || 'NO')) {

    toReturn.push({
      label: stepsLabels.l2,
      value: data.standards?.map(v => standardsTypeItems.find(item => item.value === v.type)?.label).join('\n'),
      editStepNumber: 2
    });

    data.standards?.forEach(standard => {
      toReturn.push({
        label: `Have you achieved certification for ${standard.type === 'OTHER' ? data.otherRegulationDescription : standardsTypeItems.find(item => item.value === standard.type)?.label}`,
        value: standardsHasMetItems.find(item => item.value === standard.hasMet)?.label,
        editStepNumber: toReturn.length + 1
      });
    });

    const stepNumber = toReturn.length + 1;
    const allFiles = (data.files || []).map((item: any) => ({ id: item.id, name: item.name || item.displayFileName, url: item.url }));
    allFiles.forEach((item, i) => {
      toReturn.push({
        label: `Attachment ${i + 1}`,
        value: `<a href='${item.url}'>${item.name}</a>` || 'Unknown',
        editStepNumber: stepNumber,
        allowHTML: true,
        isFile: true,
      });
    });

    // Add a button to the end of the list.
    toReturn.push({ type: 'button', label: 'Add standards and certifications', editStepNumber: stepNumber });

  }

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  const summaryData = summaryParsing(data)
    .filter(item => item.type !== 'button')
    .filter(item => !item.isFile);

  return summaryData.filter(item => item.type !== 'button');

}
