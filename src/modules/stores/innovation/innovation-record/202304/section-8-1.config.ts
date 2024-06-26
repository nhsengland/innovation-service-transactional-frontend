import { URLS } from '@app/base/constants';
import { FormEngineModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasResourcesToScaleItems, yesNoItems } from './forms.config';

// Labels.
const stepsLabels = {
  q1: {
    label: 'Is your innovation ready for wider adoption across the health and care system?',
    description: `Find out more about <a href=${URLS.INNOVATION_GUIDES_COMISSIONING_AND_ADOPTION} target="_blank" rel="noopener noreferrer">commissioning and adoption (opens in a new window)</a>.`
  },
  q2: {
    label: 'Has your innovation been deployed in a NHS or care setting?',
    description: ''
  },
  q3: {
    label: 'Where have you deployed your innovation?',
    description: 'Provide the name of the organisation and the department, if possible.',
    conditional: true
  },
  q4: {
    label: 'What was the commercial basis for deployment?',
    description: `For example, did you provide your innovation for free or was it purchased? Or was it part funded by yourself and the NHS area in which it's being deployed?`,
    conditional: true
  },
  q5: {
    label: 'How did the deployment of your innovation affect the organisation(s)?',
    description: `For example, which job roles were affected and how was the care pathway redesigned?`,
    conditional: true
  },
  q6: {
    label: 'Does your team have the resources for scaling up to national deployment?',
    description: 'This includes having a team with the right combination of skills and knowledge.'
  }
  // q7: { label: 'Share any relevant implementation planning documents', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.' },
};

const stepsParentChildRelations = {
  stepDeploymentPlans: 'isDeployed',
  commercialBasis: 'isDeployed',
  organisationDeploymentAffect: 'isDeployed'
};

// Types.
type InboundPayloadType = DocumentType202304['DEPLOYMENT'];
type StepPayloadType = InboundPayloadType & { stepDeploymentPlans: { name: string }[] };
type OutboundPayloadType = DocumentType202304['DEPLOYMENT'];

// Logic.
export const SECTION_8_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'DEPLOYMENT',
  title: 'Deployment',
  wizard: new WizardEngineModel({
    stepsChildParentRelations: stepsParentChildRelations,
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasDeployPlan',
            dataType: 'radio-group',
            label: stepsLabels.q1.label,
            description: stepsLabels.q1.description,
            validations: { isRequired: [true, 'Choose one option'] },
            items: yesNoItems
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'isDeployed',
            dataType: 'radio-group',
            label: stepsLabels.q2.label,
            validations: { isRequired: [true, 'Choose one option'] },
            items: yesNoItems
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
  }),
  allStepsList: stepsLabels
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {
  steps.splice(2);

  if (['NO'].includes(currentValues.isDeployed || 'NO')) {
    delete currentValues.deploymentPlans;
    delete currentValues.commercialBasis;
    delete currentValues.organisationDeploymentAffect;
  } else {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: 'stepDeploymentPlans',
            dataType: 'fields-group',
            label: stepsLabels.q3.label,
            description: stepsLabels.q3.description,
            fieldsGroupConfig: {
              fields: [
                {
                  id: 'name',
                  dataType: 'text',
                  label: 'Organisation and department',
                  validations: { isRequired: [true, 'Organisation and department are required'], maxLength: 100 }
                }
              ],
              addNewLabel: 'Add new organisations and department'
            }
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'commercialBasis',
            dataType: 'textarea',
            label: stepsLabels.q4.label,
            description: stepsLabels.q4.description,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 'xl'
          }
        ]
      }),
      new FormEngineModel({
        parameters: [
          {
            id: 'organisationDeploymentAffect',
            dataType: 'textarea',
            label: stepsLabels.q5.label,
            description: stepsLabels.q5.description,
            validations: { isRequired: [true, 'A description is required'] },
            lengthLimit: 'xl'
          }
        ]
      })
    );
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'hasResourcesToScale',
          dataType: 'radio-group',
          label: stepsLabels.q6.label,
          description: stepsLabels.q6.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasResourcesToScaleItems
        }
      ]
    })
  );
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  return {
    hasDeployPlan: data.hasDeployPlan,
    isDeployed: data.isDeployed,
    stepDeploymentPlans: data.deploymentPlans?.map(item => ({ name: item })) ?? [],
    commercialBasis: data.commercialBasis,
    organisationDeploymentAffect: data.organisationDeploymentAffect,
    hasResourcesToScale: data.hasResourcesToScale
  };
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    ...(data.hasDeployPlan && { hasDeployPlan: data.hasDeployPlan }),
    ...(data.isDeployed && { isDeployed: data.isDeployed }),
    ...(data.stepDeploymentPlans.length > 0 && { deploymentPlans: data.stepDeploymentPlans?.map(item => item.name) }),
    ...(data.commercialBasis && { commercialBasis: data.commercialBasis }),
    ...(data.organisationDeploymentAffect && { organisationDeploymentAffect: data.organisationDeploymentAffect }),
    ...(data.hasResourcesToScale && { hasResourcesToScale: data.hasResourcesToScale })
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  let editStepNumber = 1;

  toReturn.push(
    {
      label: stepsLabels.q1.label,
      value: yesNoItems.find(item => item.value === data.hasDeployPlan)?.label,
      editStepNumber: editStepNumber++
    },
    {
      label: stepsLabels.q2.label,
      value: yesNoItems.find(item => item.value === data.isDeployed)?.label,
      editStepNumber: editStepNumber++
    }
  );

  if (!['NO'].includes(data.isDeployed || 'NO')) {
    toReturn.push(
      {
        label: stepsLabels.q3.label,
        value: data.stepDeploymentPlans?.map(item => item.name).join('\n'),
        editStepNumber: editStepNumber++,
        isNotMandatory: true
      },
      {
        label: stepsLabels.q4.label,
        value: data.commercialBasis,
        editStepNumber: editStepNumber++
      },
      {
        label: stepsLabels.q5.label,
        value: data.organisationDeploymentAffect,
        editStepNumber: editStepNumber++
      }
    );
  }

  toReturn.push({
    label: stepsLabels.q6.label,
    value: hasResourcesToScaleItems.find(item => item.value === data.hasResourcesToScale)?.label,
    editStepNumber: editStepNumber++
  });

  return toReturn;
}
