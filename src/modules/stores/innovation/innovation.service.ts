import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { APIQueryParamsType } from '@modules/core/models/table.model';

import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';
import { AuthenticationStore } from '@modules/stores/authentication/authentication.store';
import { UserTypeEnum } from '@modules/stores/authentication/authentication.enums';

import { ActivityLogItemsEnum, ActivityLogTypesEnum, InnovationSectionEnum } from './innovation.enums';
import {
  INNOVATION_STATUS, ACTIVITY_LOG_ITEMS, INNOVATION_SUPPORT_STATUS,
  getInnovationSectionsDTO, getInnovationEvidenceDTO, getInnovationCommentsDTO, OrganisationSuggestionModel, InnovationSectionInfoDTO
} from './innovation.models';

import { UrlModel } from '@modules/core/models/url.model';
import { MappedObjectType } from '@modules/core/interfaces/base.interfaces';
import { getSectionTitle } from './innovation.config';


export type ActivityLogInDTO = {
  count: number;
  innovation: { id: string, name: string },
  data: {
    date: string; // '2020-01-01T00:00:00.000Z',
    type: keyof ActivityLogItemsEnum;
    activity: ActivityLogItemsEnum;
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
      thread?: { id: string, subject: string, messageId: string },
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
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private authenticationStore: AuthenticationStore,
    private envVariablesStore: EnvironmentVariablesStore
  ) { }


  private apiUserBasePath(): string {

    switch (this.authenticationStore.getUserType()) {
      case UserTypeEnum.ADMIN: return 'user-admin';
      case UserTypeEnum.ASSESSMENT: return 'assessments';
      case UserTypeEnum.ACCESSOR: return 'accessors';
      case UserTypeEnum.INNOVATOR: return 'innovators';
      default: return '';
    }

  }


  submitInnovation(innovationId: string): Observable<{ id: string, status: keyof typeof INNOVATION_STATUS }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/submit').setPathParams({ innovationId });
    return this.http.patch<{ id: string, status: keyof typeof INNOVATION_STATUS }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
    );

  }

  getInnovationActivityLog(
    innovationId: string,
    queryParams: APIQueryParamsType<{ activityTypes: ActivityLogTypesEnum[], startDate: string, endDate: string }>
  ): Observable<ActivityLogOutDTO> {

    const userUrlBasePath = this.authenticationStore.userUrlBasePath();
    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      activityTypes: filters.activityTypes || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/activities')
      .setPathParams({
        innovationId
      })
      .setQueryParams(qp);

    return this.http.get<ActivityLogInDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(i => {

          let link: null | { label: string; url: string; } = null;

          switch (ACTIVITY_LOG_ITEMS[i.activity].link) {
            case 'NEEDS_ASSESSMENT':
              link = i.params.assessmentId ? { label: 'Go to Needs assessment', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/assessments/${i.params.assessmentId}` } : null;
              break;
            case 'SUPPORT_STATUS':
              link = { label: 'Go to Support status', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/support` };
              break;
            case 'SECTION':
              link = i.params.sectionId ? { label: 'View section', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/record/sections/${i.params.sectionId}` } : null;
              break;
            case 'THREAD':
              link = { label: 'View messages', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/threads/${i.params.thread?.id}` };
              break;
            case 'ACTION':
              if (['innovator', 'accessor'].includes(userUrlBasePath) && i.params.actionId) { // Don't make sense for assessment users.
                link = { label: 'View action', url: `/${userUrlBasePath}/innovations/${response.innovation.id}/action-tracker/${i.params.actionId}` };
              }
              break;
          }

          return {
            date: i.date,
            type: i.type,
            activity: i.activity,
            innovation: response.innovation,
            params: {
              ...i.params,
              innovationName: response.innovation.name,
              sectionTitle: getSectionTitle(i.params.sectionId || null)
            },
            link
          };

        })
      }))
    );
  }


  getInnovationSections(innovationId: string): Observable<getInnovationSectionsDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/sections')
      .setPathParams({
        endpointModule: this.apiUserBasePath(),
        userId: this.authenticationStore.getUserId(),
        innovationId
      });

    return this.http.get<getInnovationSectionsDTO>(url.buildUrl()).pipe(take(1), map(response => response));

  }


  getSectionInfo(innovationId: string, sectionId: string): Observable<InnovationSectionInfoDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/sections/:sectionId')
      .setPathParams({
        endpointModule: this.apiUserBasePath(),
        userId: this.authenticationStore.getUserId(),
        innovationId,
        sectionId
      })
      .setQueryParams({ sectionId });
    return this.http.get<InnovationSectionInfoDTO>(url.buildUrl()).pipe(take(1), map(response => response));
  }


  updateSectionInfo(innovationId: string, sectionKey: string, data: MappedObjectType): Observable<MappedObjectType> {

    const body = { ...data };
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/sections/:sectionKey').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, sectionKey });
    return this.http.put<MappedObjectType>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

  submitSections(innovationId: string, sectionKey: string): Observable<any> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/sections/:sectionKey/submit').setPathParams({ userId: this.authenticationStore.getUserId(), innovationId, sectionKey });
    return this.http.patch<any>(url.buildUrl(), { sectionKey }).pipe(
      take(1),
      map(response => response)
    );
  }


  getSectionEvidenceInfo(innovationId: string, evidenceId: string): Observable<getInnovationEvidenceDTO> {

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/evidence/:evidenceId')
      .setPathParams({
        endpointModule: this.apiUserBasePath(),
        userId: this.authenticationStore.getUserId(),
        innovationId,
        evidenceId
      });

    return this.http.get<getInnovationEvidenceDTO>(url.buildUrl()).pipe(take(1), map(response => response));

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
    return this.http.delete<MappedObjectType>(url.buildUrl()).pipe(take(1), map(response => !!response));

  }


  // Innovation comments methods.
  getInnovationComments(innovationId: string, createdOrder: 'asc' | 'desc'): Observable<getInnovationCommentsDTO[]> {

    const order = { order: { createdAt: createdOrder.toUpperCase() } };

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments').setPathParams({
      endpointModule: this.apiUserBasePath(),
      userId: this.authenticationStore.getUserId(),
      innovationId
    }).setQueryParams(order);

    return this.http.get<getInnovationCommentsDTO[]>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  createInnovationComment(innovationId: string, body: { comment: string, replyTo?: string }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments').setPathParams({
      endpointModule: this.apiUserBasePath(),
      userId: this.authenticationStore.getUserId(),
      innovationId
    });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  updateInnovationComment(innovationId: string, body: { comment: string, replyTo?: string }, commentId: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/comments/:commentId').setPathParams({
      endpointModule: this.apiUserBasePath(),
      userId: this.authenticationStore.getUserId(),
      innovationId,
      commentId
    });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  getInnovationOrganisationSuggestions(innovationId: string): Observable<OrganisationSuggestionModel> {

    const url = new UrlModel(this.API_URL).addPath(':endpointModule/:userId/innovations/:innovationId/suggestions').setPathParams({
      endpointModule: this.apiUserBasePath(),
      userId: this.authenticationStore.getUserId(),
      innovationId
    });

    return this.http.get<OrganisationSuggestionModel>(url.buildUrl()).pipe(take(1), map(response => response));

  }

}
