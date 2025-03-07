import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { InnovationSupportStatusEnum } from '@modules/stores';

export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type OrganisationsListDTO = {
  id: string;
  name: string;
  acronym: string;
  isActive: boolean;
  organisationUnits: { id: string; name: string; acronym: string; isActive: boolean }[];
};

export type GetOrganisationInfoDTO = {
  id: string;
  name: string;
  acronym: string;
  website: string | null;
  summary: string | null;
  isActive: boolean;
  organisationUnits?: {
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
  canActivate: boolean;
};

export type GetOrganisationUnitInnovationsListDTO = {
  count: number;
  innovationsByStatus: {
    status: InnovationSupportStatusEnum;
    count: number;
  }[];
  innovationsList: {
    id: string;
    name: string;
    status: InnovationSupportStatusEnum;
  }[];
};

@Injectable()
export class OrganisationsService extends CoreService {
  constructor() {
    super();
  }

  getOrganisationsList(query: {
    unitsInformation: boolean;
    withInactive?: boolean;
  }): Observable<OrganisationsListDTO[]> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/organisations');

    const qp = {
      ...(query.unitsInformation ? { fields: ['organisationUnits'] } : {}),
      ...(query.withInactive ? { withInactive: query.withInactive } : {})
    };

    url.setQueryParams(qp);

    return this.http.get<OrganisationsListDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response =>
        response.map(item => ({
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          isActive: item.isActive,
          organisationUnits: query.unitsInformation ? item.organisationUnits : []
        }))
      )
    );
  }

  getOrganisationInfo(
    organisationId: string,
    queryParams?: { onlyActiveUsers?: boolean }
  ): Observable<GetOrganisationInfoDTO> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/organisations/:organisationId')
      .setPathParams({ organisationId })
      .setQueryParams({ onlyActiveUsers: queryParams?.onlyActiveUsers });
    return this.http.get<GetOrganisationInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        name: response.name,
        acronym: response.acronym,
        website: response.website,
        summary: response.summary,
        isActive: response.isActive,
        organisationUnits: response.organisationUnits?.map(item => ({
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          isActive: item.isActive,
          userCount: item.userCount
        }))
      }))
    );
  }

  getOrganisationUnitInfo(organisationId: string, organisationUnitId: string): Observable<GetOrganisationUnitInfoDTO> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/organisations/:organisationId/units/:organisationUnitId')
      .setPathParams({ organisationId, organisationUnitId });
    return this.http.get<GetOrganisationUnitInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }
}
