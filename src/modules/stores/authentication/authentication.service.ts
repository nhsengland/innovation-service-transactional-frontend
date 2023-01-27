import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DateISOType } from '@modules/core/interfaces/base.interfaces';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { UrlModel } from '@modules/core/models/url.model';

import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum, UserTypeEnum } from './authentication.enums';


type GetUserInfoDTO = {
  id: string,
  email: string,
  displayName: string,
  type: UserTypeEnum,
  roles: UserRoleEnum[],    
  contactByPhone: boolean,
  contactByEmail:  boolean,
  contactByPhoneTimeframe: PhoneUserPreferenceEnum,
  phone: string | null,
  contactDetails: string | null,
  termsOfUseAccepted: boolean,
  hasInnovationTransfers: boolean,
  passwordResetAt: null | DateISOType,
  firstTimeSignInAt: null | DateISOType,
  organisations: {
    id: string,
    name: string,
    role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum,
    isShadow: boolean,
    size: null | string,
    organisationUnits: { id: string; name: string; acronym: string; }[]
  }[]
};


export type UpdateUserInfoDTO = {
  displayName: string;
  contactByPhone?: boolean;
  contactByEmail?: boolean;
  contactByPhoneTimeframe?: PhoneUserPreferenceEnum;
  mobilePhone?: string;
  contactDetails?: string;
  organisation?: { id: string, isShadow: boolean, name?: null | string, size?: null | string }
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
  EMAIL = 'EMAIL',
};


export enum PhoneUserPreferenceEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  DAILY = 'DAILY'
};

@Injectable()
export class AuthenticationService {

  private APP_URL = this.envVariablesStore.APP_URL;
  private API_USERS_URL = this.envVariablesStore.API_USERS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  verifyUserSession(): Observable<boolean> {

    const url = new UrlModel(this.APP_URL).addPath('session').buildUrl();
    return this.http.head(url).pipe(take(1), map(() => true));

  }

  getUserInfo(): Observable<GetUserInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
    return this.http.get<GetUserInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        id: response.id,
        email: response.email,
        displayName: ['unknown'].includes(response.displayName) ? '' : response.displayName,
        type: response.type,
        roles: response.roles || [],
        contactByPhone: response.contactByPhone,
        contactByEmail:  response.contactByEmail,
        contactByPhoneTimeframe: response.contactByPhoneTimeframe,
        phone: response.phone,
        contactDetails: response.contactDetails,
        termsOfUseAccepted: response.termsOfUseAccepted,
        hasInnovationTransfers: response.hasInnovationTransfers,
        passwordResetAt: response.passwordResetAt,
        firstTimeSignInAt: response.firstTimeSignInAt,
        organisations: response.organisations
      }))
    );

  }

  updateUserInfo(body: UpdateUserInfoDTO): Observable<{ id: string }> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me');
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

}
