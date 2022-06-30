import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { APIQueryParamsType } from '@modules/core/models/table.model';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';

import { ActivityLogItemsEnum, InnovationSectionEnum } from './innovation.enums';
import {
  sectionType,
  INNOVATION_STATUS, ACTIVITY_LOG_ITEMS, INNOVATION_SUPPORT_STATUS,
  getInnovationSectionsDTO, getInnovationEvidenceDTO, getInnovationCommentsDTO, OrganisationSuggestionModel
} from './innovation.models';

import { UrlModel } from '@modules/core/models/url.model';
import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { getSectionTitle } from './innovation.config';


export type UserModulesType = '' | 'innovator' | 'accessor' | 'assessment';


export type ActivityLogInDTO = {
  count: number;
  data: {
    date: string; // '2020-01-01T00:00:00.000Z',
    type: keyof ActivityLogItemsEnum;
    activity: ActivityLogItemsEnum;
    innovation: { id: string, name: string };
    params: {

      actionUserName: string;
      interveningUserName?: string;

      assessmentId?: string;
      sectionId?: InnovationSectionEnum;
      actionId?: string;
      innovationSupportStatus?: keyof typeof INNOVATION_SUPPORT_STATUS;

      organisations?: string[];
      organisationUnit?: string;
      comment?: { id: string; value: string; };
      totalActions?: number;

    };
  }[];
};
export type ActivityLogOutDTO = {
  count: number;
  data: (Omit<ActivityLogInDTO['data'][0], 'innovation' | 'params'>
    & {
      params: ActivityLogInDTO['data'][0]['params'] & {
        innovationName: string;
        sectionTitle: string;
      };
      link: null | { label: string; url: string; };
    })[]
};


@Injectable()
export class InnovationService {

  private API_URL = this.envVariablesStore.API_URL;

  constructor(
    private http: HttpClient,
    private authenticationStore: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  private endpointModule(module: UserModulesType): string {
    switch (module) {
      case 'innovator':
        return 'innovators';
      case 'accessor':
        return 'accessors';
      case 'assessment':
        return 'assessments';
      default:
        return '';
    }
  }


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

  getInnovationActivityLog(module: UserModulesType, innovationId: string, queryParams: APIQueryParamsType<{ activityTypes: keyof ActivityLogItemsEnum }>): Observable<ActivityLogOutDTO> {

    const endpointModule = this.endpointModule(module);
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      activityTypes: filters.activityTypes || undefined,
    };

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/activities').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId }).setQueryParams(qp);
    return this.http.get<ActivityLogInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(i => {

          let link: null | { label: string; url: string; } = null;

          switch (ACTIVITY_LOG_ITEMS[i.activity].link) {
            case 'NEEDS_ASSESSMENT':
              link = i.params.assessmentId ? { label: 'Go to Needs assessment', url: `/${module}/innovations/${i.innovation.id}/assessments/${i.params.assessmentId}` } : null;
              break;
            case 'SUPPORT_STATUS':
              link = { label: 'Go to Support status', url: `/${module}/innovations/${i.innovation.id}/support` };
              break;
            case 'SECTION':
              link = i.params.sectionId ? { label: 'View section', url: `/${module}/innovations/${i.innovation.id}/record/sections/${i.params.sectionId}` } : null;
              break;
            case 'ACTION':
              if (['innovator', 'accessor'].includes(module) && i.params.actionId) { // Don't make sense for assessment users.
                link = { label: 'View action', url: `/${module}/innovations/${i.innovation.id}/action-tracker/${i.params.actionId}` };
              }
              break;
          }

          return {
            date: i.date,
            type: i.type,
            activity: i.activity,
            innovation: i.innovation,
            params: {
              ...i.params,
              innovationName: i.innovation.name,
              sectionTitle: getSectionTitle(i.params.sectionId || null)
            },
            link
          };

        })
      }))
    );
  }


  getInnovationSections(module: UserModulesType, innovationId: string): Observable<getInnovationSectionsDTO> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/section-summary').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.get<getInnovationSectionsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }


  getSectionInfo(module: UserModulesType, innovationId: string, section: string): Observable<{ section: sectionType, data: MappedObjectType }> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/sections').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId }).setQueryParams({ section });
    return this.http.get<{
      section: sectionType;
      data: MappedObjectType
    }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }


  updateSectionInfo(innovationId: string, section: string, data: MappedObjectType): Observable<MappedObjectType> {

    const body = {
      section,
      data: cloneDeep(data)
    };

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/sections').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.put<MappedObjectType>(url.buildUrl(), body).pipe(
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


  getSectionEvidenceInfo(module: UserModulesType, innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
    return this.http.get<getInnovationEvidenceDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }


  upsertSectionEvidenceInfo(innovationId: string, data: MappedObjectType, evidenceId?: string): Observable<MappedObjectType> {

    if (evidenceId) {
      const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
      return this.http.put<MappedObjectType>(url.buildUrl(), { ...{ id: evidenceId }, ...data }).pipe(
        take(1),
        map(response => response)
      );

    } else {
      const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId });
      return this.http.post<MappedObjectType>(url.buildUrl(), data).pipe(
        take(1),
        map(response => response)
      );

    }

  }


  deleteEvidence(innovationId: string, evidenceId: string): Observable<boolean> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations/:innovationId/evidence/:evidenceId').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, evidenceId });
    return this.http.delete<MappedObjectType>(url.buildUrl()).pipe(
      take(1),
      map(response => !!response),
      catchError(() => of(false))
    );

  }


  // Innovation comments methods.
  getInnovationComments(module: UserModulesType, innovationId: string, createdOrder: 'asc' | 'desc'): Observable<getInnovationCommentsDTO[]> {

    const endpointModule = this.endpointModule(module);
    const order = { order: { createdAt: createdOrder.toUpperCase() } };

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId }).setQueryParams(order);
    return this.http.get<getInnovationCommentsDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  createInnovationComment(module: UserModulesType, innovationId: string, body: { comment: string, replyTo?: string }): Observable<{ id: string }> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  updateInnovationComment(module: UserModulesType, innovationId: string, body: { comment: string, replyTo?: string }, commentId: string): Observable<{ id: string }> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments/:commentId').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId, commentId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationOrganisationSuggestions(module: Extract<UserModulesType, '' | 'innovator' | 'accessor'>, innovationId: string): Observable<OrganisationSuggestionModel> {

    const endpointModule = this.endpointModule(module);

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/suggestions').setPathParams({ endpointModule, userId: this.authenticationStore.getUserId(), innovationId });
    return this.http.get<OrganisationSuggestionModel>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

}
