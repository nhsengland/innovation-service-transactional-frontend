import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardStepType, WizardSummaryType } from '@modules/shared/forms';

import { sectionType } from '../shared.types';

import { InnovationSections, catalogStandardsType, catalogYesInProgressNotYet } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasRegulationKnowledgeItems, standardsHasMetItems, standardsTypeItems } from './forms.config';
import { StringsHelper } from '@app/base/helpers';



// Labels.
const stepsLabels = {
  q1: {
    label: 'Do you know which regulations, standards and certifications apply to your innovation?',
    description: 'Find out more about regulations on the <a href="/innovation-guides" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a>'
  },
  q2: {
    label: 'Which regulations, standards and certifications apply to your innovation?',
    description: `Find out more information on:
    <ul class="nhsuk-list">
    <li><a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/uk-mdr-2002-understanding-regulations-medical-devices/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">UKCA / CE marking (opens in new window)</a></li>
    <li><a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/understanding-cqc-regulations/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">CQC registration (opens in new window)</a></li>
    <li><a href="https://www.digitalregulations.innovation.nhs.uk/developers-guidance/all-developers-guidance/nhs-digital-technology-assessment-criteria-dtac/?triage_system=Medical%20device" target="_blank" rel="noopener noreferrer">DTAC (opens in new window)</a></li>
    </ul>`
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

// type SummaryPayloadType = Omit<DocumentType202304['REGULATIONS_AND_STANDARDS'], 'files'>
//   & { standardsType: string[] }
//   & { files: ({ id: string, displayFileName: string, url: string } | { id: string, name: string })[] }
//   & { [key: string]: undefined | string };



export const SECTION_5_1: sectionType<InnovationSections> = {
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
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data)
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

  // Object.keys(currentValues).filter(key => key.startsWith('standardHasMet_')).forEach((key) => { delete currentValues[key]; });

  steps.push({

    // saveStrategy: 'updateAndWait',

    ...new FormEngineModel({
      parameters: [{
        id: 'standardsType', dataType: 'checkbox-array', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
        validations: { isRequired: [true, 'Choose at least one certification/standard'] },
        items: [
          ...standardsTypeItems,
          { value: 'OTHER', label: 'Other', conditional: new FormEngineParameterModel({ id: 'otherRegulationDescription', dataType: 'text', label: 'Other standards and certifications that apply', validations: { isRequired: [true, 'Other standards and certifications is required'] } }) }
        ]
      }]
    })
  });

  currentValues.standards = (currentValues.standardsType || []).map(s => {
    return currentValues.standards?.find(item => item.type === s) || { type: s } as Required<StepPayloadType>['standards'][number];
  });

  (currentValues.standards || []).forEach((item, i) => {
    steps.push(
      new FormEngineModel({
        parameters: [{
          id: `standardHasMet_${StringsHelper.slugify(item.type)}`,
          dataType: 'radio-group',
          label: `Do you have a certification for ${item.type === 'OTHER' ? currentValues.otherRegulationDescription : standardsTypeItems.find(i => i.value === item.type)?.label}`,
          validations: { isRequired: [true, 'Choose one option'] },
          items: standardsHasMetItems
        }]
      })
    );
    currentValues[`standardHasMet_${StringsHelper.slugify(item.type)}`] = item.hasMet;
  });

  steps.push(
    new FormEngineModel({
      parameters: [{
        id: 'files', dataType: 'file-upload', label: stepsLabels.q3.label, description: stepsLabels.q3.description,
        validations: { isRequired: [true, 'Upload at least one file'] }
      }],
    })
  );

}


function inboundParsing(data: InboundPayloadType): StepPayloadType {

  const parsedData = {
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    otherRegulationDescription: data.otherRegulationDescription,
    files: data.files,
    standardsType: data.standards?.map(item => item.type)
  } as StepPayloadType;

  (parsedData.standards ?? []).forEach((item, i) => { parsedData[`standardHasMet_${i}`] = item.hasMet; });

  return parsedData;

}


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasRegulationKnowledge: data.hasRegulationKnowledge,
    standards: data.standards,
    otherRegulationDescription: data.otherRegulationDescription,
    files: data.files?.map(item => item.id)
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
        label: `Do you have a certification for ${standard.type === 'OTHER' ? data.otherRegulationDescription : standardsTypeItems.find(item => item.value === standard.type)?.label}`,
        value: standardsHasMetItems.find(item => item.value === standard.hasMet)?.label,
        editStepNumber: toReturn.length + 1
      });
    });

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

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  const summaryData = summaryParsing(data)
    .filter(item => item.type !== 'button')
    .filter(item => !item.isFile);

  return summaryData.filter(item => item.type !== 'button');

}
