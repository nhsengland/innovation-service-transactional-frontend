import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';

import { DateISOType } from '@modules/core/interfaces/base.interfaces';
import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { HowDidYouFindUsAnswersType } from '@modules/feature-modules/innovator/pages/first-time-signin/first-time-signin.config';
import { UserRoleType } from '@modules/shared/dtos/roles.dto';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from './authentication.enums';

type GetUserInfoDTO = {
  id: string;
  email: string;
  displayName: string;
  roles: UserRoleType[];
  contactByPhone: boolean;
  contactByEmail: boolean;
  contactByPhoneTimeframe: PhoneUserPreferenceEnum | null;
  phone: string | null;
  contactDetails: string | null;
  termsOfUseAccepted: boolean;
  hasInnovationTransfers: boolean;
  hasInnovationCollaborations: boolean;
  hasLoginAnnouncements: { [k: string]: boolean };
  passwordResetAt: null | DateISOType;
  firstTimeSignInAt: null | DateISOType;
  organisations: {
    id: string;
    name: string;
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
    acronym: string;
    isShadow: boolean;
    size: null | string;
    registrationNumber: null | string;
    description: null | string;
    organisationUnits: { id: string; name: string; acronym: string }[];
  }[];
};

export type MFAInfoDTO = { type: 'none' } | { type: 'email' } | { type: 'phone'; phoneNumber: string | undefined };

export type UpdateUserInfoDTO = {
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

export type GetTermsOfUseLastVersionInfoDTO = {
  id: string;
  name: string;
  summary: string;
  releasedAt?: string;
  isAccepted: boolean;
};

export enum ContactUserPreferenceEnum {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
}

export enum PhoneUserPreferenceEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  DAILY = 'DAILY'
}

@Injectable()
export class AuthenticationService {
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

  getUserMFAInfo(): Observable<MFAInfoDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/mfa');
    return this.http.get<MFAInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getUserInfo(forceRefresh?: boolean): Observable<GetUserInfoDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath(`v1/me${forceRefresh ? '?forceRefresh=true' : ''}`);
    return this.http.get<GetUserInfoDTO>(url.buildUrl()).pipe(
      take(1),
      // if for some reason the user is authenticated but v1/me returns 404 and user not found we need to create the user
      // this can happen if user cancels b2c after sign up and then tries to sign in after
      catchError(e => {
        if (e.status === 404 && e.error.error === 'U.0003') {
          const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
          return this.http
            .post(url.buildUrl(), {})
            .pipe(concatMap(() => this.http.get<GetUserInfoDTO>(url.buildUrl())));
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
        roles: response.roles || [],
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

  updateUserInfo(body: UpdateUserInfoDTO): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  updateUserMFAInfo(body: MFAInfoDTO): Observable<void> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/mfa');
    return this.http.put<void>(url.buildUrl(), body).pipe(take(1));
  }
}
