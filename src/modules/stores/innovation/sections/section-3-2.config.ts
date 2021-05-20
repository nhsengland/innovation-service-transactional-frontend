import { FormEngineModel, FormEngineParameterModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';


const stepsLabels = {
  s_3_2_1: 'Have you done market research so that you understand the need for your innovation in the UK?',
  s_3_2_2: 'Please describe the market research you\'ve done, or are doing, within the UK market landscape',
};


const hasPatentsItems = [
  { value: 'HAS_AT_LEAST_ONE', label: 'I have one or more patents' },
  { value: 'APPLIED_AT_LEAST_ONE', label: 'I have applied for one or more patents' },
  { value: 'HAS_NONE', label: 'I don\'t have any patents, but believe I have freedom to operate' }
];

const yesOrNoItems = [
  {
    value: 'yes', label: 'Yes', conditional: new FormEngineParameterModel({ id: 'otherIntellectual', dataType: 'text', validations: { isRequired: true } })
  },
  { value: 'no', label: 'No' }
];


export const SECTION_3_2: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.INTELLECTUAL_PROPERTY,
  title: 'Intellectual property',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: stepsLabels.s_3_2_1,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about intellectual property.',
        parameters: [{
          id: 'hasPatents',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: hasPatentsItems
        }]
      }),
      new FormEngineModel({
        label: stepsLabels.s_3_2_2,
        description: 'See [link to section in advanced guide] (opens in new window) for more information about intellectual property.',
        parameters: [{
          id: 'hasOtherIntellectual',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: yesOrNoItems
        }]
      })
    ],
    summaryParsing: (data: any) => summaryParsing(data)
  })
};



type summaryData = {
  id?: string;
  hasPatents: string;
  hasOtherIntellectual: null
  otherIntellectual: null
};

function summaryParsing(data: summaryData): SummaryParsingType[] {

  return [
    {
      label: stepsLabels.s_3_2_1,
      value: hasPatentsItems.find(item => item.value === data.hasPatents)?.label || '',
      editStepNumber: 1
    },
    {
      label: stepsLabels.s_3_2_2,
      value: data.otherIntellectual || yesOrNoItems.find(item => item.value === data.hasOtherIntellectual)?.label || '',
      editStepNumber: 2
    }
  ];

}
