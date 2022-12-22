import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, TermsOfUseTypeEnum, UserTypeEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';


export type getUserMinimalInfoDTO = {
  id: string;
  displayName: string;
};

export type getUserFullInfoDTO = {
  id: string;
  email: string;
  phone: null | string;
  displayName: string;
  type: UserTypeEnum;
  lockedAt: null | string;
  innovations: {
    id: string;
    name: string;
  }[];
  userOrganisations: {
    id: string;
    name: string;
    size: null | string;
    role: AccessorOrganisationRoleEnum | InnovatorOrganisationRoleEnum;
    isShadow: boolean;
    units: { id: string, name: string, acronym: string, supportCount: null | string }[];
  }[];
};


export type getLockUserRulesInDTO = {
  lastAssessmentUserOnPlatform: { valid: boolean, meta?: {} },
  lastAccessorUserOnOrganisation: {
    valid: boolean,
    meta?: { organisation: { id: string, name: string } }
  },
  lastAccessorUserOnOrganisationUnit: {
    valid: boolean,
    meta?: { unit: { id: string, name: string } }
  },
  lastAccessorFromUnitProvidingSupport: {
    valid: boolean,
    meta?: {
      supports: {
        count: number;
        innovations: { innovationId: string, innovationName: string; unitId: string; unitName: string }[]
      }
    }
  }
};
export type getLockUserRulesOutDTO = {
  key: keyof getLockUserRulesInDTO;
  valid: boolean;
  meta: { [key: string]: any }
};

export type getOrganisationRoleRulesOutDTO = {
  key: keyof getOrgnisationRoleRulesInDTO;
  valid: boolean;
  meta: { [key: string]: any }
};

export type getOrgnisationRoleRulesInDTO = {
  lastAccessorUserOnOrganisationUnit: {
    valid: boolean,
    meta?: {
      supports: {
        count: number;
        innovations: { innovationId: string, innovationName: string; unitId: string; unitName: string }[]
      }
    }
  }
};

export type getOrganisationUnitRulesInDTO = {
  lastAccessorUserOnOrganisation: {
    valid: boolean,
    meta?: { organisation: { id: string, name: string } }
  },
  lastAccessorFromUnitProvidingSupport: {
    valid: boolean,
    meta?: {
      supports: {
        count: number;
        innovations: { innovationId: string, innovationName: string; unitId: string; unitName: string }[]
      }
    }
  }
  lastAccessorUserOnOrganisationUnit: {
    valid: boolean,
    meta?: { unit: { id: string, name: string } }
  },
};

export type getOrganisationUnitRulesOutDTO = {

  key: keyof getOrganisationUnitRulesInDTO;
  valid: boolean;
  meta?: { [key: string]: any }
};

export type changeUserTypeDTO = {
  id: string;
  status: string;
};

export type AdminUserUpdateEndpointDTO = {
  id: string;
};

export type searchUserEndpointInDTO = {
  id: string;
  email: string;
  displayName: string;
  type: UserTypeEnum,
  lockedAt?: string;
  userOrganisations?: {
    id: string;
    name: string;
    acronym: string;
    role: string;
    units?: { id: string, name: string, acronym: string }[]
  }[]
};
export type searchUserEndpointOutDTO = searchUserEndpointInDTO & { typeLabel: string };

