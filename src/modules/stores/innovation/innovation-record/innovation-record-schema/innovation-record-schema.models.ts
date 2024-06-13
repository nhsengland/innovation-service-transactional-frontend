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
