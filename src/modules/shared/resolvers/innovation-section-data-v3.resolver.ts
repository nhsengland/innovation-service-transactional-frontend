import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationRecordSchemaStore, InnovationStore } from '@modules/stores';
// import { getInnovationRecordSchemaTranslationsMap } from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';

export const innovationSectionDataResolverV3: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationStore: InnovationStore = inject(InnovationStore);
  const irSchemaStore: InnovationRecordSchemaStore = inject(InnovationRecordSchemaStore);

  return of({
    id: route.params['sectionId'],
    name: irSchemaStore.getIrSchemaTranslationsMap().subsections.get(route.params['sectionId']) ?? ''
  });
};
