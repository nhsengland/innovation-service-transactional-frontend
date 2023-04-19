import { FormEngineModel, FormEngineParameterModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { InnovationSections } from './catalog.types';
import { DocumentType202304 } from './document.types';
import { hasPatentsItems } from './forms.config';


// Labels.
const stepsLabels = {
  q1: { label: 'Do you have any patents for your innovation?' },
  q2: {
    label: 'Do you have any other intellectual property for your innovation?',
    description: 'Find out more about <a href="/innovation-guides" target="_blank" rel="noopener noreferrer">intellectual property (opens in a new window)</a>.'
  }
};


// Types.
type InboundPayloadType = DocumentType202304['INTELLECTUAL_PROPERTY'];
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = DocumentType202304['INTELLECTUAL_PROPERTY'];


// Logic.
export const SECTION_5_2: InnovationSectionConfigType<InnovationSections> = {
  id: 'INTELLECTUAL_PROPERTY',
  title: 'Intellectual property',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasPatents', dataType: 'radio-group', label: stepsLabels.q1.label,
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasPatentsItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'hasOtherIntellectual', dataType: 'radio-group', label: stepsLabels.q2.label, description: stepsLabels.q2.description,
          validations: { isRequired: [true, 'Choose one option'] },
          items: [
            { value: 'YES', label: 'Yes', conditional: new FormEngineParameterModel({ id: 'otherIntellectual', dataType: 'text', label: 'Type of intellectual property', validations: { isRequired: [true, 'Type of intellectual property is required'], maxLength: 100 } }) },
            { value: 'NO', label: 'No' }
          ]
        }]
      })
    ],
    showSummary: true,
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasPatents: data.hasPatents,
    ...(data.patentNumbers && { patentNumbers: data.patentNumbers }),
    ...(data.hasOtherIntellectual && { hasOtherIntellectual: data.hasOtherIntellectual }),
    ...(data.otherIntellectual && { otherIntellectual: data.otherIntellectual })
  };

}

function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.q1.label,
    value: hasPatentsItems.find(item => item.value === data.hasPatents)?.label,
    editStepNumber: 1
  });

  if (data.hasPatents === 'HAS_AT_LEAST_ONE') {
    toReturn.push({
      label: 'Patent number(s)',
      value: data.patentNumbers,
      editStepNumber: 1
    });
  }

  toReturn.push({
    label: stepsLabels.q2.label,
    value: data.otherIntellectual || 'No',
    editStepNumber: 2
  });

  return toReturn;

}
