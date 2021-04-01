import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { CoreService } from '@app/base/core.service';

import { UrlModel } from '../models/url.model';

@Injectable()
export class AuthenticationService extends CoreService {

  private apiUrl = this.stores.environment.ENV.API_URL;

  constructor() {
    super();
  }

  verifySession(): Observable<boolean> {
    const url = new UrlModel(this.apiUrl).setPath('transactional/session').buildUrl();
    return this.http.head(url).pipe(take(1), map(() => true));
  }

}
