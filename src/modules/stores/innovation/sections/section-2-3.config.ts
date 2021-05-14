import { MappedObject } from '@modules/core';
import { FormEngineModel, WizardEngineModel } from '@modules/shared/forms';
import { InnovationSectionConfigType, InnovationSectionsIds } from '../innovation.models';

import { SECTION_2_EVIDENCES, clinicalEvidenceItems } from './section-2-3-evidences.config';

export const SECTION_2_3: InnovationSectionConfigType['sections'][0] = {
  id: InnovationSectionsIds.EVIDENCE_OF_EFFECTIVENESS,
  title: 'Evidence of effectiveness',
  wizard: new WizardEngineModel({
    steps: [
      new FormEngineModel({
        label: 'Do you have evidence of effectiveness for your innovation?',
        parameters: [{
          id: 'hasEvidence',
          dataType: 'radio-group',
          validations: { isRequired: true },
          items: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]
        }]
      })
    ],
    outboundParsing: (data: any) => outboundParsing(data),
    summaryParsing: (steps: FormEngineModel[], data: any) => group_2_3_summaryParsing(steps, data)
  }),
  evidences: SECTION_2_EVIDENCES
};





function outboundParsing(data: MappedObject): MappedObject {

  return {
    hasEvidence: data.hasEvidence
  };

}



type summaryData = {
  hasEvidence: 'yes' | 'no';
  evidence: {
    id: string;
    evidenceType: 'clinical' | 'economic' | 'other';
    clinicalEvidenceType: string;
    description: string;
    summary: string;
    files: { id: string; }[];
  }[];
};


function group_2_3_summaryParsing(steps: FormEngineModel[], data: summaryData): { label: string, value: string, editStepNumber?: number, evidenceId?: string }[] {

  const toReturn = [];

  toReturn.push({
    label: steps[0].label || '',
    value: steps[0].parameters[0].items?.find(item => item.value === data.hasEvidence)?.label || '',
    editStepNumber: 1
  });

  data.evidence.forEach((item, i) => {
    toReturn.push({
      label: `Evidence ${i + 1}`,
      value: item.description || clinicalEvidenceItems.find(e => e.value === item.clinicalEvidenceType)?.label || '',
      evidenceId: item.id
    });
  });

  return toReturn;

}
