import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';
import { AssessmentService } from '../services/assessment.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


/**
 * Note: With the creation of the environment store, this can be changed to a guard in the future,
 * as it is also assuming that responsability now (verifying access to the innovation).
 */
@Injectable()
export class InnovationDataResolver implements Resolve<null | InnovationDataResolverType> {

  constructor(
    private router: Router,
    private logger: NGXLogger,
    private environmentStore: EnvironmentStore,
    private assessmentService: AssessmentService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<null | InnovationDataResolverType> {

    return this.assessmentService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        this.environmentStore.setInnovation({
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

        this.environmentStore.clearInnovation();
        this.router.navigateByUrl('error/forbidden-innovation');

        /* istanbul ignore next */
        this.logger.error('Error fetching data innovation data', error);
        /* istanbul ignore next */
        return of(null);

      })

    );

  }

}
