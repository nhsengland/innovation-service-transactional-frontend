import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { NGXLogger } from 'ngx-logger';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class OrganisationUnitDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private organisationsService: OrganisationsService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: string, name: string, acronym: string }> {

    return this.organisationsService.getOrganisationUnitInfo(route.params.organisationId, route.params.organisationUnitId).pipe(
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
