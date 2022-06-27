import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';
import { InnovatorService } from '../services/innovator.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


@Injectable()
export class InnovationDataResolver implements Resolve<boolean | InnovationDataResolverType> {

  constructor(
    private logger: NGXLogger,
    private environmentStore: EnvironmentStore,
    private innovatorService: InnovatorService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<boolean | InnovationDataResolverType> {

    return this.innovatorService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        this.environmentStore.setInnovation({
          id: response.id,
          name: response.name,
          status: response.status,
          assessment: response.assessment ? { id: response.assessment.id } : undefined,
          owner: {
            isActive: true,
            name: ''
          }
        });

        return {
          id: response.id,
          name: response.name,
          status: response.status,
          assessment: { id: response.assessment?.id },
          owner: {
            isActive: true,
            name: ''
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
