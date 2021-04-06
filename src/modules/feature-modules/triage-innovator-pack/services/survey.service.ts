import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';

@Injectable()
export class SurveyService extends CoreService {

  private apiUrl = this.stores.environment.ENV.API_URL;

  constructor() { super(); }

  submitSurvey(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.apiUrl).setPath('transactional/survey').buildUrl();

    return this.http.post<{ id: string }>(url, body).pipe(
      take(1),
      map(response => response),
      catchError(err => throwError(err))
    );

  }

}
