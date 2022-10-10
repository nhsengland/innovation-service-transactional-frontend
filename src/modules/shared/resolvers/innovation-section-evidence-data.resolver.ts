import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { InnovationStore } from '@modules/stores/innovation/innovation.store';

import { clinicalEvidenceItems } from '@modules/stores/innovation/sections/section-2-3-evidences.config';


@Injectable()
export class InnovationSectionEvidenceDataResolver implements Resolve<null | { id: string, name: string }> {

  constructor(
    private router: Router,
    private logger: NGXLogger,
    private innovationStore: InnovationStore,

  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<null | { id: string, name: string }> {

    return this.innovationStore.getSectionEvidence$(route.params['innovationId'], route.params['evidenceId']).pipe(
      map(response => {
        return {
          id: route.params['evidenceId'] as string,
          name: response.description || clinicalEvidenceItems.find(e => e.value === response.clinicalEvidenceType)?.label || ''
        };

      })

    );

  }

}
