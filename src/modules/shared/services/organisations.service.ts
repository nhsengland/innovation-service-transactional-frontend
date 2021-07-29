import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type getAccessorsOrganisationUnitsDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};


export type getOrganisationUnitsSupportStatusDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
    status: keyof typeof INNOVATION_SUPPORT_STATUS;
  }[];
};


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'ACCESSOR' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getOrganisationUnits(): Observable<getAccessorsOrganisationUnitsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisation-units');
    console.log(url);
    return this.http.get<getAccessorsOrganisationUnitsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        console.log('UNITS', response)
        return response;
      })
    );

  }

  getOrganisationUnitsSupportStatus(innovationId: string): Observable<getOrganisationUnitsSupportStatusDTO[]> {

    return of([
      {
        id: 'Org01', name: 'The Academic HEalthd coiso', acronym: 'sdfa',
        organisationUnits: [
          { id: '152D89C7-5DC8-EB11-A7AD-281878026472', name: 'East Midlands', acronym: 'sdfa', status: 'FURTHER_INFO_REQUIRED' },
          { id: 'unit02', name: 'Eastern', acronym: 'sdfa', status: 'FURTHER_INFO_REQUIRED' }
        ]
      },
      {
        id: 'Org02', name: 'Department for TRade', acronym: 'sdfa',
        organisationUnits: [{ id: 'unit03', name: 'This should appear as  department for trade', acronym: 'sdfa', status: 'FURTHER_INFO_REQUIRED' }]
      }
    ]);

    // const url = new UrlModel(this.API_URL).addPath('accessors/:userId/innovations/:innovationId/supports').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    // return this.http.get<getOrganisationUnitsSupportStatusDTO[]>(url.buildUrl()).pipe(
    //   take(1),
    //   map(response => {
    //     return response;
    //   })
    // );

  }

}
