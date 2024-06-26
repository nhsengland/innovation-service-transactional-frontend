import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContextStore, InnovationRecordSchemaStore } from '@modules/stores';
import { ContextSchemaType } from '@modules/stores/context/context.types';
import { InnovationRecordSchemaInfoType } from '@modules/stores/innovation/innovation-record/innovation-record-schema/innovation-record-schema.models';
import { Observable } from 'rxjs';

export const innovationRecordSchemaResolver: ResolveFn<any> = (): Observable<ContextSchemaType> => {
  const contextStore: ContextStore = inject(ContextStore);
  return contextStore.getOrLoadIrSchema();
};
