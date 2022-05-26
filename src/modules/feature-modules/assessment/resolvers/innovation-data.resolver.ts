import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { ContextStore } from '@modules/stores/context/context.store';
import { AssessmentService } from '../services/assessment.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Injectable()
export class InnovationDataResolver implements Resolve<boolean | InnovationDataResolverType> {

  constructor(
    private logger: NGXLogger,
    private contextStore: ContextStore,
    private assessmentService: AssessmentService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<boolean | InnovationDataResolverType> {

    return this.assessmentService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        this.contextStore.setInnovation({
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          assessment: response.assessment ? { id: response.assessment.id } : undefined,
          owner: {
            isActive: !response.lockedInnovatorValidation.displayIsInnovatorLocked,
            name: response.lockedInnovatorValidation.innovatorName || ''
          }
        });

        return {
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          assessment: { id: response.assessment?.id },
          lockedInnovatorValidation: {
            displayIsInnovatorLocked: response.lockedInnovatorValidation.displayIsInnovatorLocked,
            innovatorName: response.lockedInnovatorValidation.innovatorName
          },
          owner: {
            isActive: !response.lockedInnovatorValidation.displayIsInnovatorLocked,
            name: response.lockedInnovatorValidation.innovatorName || ''
          }
        };

      }),
      catchError(error => {
        /* istanbul ignore next */
        this.logger.error('Error fetching data innovation data', error);
        /* istanbul ignore next */
        return of(false);
      })
    );

  }

}
