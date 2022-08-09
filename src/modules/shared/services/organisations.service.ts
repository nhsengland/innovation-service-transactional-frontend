import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};

export type getOrganisationUnitsDTO = {
  id: string;
  name: string;
  acronym: string;
  organisationUnits: {
    id: string;
    name: string;
    acronym: string;
  }[];
};


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getOrganisationsListWithUnits(): Observable<getOrganisationUnitsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisation-units');
    return this.http.get<getOrganisationUnitsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'ACCESSOR' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
