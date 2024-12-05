import { InnovationRecordSchemaV3Type } from '../../innovation/innovation-record/202405/ir-v3-types';
import { BaseContextType } from '../ctx.types';

export type InnovationRecordSchemaInfoType = {
  id: string;
  version: number;
  schema: InnovationRecordSchemaV3Type;
};

export type ContextSchemaType = {
  irSchema: InnovationRecordSchemaInfoType;
} & BaseContextType;

export const EMPTY_SCHEMA_CONTEXT: ContextSchemaType['irSchema'] = {
  id: '0',
  version: -1,
  schema: { sections: [] }
};

export type InnovationRecordSectionUpdateType = { version: number; data: Record<string, any> };

export type IrSchemaTranslatorQuestionsMapType = Map<string, { label: string; items: IrSchemaTranslatorItemMapType }>;

export type IrSchemaTranslatorItemMapType = Map<string, { label: string; group: string }>;

export type IrSchemaTranslatorMapType = {
  sections: Map<string, string>;
  subsections: Map<string, string>;
  questions: IrSchemaTranslatorQuestionsMapType;
};
