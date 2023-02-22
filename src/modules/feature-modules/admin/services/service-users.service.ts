import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, TermsOfUseTypeEnum, UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType, MappedObjectType } from '@app/base/types';
import { UserSearchDTO } from '@modules/shared/dtos/users.dto';


export type getUserMinimalInfoDTO = {
  id: string;
  displayName: string;
};

export type getUserFullInfoDTO = {
  id: string;
  email: string;
  phone: null | string;
  displayName: string;
  type: UserRoleEnum;
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
    units: { id: string, name: string, acronym: string, supportCount: null | number }[];
  }[];
};

export type changeUserTypeDTO = {
  id: string;
  status: string;
};


export type searchUserEndpointInDTO = {
  id: string;
  email: string;
  displayName: string;
  type: UserRoleEnum,
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


  getUserMinimalInfo(userId: string): Observable<getUserMinimalInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('/v1/:userId').setPathParams({ userId }).setQueryParams({ model: 'minimal' });
    return this.http.get<getUserMinimalInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getUserFullInfo(userId: string): Observable<getUserFullInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('/v1/:userId').setPathParams({ userId }).setQueryParams({ model: 'full' });
    return this.http.get<getUserFullInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  lockUser(userId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: false }).pipe(take(1), map(response => response));

  }

  unlockUser(userId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId').setPathParams({ userId });
    return this.http.patch<{ id: string }>(url.buildUrl(), { accountEnabled: true }).pipe(take(1), map(response => response));

  }


  createUser(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

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

  // The search user isAdmin distinction is because of frontend pages and this should actually either accept a role|role[] or nothing and search for all roles
  // keeping this way not to change current behavior
  searchUser(email: string, isAdmin: boolean): Observable<searchUserEndpointOutDTO[]> {
    const roles = isAdmin ? [UserRoleEnum.ADMIN] : [UserRoleEnum.ACCESSOR, UserRoleEnum.ASSESSMENT, UserRoleEnum.INNOVATOR, UserRoleEnum.QUALIFYING_ACCESSOR]

    // this could probably be a call for a shared getUsersList method
    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ email, userTypes: roles });
    return this.http.get<UserSearchDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({
        id: item.id,
        email: item.email,
        displayName: item.name,
        type: item.roles[0].role, // TODO: this is a hack while we are supporting only one role in the admin
        typeLabel: this.stores.authentication.getRoleDescription(item.roles[0].role),
        ...(item.lockedAt && { lockedAt: item.lockedAt }),
        ...(item.organisations && {
          userOrganisations: item.organisations.map(org => ({
            id: org.id,
            name: org.name,
            acronym: org.acronym,
            role: org.role,
            ...(org.units && {
              units: org.units.map(unit => ({
                id: unit.id,
                name: unit.name,
                acronym: unit.acronym
              }))
            })
          }))
        })
      })))
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


  // Validators.
  userEmailValidator(): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ email: control.value });
      return this.http.head(url.buildUrl()).pipe(
        take(1),
        map(() => ({ customError: true, message: 'Email already exist' })),
        catchError((e) => {
          return e.status === 404 ? of(null) : of({ customError: true, message: 'An error has occurred' });
        })
      );

    };
  }

}
