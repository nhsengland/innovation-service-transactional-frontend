import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UrlModel } from '@modules/core';
import { HttpHeaders } from '@angular/common/http';


export type lockUserEndpointDTO = {
  objectId?: string;
};

export type searchUserEndpointDTO = {
  id: string;
  displayName: string;
  type: 'INNOVATOR' | 'ACCESSOR' | 'ASSESSMENT' | 'ADMIN',
  email: string;
  lockedAt?: Date,
  userOrganisations?: [{
    id: string;
    name: string;
    acronym: string;
    role: string;
    units?: [{
      id: string;
      name: string;
      acronym: string;
    }]
  }]
};

@Injectable()
export class ServiceUsersService extends CoreService {

  constructor() { super(); }

  lockUser(body: { reason: string }, securityConfirmation?: { id: string, code: string }): Observable<lockUserEndpointDTO> {

    let headers = { 'x-2ls-id': '', 'x-2ls-code': '' };

    if (securityConfirmation) {
      headers = { 'x-2ls-id': securityConfirmation.id, 'x-2ls-code': securityConfirmation.code };
    }

    const ro = {
      headers: new HttpHeaders(headers)
    };

    const url = new UrlModel(this.API_URL).addPath('/user-admin/ping').setQueryParams({code: securityConfirmation?.code, id: securityConfirmation?.id});
    return this.http.post<lockUserEndpointDTO>(url.buildUrl(), { }, ro).pipe(
      take(1),
      map(response => response),
      catchError(error => throwError({
        objectId: error.error.id
      }))
    );

  }

  searchUser(email: string): Observable<searchUserEndpointDTO[]> {
    const url = new UrlModel(this.API_URL).addPath('/user-admin/users').setQueryParams({ email });

    return this.http.get<searchUserEndpointDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response),
    );
  }

}
