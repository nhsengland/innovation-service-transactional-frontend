import { URLS } from '@app/base/constants';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';
import { cloneDeep } from 'lodash';

import { InnovationSectionConfigType } from '../ir-versions.types';
import { InnovationSections } from './catalog.types';

import { DocumentType202209 } from './document.types';
import { hasDeployPlanItems, hasResourcesToScaleItems } from './forms.config';

// Labels.
const stepsLabels = {
  l1: 'Do you have an implementation plan for deploying this innovation in the NHS or a care setting?',
  l2: 'Has your innovation been deployed in an NHS or care setting?',
  l3: 'Where have you deployed your innovation?',
  l6: 'Does your team have the resources for scaling up to national deployment?',
  l7: 'Please share any relevant implementation planning documents '
};

// Types.
type InboundPayloadType = Omit<DocumentType202209['IMPLEMENTATION_PLAN'], 'files'> & {
  files: { id: string; name: string; url: string }[];
};

// [key: string] is needed to support deploymentPlansComercialBasis_${number}  and deploymentPlansOrgDeploymentAffect_${number} properties.
type StepPayloadType = InboundPayloadType & { [key: string]: null | string };

type OutboundPayloadType = DocumentType202209['IMPLEMENTATION_PLAN'];

export const SECTION_8_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'IMPLEMENTATION_PLAN',
  title: 'Implementation plan and deployment',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasDeployPlan',
            dataType: 'radio-group',
            label: stepsLabels.l1,
            description: `See <a href=${URLS.INNOVATION_GUIDES_ADVANCED_GUIDE} target="_blank" rel="noopener noreferrer">Innovation guides (opens in a new window)</a> for more information about implementation plans.`,
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasDeployPlanItems
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'isDeployed',
            dataType: 'radio-group',
            label: stepsLabels.l2,
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasDeployPlanItems
          }
        ]
      })
    ],
    showSummary: true,
    runtimeRules: [
      (steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') =>
        runtimeRules(steps, currentValues, currentStep)
    ],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(2);

  if (['NO'].includes(currentValues.isDeployed || 'NO')) {
    currentValues.deploymentPlans = [];
    Object.keys(currentValues)
      .filter(key => key.startsWith('deploymentPlansComercialBasis_'))
      .forEach(key => {
        delete currentValues[key];
      });
    Object.keys(currentValues)
      .filter(key => key.startsWith('deploymentPlansOrgDeploymentAffect_'))
      .forEach(key => {
        delete currentValues[key];
      });
  }

  Object.keys(currentValues)
    .filter(key => key.startsWith('deploymentPlansComercialBasis_'))
    .forEach(key => {
      (currentValues.deploymentPlans ?? [])[Number(key.split('_')[1])].commercialBasis = currentValues[key] as any;
      delete currentValues[key];
    });
  Object.keys(currentValues)
    .filter(key => key.startsWith('deploymentPlansOrgDeploymentAffect_'))
    .forEach(key => {
      (currentValues.deploymentPlans ?? [])[Number(key.split('_')[1])].orgDeploymentAffect = currentValues[key] as any;
      delete currentValues[key];
    });

  if (['YES'].includes(currentValues.isDeployed || 'NO')) {
    steps.push({
      saveStrategy: 'updateAndWait',

      ...new FormEngineModel({
        parameters: [
          {
            id: 'deploymentPlans',
            dataType: 'fields-group',
            label: stepsLabels.l3,
            description: 'Please provide the name of the organisation and department if possible.',
            // validations: { isRequired: true }
            fieldsGroupConfig: {
              fields: [
                { id: 'id', dataType: 'text', isVisible: false },
                {
                  id: 'name',
                  dataType: 'text',
                  label: 'Organisation and department',
                  validations: { isRequired: [true, 'Organisation and department are required'] }
                },
                { id: 'commercialBasis', dataType: 'text', isVisible: false },
                { id: 'orgDeploymentAffect', dataType: 'text', isVisible: false }
              ],
              addNewLabel: 'Add new organisations and department'
            }
          }
        ]
      })
    });

    (currentValues.deploymentPlans || []).forEach((item, i) => {
      steps.push(
        new FormEngineModel({
          parameters: [
            {
              id: `deploymentPlansComercialBasis_${i}`,
              dataType: 'textarea',
              label: `What was the commercial basis for deployment in ${item.name}`,
              description: 'For example, did you provide your innovation for free or was it purchased?',
              validations: { isRequired: [true, 'A description is required'] },
              lengthLimit: 's'
            }
          ]
        }),
        new FormEngineModel({
          parameters: [
            {
              id: `deploymentPlansOrgDeploymentAffect_${i}`,
              dataType: 'textarea',
              label: `How did the deployment of your innovation in ${item.name} affect the organisation?`,
              description: 'For example, which job roles were affected and how was the care pathway redesigned?',
              validations: { isRequired: [true, 'A description is required'] },
              lengthLimit: 's'
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
      parameters: [
        {
          id: 'hasResourcesToScale',
          dataType: 'radio-group',
          label: stepsLabels.l6,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasResourcesToScaleItems
        }
      ]
    }),
    new FormEngineModel({
      parameters: [
        {
          id: 'files',
          dataType: 'file-upload-array',
          label: stepsLabels.l7,
          description: 'The files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB.'
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  const parsedData = cloneDeep({ ...data, ...{ files: [] as any } } as StepPayloadType);

  (parsedData.deploymentPlans || []).forEach((item, i) => {
    parsedData[`deploymentPlansComercialBasis_${i}`] = item.commercialBasis;
    parsedData[`deploymentPlansOrgDeploymentAffect_${i}`] = item.orgDeploymentAffect;
  });
  parsedData.files = (data.files || []).map(item => ({ id: item.id, name: item.name, url: item.url }));

  return parsedData;
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  const parsedData = cloneDeep({
    hasDeployPlan: data.hasDeployPlan,
    isDeployed: data.isDeployed,
    deploymentPlans: data.deploymentPlans,
    hasResourcesToScale: data.hasResourcesToScale,
    files: data.files?.map(item => item.id)
  });

  if (['NO'].includes(data.isDeployed || 'NO')) {
    parsedData.deploymentPlans = [];
  }

  return parsedData;
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasDeployPlanItems.find(item => item.value === data.hasDeployPlan)?.label,
    editStepNumber: 1
  });

  toReturn.push({
    label: stepsLabels.l2,
    value: hasDeployPlanItems.find(item => item.value === data.isDeployed)?.label,
    editStepNumber: 2
  });

  if (['YES'].includes(data.isDeployed || 'NO')) {
    toReturn.push({
      label: stepsLabels.l3,
      value: data.deploymentPlans?.map(item => item.name).join('\n'),
      editStepNumber: toReturn.length + 1
    });

    data.deploymentPlans?.forEach(item => {
      toReturn.push({
        label: `What was the commercial basis for deployment in ${item.name}`,
        value: item.commercialBasis,
        editStepNumber: toReturn.length + 1
      });
      toReturn.push({
        label: `How did the deployment of your innovation in ${item.name} affect the organisation?`,
        value: item.orgDeploymentAffect,
        editStepNumber: toReturn.length + 1
      });
    });
  }

  toReturn.push({
    label: stepsLabels.l6,
    value: hasResourcesToScaleItems.find(item => item.value === data.hasResourcesToScale)?.label,
    editStepNumber: toReturn.length + 1
  });

  const stepNumber = toReturn.length + 1;
  const allFiles = (data.files || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.displayFileName,
    url: item.url
  }));
  allFiles.forEach((item, i) => {
    toReturn.push({
      label: `Attachment ${i + 1}`,
      value: `<a href='${item.url}'>${item.name}</a>` || 'Unknown',
      editStepNumber: stepNumber,
      allowHTML: true,
      isFile: true
    });
  });

  // Add a button to the end of the list.
  toReturn.push({ type: 'button', label: 'Add documents', editStepNumber: stepNumber });

  return toReturn;
}
