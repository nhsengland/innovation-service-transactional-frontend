import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UrlModel } from '@modules/core/models/url.model';
import { EnvironmentVariablesStore } from '@modules/core/stores/environment-variables.store';

import { ContextAssessmentType } from './assessment-context.types';

@Injectable()
export class AssessmentContextService {
  private API_INNOVATIONS_URL = this.envVariablesStore.API_INNOVATIONS_URL;

  constructor(
    private http: HttpClient,
    private envVariablesStore: EnvironmentVariablesStore
  ) {}

  getContextInfo(innovationId: string, assessmentId: string): Observable<ContextAssessmentType> {
    const url = new UrlModel(this.API_INNOVATIONS_URL)
      .addPath('v1/:innovationId/assessments/:assessmentId')
      .setPathParams({ innovationId, assessmentId });
    return this.http.get<Omit<ContextAssessmentType, 'expiriyAt'>>(url.buildUrl()).pipe(
      take(1),
      map(r => ({ ...r, expiryAt: Date.now() + 60000 }))
    );
  }
}