export type changeUserRoleDTO = {
  userId: string,
  role: null | InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
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


  getUserMinimalInfo(userId: string): Observable<getUserMinimalInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('/user-admin/users/:userId').setPathParams({ userId }).setQueryParams({ model: 'minimal' });
    return this.http.get<getUserMinimalInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getUserFullInfo(userId: string): Observable<getUserFullInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('/user-admin/users/:userId').setPathParams({ userId }).setQueryParams({ model: 'full' });
    return this.http.get<getUserFullInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  getLockUserRules(userId: string): Observable<getLockUserRulesOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/lock').setPathParams({ userId });
    return this.http.get<getLockUserRulesInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => Object.entries(response).map(([key, item]) => ({
        key: key as keyof getLockUserRulesInDTO,
        valid: item.valid,
        meta: item.meta || {}
      }))
      )
    );

  }

  lockUser(userId: string, securityConfirmation: { id: string, code: string }): Observable<AdminUserUpdateEndpointDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<AdminUserUpdateEndpointDTO>(url.buildUrl(), {accountEnabled: false}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.details?.id })))
    );

  }

  unlockUser(userId: string, securityConfirmation: { id: string, code: string }): Observable<AdminUserUpdateEndpointDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<AdminUserUpdateEndpointDTO>(url.buildUrl(), {accountEnabled: true}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error?.details?.id })))
    );

  }

  createUser(body: { [key: string]: any }, securityConfirmation: { id: string, code: string }): Observable<{ id: string }> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/user').setQueryParams(qp);
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }

  deleteAdminAccount(userId: string, securityConfirmation: { id: string, code: string }): Observable<{ id: string }> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/:userId/delete').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<{ id: string }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }

  searchUser(email: string, isAdmin: boolean): Observable<searchUserEndpointOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('/user-admin/users').setQueryParams({ email, isAdmin });
    return this.http.get<searchUserEndpointInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({ ...item, typeLabel: this.stores.authentication.getRoleDescription(item.type) })))
    );

  }

  getUserRoleRules(userId: string): Observable<getOrganisationRoleRulesOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/change-role').setPathParams({ userId });
    return this.http.get<getOrgnisationRoleRulesInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => Object.entries(response).map(([key, item]) => ({
        key: key as keyof getOrgnisationRoleRulesInDTO,
        valid: item.valid,
        meta: item.meta || {}
      }))
      )
    );

  }

  changeUserRole(body: changeUserRoleDTO): Observable<changeUserTypeDTO> {

    const qp = (body.securityConfirmation.id && body.securityConfirmation.code) ? body.securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/change-role').setPathParams({ userId: body.userId }).setQueryParams(qp);
    return this.http.patch<changeUserTypeDTO>(url.buildUrl(), { role: body.role }).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }


  changeOrganisationUserUnit(body: MappedObjectType, securityConfirmation: { id: string, code: string }, userId: string): Observable<any> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/change-unit').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<any>(url.buildUrl(), { newOrganisationUnitAcronym: body.organisationUnitAcronym, organisationId: body.organisationId }).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError(() => ({ id: error.error.id })))
    );

  }

  getOrgnisationUnitRules(userId: string): Observable<getOrganisationUnitRulesOutDTO[]> {
    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/change-unit').setPathParams({ userId });
    return this.http.get<getOrganisationUnitRulesInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => Object.entries(response).map(([key, item]) => ({
        key: key as keyof getOrganisationUnitRulesInDTO,
        valid: item.valid,
        meta: item.meta || {}
      }))
      )
    );
  }

  getListOfTerms(queryParams: APIQueryParamsType): Observable<getListOfTerms> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/tou').setQueryParams({ ...queryParams });

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

    const url = new UrlModel(this.API_URL).addPath('user-admin/tou');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        code: error.error.error
      }))
    );

  }

  getTermsById(id: string): Observable<GetListByIdDTO> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/tou/:id').setPathParams({ id });
    return this.http.get<GetListByIdDTO>(url.buildUrl()).pipe(take(1), map(response => response));
  }

  updateTermsById(id: string, data: MappedObjectType): Observable<any> {
    const body = Object.assign({}, data);

    const url = new UrlModel(this.API_URL).addPath('user-admin/tou/:id').setPathParams({ id });
    return this.http.put<any>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }


  // Validators.
  userEmailValidator(): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      const url = new UrlModel(this.API_URL).addPath('user-admin/users').setQueryParams({ email: control.value });
      return this.http.head(url.buildUrl()).pipe(
        take(1),
        map(() => ({ customError: true, message: 'Email already exist' })),
        catchError(() => of(null))
      );

    };
  }

}
