import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { EnvironmentStore } from '@modules/core/stores/environment.store';

import { UrlModel } from '@modules/core/models/url.model';


type getUserInfoDto = {
  id: string;
  displayName: string;
  type: 'ASSESSMENT' | 'ACCESSOR' | 'INNOVATOR';
  organisations: { id: string, name: string, role: 'OWNER' | 'QUALIFYING_ACCESSOR' | 'ACCESSOR' }[];
};

type getUserInnovationsDto = {
  id: string;
  name: string;
};


@Injectable()
export class AuthenticationService {

  private APP_URL = this.environmentStore.APP_URL;
  private API_URL = this.environmentStore.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }


  verifyUserSession(): Observable<boolean> {
    const url = new UrlModel(this.APP_URL).addPath('session')
    .buildUrl();
    return this.http.head(url).pipe(
      take(1),
      map(() => true),
      catchError((e) => throwError(e))
    );
  }

  getUserInfo(): Observable<getUserInfoDto> {

    const url = new UrlModel(this.API_URL).addPath('me');
    return this.http.get<getUserInfoDto>(url.buildUrl()).pipe(
      take(1),
      map(response => ({
        id: response.id,
        displayName: ['unknown'].includes(response.displayName) ? '' : response.displayName,
        type: response.type,
        organisations: response.organisations
      }))
    );

  }

  verifyInnovator(userId: string): Observable<boolean> {
    const url = new UrlModel(this.API_URL).addPath('innovators/:userId').setPathParams({ userId });
    return this.http.head(url.buildUrl()).pipe(
      take(1),
      map(() => true),
      catchError(() => of(false))
    );
  }

  getInnovations(userId: string): Observable<getUserInnovationsDto[]> {

    const url = new UrlModel(this.API_URL).addPath('innovators/:userId/innovations').setPathParams({ userId });
    return this.http.get<getUserInnovationsDto[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
      catchError(() => of([])) // On error, just return no innovation at all.
    );

  }

}
