import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';

import { AccessorOrganisationRoleEnum, UserRoleEnum } from '@modules/stores/authentication/authentication.enums';


export type updateOrganisationDTO = {
  organisationId: string;
};

export type updateOrganisationUnitDTO = {
  unitId: string;
};


export type organisationUsersInDTO = {
  id: string;
  name: string;
  role: AccessorOrganisationRoleEnum;
};
export type organisationUsersOutDTO = organisationUsersInDTO & { roleDescription: string };


export type CreateOrganisationBodyDTO = {
  name: string, acronym: string,
  units: { name: string, acronym: string }[]
};

export type CreateOrganisationUnitBodyDTO = {
  name: string,
  acronym: string
}


@Injectable()
export class AdminOrganisationsService extends CoreService {

  constructor() { super(); }

  updateOrganisation(body: MappedObjectType, securityConfirmation: { id: string, code: string }, organisationId: string): Observable<updateOrganisationDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations/:organisationId').setPathParams({ organisationId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }


  updateUnit(body: MappedObjectType, securityConfirmation: { id: string, code: string }, organisationUnitId: string, organisationId: string): Observable<updateOrganisationUnitDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations/:organisationId/units/:organisationUnitId').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationUnitDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }

  activateOrganisationUnit(organisationId: string, organisationUnitId: string, userIds: string[]): Observable<boolean> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations/:organisationId/units/:organisationUnitId/activate').setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<{}>(url.buildUrl(), { userIds }).pipe(
      take(1),
      map(response => true)
    );

  }

  inactivateOrganisationUnit(organisationId: string, organisationUnitId: string): Observable<boolean> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations/:organisationId/units/:organisationUnitId/inactivate').setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<{}>(url.buildUrl(), { organisationUnitId }).pipe(
      take(1),
      map(response => true)
    );

  }

  createOrganisation(body: CreateOrganisationBodyDTO): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1),
      map(response => response)
    );

  }

  createOrganisationUnit(organisationId: string, body: CreateOrganisationUnitBodyDTO): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisations/:organisationId/units').setPathParams({ organisationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1),
      map(response => response)
    );

  }

  createUnitUser(
    organisationUnitId: string,
    userId: string,
    body: {
      role: UserRoleEnum.ACCESSOR | UserRoleEnum.QUALIFYING_ACCESSOR
    }
  ): Observable<void> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('/v1/units/:organisationUnitId/users/:userId').setPathParams({ organisationUnitId, userId });
    return this.http.post<void>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
