import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { InnovatorService } from '../services/innovator.service';

export type InnovationDataType = {
  id: string;
  name: string;
  assessment: {
    id: undefined | string;
  };
};


@Injectable()
export class InnovationDataResolver implements Resolve<InnovationDataType> {

  constructor(
    private logger: NGXLogger,
    private innovatorService: InnovatorService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<InnovationDataType> {

    return this.innovatorService.getInnovationInfo(route.params.innovationId).pipe(
      map(
        response => ({
          id: response.id,
          name: response.name,
          assessment: { id: response.assessment?.id }
        }),
        catchError(error => {
          this.logger.error('Error fetching data innovation data', error);
          return of(false);
        })
      )
    );

  }

}
