import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { INNOVATION_SECTION_STATUS, INNOVATION_SECTION_ACTION_STATUS, InnovationSectionsIds, getInnovationInfoResponse, getInnovationInfoEndpointDTO, getInnovationSectionsDTO, sectionType } from './innovation.models';

import { UrlModel } from '@modules/core/models/url.model';
import { MappedObject } from '@modules/core/interfaces/base.interfaces';





@Injectable()
export class InnovationService {

  private API_URL = this.environmentStore.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore,
    private authenticationStore: AuthenticationStore
  ) { }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoResponse> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
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


  getInnovationSections(innovationId: string): Observable<getInnovationSectionsDTO> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/section-summary').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.get<getInnovationSectionsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getSectionInfo(innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObject }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId }).setQueryParams({ section });
    return this.http.get<{
      section: sectionType;
      data: MappedObject
    }>(url.buildUrl()).pipe(
      take(1),
      map(response => response


        //   ({
        //   section: {
        //     id: null, // response.section.id,
        //     section: 'INNOVATION_DESCRIPTION', // response.section.section,
        //     status: 'NOT_STARTED', // response.section.status,
        //     actionStatus: '', // response.section.actionStatus,
        //     updatedAt: '', // response.section.updateAt,
        //   },
        //   data: response.data
        // })
      )
    );
  }

  updateSectionInfo(innovationId: string, section: string, isSubmission: boolean, data: MappedObject): Observable<MappedObject> {

    const body = {
      section,
      isSubmission,
      data: cloneDeep(data)
    };

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.put<any>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
