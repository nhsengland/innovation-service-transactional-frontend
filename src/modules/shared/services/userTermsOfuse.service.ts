import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError, timer } from 'rxjs';
import { CoreService } from '@app/base';
import { APIQueryParamsType, MappedObject, UrlModel } from '@modules/core';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';

export type userTermsOfUse = {
    id: string,
    name: string,
    summary: string,
    releasedAt?: string,
    isAccepted: string
  };

@Injectable()
  export class UserTermsOfUseService extends CoreService {

    constructor() { super(); }

    userTermsOfUseInfo(): Observable<any> {

      const url = new UrlModel(this.API_URL).addPath('/tou/me');
      return this.http.get<userTermsOfUse>(url.buildUrl()).pipe(
        take(1),
        map(response => response)
      );
    }

    agreeTermsById(touId: string): Observable<any> {
      // const body = Object.assign({}, data);

      const url = new UrlModel(this.API_URL).addPath('/tou/:touId/accept').setPathParams({ touId });
      return this.http.patch<any>(url.buildUrl(), {}).pipe(
        take(1),
        map(response => response)
      );
    }

  }
