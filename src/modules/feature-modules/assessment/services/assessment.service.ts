import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


export type getInnovationsListEndpointDTO = {
  count: number;
  data: {
    id: string;
    name: string;
    countryName: string;
    postCode: string;
    mainCategory: string;
    submittedAt: string; // "2021-04-16T09:23:49.396Z",
    assessment: {
      createdAt: string; // "2021-04-16T09:23:49.396Z",
      assignTo: { name: string };
      finishedAt: string; // "2021-04-16T09:23:49.396Z",
    },
    organisations: string[];
  }[];
};


@Injectable()
export class AssessmentService extends CoreService {

  constructor() { super(); }

  getInnovationsList(queryParams: { filters?: { status: string[] }, take: number, skip: number }): Observable<getInnovationsListEndpointDTO> {

    const qp = { take: queryParams.take, skip: queryParams.skip, status: queryParams.filters?.status || [] };

    const url = new UrlModel(this.API_URL).addPath('/assessments/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() }).setQueryParams(qp);
    return this.http.get<getInnovationsListEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
