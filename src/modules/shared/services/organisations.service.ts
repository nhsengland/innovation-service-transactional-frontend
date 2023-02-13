import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { UserSearchDTO } from '../dtos/users.dto';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type OrganisationsListDTO = {
  id: string,
  name: string,
  acronym: string,
  organisationUnits: { id: string, name: string, acronym: string }[];
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
  id: string,
  organisationUnitUserId: string,
  name: string,
  email?: string,
  role: UserRoleEnum
  roleDescription: string,
  isActive: boolean,
  lockedAt: string | undefined
}[];

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
        organisationUnits: query.unitsInformation ? item.organisationUnits : []
      })))
    );

  }

  // this could probably be a envelop for a shared getUsersList method and moved to the usersService
  getOrganisationUnitUsersList(organisationUnitId: string, query: { email?: boolean, onlyActive?: boolean } ): Observable<GetOrganisationUnitUsersDTO> {

    const fields = query.email ? ['email', 'organisations', 'units'] : ['organisations', 'units'];
    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ organisationUnitId, fields, userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR], onlyActive: query.onlyActive ?? false });
    return this.http.get<UserSearchDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => {
        // this will probably be easier once we use the roles instead of organisations
        const organisation = item.organisations?.find( o => o.units?.find( u => u.id === organisationUnitId));
        const organisationUnit = organisation?.units?.find( u => u.id === organisationUnitId);
        
        return {
          id: item.id,
          organisationUnitUserId: organisationUnit?.organisationUnitUserId ?? '', // it should never be null or it wouldn't have been returned. This logic to identify the users should probably be revised
          name: item.name,
          email: item.email,
          role: organisation!.role, //should always have a role
          roleDescription: this.stores.authentication.getRoleDescription(organisation!.role),
          isActive: item.isActive,
          lockedAt: item.lockedAt
        };
      }))
    );
  }

  getOrganisationInfo(organisationId: string): Observable<GetOrganisationInfoDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations/:organisationId').setPathParams({ organisationId });
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

}
