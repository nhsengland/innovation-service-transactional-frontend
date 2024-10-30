import { InnovationRecordSchemaV3Type } from '../202405/ir-v3-types';

export class InnovationRecordSchemaModel {
  constructor() {}
}

export type InnovationRecordSchemaInfoType = {
  id: string;
  version: number;
  schema: InnovationRecordSchemaV3Type;
};

export type InnovationRecordSectionUpdateType = { version: number; data: { [key: string]: any } };

export type IrSchemaTranslatorQuestionsMapType = Map<string, { label: string; items: IrSchemaTranslatorItemMapType }>;

export type IrSchemaTranslatorItemMapType = Map<string, { label: string; group: string }>;

export type IrSchemaTranslatorMapType = {
  sections: Map<string, string>;
  subsections: Map<string, string>;
  questions: IrSchemaTranslatorQuestionsMapType;
};
