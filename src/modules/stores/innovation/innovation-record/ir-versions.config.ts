import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { InnovationSectionEnum } from '../innovation.enums';
import { INNOVATION_SECTION_STATUS, sectionType } from '../innovation.models';
import { InnovationSectionsListType } from './ir-versions.types';

import {
  categoriesItems as SECTIONS_202209_categoriesItems,
  clinicalEvidenceItems as SECTIONS_202209_evidencetypeItems
} from './202209/forms.config';
import { INNOVATION_SECTIONS as SECTIONS_202209 } from './202209/main.config';
import {
  categoriesItems as SECTIONS_202304_categoriesItems,
  evidenceTypeItems as SECTIONS_202304_evidenceTypeItems
} from './202304/forms.config';
import { INNOVATION_SECTIONS as SECTIONS_202304 } from './202304/main.config';
import { InnovationRecordSchemaInfoType } from './innovation-record-schema/innovation-record-schema.models';

import { irSchemaTranslationsMap } from './202405/ir-v3-schema-translation.helper';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';

export type AllSectionsOutboundPayloadType = {
  title: string;
  sections: {
    section: string;
    answers: { label: string; value: string }[];
    status: 'SUBMITTED' | 'UNKNOWN' | 'NOT_STARTED' | 'DRAFT';
  }[];
}[];

export const irVersionsMainCategoryItems = [...SECTIONS_202209_categoriesItems, ...SECTIONS_202304_categoriesItems];
export const irVersionsClinicalMainCategoryItems = [
  ...SECTIONS_202209_evidencetypeItems,
  ...SECTIONS_202304_evidenceTypeItems
];

// These sections should accept documents/files even before the innovation is submitted for NA.
export const innovationSectionsWithFiles = [
  'UNDERSTANDING_OF_NEEDS',
  'EVIDENCE_OF_EFFECTIVENESS',
  'TESTING_WITH_USERS',
  'REGULATIONS_AND_STANDARDS',
  'DEPLOYMENT'
];

export function getInnovationRecordConfig(version?: string): InnovationSectionsListType {
  switch (version) {
    case '202209':
      return SECTIONS_202209;
    case '202304':
    default:
      return SECTIONS_202304;
  }
}

export function getAllSectionsSummary(
  data: {
    section: {
      id: null | string;
      section: InnovationSectionEnum;
      status: keyof typeof INNOVATION_SECTION_STATUS;
      updatedAt: string;
    };
    data: MappedObjectType;
  }[],
  version?: string
): AllSectionsOutboundPayloadType {
  const sectionMap = new Map(data.map(d => [d.section.section, d]));

  return getInnovationRecordConfig(version).map(i => ({
    title: i.title,
    sections: i.sections.map(s => ({
      section: s.title,
      status: sectionMap.get(s.id as any)?.section.status ?? 'UNKNOWN',
      answers: s.wizard
        .runSummaryParsing(s.wizard.runInboundParsing(sectionMap.get(s.id as any)?.data ?? {}))
        .filter(item => item.type !== 'button' && !item.isFile)
        .map(a => ({ label: a.label, value: a.value || '' }))
    }))
  }));
}

export function getAllSectionsSummaryV3(
  sections: {
    section: sectionType;
    data: MappedObjectType;
  }[],
  schema: InnovationRecordSchemaInfoType
): AllSectionsOutboundPayloadType {
  const sectionMap = new Map(sections.map(d => [d.section.section, d]));

  return schema.schema.sections.map(s => {
    return {
      title: s.title,
      sections: s.subSections.map(sub => {
        const wizard = new WizardIRV3EngineModel({
          schema: schema,
          translations: irSchemaTranslationsMap(schema.schema),
          sectionId: sub.id
        });

        wizard
          .setAnswers(sectionMap.get(sub.id)?.data ?? {})
          .runRules()
          .runInboundParsing();
        return {
          section: sub.title,
          status: sectionMap.get(sub.id as any)?.section.status ?? 'UNKNOWN',
          answers: wizard.translateSummaryForIRDocumentExport().map(a => ({ label: a.label, value: a.value }))
        };
      })
    };
  });
}

export function getAllSectionsList(): { value: string; label: string }[] {
  return getInnovationRecordConfig().reduce((sectionGroupAcc: { value: string; label: string }[], sectionGroup, i) => {
    return [
      ...sectionGroupAcc,
      ...sectionGroup.sections.reduce((sectionAcc: { value: string; label: string }[], section, j) => {
        return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
      }, [])
    ];
  }, []);
}

export function getAllSectionsListV3(
  schema: InnovationRecordSchemaInfoType | null
): { value: string; label: string }[] {
  return !schema
    ? []
    : schema.schema.sections.reduce((sectionGroupAcc: { value: string; label: string }[], sectionGroup, i) => {
        return [
          ...sectionGroupAcc,
          ...sectionGroup.subSections.reduce((sectionAcc: { value: string; label: string }[], section, j) => {
            return [...sectionAcc, ...[{ value: section.id, label: `${i + 1}.${j + 1} ${section.title}` }]];
          }, [])
        ];
      }, []);
}
