import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


// Labels.
const stepsLabels = {
  l1: 'Have you done market research so that you understand the need for your innovation in the UK?',
  l2: 'Please describe the market research you\'ve done, or are doing, within the UK market landscape',
};


// Catalogs.
const hasPatentsItems = [
  { value: 'HAS_AT_LEAST_ONE', label: 'I have one or more patents' },
  { value: 'APPLIED_AT_LEAST_ONE', label: 'I have applied for one or more patents' },
  { value: 'HAS_NONE', label: 'I don\'t have any patents, but believe I have freedom to operate' }
];

const hasOtherIntellectualItems = [
  { value: 'YES', label: 'Yes', conditional: new FormEngineParameterModel({ id: 'otherIntellectual', dataType: 'text', validations: { isRequired: true } }) },
  { value: 'NO', label: 'No' }
];


// Types.
type InboundPayloadType = {
  hasPatents: null | 'HAS_AT_LEAST_ONE' |   'APPLIED_AT_LEAST_ONE' |   'HAS_NONE';
  hasOtherIntellectual: null | 'YES' | 'NO';
  otherIntellectual: null | string;
};

type StepPayloadType = InboundPayloadType;



export const SECTION_3_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.INTELLECTUAL_PROPERTY,
  title: 'Intellectual property',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.l1,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about intellectual property.',
        parameters: [{ id: 'hasPatents', dataType: 'radio-group', validations: { isRequired: true }, items: hasPatentsItems }]
      }),
      new FormEngineModel({
        label: stepsLabels.l2,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about intellectual property.',
        parameters: [{ id: 'hasOtherIntellectual', dataType: 'radio-group', validations: { isRequired: true }, items: hasOtherIntellectualItems }]
      })
    ],
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};



function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

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
