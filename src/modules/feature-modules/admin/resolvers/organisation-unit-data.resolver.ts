import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { Observable, map } from 'rxjs';

export const organisationUnitDataResolver: ResolveFn<{
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  canActivate: boolean;
}> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: string; name: string; acronym: string; isActive: boolean; canActivate: boolean }> => {
  const organisationsService: OrganisationsService = inject(OrganisationsService);

  return organisationsService
    .getOrganisationUnitInfo(route.params.organisationId, route.params.organisationUnitId)
    .pipe(
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
};
