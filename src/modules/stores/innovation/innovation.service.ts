import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS, InnovationSectionsIds } from './innovation.models';

import { UrlModel } from '@modules/core/models/url.model';


export type getInnovationSectionsDTO = {
  id: string;
  name: string;
  sections: {
    id: null | string;
    section: InnovationSectionsIds;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  }[];
};



@Injectable()
export class InnovationService {

  private API_URL = this.environmentStore.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore,
    private authenticationStore: AuthenticationStore
  ) { }


  getInnovationSections(innovationId: string): Observable<getInnovationSectionsDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/section-summary').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.get<getInnovationSectionsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }




}
