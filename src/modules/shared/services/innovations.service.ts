import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@app/base/models';


type getInnovationDTO = {
  id: string;
  name: string;
};


@Injectable()
export class InnovationsService extends CoreService {

  constructor() { super(); }

  getInnovationsList(): Observable<getInnovationDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId: this.stores.authentication.getUserId() });
    return this.http.get<getInnovationDTO[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }


}
