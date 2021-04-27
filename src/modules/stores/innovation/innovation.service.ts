import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { EnvironmentStore } from '@modules/core/stores/environment.store';

import { INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS, InnovationSectionsIds } from './innovation.models';

import { UrlModel } from '@modules/core/models/url.model';


export type getInnovationSectionsDTO = {

  sections: {
    code: InnovationSectionsIds;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    actionStatus: keyof typeof INNOVATION_SECTION_ACTION_STATUS;
  }[];
};



@Injectable()
export class InnovationService {

  private API_URL = this.environmentStore.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  getInnovationSections(innovationId: string): Observable<getInnovationSectionsDTO['sections']> {

    return of(
      [
        { code: InnovationSectionsIds.descritionOfInnovation, status: 'DRAFT', actionStatus: 'REQUESTED' },
        { code: InnovationSectionsIds.valueProposition, status: 'NOT_STARTED', actionStatus: 'IN_REVIEW' },
        { code: InnovationSectionsIds.understandingOfNeeds, status: 'SUBMITTED', actionStatus: '' },
        { code: InnovationSectionsIds.understandingOfBenefits, status: 'UNKNOWN', actionStatus: '' },
        { code: InnovationSectionsIds.evidenceDocuments, status: 'SUBMITTED', actionStatus: '' }
      ]
    );

    // const url = new UrlModel(this.API_URL).addPath('innovations/:innovationId/section-summary').setPathParams({ innovationId });
    // return this.http.get<getInnovationSectionsDTO[]>(url.buildUrl()).pipe(
    //   take(1),
    //   map(response => response)
    // );


  }




}
