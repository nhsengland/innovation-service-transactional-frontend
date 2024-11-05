import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';


import { irVersionsClinicalMainCategoryItems } from '@modules/stores/innovation/innovation-record/ir-versions.config';
import { CtxStore } from '@modules/stores';

@Injectable()
export class InnovationSectionEvidenceDataResolver {
  constructor(private ctx: CtxStore) {}

  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: string; name: string }> {
    return this.ctx.innovation.getSectionEvidence$(route.params['innovationId'], route.params['evidenceId']).pipe(
      map(response => {
        return {
          id: route.params['evidenceId'] as string,
          name:
            response.description ||
            irVersionsClinicalMainCategoryItems.find(e => e.value === response.clinicalEvidenceType)?.label ||
            ''
        };
      })
    );
  }
}
