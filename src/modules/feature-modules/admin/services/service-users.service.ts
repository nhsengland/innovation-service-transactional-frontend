import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, TermsOfUseTypeEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';
import { UserInfo } from '@modules/shared/dtos/users.dto';


export type changeUserTypeDTO = {
  id: string;
  status: string;
};


export type changeUserRoleDTO = {
  role: {
    name: AccessorOrganisationRoleEnum, // this used to have InnovatorOrganisationRoleEnum but I don't think it is used
    organisationId: string,
  },
  securityConfirmation: {
    id: string,
    code: string
  }
};

export type getListOfTerms = {
  count: number,
  data: {
    id: string,
    name: string,
    touType: string,
    summary: string,
    releasedAt?: string,
    createdAt: string
  }[]
};

type GetListByIdDTO = {
  id: string,
  touType: TermsOfUseTypeEnum,
  name: string,
  summary: string,
  createdAt: DateISOType,
  releasedAt: null | DateISOType
}

@Injectable()
export class ServiceUsersService extends CoreService {

  constructor() { super(); }


  lockUser(userId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: false }).pipe(take(1), map(response => response));

  }

  unlockUser(userId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: true }).pipe(take(1), map(response => response));

  }


  deleteAdminAccount(userId: string, securityConfirmation: { id: string, code: string }): Observable<{ id: string }> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId/delete').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<{ id: string }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.details.id })))
    );

  }

  changeUserRole(userId: string, body: changeUserRoleDTO): Observable<changeUserTypeDTO> {

    const qp = (body.securityConfirmation.id && body.securityConfirmation.code) ? body.securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<changeUserTypeDTO>(url.buildUrl(), { role: body.role }).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.details.id })))
    );

  }


  changeOrganisationUserUnit(body: MappedObjectType, securityConfirmation: { id: string, code: string }, userId: string): Observable<any> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/change-unit').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<any>(url.buildUrl(), { newOrganisationUnitAcronym: body.organisationUnitAcronym, organisationId: body.organisationId }).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.id })))  // Note this will need to be changed when the backend API is updated to error.error?.details?.id
    );

  }

  updateUserRole(userId: string, roleId: string, enabled?: boolean): Observable<{ roleId: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('/v1/users/:userId/roles/:roleId').setPathParams({ userId, roleId });
    return this.http.patch<{ roleId: string }>(url.buildUrl(), { enabled }).pipe(take(1), map(response => response));

  }

  getListOfTerms(queryParams: APIQueryParamsType): Observable<getListOfTerms> {
    const { filters, ...qp } = queryParams;

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/tou').setQueryParams(qp);

    return this.http.get<getListOfTerms>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(items => ({
          id: items.id,
          name: items.name,
          summary: items.summary,
          touType: items.touType,
          releasedAt: items.releasedAt,
          createdAt: items.createdAt
        }))
      }))
    );
  }

  createVersion(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/tou');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        code: error.error.error
      }))
    );

  }

  getTermsById(id: string): Observable<GetListByIdDTO> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/tou/:id').setPathParams({ id });
    return this.http.get<GetListByIdDTO>(url.buildUrl()).pipe(take(1), map(response => response));
  }

  updateTermsById(id: string, data: MappedObjectType): Observable<any> {
    const body = Object.assign({}, data);

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/tou/:id').setPathParams({ id });
    return this.http.put<any>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  /**
   * Get's the information of a user through is email or id
   * @param idOrEmail user id or email
  */
  getUserInfo(idOrEmail: string): Observable<UserInfo> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath(`v1/users/${idOrEmail}`);
    return this.http.get<UserInfo>(url.buildUrl()).pipe(take(1));

  }
}
