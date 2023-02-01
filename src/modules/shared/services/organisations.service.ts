import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';


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

  getOrganisationUnitUsersList(organisationUnitId: string, activeOnly = true): Observable<{ id: string, organisationUnitUserId: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ organisationUnitId, fields: ['organisations', 'units'], userTypes: [UserRoleEnum.ACCESSOR] });
    return this.http.get<{
      id: string,
      name: string,
      type: UserRoleEnum,
      isActive: boolean,
      organisations: {
        name: string;
        role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
        units: { name: string, organisationUnitUserId: string }[]
      }[]
    }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.filter(r => !activeOnly || r.isActive )
        .map(item => ({
          id: item.id,
          organisationUnitUserId: item.organisations[0].units[0].organisationUnitUserId,
          name: item.name
        })))
    );

  }

}
