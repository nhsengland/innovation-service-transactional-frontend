import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';

import { UrlModel } from '@modules/core';

@Injectable()
export class InnovatorService extends CoreService {

  constructor() { super(); }

  submitFirstTimeSigninInfo(data: { [key: string]: any }): Observable<string> {

    const body = {
      actionType: 'first_time_signin',
      user: {
        displayName: data.innovatorName
      },
      innovation: {
        name: data.innovationName,
        description: data.innovationDescription,
        countryName: data.locationCountryName || data.location,
        postcode: data.englandPostCode || '',
        organisationShares: data.organisationShares || []
      },
      organisation: data.isCompanyOrOrganisation === 'yes' ? { name: data.organisationName, size: data.organisationSize } : undefined
    };

    const url = new UrlModel(this.API_URL).addPath('innovators');
    return this.http.post<{}>(url.buildUrl(), body).pipe(take(1), map(() => ''));

  }

}
