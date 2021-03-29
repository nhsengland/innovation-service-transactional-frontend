import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { EnvironmentStore } from '../../stores/environment/environment.store';

import { UrlModel } from '../models/url.model';

@Injectable()
export class AuthenticationService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  verifySession(): Observable<boolean> {
    const url = new UrlModel(this.apiUrl).setPath('transactional/session').buildUrl();
    return this.http.head(url).pipe(take(1), map(() => true));
  }

}
