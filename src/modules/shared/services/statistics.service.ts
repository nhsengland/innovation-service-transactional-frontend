import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';

import { ContextTypeType } from './innovation-documents.service';
import { InnovationStatisticsEnum, OrganisationUnitStatisticsEnum, UserStatisticsTypeEnum } from './statistics.enum';

export type UserStatisticsDTO = {
  [UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER]: { count: number; overdue: number };
  [UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER]: { count: number; total: number; overdue: number };
  [UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER]: {
    count: number;
    total: number;
    lastSubmittedAt: null | DateISOType;
  };
  [UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType };
  [UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER]: {
    count: number;
    total: number;
    lastSubmittedAt: null | DateISOType;
  };
  [UserStatisticsTypeEnum.INNOVATIONS_NEEDING_ACTION_COUNTER]: { count: number };
};

export type InnovationStatisticsDTO = {
  [InnovationStatisticsEnum.TASKS_OPEN_COUNTER]: {
    count: number;
    lastSubmittedSection: null | string;
    lastSubmittedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.TASKS_RESPONDED_COUNTER]: {
    count: number;
    total: number;
    lastUpdatedSection: null | string;
    lastUpdatedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]: {
    count: number;
    total: number;
    lastSubmittedSection: null | string;
    lastSubmittedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType };
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER]: {
    count: number;
    total: number;
    lastSubmittedSection: null | string;
    lastSubmittedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]: {
    count: number;
    total: number;
    lastSubmittedSection: null | string;
    lastSubmittedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]: {
    count: number;
    lastSubmittedAt: null | DateISOType;
  };
  [InnovationStatisticsEnum.PENDING_EXPORT_REQUESTS_COUNTER]: { count: number };
  [InnovationStatisticsEnum.DOCUMENTS_STATISTICS_COUNTER]: {
    uploadedByRoles: { role: UserRoleEnum; count: number }[];
    uploadedByUnits: { id: string; unit: string; count: number }[];
    locations: { location: ContextTypeType; count: number }[];
  };
  [InnovationStatisticsEnum.UNANSWERED_SURVEYS_BY_UNIT_COUNTER]: { count: number };
};

export type OrganisationUnitStatisticsDTO = {
  [OrganisationUnitStatisticsEnum.INNOVATIONS_PER_UNIT]: { ENGAGING: number; WAITING: number };
};

@Injectable()
export class StatisticsService extends CoreService {
  constructor() {
    super();
  }

  getUserStatisticsInfo(qParams: { statistics: any[] }): Observable<UserStatisticsDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/statistics').setQueryParams(qParams);
    return this.http.get<UserStatisticsDTO>(url.buildUrl()).pipe(take(1));
  }

  getInnovationStatisticsInfo(
    innovationId: string,
    qParams: { statistics: InnovationStatisticsEnum[] }
  ): Observable<InnovationStatisticsDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/statistics')
      .setPathParams({ innovationId })
      .setQueryParams(qParams);
    return this.http.get<InnovationStatisticsDTO>(url.buildUrl()).pipe(take(1));
  }

  getOrganisationUnitStatistics(
    organisationUnitId: string,
    qParams: { statistics: OrganisationUnitStatisticsEnum[] }
  ): Observable<OrganisationUnitStatisticsDTO> {
    const url = new UrlModel(this.API_ADMIN_URL)
      .addPath('v1/organisation-unit/:organisationUnitId/statistics')
      .setPathParams({ organisationUnitId })
      .setQueryParams(qParams);
    return this.http.get<OrganisationUnitStatisticsDTO>(url.buildUrl()).pipe(take(1));
  }
}
