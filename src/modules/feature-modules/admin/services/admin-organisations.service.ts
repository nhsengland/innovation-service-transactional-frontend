import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

export type updateOrganisationDTO = {
  organisationId: string;
};

export type updateOrganisationUnitDTO = {
  unitId: string;
};

export type CreateOrganisationBodyDTO = {
  name: string;
  acronym: string;
  summary: string;
  units: { name: string; acronym: string }[];
};

export type CreateOrganisationUnitBodyDTO = {
  name: string;
  acronym: string;
};

@Injectable()
export class AdminOrganisationsService extends CoreService {
  constructor() {
    super();
  }

  updateOrganisation(body: MappedObjectType, organisationId: string): Observable<updateOrganisationDTO> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisations/:organisationId')
      .setPathParams({ organisationId });
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.error })))
    );
  }

  updateUnit(
    body: MappedObjectType,
    organisationUnitId: string,
    organisationId: string
  ): Observable<updateOrganisationUnitDTO> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisations/:organisationId/units/:organisationUnitId')
      .setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<updateOrganisationUnitDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.error })))
    );
  }

  activateOrganisationUnit(organisationId: string, organisationUnitId: string, userIds: string[]): Observable<boolean> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisations/:organisationId/units/:organisationUnitId/activate')
      .setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<unknown>(url.buildUrl(), { userIds }).pipe(
      take(1),
      map(() => true)
    );
  }

  inactivateOrganisationUnit(organisationId: string, organisationUnitId: string): Observable<boolean> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisations/:organisationId/units/:organisationUnitId/inactivate')
      .setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<unknown>(url.buildUrl(), { organisationUnitId }).pipe(
      take(1),
      map(() => true)
    );
  }

  createOrganisation(body: CreateOrganisationBodyDTO): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  createOrganisationUnit(organisationId: string, body: CreateOrganisationUnitBodyDTO): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisations/:organisationId/units')
      .setPathParams({ organisationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }
}
