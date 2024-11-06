import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CtxStore } from '@modules/stores';

export const innovationSectionDataResolverV3: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const ctx: CtxStore = inject(CtxStore);

  return of({
    id: route.params['sectionId'],
    name: ctx.schema.getIrSchemaTranslationsMap().subsections.get(route.params['sectionId']) ?? ''
  });
};
