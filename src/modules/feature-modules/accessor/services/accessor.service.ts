import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';

import { NEEDS_ACCESSMENT_STATES, INNOVATION_STATES } from '@modules/shared';


export type getInnovationsListEndpointDTO = {
  count: number;
  data: {
    id: string;
    status: keyof typeof NEEDS_ACCESSMENT_STATES;
    name: string;
    supportStatus: keyof typeof INNOVATION_STATES;
    createdAt: string; // "2021-04-16T09:23:49.396Z",
    updatedAt: string; // "2021-04-16T09:23:49.396Z"
  }[];
};


@Injectable()
export class AccessorService extends CoreService {

  constructor() { super(); }

  getInnovationsList(queryParams: { take: number, skip: number }): Observable<getInnovationsListEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('/accessors/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(queryParams);
    return this.http.get<getInnovationsListEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
