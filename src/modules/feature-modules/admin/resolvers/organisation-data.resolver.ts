import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

export const organisationDataResolver: ResolveFn<{ id: string; name: string; acronym: string }> = (
  route: ActivatedRouteSnapshot
): Observable<{ id: string; name: string; acronym: string }> => {
  const organisationsService: OrganisationsService = inject(OrganisationsService);

  return organisationsService.getOrganisationInfo(route.params.organisationId).pipe(
    map(response => {
      return {
        id: response.id,
        name: response.name,
        acronym: response.acronym
      };
    })
  );
};
