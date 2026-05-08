import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { sectionType } from '../../ctx/innovation/innovation.models';

import { evidenceTypeItems as SECTIONS_202405_evidenceTypeItems } from './202405/evidences-forms.config';

import { irSchemaTranslationsMap } from './202405/ir-v3-schema-translation.helper';
import { WizardIRV3EngineModel } from '@modules/shared/forms/engine/models/wizard-engine-irv3-schema.model';
import { InnovationRecordSchemaInfoType } from '../../ctx/schema/schema.types';

export type AllSectionsOutboundPayloadType = {
  title: string;
  sections: {
    section: string;
    answers: { label: string; value: string }[];
    status: 'SUBMITTED' | 'UNKNOWN' | 'NOT_STARTED' | 'DRAFT';
  }[];
}[];

export const irVersionsClinicalMainCategoryItems = [...SECTIONS_202405_evidenceTypeItems];

// These sections should accept documents/files even before the innovation is submitted for NA.
export const innovationSectionsWithFiles = [
  'UNDERSTANDING_OF_NEEDS',
  'EVIDENCE_OF_EFFECTIVENESS',
  'TESTING_WITH_USERS',
  'REGULATIONS_AND_STANDARDS',
  'DEPLOYMENT'
];

export const innovationsSubSections = {
  INNOVATION_DESCRIPTION: 'INNOVATION_DESCRIPTION',
  UNDERSTANDING_OF_NEEDS: 'UNDERSTANDING_OF_NEEDS',
  EVIDENCE_OF_EFFECTIVENESS: 'EVIDENCE_OF_EFFECTIVENESS',
  COST_OF_INNOVATION: 'COST_OF_INNOVATION',
  CURRENT_CARE_PATHWAY: 'CURRENT_CARE_PATHWAY',
  DEPLOYMENT: 'DEPLOYMENT',
  INTELLECTUAL_PROPERTY: 'INTELLECTUAL_PROPERTY',
  MARKET_RESEARCH: 'MARKET_RESEARCH',
  REGULATIONS_AND_STANDARDS: 'REGULATIONS_AND_STANDARDS',
  REVENUE_MODEL: 'REVENUE_MODEL',
  TESTING_WITH_USERS: 'TESTING_WITH_USERS'
};

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
