import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';
import { MappedObjectType } from '@app/base/types';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type getOrganisationUnitsDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};

export type getOrganisationDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};

export type updateOrganisationDTO = {
  id: string;
  status: string;
  error?: string;
};

export type organisationUsersInDTO = {
  id: string;
  name: string;
  role: 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
};

export type organisationUsersOutDTO = Omit<organisationUsersInDTO, 'role'> & {
  id: string;
  name: string;
  role: 'ACCESSOR' | 'QUALIFYING_ACCESSOR';
  roleDescription: string;
};

@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'ACCESSOR' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisationUnits(): Observable<getOrganisationUnitsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisation-units');
    return this.http.get<getOrganisationUnitsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisation(orgId: string): Observable<getOrganisationDTO> {

    const url = new UrlModel(this.API_URL).addPath('organisations/:orgId').setPathParams({ orgId });
    return this.http.get<getOrganisationDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  updateOrganisation(body: MappedObjectType, securityConfirmation: { id: string, code: string }, orgId: string): Observable<updateOrganisationDTO> {
    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation/:orgId').setPathParams({ orgId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        id: error.error.id
      }))
    );

  }

  updateUnit(body: MappedObjectType, securityConfirmation: { id: string, code: string }, organisationUnitId: string): Observable<updateOrganisationDTO> {
    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation-units/:organisationUnitId').setPathParams({ organisationUnitId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        id: error.error.id
      }))
    );

  }

  getUsersByUnitId(organisationUnitId: string): Observable<organisationUsersOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationUnitId/users').setPathParams({ organisationUnitId });
    return this.http.get<organisationUsersInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(user => ({ ...user, roleDescription: this.stores.authentication.getRoleDescription(user.role) })))
    );

  }
}
