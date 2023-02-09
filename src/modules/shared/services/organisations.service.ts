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
  getOrganisationUnitUsersList(organisationUnitId: string, activeOnly = true): Observable<{ id: string, organisationUnitUserId: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ organisationUnitId, fields: ['organisations', 'units'], userTypes: [UserRoleEnum.ACCESSOR], onlyActive: activeOnly });
    return this.http.get<UserSearchDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => {
        // this will probably be easier once we use the roles instead of organisations
        const organisation = item.organisations?.find( o => o.units?.find( u => u.id === organisationUnitId));
        const organisationUnit = organisation?.units?.find( u => u.id === organisationUnitId);
        
        return {
          id: item.id,
          organisationUnitUserId: organisationUnit?.organisationUnitUserId ?? '', // it should never be null or it wouldn't have been returned. This logic to identify the users should probably be revised
          name: item.name
        };
      }))
    );

  }

}
