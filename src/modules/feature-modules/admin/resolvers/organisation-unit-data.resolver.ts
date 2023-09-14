import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve
} from '@angular/router';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class OrganisationUnitDataResolver implements Resolve<{ id: null | string, name: string }> {

  constructor(
    private organisationsService: OrganisationsService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<{ id: string, name: string, acronym: string, isActive: boolean, canActivate: boolean }> {

    return this.organisationsService.getOrganisationUnitInfo(route.params.organisationId, route.params.organisationUnitId).pipe(
      map(response => {
        return {
          id: response.id,
          name: response.name,
          acronym: response.acronym,
          isActive: response.isActive,
          canActivate: response.canActivate
        };
      })
    );
  }

}
