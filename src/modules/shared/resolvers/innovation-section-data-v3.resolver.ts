import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationStore } from '@modules/stores';

export const innovationSectionDataResolverV3: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationStore: InnovationStore = inject(InnovationStore);
  console.log(route.params['sectionId']);
  return of({
    id: route.params['sectionId'],
    name: 'asdasdasd'
  });
};
