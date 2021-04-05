import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';

import { UrlModel } from '@modules/core';
import { catchError, map, take } from 'rxjs/operators';

@Injectable()
export class SurveyService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  submitSurvey(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.apiUrl).setPath('transactional/survey').buildUrl();

    return this.http.post<{ id: string }>(url, body).pipe(
      take(1),
      map(response => response),
      catchError(err => {
        return throwError(err);
      })
    );

  }

}
