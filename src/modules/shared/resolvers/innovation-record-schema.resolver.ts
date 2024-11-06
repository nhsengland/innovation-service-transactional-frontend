import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContextSchemaType, CtxStore } from '@modules/stores';
import { Observable } from 'rxjs';

export const innovationRecordSchemaResolver: ResolveFn<any> = (): Observable<ContextSchemaType['irSchema']> => {
  const ctxStore: CtxStore = inject(CtxStore);
  return ctxStore.schema.getOrLoad$();
};
