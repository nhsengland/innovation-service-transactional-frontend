import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';
import { InnovationStatisticsEnum, UserStatisticsTypeEnum } from './statistics.enum';

export type UserStatisticsDTO = {
  [UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER]: { count: number; overdue: number;},
  [UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER]: { count: number; total: number; overdue: number;},
  [UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER]: { count: number; total: number; lastSubmittedAt: null | DateISOType; },
  [UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER]: { count: number; total: number; lastSubmittedAt: null | DateISOType; },
  [UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER]: { count: number; lastSubmittedAt: null | DateISOType; },
}

export type OrganisationUnitStatisticsDTO = {
  [InnovationStatisticsEnum.INNOVATIONS_PER_UNIT]: { ENGAGING: number; FURTHER_INFO_REQUIRED: number;},
}

@Injectable()
export class StatisticsService extends CoreService {

  constructor() { super(); }

  getUserStatisticsInfo(qParams: { statistics: any[] }): Observable<UserStatisticsDTO> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1/statistics').setQueryParams(qParams);
    return this.http.get<UserStatisticsDTO>(url.buildUrl()).pipe(take(1));
  }

  getOrganisationUnitStatistics(organisationUnitId: string, qParams: { statistics: InnovationStatisticsEnum[] }): Observable<OrganisationUnitStatisticsDTO> {
    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/organisation-unit/:organisationUnitId/statistics').setPathParams({ organisationUnitId }).setQueryParams(qParams);
    return this.http.get<OrganisationUnitStatisticsDTO>(url.buildUrl()).pipe(take(1));
  }
}
