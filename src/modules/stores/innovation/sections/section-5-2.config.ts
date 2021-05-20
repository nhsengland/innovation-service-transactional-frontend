import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { cloneDeep } from 'lodash';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_5_2_1: 'Have you tested your innovation with users?',
  s_5_2_2: 'What kind of testing with users have you done?',
  s_5_2_3: 'Please describe the testing and feedback for [testing type]',
  s_5_2_4: 'Please upload any documents demonstrating the testing you have done with users',
};

const yesOrNoItems = [
  { value: 'yes', label: 'Yes' },
  { value: 'in_process', label: 'I\'m in the process of testing with users' },
  { value: 'not_yet', label: 'Not yet' }
];


type apiPayload = {
  id?: string;
  hasTests: 'yes' | 'in_process' | 'not_yet';
  userTests: {
    id: string;
    kind: string;
    feedback: null | string;
  }[];
  files: { id: string; name?: string; displayFileName?: string; url: string }[];
  // files: string[];
};

// [key: string] is needed to support userTestFeedback_${number} properties.
type stepPayload = apiPayload & { [key: string]: null | string };



export const SECTION_5_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.TESTING_WITH_USERS,
  title: 'Testing with users',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_5_2_1,
        description: 'Testing can mean involving patients, carers, clinicians or administrators in the design process.',
        parameters: [{
          id: 'hasTests',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_5_2_2,
        description: 'This can include any testing you\'ve done with people who would use your innovation, for example patients, nurses or administrative staff.',
        parameters: [{
          id: 'userTests',
          dataType: 'fields-group',
          // validations: { isRequired: true }
          fieldsGroupConfig: {
            fields: [
              { id: 'id', dataType: 'text', isVisible: false },
              { id: 'kind', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } },
              { id: 'feedback', dataType: 'text', isVisible: false }
            ],
            addNewLabel: 'Add new population or subgroup'
          }
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

  if (['no_yet'].includes(currentValues.hasTests)) {
    steps.splice(1);
    currentValues.innovationPathwayKnowledge = null;
    currentValues.userTests = currentValues.userTests.map(item => {
      item.feedback = null;
      return item;
    });

    Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => {
      delete currentValues[key];
    });
    return;
  }

  if (currentStep > 3) { // Updates subgroups.carePathway value.

    Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => {
      const index = Number(key.split('_')[1]);
      currentValues.userTests[index].feedback = currentValues[key];
    });

    return;
  }

  // // Removes all steps behond step 2, and removes root parameters 'userTestFeedback_*' values.
  steps.splice(1);
  Object.keys(currentValues).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => {
    delete currentValues[key];
  });


  (currentValues.userTests || []).forEach((item, i) => {

    const dynamicStep = new FormEngineModel({
      label: `Please describe the testing and feedback for ${item.kind}`,
      parameters: [
        {
          id: `userTestFeedback_${i}`,
          dataType: 'textarea',
          validations: { isRequired: true },
        }
      ]
    });

    steps.push(dynamicStep);
    currentValues[`userTestFeedback_${i}`] = item.feedback;

  });

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_5_2_4,
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

  (parsedData.userTests || []).forEach((item, i) => {
    parsedData[`userTestFeedback_${i}`] = item.kind;
  });

  parsedData.files = (parsedData.files || []).map((item: any) => ({ id: item.id, name: item.displayFileName, url: item.url }));

  return parsedData;

}


function outboundParsing(data: stepPayload): MappedObject {

  const parsedData = cloneDeep(data);

  if (['not_yet'].includes(parsedData.hasTests)) {
    parsedData.userTests = [];
  }

  parsedData.files = (data.files || []).map((item: any) => item.id);

  Object.keys(parsedData).filter(key => key.startsWith('userTestFeedback_')).forEach((key) => {
    delete parsedData[key];
  });


  return parsedData;

}


function summaryParsing(data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_5_2_1,
    value: yesOrNoItems.find(item => item.value === data.hasUKPathwayKnowledge)?.label || '',
    editStepNumber: 1
  });

  if (['yes'].includes(data.hasTests)) {

    toReturn.push({
      label: stepsLabels.s_5_2_2,
      value: data.userTests?.map(item => item.kind).join('<br />'),
      editStepNumber: 2
    });

    data.userTests.forEach((item, i) => {
      toReturn.push({
        label: `${item.kind} kind of testing`,
        value: item.feedback,
        editStepNumber: i + 2
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
