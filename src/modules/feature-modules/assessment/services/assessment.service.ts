import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { DateISOType, MappedObjectType } from '@app/base/types';

const InnovationKPIExemption = [
  'NO_RESPONSE',
  'TECHNICAL_DIFFICULTIES',
  'INCORRECT_DETAILS',
  'SERVICE_UNAVAILABLE',
  'CAPACITY'
] as const;
export type InnovationKPIExemption = (typeof InnovationKPIExemption)[number];

export type AssessmentExemptionTypeDTO = {
  isExempted: boolean;
  exemption?: { reason: InnovationKPIExemption; message?: string; exemptedAt: DateISOType };
};

export type NeedsAssessorList = {
  count: number;
  data: {
    needsAssessorUserId: string;
    needsAssessorUserName: string;
    assignedInnovation: string;
    needsAssessmentVersion: string;
    innovationId: string;
    assessmentId: string;
  }[];
};

@Injectable()
export class AssessmentService extends CoreService {
  constructor() {
    super();
  }

  // getOverdueAssessments(status: InnovationStatusEnum[], assignedToMe?: boolean): Observable<{ overdue: number }> {

  //   // Overdue assessments only exists on these 2 statuses. If more is passed, is removed.
  //   status = status.filter(item => [InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT, InnovationStatusEnum.NEEDS_ASSESSMENT].includes(item));

  //   const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/overdue-assessments').setQueryParams({ status, assignedToMe });
  //   return this.http.get<{ overdue: number }>(url.buildUrl()).pipe(take(1), map(response => response));

  // }

  createInnovationNeedsAssessment(innovationId: string, data: MappedObjectType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      finalize(() => this.ctx.innovation.clear())
    );
  }

  editInnovationNeedsAssessment(innovationId: string, data: MappedObjectType): Observable<{ id: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/edit')
      .setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), data).pipe(
      take(1),
      finalize(() => {
        this.ctx.innovation.clear();
        this.ctx.assessment.clear();
      })
    );
  }

  updateInnovationNeedsAssessment(
    innovationId: string,
    assessmentId: string,
    isSubmission: boolean,
    data: MappedObjectType
  ): Observable<{ id: string }> {
    const body = Object.assign({}, data);

    if (isSubmission) {
      body.isSubmission = true;
    }

    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId')
      .setPathParams({ innovationId, assessmentId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(
      take(1),
      finalize(() => {
        this.ctx.innovation.clear();
        this.ctx.assessment.fetch$.next({ innovationId, assessmentId });
      })
    );
  }

  updateInnovationNeedsAssessmentAssessor(
    innovationId: string,
    assessmentId: string,
    body: { assessorId: string }
  ): Observable<{ assessmentId: string; assessorId: string }> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId')
      .setPathParams({ innovationId, assessmentId });
    return this.http.patch<{ assessmentId: string; assessorId: string }>(url.buildUrl(), body).pipe(
      take(1),
      finalize(() => this.ctx.assessment.fetch$.next({ innovationId, assessmentId }))
    );
  }

  getInnovationExemption(innovationId: string, assessmentId: string): Observable<AssessmentExemptionTypeDTO> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId/exemption')
      .setPathParams({ innovationId, assessmentId });
    return this.http.get<AssessmentExemptionTypeDTO>(url.buildUrl()).pipe(
      take(1),
      catchError(() => of({ isExempted: false }))
    );
  }

  updateInnovationExemption(
    innovationId: string,
    assessmentId: string,
    data: { reason: InnovationKPIExemption; message?: string }
  ): Observable<null> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId/exemption')
      .setPathParams({ innovationId, assessmentId });
    return this.http.patch<null>(url.buildUrl(), data).pipe(
      take(1),
      map(response => response)
    );
  }


  getNeedsAccessorAndInnovationsList(): Observable<NeedsAssessorList> {
    const url = new UrlModel(this.API_USERS_URL)
      .addPath('v1/needs-assessors');
    return this.http.get<NeedsAssessorList>(url.buildUrl()).pipe(take(1));
  }
}
