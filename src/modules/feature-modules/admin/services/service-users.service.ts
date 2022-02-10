import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@modules/core';


export type getUserMinimalInfoDTO = {
  id: string;
  displayName: string;
};

export type getUserFullInfoDTO = {
  id: string;
  email: string;
  displayName: string;
  type: 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
  lockedAt: null | string;
  userOrganisations: {
    id: string;
    name: string;
    role: 'INNOVATOR_OWNER' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR';
    units: []
  }[]
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
    meta?: { innovations: { id: string, name: string }[] }
  }
};
export type getLockUserRulesOutDTO = {
  key: keyof getLockUserRulesInDTO;
  valid: boolean;
  meta: { [key: string]: any }
};

export type lockUserEndpointDTO = {
  id: string;
  status: string;
};


export enum UserType {
  ACCESSOR = 'ACCESSOR',
  ASSESSMENT = 'ASSESSMENT'
}

export type UserSearchResult = {
  id: string;
  displayName: string;
  type: UserType;
  lockedAt?: Date;
  userOrganisations: {
    id: string;
    name: string;
    role: string;
    units: {
      id: string;
      name: string;
    }[];
  }[];
  serviceRoles?: { [key: string]: any }[];
};

export type searchUserEndpointDTO = {
  id: string;
  displayName: string;
  type: 'INNOVATOR' | 'ACCESSOR' | 'ASSESSMENT' | 'ADMIN',
  email: string;
  lockedAt?: string;
  userOrganisations?: [{
    id: string;
    name: string;
    acronym: string;
    role: string;
    units?: [{
      id: string;
      name: string;
      acronym: string;
    }]
  }]
};

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

  lockUser(userId: string, securityConfirmation: { id: string, code: string }): Observable<lockUserEndpointDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/lock').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<lockUserEndpointDTO>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        id: error.error.id
      }))
    );

  }

  unlockUser(userId: string, securityConfirmation: { id: string, code: string }): Observable<lockUserEndpointDTO> {

    const qp = (securityConfirmation.id && securityConfirmation.code) ? securityConfirmation : {};

    const url = new UrlModel(this.API_URL).addPath('user-admin/users/:userId/unlock').setPathParams({ userId }).setQueryParams(qp);
    return this.http.patch<lockUserEndpointDTO>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        id: error.error.id
      }))
    );

  }

  createUser(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/user');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  searchUser(email: string): Observable<searchUserEndpointDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('/user-admin/users').setQueryParams({ email });
    return this.http.get<searchUserEndpointDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
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
