import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, take, map, concatMap, throwError } from 'rxjs';

import { EnvironmentVariablesStore } from '@modules/core';

import { UrlModel } from '@app/base/models';
import { PhoneUserPreferenceEnum, UserInfo } from './user.types';
import { HowDidYouFindUsAnswersType } from '@modules/feature-modules/innovator/pages/first-time-signin/first-time-signin.config';

export type MFAInfo = { type: 'none' } | { type: 'email' } | { type: 'phone'; phoneNumber: string | undefined };

export type UpdateUserInfo = {
  displayName: string;
  contactByPhone?: boolean;
  contactByEmail?: boolean;
  contactByPhoneTimeframe?: PhoneUserPreferenceEnum;
  mobilePhone?: string;
  contactDetails?: string;
  organisation?: {
    id: string;
    isShadow: boolean;
    name?: string;
    size?: string;
    description?: string;
    registrationNumber?: string;
  };
  howDidYouFindUsAnswers?: null | HowDidYouFindUsAnswersType;
};

@Injectable()
export class UserContextService {
  private APP_URL = this.envVariablesStore.APP_URL;
  private API_USERS_URL = this.envVariablesStore.API_USERS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  verifyUserSession(): Observable<boolean> {
    const url = new UrlModel(this.APP_URL).addPath('session').buildUrl();
    return this.http.head(url).pipe(
      take(1),
      map(() => true)
    );
  }

  getUserInfo(forceRefresh?: boolean): Observable<UserInfo> {
    const qp = forceRefresh ? { forceRefresh: true } : {};
    const url = new UrlModel(this.API_USERS_URL).addPath(`v1/me`).setQueryParams(qp);
    return this.http.get<UserInfo>(url.buildUrl()).pipe(
      take(1),
      // if for some reason the user is authenticated but v1/me returns 404 and user not found we need to create the user
      // this can happen if user cancels b2c after sign up and then tries to sign in after
      catchError(e => {
        if (e.status === 404 && e.error.error === 'U.0003') {
          const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
          return this.http.post(url.buildUrl(), {}).pipe(concatMap(() => this.http.get<UserInfo>(url.buildUrl())));
        } else {
          return throwError(() => {
            throw e;
          });
        }
      }),
      map(response => ({
        id: response.id,
        email: response.email,
        displayName: ['unknown'].includes(response.displayName) ? '' : response.displayName,
        roles: response.roles ?? [],
        contactByPhone: response.contactByPhone,
        contactByEmail: response.contactByEmail,
        contactByPhoneTimeframe: response.contactByPhoneTimeframe,
        phone: response.phone,
        contactDetails: response.contactDetails,
        termsOfUseAccepted: response.termsOfUseAccepted,
        hasInnovationTransfers: response.hasInnovationTransfers,
        hasInnovationCollaborations: response.hasInnovationCollaborations,
        hasLoginAnnouncements: response.hasLoginAnnouncements,
        passwordResetAt: response.passwordResetAt,
        firstTimeSignInAt: response.firstTimeSignInAt,
        organisations: response.organisations
      }))
    );
  }

  updateUserInfo(body: UpdateUserInfo): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getUserMFAInfo(): Observable<MFAInfo> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/mfa');
    return this.http.get<MFAInfo>(url.buildUrl()).pipe(take(1));
  }

  updateUserMFAInfo(body: MFAInfo): Observable<void> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/mfa');
    return this.http.put<void>(url.buildUrl(), body).pipe(take(1));
  }
}
