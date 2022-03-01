import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { ServiceUsersService, getUserMinimalInfoDTO } from '../services/service-users.service';


@Injectable()
export class ServiceUserDataResolver implements Resolve<getUserMinimalInfoDTO> {

  constructor(
    private logger: NGXLogger,
    private serviceUsersService: ServiceUsersService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<getUserMinimalInfoDTO> {

    return this.serviceUsersService.getUserMinimalInfo(route.params.userId).pipe(
      map(
        response => ({
          id: response.id,
          displayName: response.displayName
        }),
        catchError(error => {
          /* istanbul ignore next */
          this.logger.error('Error fetching user information', error);
          /* istanbul ignore next */
          return of({ id: '', displayName: 'Error' });
        })
      )
    );

  }

}
