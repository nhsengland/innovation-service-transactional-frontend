import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export type getAccessorsOrganisations = {
  id: string;
  name: string;
};


@Injectable()
export class OrganisationsService extends CoreService {

  constructor() { super(); }

  getAccessorsOrganisations(): Observable<getAccessorsOrganisations[]> {

    // return of([
    //   { id: '1', name: 'Empr1' },
    //   { id: '3', name: 'Empr2' }
    // ]);

    const url = new UrlModel(this.API_URL).addPath('organisations').setQueryParams({ type: 'accessor' });
    return this.http.get<getAccessorsOrganisations[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
