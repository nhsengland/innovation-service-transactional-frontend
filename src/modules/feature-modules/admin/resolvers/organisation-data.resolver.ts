import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { OrganisationsService } from '@modules/shared/services/organisations.service';


@Injectable()
export class OrganisationDataResolver  {

  constructor(
    private logger: NGXLogger,
    private organisationsService: OrganisationsService
  ) { }


  resolve(route: ActivatedRouteSnapshot): Observable<{ id: string, name: string, acronym: string }> {

    return this.organisationsService.getOrganisationInfo(route.params.organisationId).pipe(
      map(response => {
        return {
          id: response.id,
          name: response.name,
          acronym: response.acronym
        };
      })
    );

  }

}
