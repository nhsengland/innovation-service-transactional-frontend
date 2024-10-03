import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InnovationRecordSchemaStore } from '@modules/stores';

@Injectable()
export class InnovationSectionDataResolver {
  constructor(private schemaStore: InnovationRecordSchemaStore) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string; name: string }> {
    return of({
      id: route.params['sectionId'],
      name: this.schemaStore.getIrSchemaSectionIdentificationV3(route.params['sectionId'])?.section.title ?? ''
    });
  }
}
