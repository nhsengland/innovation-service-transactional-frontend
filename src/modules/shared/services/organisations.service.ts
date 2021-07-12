import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export type getAccessorsOrganisationsDTO = {
  id: string;
  name: string;
};


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisationsDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'accessor' });
    return this.http.get<getAccessorsOrganisationsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
