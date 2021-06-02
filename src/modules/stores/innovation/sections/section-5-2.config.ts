import { cloneDeep } from 'lodash';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasTestsItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Have you tested your innovation with users?',
  l2: 'What kind of testing with users have you done?',
  l3: 'Please describe the testing and feedback for [testing type]',
  l4: 'Please upload any documents demonstrating the testing you have done with users',
};


// Types.
type InboundPayloadType = {
  hasTests: null | 'YES' | 'IN_PROCESS' | 'NOT_YET';
  userTests: {
    id: string;
    kind: string;
    feedback: null | string;
  }[];
  files: { id: string; name?: string; displayFileName?: string; url: string }[];
};

// [key: string] is needed to support userTestFeedback_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

type OutboundPayloadType = Omit<InboundPayloadType, 'files'> & { files: string[] };

type SummaryPayloadType = Omit<InboundPayloadType, 'files'>
  & { files: ({ id: string, displayFileName: string, url: string } | { id: string, name: string })[] }
  & { [key: string]: null | string };



export const SECTION_5_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.TESTING_WITH_USERS,
  title: 'Testing with users',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'Testing can mean involving patients, carers, clinicians or administrators in the design process.',
        parameters: [{ id: 'hasTests', dataType: 'radio-group', validations: { isRequired: true }, items: hasTestsItems }]
      })
    ],
    runtimeRules: [(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number) => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: SummaryPayloadType) => summaryParsing(data)
  })
};



function runtimeRules(steps: FormEngineModel[], currentValues: StepPayloadType, currentStep: number): void {

  steps.splice(1);

  if (['NOT_YET'].includes(currentValues.hasTests || 'NOT_YET')) {
    currentValues.userTests = currentValues.userTests.map(item => ({
      id: item.id, kind: item.kind, feedback: null
    }));
    Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => { delete currentValues[key]; });
    return;
  }

  if (currentStep > 2) { // Updates userTests.feedback value.
    Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => {
      currentValues.userTests[Number(key.split('_')[1])].feedback = currentValues[key];
    });
  }

  Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => { delete currentValues[key]; });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l2,
      description: 'This can include any testing you\'ve done with people who would use your innovation, for example patients, nurses or administrative staff.',
      parameters: [{
        id: 'userTests',
        dataType: 'fields-group',
        // validations: { isRequired: true }
        fieldsGroupConfig: {
          fields: [
            { id: 'id', dataType: 'text', isVisible: false },
            { id: 'kind', dataType: 'text', label: 'User test', validations: { isRequired: true } },
            { id: 'feedback', dataType: 'text', isVisible: false }
          ],
          addNewLabel: 'Add new user test'
        }
      }]
    })
  );

  currentValues.userTests.forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        label: `Please describe the testing and feedback for ${item.kind}`,
        parameters: [{ id: `userTestFeedback_${i}`, dataType: 'textarea', validations: { isRequired: true } }]
      })
    );
    currentValues[`userTestFeedback_${i}`] = item.feedback;
  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.l4,
      description: 'The files must be CSV, XLSX, DOCX or PDF.',
      parameters: [{ id: 'files', dataType: 'file-upload', validations: { isRequired: true } }]
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = cloneDeep(data) as StepPayloadType;

  parsedData.userTests.forEach((item, i) => { parsedData[`userTestFeedback_${i}`] = item.kind; });

  parsedData.files = (data.files || []).map(item => ({ id: item.id, name: item.displayFileName, url: item.url }));

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  const parsedData = cloneDeep({
    hasTests: data.hasTests,
    userTests: data.userTests,
    files: data.files.map(item => item.id)
  });

  if (['NOT_YET'].includes(parsedData.hasTests || 'NOT_YET')) {
    parsedData.userTests = [];
    parsedData.files = [];
  }

  return parsedData;

}


function summaryParsing(data: SummaryPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasTestsItems.find(item => item.value === data.hasTests)?.label,
    editStepNumber: 1
  });

  if (!['NOT_YET'].includes(data.hasTests || 'NOT_YET')) {

    toReturn.push({
      label: stepsLabels.l2,
      value: data.userTests?.map(item => item.kind).join('<br />'),
      editStepNumber: 2
    });

    data.userTests.forEach((item, i) => {
      toReturn.push({
        label: `${item.kind} kind of testing`,
        value: item.feedback,
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
