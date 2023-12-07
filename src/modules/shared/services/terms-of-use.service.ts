import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@app/base/models';
import { DateISOType } from '@app/base/types';

export type GetTermsOfUseLastVersionInfoDTO = {
  id: string;
  name: string;
  summary: string;
  releasedAt: DateISOType;
  isAccepted: boolean;
};

@Injectable()
export class TermsOfUseService extends CoreService {
  constructor() {
    super();
  }

  getTermsOfUseLastVersionInfo(): Observable<GetTermsOfUseLastVersionInfoDTO> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/terms-of-use');
    return this.http.get<GetTermsOfUseLastVersionInfoDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response)
    );
  }

  acceptTermsOfUseVersion(id: string): Observable<{ id: string }> {
    const url = new UrlModel(this.API_USERS_URL).addPath('v1/me/terms-of-use/accept');
    return this.http.patch<{ id: string }>(url.buildUrl(), {}).pipe(
      take(1),
      map(response => response)
    );
  }
}
