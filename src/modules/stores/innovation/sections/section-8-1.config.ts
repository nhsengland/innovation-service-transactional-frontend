import { MappedObject } from '@modules/core/interfaces/base.interfaces';
import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { cloneDeep } from 'lodash';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_8_1_1: 'Do you have an implementation plan for deploying this innovation in the NHS or a care setting?',
  s_8_1_2: 'Has your innovation been deployed in an NHS or care setting?',
  s_8_1_3: 'Where have you deployed your innovation?',
  s_8_1_6: 'Does your team have the resources for scaling up to national deployment?',
  s_8_1_7: 'Please share any relevant implementation planning documents '
};

const yesOrNoItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

const yesOrNoOrNotSureItems = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'NOT_SURE', label: 'I\'m not sure' }
];


type apiPayload = {

  hasDeployPlan: null | 'YES' | 'NO';
  isDeployed: null | 'YES' | 'NO';
  deploymentPlans: {
    id: null | string;
    name: string;
    commercialBasis: null | string;
    orgDeploymentAffect: null | string;
  }[];
  hasResourcesToScale: null | 'YES' | 'NO' | 'NOT_SURE';
  // hasTests: 'yes' | 'in_process' | 'not_yet';
  // deploymentPlans: {
  //   id: string;
  //   kind: string;
  //   feedback: null | string;
  // }[];
  files: { id: string; name?: string; displayFileName?: string; url: string }[];
  // files: string[];
};

// [key: string] is needed to support deploymentPlansComercialBasis_${number} properties.
type stepPayload = apiPayload & { [key: string]: null | string };



