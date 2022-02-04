import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@modules/core';
import { HttpHeaders } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';


export type lockUserEndpointDTO = {
  objectId?: string;
};

export type createUserEndpointDTO = {
  email: string,
  name: string,
  type: null | 'ASSESSMENT' | 'ACCESSOR' | 'QUALIFYING_ACCESSOR',
  organisationAcronym?: null | string, // Only for QA, A
  role?: null | 'QUALIFYING_ACCESSOR' | 'ACCESSOR', // Only for QA, A
  organisationUnitAcronym?: null | string, // Only for A
}

export enum UserType {
  ACCESSOR = "ACCESSOR",
  ASSESSMENT = "ASSESSMENT",
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

    const url = new UrlModel(this.API_URL).addPath('/user-admin/ping').setQueryParams({code: securityConfirmation?.code, id: securityConfirmation?.id});
    return this.http.post<lockUserEndpointDTO>(url.buildUrl(), { }, ro).pipe(
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
      map(response => response),
      catchError(error => throwError({
        objectId: error.error.id
      }))
    );
  }

  searchUserByEmail(email: string): Observable<any> {
    const url = new UrlModel(this.API_URL).addPath('user-admin/users').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams({ email });

    return timer(1000)
    .pipe(
      switchMap(() => {
        // Check if email is available
        return  this.http.get<UserSearchResult>(url.buildUrl()).pipe(  
          take(1),
          map(response => response),
          catchError(error => throwError({
            objectId: error.error.id
          }))
        );
      })
    );
   
  }

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      return this.searchUserByEmail(control.value).pipe(
        map(res => (res) ? { 'emailExists': true} : null)
      )      
    };
  }
}
