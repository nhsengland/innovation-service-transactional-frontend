import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../services/accessor.service';


@Injectable()
export class InnovationDataResolver implements Resolve<boolean | InnovationDataResolverType> {

  constructor(
    private logger: NGXLogger,
    private contextStore: EnvironmentStore,
    private accessorService: AccessorService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<boolean | InnovationDataResolverType> {

    return this.accessorService.getInnovationInfo(route.params.innovationId).pipe(
      map(response => {

        this.contextStore.setInnovation({
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          owner: {
            isActive: !response.lockedInnovatorValidation.displayIsInnovatorLocked,
            name: response.lockedInnovatorValidation.innovatorName || ''
          },
          assessment: response.assessment ? { id: response.assessment.id } : undefined,
          support: response.support ? { id: response.support.id, status: response.support.status } : undefined
        });

        return {
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          assessment: { id: response.assessment?.id },
          support: {
            id: response.support?.id,
            status: response.support?.status || InnovationSupportStatusEnum.UNASSIGNED
          },
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
