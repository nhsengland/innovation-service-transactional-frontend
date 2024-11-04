import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { EnvironmentVariablesStore } from '../stores/environment-variables.store';

import { UrlModel } from '../models/url.model';
import { InnovationCollaboratorStatusEnum } from '@modules/stores';

@Injectable()
export class InnovationService {
  private APP_URL: string;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentVariablesStore
  ) {
    this.APP_URL = this.environmentStore.APP_URL;
  }

  getInnovationTransfer(id: string): Observable<{ userExists: boolean }> {
    const url = new UrlModel(this.APP_URL).addPath('innovators/innovation-transfers/:id/check').setPathParams({ id });
    return this.http.get<{ userExists: boolean }>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  getInnovationCollaboration(
    id: string
  ): Observable<{ userExists: boolean; collaboratorStatus: InnovationCollaboratorStatusEnum }> {
    const url = new UrlModel(this.APP_URL)
      .addPath('innovators/innovation-collaborations/:id/check')
      .setPathParams({ id });

    return this.http
      .get<{ userExists: boolean; collaboratorStatus: InnovationCollaboratorStatusEnum }>(url.buildUrl())
      .pipe(take(1));
  }
}
