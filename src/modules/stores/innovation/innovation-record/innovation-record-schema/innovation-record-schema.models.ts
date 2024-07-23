import { MappedObjectType } from '@app/base/types';
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

export type IrSchemaTranslatorMapType = {
  sections: Map<string, string>;
  subsections: Map<string, string>;
  questions: Map<string, { label: string; items: Map<string, { label: string; group: string }> }>;
};
