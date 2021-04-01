import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    private http: HttpClient
  ) { }


  getUserInfo(): Observable<{ user: { id: string, displayName: string } } | null> {

    const url = new UrlModel(this.apiUrl).setPath('transactional/auth/user');
    return this.http.get<getUserInfoDto>(url.buildUrl()).pipe(
      take(1),
      map(response =>
        ({ user: { id: response.data.id, displayName: response.data.attributes.displayName } })
      ),
      catchError(error => throwError(error))
    );

  }

}
