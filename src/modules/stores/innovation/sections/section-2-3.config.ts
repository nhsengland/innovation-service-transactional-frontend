import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import { InnovationSectionEnum } from '../innovation.enums';
import { InnovationSectionConfigType } from '../innovation.models';

import { hasEvidenceItems } from './catalogs.config';

import { clinicalEvidenceItems, SECTION_2_EVIDENCES } from './section-2-3-evidences.config';


// Labels.
const stepsLabels = {
  l1: 'Do you have evidence to show the effectiveness of your innovation?'
};


// Types.
type BaseType = {
  hasEvidence: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET',
  evidences: {
    id: string,
    evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER',
    clinicalEvidenceType: null | 'DATA_PUBLISHED' | 'NON_RANDOMISED_COMPARATIVE_DATA' | 'NON_RANDOMISED_NON_COMPARATIVE_DATA' | 'CONFERENCE' | 'RANDOMISED_CONTROLLED_TRIAL' | 'UNPUBLISHED_DATA' | 'OTHER',
    description: string,
    summary: string
  }[];
};
type StepPayloadType = BaseType;
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
          description: 'Evidence of effectiveness can include clinical and economic effectiveness as well as other proven benefits such as staff and system benefits. You\'ll be able to add several pieces of evidence one at a time. We will ask about user testing and regulatory approval (approvals by government or health authorities) in later sections.',
          validations: { isRequired: [true, 'Choose one option'] },
          items: hasEvidenceItems
        }]
      })
    ],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data),
    summaryPDFParsing: (data: StepPayloadType) => summaryPDFParsing(data),
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

  (data.evidences || []).forEach((item, i) => {
    toReturn.push({
      label: `Evidence ${i + 1}`,
      value: item.description || clinicalEvidenceItems.find(e => e.value === item.clinicalEvidenceType)?.label,
      evidenceId: i
    });
  });

  return toReturn;

}

function summaryPDFParsing(data: StepPayloadType): WizardSummaryType[] {
  return summaryParsing(data);
}
