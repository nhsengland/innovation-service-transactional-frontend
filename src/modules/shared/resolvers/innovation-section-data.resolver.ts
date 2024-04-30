import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationStore } from '@modules/stores';

export const innovationSectionDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: null | string; name: string }> => {
  const innovationStore: InnovationStore = inject(InnovationStore);

  return of({
    id: route.params['sectionId'],
    name: innovationStore.getInnovationRecordSectionIdentification(route.params['sectionId'])?.section.title ?? ''
  });
};
