import { FormEngineModel, WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionConfigType } from '../ir-versions.types';

import { catalogYesInProgressNotYet, InnovationSections } from './catalog.types';
import { DocumentType202209 } from './document.types';
import { clinicalEvidenceItems, hasEvidenceItems } from './forms.config';

import { SECTION_2_EVIDENCES } from './section-2-3-evidences.config';

// Labels.
const stepsLabels = {
  l1: 'Do you have evidence to show the effectiveness of your innovation?'
};

// Types.
type InboundPayloadType = Omit<DocumentType202209['EVIDENCE_OF_EFFECTIVENESS'], 'files'> & {
  files: { id: string; name: string; url: string }[];
};
type StepPayloadType = InboundPayloadType;
type OutboundPayloadType = {
  hasEvidence: catalogYesInProgressNotYet;
};

export const SECTION_2_3: InnovationSectionConfigType<InnovationSections> = {
  id: 'EVIDENCE_OF_EFFECTIVENESS',
  title: 'Evidence of effectiveness',
  evidences: SECTION_2_EVIDENCES,
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        parameters: [
          {
            id: 'hasEvidence',
            dataType: 'radio-group',
            label: stepsLabels.l1,
            description:
              "Evidence of effectiveness can include clinical and economic effectiveness as well as other proven benefits such as staff and system benefits. You'll be able to add several pieces of evidence one at a time. We will ask about user testing and regulatory approval (approvals by government or health authorities) in later sections.",
            validations: { isRequired: [true, 'Choose one option'] },
            items: hasEvidenceItems
          }
        ]
      })
    ],
    showSummary: true,
    outboundParsing: (data: StepPayloadType) => outboundParsing(data),
    summaryParsing: (data: StepPayloadType) => summaryParsing(data)
  })
};

function outboundParsing(data: StepPayloadType): OutboundPayloadType {
  return {
    hasEvidence: data.hasEvidence ?? 'NOT_YET'
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
      evidenceId: item.id
    });
  });

  return toReturn;
}
