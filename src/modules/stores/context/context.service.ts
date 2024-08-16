import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { UserRoleEnum } from '@app/base/enums';
import { InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { InnovationGroupedStatusEnum, InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { AuthenticationModel } from '../authentication/authentication.models';
import { NotificationCategoryTypeEnum, NotificationContextDetailEnum } from './context.enums';
import { ContextAssessmentType, ContextInnovationType } from './context.types';

type InnovationNotificationsDTO = {
  count: number;
  data: { [key in NotificationCategoryTypeEnum]: number };
};

@Injectable()
export class ContextService {
  private API_URL = this.envVariablesStore.API_URL;
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;
  private API_USERS_URL = this.envVariablesStore.API_USERS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getUserUnreadNotifications(): Observable<{ total: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/counters');
    return this.http.get<{ total: number }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  dismissNotification(
    innovationId: string,
    conditions: {
      notificationIds?: string[];
      contextTypes?: NotificationCategoryTypeEnum[];
      contextDetails?: NotificationContextDetailEnum[];
      contextIds?: string[];
    }
  ): Observable<void> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/notifications/dismiss')
      .setPathParams({ innovationId });
    return this.http.patch<void>(url.buildUrl(), conditions).pipe(take(1));
  }

  dismissUserNotification(conditions: {
    notificationIds?: string[];
    contextTypes?: NotificationCategoryTypeEnum[];
    contextDetails?: NotificationContextDetailEnum[];
    contextIds?: string[];
  }): Observable<{ affected: number }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/notifications/dismiss');
    return this.http.patch<{ affected: number }>(url.buildUrl(), conditions).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationNotifications(innovationId: string): Observable<InnovationNotificationsDTO> {
    const url = new UrlModel(this.API_URL)
      .addPath('innovations/:innovationId/notifications')
      .setPathParams({ innovationId });
    return this.http.get<InnovationNotificationsDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationContextInfo(
    innovationId: string,
    userContext: AuthenticationModel['userContext']
  ): Observable<ContextInnovationType> {
    const qp: { fields: ('assessment' | 'supports')[] } = { fields: [] };

    switch (userContext?.type) {
      case UserRoleEnum.ASSESSMENT:
        qp.fields = ['assessment'];
        break;
      case UserRoleEnum.INNOVATOR:
      case UserRoleEnum.ACCESSOR:
      case UserRoleEnum.QUALIFYING_ACCESSOR:
      case UserRoleEnum.ADMIN:
        qp.fields = ['assessment', 'supports'];
        break;
      default:
        break;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId')
      .setPathParams({ innovationId })
      .setQueryParams(qp);
    return this.http.get<InnovationInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        let support: undefined | { id: string; status: InnovationSupportStatusEnum; organisationUnitId: string };

        if (userContext?.type === UserRoleEnum.ACCESSOR || userContext?.type === UserRoleEnum.QUALIFYING_ACCESSOR) {
          support = (response.supports ?? []).find(
            item => item.organisationUnitId === userContext?.organisationUnit?.id
          );
        }

        return {
          id: response.id,
          name: response.name,
          status:
            response.groupedStatus === InnovationGroupedStatusEnum.AWAITING_NEEDS_REASSESSMENT
              ? InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT
              : response.status,
          statusUpdatedAt: response.statusUpdatedAt,
          hasBeenAssessed: response.hasBeenAssessed,
          archivedStatus: response.archivedStatus,
          ...(response.owner
            ? {
                owner: {
                  isActive: response.owner.isActive,
                  name: response.owner.name,
                  organisation: response.owner.organisation
                }
              }
            : {}),
          loggedUser: { isOwner: response.owner ? response.owner?.id === userContext?.id : false },
          ...(response.assessment
            ? {
                assessment: {
                  id: response.assessment.id,
                  majorVersion: response.assessment.majorVersion,
                  minorVersion: response.assessment.minorVersion,
                  createdAt: response.assessment.createdAt,
                  finishedAt: response.assessment.finishedAt
                }
              }
            : {}),
          ...(response.assessment?.assignedTo
            ? {
                assignedTo: {
                  id: response.assessment.assignedTo.id,
                  userRoleId: response.assessment.assignedTo.userRoleId,
                  name: response.assessment.assignedTo.name
                }
              }
            : {}),
          ...(support ? { support: { id: support.id, status: support.status } } : {}),
          collaboratorId: response.collaboratorId ? response.collaboratorId : undefined,
          createdAt: response.createdAt,
          reassessmentCount: response.assessment?.reassessmentCount ? response.assessment.reassessmentCount : 0,
          categories: response.categories,
          otherCategoryDescription: response.otherCategoryDescription,
          countryName: response.countryName,
          description: response.description,
          postCode: response.postCode,
          expiryAt: Date.now() + 5000
        };
      })
    );
  }

  getAssessmentContextInfo(innovationId: string, assessmentId: string): Observable<ContextAssessmentType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId')
      .setPathParams({ innovationId, assessmentId });
    return this.http
      .get<Omit<ContextAssessmentType, 'expiriyAt'>>(url.buildUrl())
      .pipe(map(r => ({ ...r, expiryAt: Date.now() + 5000 })));
  }
}
