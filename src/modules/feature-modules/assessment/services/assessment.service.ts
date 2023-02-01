import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { MappedObjectType } from '@app/base/types';
import { UrlModel } from '@app/base/models';

import { InnovationStatusEnum } from '@modules/stores/innovation';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserTypeEnum } from '@app/base/enums';
@Injectable()
export class AssessmentService extends CoreService {

  constructor() { super(); }


  getOverdueAssessments(status: InnovationStatusEnum[]): Observable<{ overdue: number }> {

    // Overdue assessments only exists on these 2 statuses. If more is passed, is removed.
    status = status.filter(item => [InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT, InnovationStatusEnum.NEEDS_ASSESSMENT].includes(item));

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/overdue-assessments').setQueryParams({ status });
    return this.http.get<{ overdue: number }>(url.buildUrl()).pipe(take(1), map(response => response));

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

  updateInnovationNeedsAssessmentAssessor(innovationId: string, assessmentId: string, body: { assessorId: string }): Observable<{ assessmentId: string, assessorId: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/assessments/:assessmentId').setPathParams({ innovationId, assessmentId });

    return this.http.patch<{ assessmentId: string, assessorId: string }>(url.buildUrl(), body).pipe(
      take(1),
      map(response => response)
    );
  }

  getAssessmentUsersList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ userTypes: [UserTypeEnum.ASSESSMENT], onlyActive: true });
    return this.http.get<{
      id: string,
      name: string,
      type: UserTypeEnum,
      isActive: boolean,
      organisations: {
        name: string;
        role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
        units: { name: string, organisationUnitUserId: string }[]
      }[]
    }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({
        id: item.id,
        name: item.name
      })))
    );

  }
}
