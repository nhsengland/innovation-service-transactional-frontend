import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { hasOtherIntellectualItems, hasPatentsItems } from './catalogs.config';


// Labels.
const stepsLabels = {
  l1: 'Do you have any patents for your innovation?',
  l2: 'Do you have any other intellectual property for your innovation?',
};


// Types.
type BaseType = {
  hasPatents: null | 'HAS_AT_LEAST_ONE' | 'APPLIED_AT_LEAST_ONE' | 'HAS_NONE';
  hasOtherIntellectual: null | 'YES' | 'NO';
  otherIntellectual: null | string;
};
type StepPayloadType = BaseType;


export const SECTION_3_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.INTELLECTUAL_PROPERTY,
  title: 'Intellectual property',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasPatents',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a> for more information about intellectual property.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasPatentsItems
        }]
      }),
      new FormEngineModel({
        parameters: [{
          id: 'hasOtherIntellectual',
          dataType: 'radio-group',
          label: stepsLabels.l2,
          description: 'See <a href="/innovation-guides/advanced-innovation-guide" target="_blank" rel="noopener noreferrer">Innovation guides (opens in new window)</a> for more information about intellectual property.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasOtherIntellectualItems
        }]
      })
    ],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data),
    showSummary: true
  })
};



function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  return [
    {
      label: stepsLabels.l1,
      value: hasPatentsItems.find(item => item.value === data.hasPatents)?.label,
      editStepNumber: 1
    },
    {
      label: stepsLabels.l2,
      value: data.otherIntellectual || hasOtherIntellectualItems.find(item => item.value === data.hasOtherIntellectual)?.label,
      editStepNumber: 2
    }
  ];

}
function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
