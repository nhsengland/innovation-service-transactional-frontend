import { FormEngineModel, WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { hasEvidenceItems } from './catalogs.config';

import { SECTION_2_EVIDENCES } from './section-2-3-evidences.config';


// Labels.
const stepsLabels = {
  l1: 'Do you have evidence to show the effectiveness of your innovation?'
};


// Types.
type InboundPayloadType = {
  hasEvidence: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET'
};
type StepPayloadType = InboundPayloadType;

type OutboundPayloadType = {
  hasEvidence: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
};


export const SECTION_2_3: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionEnum.EVIDENCE_OF_EFFECTIVENESS,
  title: 'Evidence of effectiveness',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasEvidence',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          description: 'Evidence of effectiveness can include clinical and economic effectiveness as well as other proven benefits such as staff and system benefits. You\'ll be able to add several pieces of evidence one at a time. We\'ll ask about user testing and regulatory approval in later sections.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasEvidenceItems
        }]
      })
    ],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    showSummary: true
  }),
  evidences: SECTION_2_EVIDENCES
};


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasEvidence: data.hasEvidence
  };

}


function summaryParsing(data: StepPayloadType): WizardSummaryType[] {

  const toReturn: WizardSummaryType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasEvidenceItems.find(item => item.value === data.hasEvidence)?.label,
    editStepNumber: 1
  });

  return toReturn;

}
