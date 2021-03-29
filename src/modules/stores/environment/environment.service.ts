import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
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


@Injectable()
export class EnvironmentService {

  private apiUrl = environment.API_URL;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) { }

  getUserInfo(): Observable<{ user: { id: string, displayName: string } } | null> {

    if (isPlatformServer(this.platformId)) {
      return of({ user: { id: '', displayName: '' } });
    }

    const url = new UrlModel(this.apiUrl).setPath('transactional/auth/user');
    return this.http.get<getUserInfoDto>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        return { user: { id: response.data.id, displayName: response.data.attributes.displayName } };
      }),
      catchError(err => {
        // console.log(err);
        return throwError(err);
      })
    );

  }

}
