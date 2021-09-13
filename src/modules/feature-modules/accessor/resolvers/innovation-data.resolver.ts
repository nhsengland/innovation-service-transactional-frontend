import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../services/accessor.service';


@Injectable()
export class InnovationDataResolver implements Resolve<InnovationDataResolverType> {

  constructor(
    private logger: NGXLogger,
    private accessorService: AccessorService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<InnovationDataResolverType> {

    return this.accessorService.getInnovationInfo(route.params.innovationId).pipe(
      map(
        response => ({
          id: response.summary.id,
          name: response.summary.name,
          status: response.summary.status,
          assessment: { id: response.assessment?.id },
          support: {
            id: response.support?.id,
            status: response.support?.status || 'UNASSIGNED'
          }
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
