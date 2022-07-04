import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { UrlModel } from '@modules/core/models/url.model';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from './authentication.enums';


type getUserInfoInDTO = {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  type: UserTypeEnum;
  roles: UserRoleEnum[];
  organisations: {
    id: string;
    name: string;
    size: null | string;
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
    isShadow: boolean;
    organisationUnits: { id: string; name: string; }[];
  }[];
  passwordResetOn: string;
};
type getUserInfoOutDTO = Required<getUserInfoInDTO>;


export type saveUserInfoDTO = {
  displayName: string;
  mobilePhone?: string;
  organisation?: { id: string; name: string; isShadow: boolean; size: null | string; }
};

export type GetTermsOfUseLastVersionInfoDTO = {
  id: string;
  name: string;
  summary: string;
  releasedAt?: string;
  isAccepted: boolean;
};


@Injectable()
export class AuthenticationService {

  private APP_URL = this.envVariablesStore.APP_URL;
  private API_URL = this.envVariablesStore.API_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  verifyUserSession(): Observable<boolean> {

    const url = new UrlModel(this.APP_URL).addPath('session').buildUrl();
    return this.http.head(url).pipe(
      take(1),
      map(() => true),
      catchError((e) => throwError(e))
    );

  }

  getUserInfo(): Observable<getUserInfoOutDTO> {

    const url = new UrlModel(this.API_URL).addPath('me');
    return this.http.get<getUserInfoInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        email: response.email,
        displayName: ['unknown'].includes(response.displayName) ? '' : response.displayName,
        type: response.type,
        roles: response.roles || [],
        organisations: response.organisations,
        passwordResetOn: response.passwordResetOn,
        phone: response.phone
      }))
    );

  }

  saveUserInfo(body: saveUserInfoDTO): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('me');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  verifyInnovator(): Observable<{ userExists: boolean, hasInvites: boolean }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/check');
    return this.http.get<{ userExists: boolean, hasInvites: boolean }>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
      catchError(() => of({ userExists: false, hasInvites: false }))
    );

  }

  userTermsOfUseInfo(): Observable<null | GetTermsOfUseLastVersionInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('tou/me');
    return this.http.get<GetTermsOfUseLastVersionInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
      catchError(() => of(null))
    );

  }

}
