import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationStore } from '@modules/stores';

@Injectable()
export class InnovationSectionDataResolver {
  constructor(private innovationStore: InnovationStore) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string; name: string }> {
    return of({
      id: route.params['sectionId'],
      name:
        this.innovationStore.getInnovationRecordSectionIdentification(route.params['sectionId'])?.section.title ?? ''
    });
  }
}
