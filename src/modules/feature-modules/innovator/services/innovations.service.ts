import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';



import { CoreService } from '@app/base';

import { MappedObject, UrlModel } from '@modules/core';


type getInnovationInfoEndpointDTO = {
  id: string;
  name: string;
  company: string;
  description: string;
  countryName: string;
  postcode: string;
  actions: string[]; // actionsCount: number;
  comments: string[]; // commentsCount: number
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

  constructor() { super(); }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoResponse> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        name: response.name,
        company: response.company || '',
        location: `${response.countryName}${response.postcode ? ', ' + response.postcode : ''}`,
        description: response.description,
        openActionsNumber: response.actions?.length || 0,
        openCommentsNumber: response.comments?.length || 0
      }))
    );

  }


  getSectionInfo(innovationId: string, section: string): Observable<MappedObject> {

    // return of({
    //   hasSubgroups: 'yes',
    //   subgroups: [{ id: null, name: 'Item 1', conditions: 'Item 1 conditions' }]
    // });

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId }).setQueryParams({ section });
    return this.http.get<{
      section: string;
      data: MappedObject
    }>(url.buildUrl()).pipe(
      take(1),
      map(response => response.data)
    );
  }

  updateSectionInfo(innovationId: string, section: string, data: MappedObject): Observable<MappedObject> {

    // console.log('UPDATE', data)
    // return of({});

    const body = { section, data: cloneDeep(data) };

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.put<any>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
