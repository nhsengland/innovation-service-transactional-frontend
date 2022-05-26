import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { EnvironmentStore } from '@modules/core/stores/environment.store';

import { UrlModel } from '@modules/core/models/url.model';


type getUserInfoInDTO = {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  type: 'ADMIN' | 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
  roles: ('ADMIN' | 'SERVICE_TEAM')[];
  organisations: {
    id: string;
    name: string;
    size: null | string;
    role: 'INNOVATOR_OWNER' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR';
    isShadow: boolean;
    organisationUnits: { id: string; name: string; }[];
  }[];
  passwordResetOn: string;
};
type getUserInfoOutDTO = Required<getUserInfoInDTO>;


type getUserInnovationsDto = {
  id: string;
  name: string;
};

export type saveUserInfoDTO = {
  displayName: string;
  mobilePhone?: string;
  organisation?: { id: string; name: string; isShadow: boolean; size: null | string; }
};

export type userTermsOfUseInfo = {
  id: string,
  name: string,
  summary: string,
  releasedAt?: string,
  isAccepted: string
};
@Injectable()
export class AuthenticationService {

  private APP_URL = this.environmentStore.APP_URL;
  private API_URL = this.environmentStore.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
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

  getInnovations(userId: string): Observable<getUserInnovationsDto[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId });
    return this.http.get<getUserInnovationsDto[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
      catchError(() => of([])) // On error, just return no innovation at all.
    );

  }

  userTermsOfUseInfo(): Observable<any> {

    const url = new UrlModel(this.API_URL).addPath('/tou/me');
    return this.http.get<userTermsOfUseInfo>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
      catchError(() => of([]))
    );
  }

}
