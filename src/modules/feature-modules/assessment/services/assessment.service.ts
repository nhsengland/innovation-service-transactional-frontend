import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { MappedObjectType } from '@app/base/types';
import { UrlModel } from '@app/base/models';

import { InnovationStatusEnum, INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation';


export enum SupportLogType {
  ACCESSOR_SUGGESTION = 'ACCESSOR_SUGGESTION',
  STATUS_UPDATE = 'STATUS_UPDATE'
}


export type getInnovationInfoEndpointDTO = {
  summary: {
    id: string;
    name: string;
    status: InnovationStatusEnum;
    description: string;
    company: string;
    countryName: string;
    postCode: string;
    categories: string[];
    otherCategoryDescription: null | string;
    companySize: string;
  };
  contact: {
    name: string;
    email: string;
    phone: null | string;
  };
  assessment?: {
    id: string;
    assignToName: string;
  };
  lockedInnovatorValidation: {
    displayIsInnovatorLocked: boolean,
    innovatorName?: string
  }
};

export type getSupportLogInDTO = {
  id: string;
  type: SupportLogType;
  description: string;
  createdBy: string;
  createdAt: string;
  innovationSupportStatus: keyof typeof INNOVATION_SUPPORT_STATUS;
  organisationUnit: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  };
  suggestedOrganisationUnits?: {
    id: string; name: string; acronym: string;
    organisation: { id: string; name: string; acronym: string; };
  }[];
};

export type getSupportLogOutDTO = getSupportLogInDTO & { logTitle: string; suggestedOrganisationUnitsNames: string[]; };


@Injectable()
export class AssessmentService extends CoreService {

  constructor() { super(); }


  getOverdueAssessments(status: InnovationStatusEnum[]): Observable<{ overdue: number }> {

    // Overdue assessments only exists on these 2 statuses. If more is passed, is removed.
    status = status.filter(item => [InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT, InnovationStatusEnum.NEEDS_ASSESSMENT].includes(item));

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/overdue-assessments').setQueryParams({ status });
    return this.http.get<{ overdue: number }>(url.buildUrl()).pipe(take(1), map(response => response));

  }

  getInnovationInfo(innovationId: string): Observable<getInnovationInfoEndpointDTO> {

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getInnovationInfoEndpointDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  getSupportLog(innovationId: string): Observable<getSupportLogOutDTO[]> {

    const url = new UrlModel(this.API_URL).addPath('assessments/:userId/innovations/:innovationId/support-logs').setPathParams({ userId: this.stores.authentication.getUserId(), innovationId });
    return this.http.get<getSupportLogInDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => {

        let logTitle = '';

        switch (item.type) {
          case SupportLogType.ACCESSOR_SUGGESTION:
            logTitle = 'Suggested organisations';
            break;
          case SupportLogType.STATUS_UPDATE:
            logTitle = 'Updated support status';
            break;
          default:
            break;
        }

        return {
          ...item,
          logTitle,
          suggestedOrganisationUnitsNames: (item.suggestedOrganisationUnits || []).map(o => o.name)
        };

      }))
    );
  }

  createInnovationNeedsAssessment(innovationId: string, data: MappedObjectType): Observable<{ id: string }> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/assessments').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );

  }

  updateInnovationNeedsAssessment(innovationId: string, assessmentId: string, isSubmission: boolean, data: MappedObjectType): Observable<{ id: string }> {

    const body = Object.assign({}, data);

    if (isSubmission) {
      body.isSubmission = true;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/assessments/:assessmentId').setPathParams({ innovationId, assessmentId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );

  }

}
