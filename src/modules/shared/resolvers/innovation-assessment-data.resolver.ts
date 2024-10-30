import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InnovationNeedsAssessmentInfoDTO } from '../services/innovations.dtos';
import { CtxStore } from '@modules/stores';

/**
 * Note: With the creation of the context store, this can be changed to a guard in the future,
 * as it is also assuming that responsibility now (verifying access to the innovation).
 */
// TODO: Check this service and move the contextStore
@Injectable()
export class InnovationAssessmentDataResolver {
  constructor(
    private router: Router,
    private logger: NGXLogger,
    private ctx: CtxStore
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<null | InnovationNeedsAssessmentInfoDTO> {
    return this.ctx.assessment.getOrLoad(route.params.innovationId, route.params.assessmentId).pipe(
      catchError(error => {
        this.ctx.innovation.clear();
        this.ctx.assessment.clear();
        this.router.navigateByUrl('error/forbidden-innovation');

        this.logger.error('Error fetching data innovation data', error);
        return of(null);
      })
    );
  }
}
