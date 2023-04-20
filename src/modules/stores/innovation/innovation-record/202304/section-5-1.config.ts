import { StringsHelper } from '@app/base/helpers';
import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections, catalogStandardsType, catalogYesInProgressNotYet } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasRegulationKnowledgeItems, standardsHasMetItems, standardsTypeItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: {
    label: 'Do you know which regulations, standards and certifications apply to your innovation?',
    description: 'Find out more about <a href="/innovation-guides/creation/regulation" target="_blank" rel="noopener noreferrer">regulations (opens in a new window)</a>.'
  },
  q2: {
    label: 'Which regulations, standards and certifications apply to your innovation?',
    description: `Find out more about <a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/uk-mdr-2002-understanding-regulations-medical-devices/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">UKCA / CE marking (opens in a new window)</a>, <a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/understanding-cqc-regulations/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">CQC registration (opens in a new window)</a>, or <a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/nhs-digital-technology-assessment-criteria-dtac/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">DTAC (opens in a new window)</a>.`
  },
  q3: {
    label: 'Upload all certification documents', description: 'Files must be CSV, XLSX, DOCX or PDF, and can be up to 20MB each.'
  }
};


// Types.
type InboundPayloadType = Omit<DocumentType202304['REGULATIONS_AND_STANDARDS'], 'files'> & { files?: { id: string; name: string, url: string }[] };
type StepPayloadType = InboundPayloadType
  & { standardsType: catalogStandardsType[] }
  & { [key in `standardHasMet_${string}`]?: catalogYesInProgressNotYet };
type OutboundPayloadType = DocumentType202304['REGULATIONS_AND_STANDARDS'];


// Logic.
export const SECTION_5_1: InnovationSectionConfigType<InnovationSections> = {
  id: 'REGULATIONS_AND_STANDARDS',
  title: 'Regulatory approvals, standards and certifications',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasRegulationKnowledge', dataType: 'radio-group', label: stepsLabels.q1.label, description: stepsLabels.q1.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasRegulationKnowledgeItems
        }]
      })
    ],
    showSummary: true,
    runtimeRules: [(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary') => runtimeRules(steps, currentValues, currentStep)],
    inboundParsing: (data: InboundPayloadType) => inboundParsing(data),
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function runtimeRules(steps: WizardStepType[], currentValues: StepPayloadType, currentStep: number | 'summary'): void {

  steps.splice(1);

  if (['NO', 'NOT_RELEVANT'].includes(currentValues.hasRegulationKnowledge || 'NO')) {
    delete currentValues.standards;
    currentValues.standardsType = [];
    delete currentValues.otherRegulationDescription;
    delete currentValues.files;
    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => { delete currentValues[key as any]; });
    return;
  }

  if (Number(currentStep) > 2) { // Updates standards.hasMet value.
    Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => {
      const index = (currentValues.standards ?? []).findIndex(item => StringsHelper.slugify(item.type) === key.split('_')[1]);
      if (index > -1) {
        (currentValues.standards ?? [])[index].hasMet = currentValues[key as any];
      }
      delete currentValues[key as any];
    });
  }

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'standardsType', dataType: 'checkbox-array', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
        validations: { isRequired: [true, 'Choose at least one option'] },
        items: [
          ...standardsTypeItems,
          { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRegulationDescription', dataType: 'text', label: 'Other regulations, standards and certifications that apply', validations: { isRequired: [true, 'Other regulations, standards and certifications is required'], maxLength: 100 } }) }
        ]
      }]
    })
  );

  currentValues.standards = (currentValues.standardsType || []).map(s => {
    return currentValues.standards?.find(item => item.type === s) || { type: s } as Required<StepPayloadType>['standards'][number];
  });

  (currentValues.standards || []).forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: `standardHasMet_${StringsHelper.slugify(item.type)}`,
          dataType: 'radio-group',
          label: `Do you have a certification for ${item.type === 'OTHER' ? currentValues.otherRegulationDescription : standardsTypeItems.find(i => i.value === item.type)?.label}?`,
          validations: { isRequired: [true, 'Choose one option'] },
          items: standardsHasMetItems
        }]
      })
    );
    currentValues[`standardHasMet_${StringsHelper.slugify(item.type)}`] = item.hasMet;
  });

  // Only diplay files if answered YES to at least on "standard" question.
  if (currentValues.standards.some(item => item.hasMet === 'YES')) {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: 'files', dataType: 'file-upload', label: stepsLabels.q3.label, description: stepsLabels.q3.description
        }],
      })
    );
  } else {
    delete currentValues.files;
  }

}

function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = {
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    standards: data.standards,
    otherRegulationDescription: data.otherRegulationDescription,
    files: data.files,
    standardsType: data.standards?.map(item => item.type)
  } as StepPayloadType;

  (data.standards ?? []).forEach((item, i) => { parsedData[`standardHasMet_${StringsHelper.slugify(item.type)}`] = item.hasMet; });

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
    ...(data.otherRegulationDescription && { otherRegulationDescription: data.otherRegulationDescription }),
    ...((data.files ?? []).length > 0 && { files: data.files?.map(item => item.id) })

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
      value: data.standards?.map(v => v.type === 'OTHER' ? data.otherRegulationDescription : standardsTypeItems.find(item => item.value === v.type)?.label).join('\n'),
      editStepNumber: 2
    });

    data.standards?.forEach(standard => {
      toReturn.push({
        label: `Do you have a certification for ${standard.type === 'OTHER' ? data.otherRegulationDescription : standardsTypeItems.find(item => item.value === standard.type)?.label}?`,
        value: standardsHasMetItems.find(item => item.value === standard.hasMet)?.label,
        editStepNumber: toReturn.length + 1
      });
    });

    if (data.standards?.some(item => item.hasMet === 'YES')) {

      const stepNumber = toReturn.length + 1;
      const allFiles = (data.files || []).map(item => ({ id: item.id, name: item.name, url: item.url }));
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
      toReturn.push({ type: 'button', label: 'Add certification documents', editStepNumber: stepNumber });

    }

  }

  return toReturn;

}
