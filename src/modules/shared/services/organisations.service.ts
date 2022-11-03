import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserTypeEnum } from '@app/base/enums';
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

  getOrganisationsList(unitsInformation: boolean): Observable<OrganisationsListDTO[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations');

    if (unitsInformation) {
      url.setQueryParams({ fields: ['organisationUnits'] });
    }

    return this.http.get<OrganisationsListDTO[]>(url.buildUrl()).pipe(take(1),
      map(response => response.map(item => ({
        id: item.id,
        name: item.name,
        acronym: item.acronym,
        organisationUnits: unitsInformation ? item.organisationUnits : []
      })))
    );

  }

  getOrganisationUnitUsersList(organisationUnitId: string): Observable<{ id: string, organisationUnitUserId: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ organisationUnitId, fields: ['organisations', 'units'], userTypes: [UserTypeEnum.ACCESSOR] });
    return this.http.get<{
      id: string,
      name: string,
      type: UserTypeEnum,
      isActive: boolean,
      organisations: {
        name: string;
        role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
        units: { name: string, organisationUnitUserId: string }[]
      }[]
    }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({
        id: item.id,
        organisationUnitUserId: item.organisations[0].units[0].organisationUnitUserId,
        name: item.name
      })))
    );

  }

}
