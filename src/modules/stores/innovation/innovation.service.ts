import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { EnvironmentStore } from '@modules/core/stores/environment.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { getInnovationSectionsDTO, sectionType, getInnovationEvidenceDTO, INNOVATION_STATUS } from './innovation.models';

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


  // getInnovationInfo(innovationId: string): Observable<getInnovationInfoResponse> {

  //   const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
  //   return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
  //     take(1),
  //     map(response => ({
  //       id: response.id,
  //       name: response.name,
  //       company: response.company || '',
  //       location: `${response.countryName}${response.postcode ? ', ' + response.postcode : ''}`,
  //       description: response.description,
  //       openActionsNumber: response.actions?.length || 0,
  //       openCommentsNumber: response.comments?.length || 0
  //     }))
  //   );

  // }

  submitInnovation(innovationId: string): Observable<{ id: string, status: keyof typeof INNOVATION_STATUS }> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/submit').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.patch<{ id: string, status: keyof typeof INNOVATION_STATUS }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
    );

  }


  getInnovationSections(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string): Observable<getInnovationSectionsDTO> {

    let endpointModule = '';

    switch (module) {
      case 'innovator':
        endpointModule = 'innovators';
        break;
      case 'accessor':
        endpointModule = 'accessors';
        break;
      case 'assessment':
        endpointModule = 'assessments';
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/section-summary').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.get<getInnovationSectionsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getSectionInfo(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObject }> {

    let endpointModule = '';

    switch (module) {
      case 'innovator':
        endpointModule = 'innovators';
        break;
      case 'accessor':
        endpointModule = 'accessors';
        break;
      case 'assessment':
        endpointModule = 'assessments';
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/sections').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId }).setQueryParams({ section });
    return this.http.get<{
      section: sectionType;
      data: MappedObject
    }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }


  updateSectionInfo(innovationId: string, section: string, data: MappedObject): Observable<MappedObject> {

    const body = {
      section,
      data: cloneDeep(data)
    };

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.put<MappedObject>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }


  submitSections(innovationId: string, sections: string[]): Observable<any> {
    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections/submit').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.patch<any>(url.buildUrl(), { sections }).pipe(
      take(1),
      map(response => response)
    );
  }


  getSectionEvidenceInfo(module: '' | 'innovator' | 'accessor' | 'assessment', innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {

    let endpointModule = '';

    switch (module) {
      case 'innovator':
        endpointModule = 'innovators';
        break;
      case 'accessor':
        endpointModule = 'accessors';
        break;
      case 'assessment':
        endpointModule = 'assessments';
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
    return this.http.get<getInnovationEvidenceDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }


  upsertSectionEvidenceInfo(innovationId: string, data: MappedObject, evidenceId?: string): Observable<MappedObject> {

    if (evidenceId) {
      const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
      return this.http.put<MappedObject>(url.buildUrl(), { ...{ id: evidenceId }, ...data }).pipe(
        take(1),
        map(response => response)
      );

    } else {
      const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
      return this.http.post<MappedObject>(url.buildUrl(), data).pipe(
        take(1),
        map(response => response)
      );

    }

  }


  deleteEvidence(innovationId: string, evidenceId: string): Observable<boolean> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
    return this.http.delete<MappedObject>(url.buildUrl()).pipe(
      take(1),
      map(response => !!response),
      catchError(() => of(false))
    );

  }

}