export const SECTION_8_1: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.IMPLEMENTATION_PLAN,
  title: 'Implementation plan and deployment',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_8_1_1,
        description: 'See [link to section in advanced guide] (opens in new window) for information about implementation plans.',
        parameters: [{
          id: 'hasDeployPlan',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_8_1_2,
        parameters: [{
          id: 'isDeployed',
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



  if (['NO'].includes(currentValues.isDeployed || 'NO')) {
    steps.splice(2);
    currentValues.deploymentPlans = [];
    Object.keys(currentValues).filter(key => key.startsWith('deploymentPlansComercialBasis_')).forEach((key) => { delete currentValues[key]; });
    Object.keys(currentValues).filter(key => key.startsWith('deploymentPlansOrgDeploymentAffect_')).forEach((key) => { delete currentValues[key]; });
    // return;
  }


  // if (currentStep > 3) { // Updates subgroups.carePathway value.

  //   Object.keys(currentValues).filter(key => key.startsWith('deploymentPlansComercialBasis_')).forEach((key) => {
  //     const index = Number(key.split('_')[1]);
  //     currentValues.deploymentPlans[index].feedback = currentValues[key];
  //   });

  //   return;
  // }

  // // Removes all steps behond step 2, and removes root parameters 'deploymentPlansComercialBasis_*' values.
  steps.splice(2);
  Object.keys(currentValues).filter(key => key.startsWith('deploymentPlansComercialBasis_')).forEach((key) => {
    currentValues.deploymentPlans[Number(key.split('_')[1])].commercialBasis = currentValues[key];
    delete currentValues[key];
  });
  Object.keys(currentValues).filter(key => key.startsWith('deploymentPlansOrgDeploymentAffect_')).forEach((key) => {
    currentValues.deploymentPlans[Number(key.split('_')[1])].orgDeploymentAffect = currentValues[key];
    delete currentValues[key];
  });


  if (['YES'].includes(currentValues.isDeployed || 'NO')) {

    steps.push(
      new FormEngineModel({
        label: stepsLabels.s_8_1_3,
        description: 'Please provide the name of the organisation and department if possible.',
        parameters: [{
          id: 'deploymentPlans',
          dataType: 'fields-group',
          // validations: { isRequired: true }
          fieldsGroupConfig: {
            fields: [
              { id: 'id', dataType: 'text', isVisible: false },
              { id: 'name', dataType: 'text', label: 'Population or subgroup', validations: { isRequired: true } },
              { id: 'commercialBasis', dataType: 'text', isVisible: false },
              { id: 'orgDeploymentAffect', dataType: 'text', isVisible: false }
            ],
            addNewLabel: 'Add new population or subgroup'
          }
        }]
      })
    );

    (currentValues.deploymentPlans || []).forEach((item, i) => {

      steps.push(
        new FormEngineModel({
          label: `What was the commercial basis for deployment in ${item.name}`,
          description: 'For example, did you provide your innovation for free or was it purchased?',
          parameters: [
            {
              id: `deploymentPlansComercialBasis_${i}`,
              dataType: 'textarea',
              validations: { isRequired: true },
            }
          ]
        })
      );

      steps.push(
        new FormEngineModel({
          label: `How did the deployment of your innovation in ${item.name} affect the organisation?`,
          parameters: [
            {
              id: `deploymentPlansOrgDeploymentAffect_${i}`,
              dataType: 'textarea',
              validations: { isRequired: true },
            }
          ]
        })
      );

      currentValues[`deploymentPlansComercialBasis_${i}`] = item.commercialBasis;
      currentValues[`deploymentPlansOrgDeploymentAffect_${i}`] = item.orgDeploymentAffect;

    });


  }

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_8_1_6,
      parameters: [{
        id: 'hasResourcesToScale',
        dataType: 'radio-group',
        validations: { isRequired: true },
        items: yesOrNoOrNotSureItems
      }]
    })
  );

  steps.push(
    new FormEngineModel({
      label: stepsLabels.s_8_1_7,
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

  (parsedData.deploymentPlans || []).forEach((item, i) => {
    parsedData[`deploymentPlansComercialBasis_${i}`] = item.commercialBasis;
    parsedData[`deploymentPlansOrgDeploymentAffect_${i}`] = item.orgDeploymentAffect;
  });

  parsedData.files = (parsedData.files || []).map((item: any) => ({ id: item.id, name: item.displayFileName, url: item.url }));

  return parsedData;

}



function outboundParsing(data: stepPayload): MappedObject {

  const parsedData = cloneDeep(data);

  if (['NO'].includes(data.isDeployed || 'NO')) {
    parsedData.deploymentPlans = [];
  }

  parsedData.files = (data.files || []).map((item: any) => item.id);

  Object.keys(parsedData).filter(key => key.startsWith('deploymentPlansComercialBasis_')).forEach((key) => { delete parsedData[key]; });
  Object.keys(parsedData).filter(key => key.startsWith('deploymentPlansOrgDeploymentAffect_')).forEach((key) => { delete parsedData[key]; });

  return parsedData;

}


function summaryParsing(data: stepPayload): SummaryParsingType[] {

  const toReturn = [];

  toReturn.push({
    label: stepsLabels.s_8_1_1,
    value: yesOrNoItems.find(item => item.value === data.hasDeployPlan)?.label || '',
    editStepNumber: 1
  });

  toReturn.push({
    label: stepsLabels.s_8_1_2,
    value: yesOrNoItems.find(item => item.value === data.isDeployed)?.label || '',
    editStepNumber: 2
  });

  if (['YES'].includes(data.isDeployed || 'NO')) {

    toReturn.push({
      label: stepsLabels.s_8_1_3,
      value: data.deploymentPlans?.map(item => item.name).join('<br />'),
      editStepNumber: toReturn.length + 1
    });

    data.deploymentPlans.forEach((item, i) => {
      toReturn.push({ label: `Group ${item.name} comercial basis`, value: item.commercialBasis, editStepNumber: toReturn.length + 1 });
      toReturn.push({ label: `Group ${item.name} org. deplyoment affect`, value: item.orgDeploymentAffect, editStepNumber: toReturn.length + 1 });
    });

  }

  toReturn.push({
    label: stepsLabels.s_8_1_6,
    value: yesOrNoOrNotSureItems.find(item => item.value === data.hasResourcesToScale)?.label || '',
    editStepNumber: toReturn.length + 1
  });

  const allFiles = (data.files || []).map((item: any) => ({ id: item.id, name: item.name || item.displayFileName, url: item.url }));

  allFiles.forEach((item, i) => {
    toReturn.push({
      label: `Attachment ${i + 1}`,
      value: item.name || 'Unknown',
      editStepNumber: toReturn.length + 1
    });
  });

  return toReturn;

}
