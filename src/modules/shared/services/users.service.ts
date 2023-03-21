import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { UsersListDTO } from '../dtos/users.dto';


@Injectable()
export class UsersService extends CoreService {

  constructor() { super(); }

  // this could probably be a envelop for a shared getUsersList method
  getAssessmentUsersList(): Observable<{ id: string, name: string }[]> {
    const qp = { take: 100, skip: 0, filters: { userTypes: [UserRoleEnum.ASSESSMENT], onlyActive: true} }

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams(qp);
    return this.http.get<UsersListDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => response.data.map(item => ({
        id: item.id,
        name: item.name
      })))
    );

  }

}
