import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';

import { AccessorOrganisationRoleEnum } from '@modules/stores/authentication/authentication.enums';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


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
    usersNumber: number;
  }[];
};

export type GetOrganisationUnitInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  userCount: number;
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

export type updateOrganisationDTO = {
  id: string;
  status: string;
  error?: string;
};

export type GetOrganisationUnitUsersInDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    email: string;
    role: AccessorOrganisationRoleEnum;
    isActive: boolean;
    lockedAt: DateISOType;
  }[];
};
export type GetOrganisationUnitUsersOutDTO = {
  count: number;
  data: (GetOrganisationUnitUsersInDTO['data'][0] & { roleDescription: string })[];
};

export type organisationUsersInDTO = {
  id: string;
  name: string;
  role: AccessorOrganisationRoleEnum;
};
export type organisationUsersOutDTO = organisationUsersInDTO & { roleDescription: string };


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getOrganisationsListWithUnits(): Observable<getOrganisationUnitsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisation-units');
    return this.http.get<getOrganisationUnitsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getOrganisationInfo(organisationId: string): Observable<GetOrganisationInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationId').setPathParams({ organisationId });
    return this.http.get<GetOrganisationInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        id: response.id, name: response.name, acronym: response.acronym, isActive: true,
        organisationUnits: response.organisationUnits.map(item => ({
          id: item.id, name: item.name, acronym: item.acronym, isActive: true, usersNumber: 10
        }))
      }))
    );

  }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'ACCESSOR' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
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


  getOrganisationUnitInfo(organisationId: string, organisationUnitId: string): Observable<GetOrganisationUnitInfoDTO> {

    return of({ id: 'Unit01', name: 'Unit name', acronym: 'AAC', isActive: true, userCount: 10 });

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationId/units/:organisationUnitId').setPathParams({ organisationId, organisationUnitId });
    return this.http.get<GetOrganisationUnitInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }


  getOrganisationUnitInnovationsList(organisationId: string, organisationUnitId: string, queryParams: APIQueryParamsType<{}>): Observable<GetOrganisationUnitInnovationsListDTO> {

    return of({
      count: 24,
      innovationsByStatus: [
        { status: InnovationSupportStatusEnum.ENGAGING, count: 20 },
        { status: InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED, count: 40 }
      ],
      innovationsList: [
        { id: 'Inno01', name: 'Innovation 01', status: InnovationSupportStatusEnum.ENGAGING },
        { id: 'Inno02', name: 'Innovation 02', status: InnovationSupportStatusEnum.COMPLETE }
      ]
    });


    const { filters, ...qParams } = queryParams;
    const qp = { ...qParams };

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationId/units/:organisationUnitId').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.get<GetOrganisationUnitInnovationsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

  getOrganisationUnitUsers(organisationId: string, organisationUnitId: string, queryParams: APIQueryParamsType<{}>): Observable<GetOrganisationUnitUsersOutDTO> {

    return of({
      count: 50,
      data: [
        {
          id: 'Id01', name: 'User name 01', email: 'user01@email.com',
          role: AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR, roleDescription: this.stores.authentication.getRoleDescription(AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR),
          isActive: true, lockedAt: '2020-01-01T00:00:00.000Z'
        },
        {
          id: 'Id02', name: 'User name 02', email: 'user02@email.com',
          role: AccessorOrganisationRoleEnum.ACCESSOR, roleDescription: this.stores.authentication.getRoleDescription(AccessorOrganisationRoleEnum.ACCESSOR),
          isActive: true, lockedAt: '2020-01-01T00:00:00.000Z'
        }
      ]
    });

    const { filters, ...qParams } = queryParams;
    const qp = { ...qParams };

    const url = new UrlModel(this.API_URL).addPath('organisations/:organisationId/units/:organisationUnitId/users').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.get<GetOrganisationUnitUsersInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(user => ({ ...user, roleDescription: this.stores.authentication.getRoleDescription(user.role) }))
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

  inactivateOrganisationUnit(organisationUnitId: string): Observable<boolean> {

    return of(true);
    // return throwError('error');

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisation-units');
    return this.http.patch<{}>(url.buildUrl(), { organisationUnitIds: [organisationUnitId] }).pipe(
      take(1),
      map(response => true)
    );

  }

}
