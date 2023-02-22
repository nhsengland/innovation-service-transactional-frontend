import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { UserSearchDTO } from '../dtos/users.dto';


@Injectable()
export class UsersService extends CoreService {

  constructor() { super(); }

  // this could probably be a envelop for a shared getUsersList method
  getAssessmentUsersList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ userTypes: [UserRoleEnum.ASSESSMENT], onlyActive: true });
    return this.http.get<UserSearchDTO[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({
        id: item.id,
        name: item.name
      })))
    );

  }

}
