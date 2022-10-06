import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';

import { AccessorOrganisationRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


export type GetOrganisationsListDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  organisationUnits: { id: string; name: string; acronym: string; isActive: boolean }[];
};

export type GetOrganisationInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
    isActive: boolean;
    userCount: number;
  }[];
};

export type updateOrganisationDTO = {
  id: string;
  status: string;
  error?: string;
};

export type GetOrganisationUnitInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  userCount: number;
};

export type GetOrganisationUnitUsersInDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    email: string;
    organisationRole: AccessorOrganisationRoleEnum;
    isActive: boolean;
    lockedAt: null | DateISOType;
  }[];
};
export type GetOrganisationUnitUsersOutDTO = {
  count: number;
  data: (GetOrganisationUnitUsersInDTO['data'][0] & { organisationRoleDescription: string })[];
};

export type GetOrganisationUnitInnovationsListDTO = {
  count: number;
  innovationsByStatus: {
    status: InnovationSupportStatusEnum,
    count: number
  }[];
  innovationsList: {
    id: string,
    name: string,
    status: InnovationSupportStatusEnum
  }[];
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



@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getOrganisationsList(filters: { onlyActive: boolean }): Observable<GetOrganisationsListDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations').setQueryParams(filters);
    return this.http.get<GetOrganisationsListDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisationInfo(organisationId: string): Observable<GetOrganisationInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId').setPathParams({ organisationId });
    return this.http.get<GetOrganisationInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        id: response.id, name: response.name, acronym: response.acronym, isActive: response.isActive,
        organisationUnits: response.organisationUnits.map(item => ({
          id: item.id, name: item.name, acronym: item.acronym, isActive: item.isActive, userCount: item.userCount
        }))
      }))
    );

  }

  updateOrganisation(body: MappedObjectType, securityConfirmation: { id: string, code: string }, orgId: string): Observable<updateOrganisationDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation/:orgId').setPathParams({ orgId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }


  getOrganisationUnitInfo(organisationId: string, organisationUnitId: string): Observable<GetOrganisationUnitInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId').setPathParams({ organisationId, organisationUnitId });
    return this.http.get<GetOrganisationUnitInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getOrganisationUnitUsers(organisationId: string, organisationUnitId: string, queryParams: APIQueryParamsType<{ onlyActive: boolean }>): Observable<GetOrganisationUnitUsersOutDTO> {

    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      onlyActive: filters.onlyActive ? 'true' : 'false'
    };

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId/users').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.get<GetOrganisationUnitUsersInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(user => ({ ...user, organisationRoleDescription: this.stores.authentication.getRoleDescription(user.organisationRole) }))
      }))
    );

  }

  getOrganisationUnitInnovationsList(organisationId: string, organisationUnitId: string, queryParams: APIQueryParamsType<{ onlyOpen: boolean }>): Observable<GetOrganisationUnitInnovationsListDTO> {

    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      onlyOpen: filters.onlyOpen ? 'true' : 'false'
    };

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId/innovations').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.get<GetOrganisationUnitInnovationsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  updateUnit(body: MappedObjectType, securityConfirmation: { id: string, code: string }, organisationUnitId: string): Observable<updateOrganisationDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation-units/:organisationUnitId').setPathParams({ organisationUnitId }).setQueryParams(qp);
    return this.http.patch<updateOrganisationDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }

  activateOrganisationUnit(organisationId: string, organisationUnitId: string, userIds: string[]): Observable<boolean> {

    // return of(true);
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId/activate').setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<{}>(url.buildUrl(), { organisationUnitId, userIds }).pipe(
      take(1),
      map(response => true)
    );

  }

  inactivateOrganisationUnit(organisationId: string, organisationUnitId: string): Observable<boolean> {

    // return of(true);
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId/inactivate').setPathParams({ organisationId, organisationUnitId });
    return this.http.patch<{}>(url.buildUrl(), { organisationUnitId }).pipe(
      take(1),
      map(response => true)
    );

  }

  createOrganisation(body: CreateOrganisationBodyDTO): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations');
    return this.http.post<{ id: string }>(url.buildUrl(), { organisation: body }).pipe(take(1),
      map(response => response)
    );

  }

}
