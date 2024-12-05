import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CtxStore } from '@modules/stores';

@Injectable()
export class InnovationSectionDataResolver {
  constructor(private ctx: CtxStore) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: null | string; name: string }> {
    return of({
      id: route.params['sectionId'],
      name: this.ctx.schema.getIrSchemaSectionIdentificationV3(route.params['sectionId'])?.section.title ?? ''
    });
  }
}
