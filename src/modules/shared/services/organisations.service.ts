import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { UserSearchDTO } from '../dtos/users.dto';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { APIQueryParamsType, DateISOType } from '@app/base/types';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type OrganisationsListDTO = {
  id: string,
  name: string,
  acronym: string,
  isActive: boolean,
  organisationUnits: { id: string, name: string, acronym: string, isActive: boolean }[];
};

export type GetOrganisationInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
    isActive: boolean;
    userCount: number;
  }[];
};

export type GetOrganisationUnitInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  userCount: number;
};

export type GetOrganisationUnitUsersDTO = {
  count: number,
  data: {
    id: string,
    isActive: boolean,
    name: string,  
    role: UserRoleEnum
    roleDescription: string,
    lockedAt: DateISOType,  
    organisationUnitUserId: string,
    email?: string,
  }[]
};

export type GetOrganisationUnitUsersRequestDTO = {
  count: number,
  data: {
    id: string,
    isActive: boolean,
    name: string,
    lockedAt: DateISOType,  
    organisationUnitUserId: string,
    email?: string,
    roles: {
      id: string,
      organisationId: string,
      organisationUnitId: string,
      role: UserRoleEnum
    }[]
  }[]
};

export type GetOrganisationUnitInnovationsListDTO = {
  count: number;
  innovationsByStatus: {
    status: InnovationSupportStatusEnum,
    count: number
  }[];
  innovationsList: {
    id: string,
    name: string,
    status: InnovationSupportStatusEnum
  }[];
};

export type UserListFiltersType = {
  onlyActive: boolean,
  email?: boolean,
  organisationUnitId?: string,
};

@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getOrganisationsList(query: { unitsInformation: boolean, withInactive?: boolean }): Observable<OrganisationsListDTO[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations');

    const qp = {
      ...(query.unitsInformation ? { fields: ['organisationUnits'] } : {}),
      ...(query.withInactive ? { withInactive: query.withInactive } : {}),
    };

    url.setQueryParams(qp);

    return this.http.get<OrganisationsListDTO[]>(url.buildUrl()).pipe(take(1),
      map(response => response.map(item => ({
        id: item.id,
        name: item.name,
        acronym: item.acronym,
        isActive: item.isActive,
        organisationUnits: query.unitsInformation ? item.organisationUnits : []
      })))
    );

  }

  // this could probably be a envelop for a shared getUsersList method and moved to the usersService
  getOrganisationUnitUsersList({ queryParams }: { queryParams?: APIQueryParamsType<UserListFiltersType> } = {}): Observable<GetOrganisationUnitUsersDTO> {

    if (!queryParams) {
      queryParams = { take: 100, skip: 0, filters: { email: false, onlyActive: false} };
    }
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR],
      fields: filters.email ? ['email', 'organisations', 'units'] : ['organisations', 'units'],
      onlyActive: filters.onlyActive ?? false,
      ...(filters.organisationUnitId ? { organisationUnitId: filters.organisationUnitId } : {}),
    }

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams(qp);
    return this.http.get<GetOrganisationUnitUsersRequestDTO>(url.buildUrl()).pipe(
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
              organisationUnitUserId: item.organisationUnitUserId,
              role: item.roles[0].role,
              roleDescription: this.stores.authentication.getRoleDescription(item.roles[0].role),
              email: item.email ?? '',
            }
          })
        }
      })
    );
  }

  getOrganisationInfo(organisationId: string, queryParams?: { onlyActiveUsers?: boolean }): Observable<GetOrganisationInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations/:organisationId')
      .setPathParams({ organisationId })
      .setQueryParams({ onlyActiveUsers: queryParams?.onlyActiveUsers })
    return this.http.get<GetOrganisationInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        id: response.id, name: response.name, acronym: response.acronym, isActive: response.isActive,
        organisationUnits: response.organisationUnits.map(item => ({
          id: item.id, name: item.name, acronym: item.acronym, isActive: item.isActive, userCount: item.userCount
        }))
      }))
    );

  }

  getOrganisationUnitInfo(organisationId: string, organisationUnitId: string): Observable<GetOrganisationUnitInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations/:organisationId/units/:organisationUnitId').setPathParams({ organisationId, organisationUnitId });
    return this.http.get<GetOrganisationUnitInfoDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );
  }

  //@deprecated  
  getOrganisationUnitInnovationsList(organisationId: string, organisationUnitId: string, queryParams: APIQueryParamsType<{ onlyOpen: boolean }>): Observable<GetOrganisationUnitInnovationsListDTO> {

    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      onlyOpen: filters.onlyOpen ? 'true' : 'false'
    };

    const url = new UrlModel(this.API_URL).addPath('user-admin/organisations/:organisationId/units/:organisationUnitId/innovations').setPathParams({ organisationId, organisationUnitId }).setQueryParams(qp);
    return this.http.get<GetOrganisationUnitInnovationsListDTO>(url.buildUrl()).pipe(take(1),
      map(response => response)
    );

  }

}
