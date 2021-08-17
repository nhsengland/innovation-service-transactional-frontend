import { FormEngineModel, SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { hasEvidenceItems } from './catalogs.config';

import { SECTION_2_EVIDENCES, clinicalEvidenceItems } from './section-2-3-evidences.config';


// Labels.
const stepsLabels = {
  l1: 'Do you have evidence of effectiveness for your innovation?'
};


// Types.
type InboundPayloadType = {
  hasEvidence: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
  evidence: {
    id: string;
    evidenceType: 'CLINICAL' | 'ECONOMIC' | 'OTHER';
    clinicalEvidenceType: null | 'DATA_PUBLISHED' | 'NON_RANDOMISED_COMPARATIVE_DATA' | 'NON_RANDOMISED_NON_COMPARATIVE_DATA' | 'CONFERENCE' | 'RANDOMISED_CONTROLLED_TRIAL' | 'UNPUBLISHED_DATA' | 'OTHER';
    description: string;
    summary: string;
  }[];
};

type StepPayloadType = InboundPayloadType;

type OutboundPayloadType = {
  hasEvidence: null | 'YES' | 'IN_PROGRESS' | 'NOT_YET';
};



export const SECTION_2_3: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS,
  title: 'Evidence of effectiveness',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [{
          id: 'hasEvidence',
          dataType: 'radio-group',
          label: stepsLabels.l1,
          validations: { isRequired: true },
          items: hasEvidenceItems
        }]
      })
    ],
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  }),
  evidences: SECTION_2_EVIDENCES
};


function outboundParsing(data: StepPayloadType): OutboundPayloadType {

  return {
    hasEvidence: data.hasEvidence
  };

}


function summaryParsing(data: StepPayloadType): SummaryParsingType[] {

  const toReturn: SummaryParsingType[] = [];

  toReturn.push({
    label: stepsLabels.l1,
    value: hasEvidenceItems.find(item => item.value === data.hasEvidence)?.label,
    editStepNumber: 1
  });

  (data.evidence || []).forEach((item, i) => {
    toReturn.push({
      label: `Evidence ${i + 1}`,
      value: item.description || clinicalEvidenceItems.find(e => e.value === item.clinicalEvidenceType)?.label,
      evidenceId: item.id
    });
  });

  return toReturn;

}
