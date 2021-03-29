import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { EnvironmentStore } from '@modules/stores/environment/environment.store';

import { UrlModel } from '@modules/core';
import { catchError, map, take } from 'rxjs/operators';

import { RandomGeneratorHelper } from '@modules/core';

@Injectable()
export class InnovatorService {

  private apiUrl = this.environmentStore.ENV.API_URL;

  constructor(
    private http: HttpClient,
    private environmentStore: EnvironmentStore
  ) { }

  submitFirstTimeSigninInfo(data: { [key: string]: any }): Observable<string> {

    const body = {
      actionType: 'first_time_signin',
      user: {
        displayName: data.innovatorName
      },
      innovator: {
        surveyId: RandomGeneratorHelper.generateRandom()
      },
      innovation: {
        name: data.innovationName,
        description: data.innovationDescription,
        countryName: data.locationCountryName || data.location,
        postcode: data.englandPostCode || ''
      },
      organisation: data.isCompanyOrOrganisation === 'yes' ? { name: data.organisationName, size: data.organisationSize } : undefined
    };

    const url = new UrlModel(this.apiUrl).setPath('transactional/api/innovators');
    return this.http.post<{}>(url.buildUrl(), body).pipe(
      take(1),
      map(response => {
        console.log('First Time Signin RESPONSE', response);
        return '';
      }),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );


  }

}
