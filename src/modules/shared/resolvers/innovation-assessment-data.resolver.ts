import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ContextStore } from '@modules/stores/context/context.store';
import { InnovationNeedsAssessmentInfoDTO } from '../services/innovations.dtos';

/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */
@Injectable()
export class InnovationAssessmentDataResolver {
  constructor(
    private router: Router,
    private logger: NGXLogger,
    private contextStore: ContextStore
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<null | InnovationNeedsAssessmentInfoDTO> {
    return this.contextStore.getOrLoadAssessment(route.params.innovationId, route.params.assessmentId).pipe(
      catchError(error => {
        this.contextStore.clearInnovation();
        this.router.navigateByUrl('error/forbidden-innovation');

        this.logger.error('Error fetching data innovation data', error);
        return of(null);
      })
    );
  }
}
