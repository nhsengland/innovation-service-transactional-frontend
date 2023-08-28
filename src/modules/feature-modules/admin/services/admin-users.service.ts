import { Injectable } from '@angular/core';
import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { map, Observable, take } from 'rxjs';


@Injectable()
export class AdminUsersService extends CoreService {

  constructor() { super(); }

  createUser(body: { [key: string]: any }): Observable<{ id: string }> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users');
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  addRoles(userId: string, body: { role: UserRoleEnum, organisationId?: string, unitIds?: string[] }): Observable<{ id: string }[]> {

    const url = new UrlModel(this.API_ADMIN_URL).addPath('v1/users/:userId/roles').setPathParams({ userId });
    return this.http.post<{ id: string }[]>(url.buildUrl(), body).pipe(take(1), map(response => response));
  }

}
