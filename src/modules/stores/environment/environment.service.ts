import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { environment } from '@app/config/environment.config';

import { UrlModel } from '../../core/models/url.model';


type getUserInfoDto = {
  data: {
    id: string,
    type: 'user',
    attributes: { displayName: string }
  }
};

type getUserInnovationsDto = {
  data: {
    id: string,
    name: 'innovation',
    attributes: { name: string }
  }[]
};


@Injectable()
export class EnvironmentService {

  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }


  verifyUserSession(): Observable<boolean> {
    const url = new UrlModel(this.apiUrl).setPath('transactional/session').buildUrl();
    return this.http.head(url).pipe(take(1), map(() => true));
  }

  getUserInfo(): Observable<{ user: { id: string, displayName: string } }> {

    const url = new UrlModel(this.apiUrl).setPath('transactional/auth/user');
    return this.http.get<getUserInfoDto>(url.buildUrl()).pipe(
      take(1),
      map(response => ({ user: { id: response.data.id, displayName: response.data.attributes.displayName } })),
      catchError(() => throwError({}))
    );

  }

  verifyInnovator(userId: string): Observable<boolean> {
    const url = new UrlModel(this.apiUrl).setPath('transactional/api/innovators/:userId').setPathParams({ userId });
    return this.http.head(url.buildUrl()).pipe(take(1), map(() => true));
  }



  getInnovations(): Observable<{ id: string, name: string }[]> {

    return of([{ id: 'abc123zxc', name: 'HealthyApp' }]);

    const url = new UrlModel(this.apiUrl).setPath('transactional/api/innovations');
    return this.http.get<getUserInnovationsDto>(url.buildUrl()).pipe(
      take(1),
      map(response => response.data.map(d => ({ id: d.id, name: d.attributes.name })))
    );

  }

}
