import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { OrganisationsService } from '@modules/shared/services/organisations.service';


@Injectable()
export class OrganisationDataResolver implements Resolve<any> {

  constructor(
    private logger: NGXLogger,
    private organisationsService: OrganisationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.organisationsService.getOrganisationInfo(route.params.organisationId).pipe(
      map(
        response => ({ id: response.id, name: response.name }),
        catchError(error => {
          /* istanbul ignore next */
          this.logger.error('Error fetching organisation information', error);
          /* istanbul ignore next */
          return of({ id: '', name: 'Error' });
        })
      )
    );

  }

}
