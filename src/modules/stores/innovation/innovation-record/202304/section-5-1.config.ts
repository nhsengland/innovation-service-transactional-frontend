import { URLS } from '@app/base/constants';
import { StringsHelper } from '@app/base/helpers';
import {
  FormEngineModel,
  FormEngineParameterModel,
  WizardEngineModel,
  WizardStepType,
  WizardSummaryType
} from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections, catalogStandardsType, catalogYesInProgressNotYet } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasRegulationKnowledgeItems, standardsHasMetItems, standardsTypeItems } from './forms.config';

// Labels.
const stepsLabels = {
  q1: {
    label: 'Do you know which regulations, standards and certifications apply to your innovation?',
    description: `Find out more about <a href="${URLS.INNOVATION_GUIDES_REGULATION}" target="_blank" rel="noopener noreferrer">regulations (opens in a new window)</a>.`
  },
  q2: {
    label: 'Which regulations, standards and certifications apply to your innovation?',
    description: `Find out more about <a href="${URLS.UNDERSTANDING_REGULATIONS_MEDICAL_DEVICES}" target="_blank" rel="noopener noreferrer">UKCA / CE marking (opens in a new window)</a>, <a href="${URLS.UNDERSTANDING_CQC_REGULATIONS}" target="_blank" rel="noopener noreferrer">CQC registration (opens in a new window)</a>, or <a href=${URLS.NHS_DIGITAL_TECHNOLOGY_ASSESSMENT_CRITERIA} target="_blank" rel="noopener noreferrer">DTAC (opens in a new window)</a>.`,
    conditional: true
  }
  // q3: {
  //   label: 'Upload all certification documents', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.',
  //   conditional: true
  // }
};

const stepsParentChildRelations = {
  hasRegulationKnowledge: ['standardsType'],
  standardsType: ['standardHasMet_']
};

// Types.
type InboundPayloadType = DocumentType202304['REGULATIONS_AND_STANDARDS'];
type StepPayloadType = InboundPayloadType & { standardsType: catalogStandardsType[] } & {
  [key in `standardHasMet_${string}`]?: catalogYesInProgressNotYet;
};
type OutboundPayloadType = DocumentType202304['REGULATIONS_AND_STANDARDS'];

// Logic.
export const SECTION_5_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'REGULATIONS_AND_STANDARDS',
  title: 'Regulatory approvals, standards and certifications',
  wizard: new WizardEngineModel({
    stepsParentChildRelations: stepsParentChildRelations,
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasRegulationKnowledge',
            dataType: 'radio-group',
            label: stepsLabels.q1.label,
            description: stepsLabels.q1.description,
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasRegulationKnowledgeItems
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
  steps.splice(1);

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasRegulationKnowledge || 'NO')) {
    delete currentValues.standards;
    currentValues.standardsType = [];
    delete currentValues.otherRegulationDescription;
    Object.keys(currentValues)
      .filter(key => key.startsWith('standardHasMet_'))
      .forEach(key => {
        delete currentValues[key as any];
      });
    return;
  }

  if (Number(currentStep) > 2) {
    // Updates standards.hasMet value.
    Object.keys(currentValues)
      .filter(key => key.startsWith('standardHasMet_'))
      .forEach(key => {
        const index = (currentValues.standards ?? []).findIndex(
          item => StringsHelper.slugify(item.type) === key.split('_')[1]
        );
        if (index > -1) {
          (currentValues.standards ?? [])[index].hasMet = currentValues[key as any];
        }
        delete currentValues[key as any];
      });
  }

  steps.push(
    new FormEngineModel({
      parameters: [
        {
          id: 'standardsType',
          dataType: 'checkbox-array',
          label: stepsLabels.q2.label,
          description: stepsLabels.q2.description,
          validations: { isRequired: [true, 'Choose at least one option'] },
          items: [
            ...standardsTypeItems,
            {
              value: 'OTHER',
              label: 'Other',
              conditional: new FormEngineParameterModel({
                id: 'otherRegulationDescription',
                dataType: 'text',
                label: 'Other regulations, standards and certifications that apply',
                validations: {
                  isRequired: [true, 'Other regulations, standards and certifications is required'],
                  maxLength: 100
                }
              })
            }
          ]
        }
      ]
    })
  );

  currentValues.standards = (currentValues.standardsType || []).map(s => {
    return (
      currentValues.standards?.find(item => item.type === s) ||
      ({ type: s } as Required<StepPayloadType>['standards'][number])
    );
  });

  (currentValues.standards || []).forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [
          {
            id: `standardHasMet_${StringsHelper.slugify(item.type)}`,
            dataType: 'radio-group',
            label: `Do you have a certification for ${
              item.type === 'OTHER'
                ? currentValues.otherRegulationDescription
                : standardsTypeItems.find(i => i.value === item.type)?.label
            }?`,
            validations: { isRequired: [true, 'Choose one option'] },
            items: standardsHasMetItems
          }
        ]
      })
    );
    currentValues[`standardHasMet_${StringsHelper.slugify(item.type)}`] = item.hasMet;
  });
}

function inboundParsing(data: InboundPayloadType): StepPayloadType {
  const parsedData = {
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    standards: data.standards,
    otherRegulationDescription: data.otherRegulationDescription,
    standardsType: data.standards?.map(item => item.type)
  } as StepPayloadType;

  (data.standards ?? []).forEach((item, i) => {
    parsedData[`standardHasMet_${StringsHelper.slugify(item.type)}`] = item.hasMet;
  });

  return parsedData;
}

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    ...((data.standards ?? []).length > 0 && {
      standards: data.standards?.map(item => ({
        type: item.type,
        ...(item.hasMet && { hasMet: item.hasMet })
      }))
    }),
    ...(data.otherRegulationDescription && { otherRegulationDescription: data.otherRegulationDescription })
  };
}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {
  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.q1.label,
    value: hasRegulationKnowledgeItems.find(item => item.value === data.hasRegulationKnowledge)?.label,
    editStepNumber: 1
  });

  if (!['NO', 'NOT_RELEVANT'].includes(data.hasRegulationKnowledge || 'NO')) {
    toReturn.push({
      label: stepsLabels.q2.label,
      value: data.standards
        ?.map(v =>
          v.type === 'OTHER'
            ? data.otherRegulationDescription
            : standardsTypeItems.find(item => item.value === v.type)?.label
        )
        .join('\n'),
      editStepNumber: 2
    });

    data.standards?.forEach(standard => {
      toReturn.push({
        label: `Do you have a certification for ${
          standard.type === 'OTHER'
            ? data.otherRegulationDescription
            : standardsTypeItems.find(item => item.value === standard.type)?.label
        }?`,
        value: standardsHasMetItems.find(item => item.value === standard.hasMet)?.label,
        editStepNumber: toReturn.length + 1
      });
    });
  }

  return toReturn;
}
