import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@modules/core';
import { HttpHeaders } from '@angular/common/http';


export type lockUserEndpointDTO = {
  objectId?: string;
};

export type createUserEndpointDTO = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string // Only for A
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
  lockedAt?: Date,
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

  lockUser(body: { reason: string }, securityConfirmation?: { id: string, code: string }): Observable<lockUserEndpointDTO> {

    let headers = { 'x-2ls-id': '', 'x-2ls-code': '' };

    if (securityConfirmation) {
      headers = { 'x-2ls-id': securityConfirmation.id, 'x-2ls-code': securityConfirmation.code };
    }

    const ro = {
      headers: new HttpHeaders(headers)
    };

    const url = new UrlModel(this.API_URL).addPath('/user-admin/ping').setQueryParams({ code: securityConfirmation?.code, id: securityConfirmation?.id });
    return this.http.post<lockUserEndpointDTO>(url.buildUrl(), {}, ro).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        objectId: error.error.id
      }))
    );

  }

  createUser(body: { [key: string]: any }): Observable<any> {

    const url = new UrlModel(this.API_URL).addPath('user-admin/user').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.post<createUserEndpointDTO>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

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

  searchUser(email: string): Observable<searchUserEndpointDTO[]> {
    const url = new UrlModel(this.API_URL).addPath('/user-admin/users').setQueryParams({ email });

    return this.http.get<searchUserEndpointDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
    );
  }

}
