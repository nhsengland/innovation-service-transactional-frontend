import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';


type getInnovationInfoEndpointDTO = {
  id: string;
  name: string;
  company: string;
  description: string;
  countryName: string;
  postcode: string;
  actions: string[];
  comments: string[];
};
export type getInnovationInfoResponse = {
  id: string;
  name: string;
  company: string;
  location: string;
  description: string;
  openActionsNumber: number;
  openCommentsNumber: number;
};


@Injectable()
export class InnovationsService extends CoreService {

  private apiUrl = this.stores.environment.ENV.API_URL;

  constructor() { super(); }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoResponse> {

    const url = new UrlModel(this.apiUrl).setPath('transactional/api/innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.environment.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        name: response.name,
        company: response.company || '',
        location: `${response.countryName}${response.postcode ? ', ' + response.postcode : ''}`,
        description: response.description,
        openActionsNumber: response.actions.length,
        openCommentsNumber: response.comments.length
      }))
    );

  }

}
