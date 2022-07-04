import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';


export type GetTermsOfUseLastVersionInfoDTO = {
  id: string;
  name: string;
  summary: string;
  releasedAt?: string;
  isAccepted: boolean;
};


@Injectable()
export class TermsOfUseService extends CoreService {

  constructor() { super(); }

  getTermsOfUseLastVersionInfo(): Observable<GetTermsOfUseLastVersionInfoDTO> {

    const url = new UrlModel(this.API_URL).addPath('tou/me');
    return this.http.get<GetTermsOfUseLastVersionInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );

  }

  acceptTermsOfUseVersion(id: string): Observable<{ id: string }> {

    const url = new UrlModel(this.API_URL).addPath('tou/:id/accept').setPathParams({ id });
    return this.http.patch<{ id: string }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
    );

  }

}
