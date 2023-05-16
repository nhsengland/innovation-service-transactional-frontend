import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { GetUsersRequestDTO, UserSearchDTO, UsersListDTO } from '../dtos/users.dto';
import { APIQueryParamsType } from '@app/base/types';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

export type UserListFiltersType = {
  onlyActive: boolean,
  userTypes: UserRoleEnum[]
  email?: boolean,
  organisationUnitId?: string,
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

@Injectable()
export class UsersService extends CoreService {

  constructor() { super(); }

  getUsersList({ queryParams }: { queryParams?: APIQueryParamsType<UserListFiltersType> } = {}): Observable<UsersListDTO> {
    if (!queryParams) {
      queryParams = { take: 100, skip: 0, filters: { email: false, onlyActive: true, userTypes: [UserRoleEnum.ASSESSMENT]} };
    }
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      userTypes: filters.userTypes,
      fields: filters.email ? ['email'] : [],
      onlyActive: filters.onlyActive ?? false,
      ...(filters.organisationUnitId ? { organisationUnitId: filters.organisationUnitId } : {}),
    }

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams(qp);
    return this.http.get<GetUsersRequestDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        return {
          count: response.count,
          data: response.data.map((item) => {
            return {
              id: item.id,
              isActive: item.isActive,
              name: item.name,
              lockedAt: item.lockedAt,
              role: item.roles[0].role,
              roleDescription: this.stores.authentication.getRoleDescription(item.roles[0].role),
              email: item.email ?? '',
              organisationUnitUserId: item.organisationUnitUserId ?? '',
            }
          })
        }
      })
    );
  }

  searchUser(email: string): Observable<searchUserEndpointOutDTO[]> {
    const roles =  [UserRoleEnum.ADMIN, UserRoleEnum.ACCESSOR, UserRoleEnum.ASSESSMENT, UserRoleEnum.INNOVATOR, UserRoleEnum.QUALIFYING_ACCESSOR]

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

  getUserFullInfo(userId: string): Observable<getUserFullInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('/v1/:userId').setPathParams({ userId }).setQueryParams({ model: 'full' });
    return this.http.get<getUserFullInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));

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
