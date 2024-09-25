import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, TermsOfUseTypeEnum, UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';
import { UserInfo } from '@modules/shared/dtos/users.dto';

export type changeUserTypeDTO = {
  id: string;
  status: string;
};

export type changeUserRoleDTO = {
  role: {
    name: AccessorOrganisationRoleEnum;
    organisationId: string;
  };
};

export type getListOfTerms = {
  count: number;
  data: {
    id: string;
    name: string;
    touType: string;
    summary: string;
    releasedAt?: string;
    createdAt: string;
  }[];
};

type GetListByIdDTO = {
  id: string;
  touType: TermsOfUseTypeEnum;
  name: string;
  summary: string;
  createdAt: DateISOType;
  releasedAt: null | DateISOType;
};

export type GetInnovationsByInnovatorIdDTO = {
  id: string;
  name: string;
  isOwner: boolean;
}[];

export type AssignedInnovationsList = {
  count: number;
  data: {
    innovation: { id: string; name: string };
    supportedBy: { id: string; name: string; role: UserRoleEnum }[];
    unit: string;
  }[];
};

@Injectable()
export class AdminUsersService extends CoreService {
  constructor() {
    super();
  }

  createUser(body: { [key: string]: any }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  addRoles(
    userId: string,
    body: { role: UserRoleEnum; organisationId?: string; unitIds?: string[] }
  ): Observable<{ id: string }[]> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId/roles').setPathParams({ userId });
    return this.http.post<{ id: string }[]>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  changeUserEmail(userId: string, email: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { email }).pipe(
      take(1),
      map(response => response)
    );
  }

  lockUser(userId: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: false }).pipe(
      take(1),
      map(response => response)
    );
  }

  unlockUser(userId: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: true }).pipe(
      take(1),
      map(response => response)
    );
  }

  deleteUser(userId: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.delete<{ id: string }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  changeUserRole(userId: string, body: changeUserRoleDTO): Observable<changeUserTypeDTO> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<changeUserTypeDTO>(url.buildUrl(), { role: body.role }).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.details.id })))
    );
  }

  updateUserRole(userId: string, roleId: string, enabled?: boolean): Observable<{ roleId: string }> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('/v1/users/:userId/roles/:roleId')
      .setPathParams({ userId, roleId });
    return this.http.patch<{ roleId: string }>(url.buildUrl(), { enabled }).pipe(
      take(1),
      map(response => response)
    );
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
      catchError(error =>
        throwError({
          code: error.error.error
        })
      )
    );
  }

  getTermsById(id: string): Observable<GetListByIdDTO> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/tou/:id').setPathParams({ id });
    return this.http.get<GetListByIdDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
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

  getInnovationsByInnovatorId(userId: string, asCollaborator?: boolean) {
    const qp = {
      ...(asCollaborator ? { asCollaborator } : {})
    };

    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('/v1/users/:userId/innovations')
      .setPathParams({ userId })
      .setQueryParams(qp);
    return this.http.get<GetInnovationsByInnovatorIdDTO>(url.buildUrl()).pipe(take(1));
  }

  transferInnovation(body: {
    innovationId: string;
    email: string;
    ownerToCollaborator: boolean;
  }): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/transfers');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getAssignedInnovations(userId: string): Observable<AssignedInnovationsList> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('/v1/users/:userId/assigned-innovations')
      .setPathParams({ userId });
    return this.http.get<AssignedInnovationsList>(url.buildUrl()).pipe(take(1));
  }
}
