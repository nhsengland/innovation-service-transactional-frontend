import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { AssessmentService } from '../services/assessment.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Injectable()
export class InnovationDataResolver implements Resolve<InnovationDataResolverType> {

  constructor(
    private logger: NGXLogger,
    private assessmentService: AssessmentService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<InnovationDataResolverType> {

    return this.assessmentService.getInnovationInfo(route.params.innovationId).pipe(
      map(
        response => ({
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          assessment: { id: response.assessment?.id }
        }),
        catchError(error => {
          /* istanbul ignore next */
          this.logger.error('Error fetching data innovation data', error);
          /* istanbul ignore next */
          return of(false);
        })
      )
    );

  }

}
