import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationStore } from '@modules/stores';
import { getInnovationRecordSchemaTranslationsMap } from '@modules/stores/innovation/innovation-record/202405/ir-v3.helpers';

export const innovationSectionDataResolverV3: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationStore: InnovationStore = inject(InnovationStore);
  console.log(route.params['sectionId']);
  return of({
    id: route.params['sectionId'],
    name: getInnovationRecordSchemaTranslationsMap().subsections.get(route.params['sectionId']) ?? ''
  });
};
