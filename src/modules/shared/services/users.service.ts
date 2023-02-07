import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';


@Injectable()
export class UsersService extends CoreService {

  constructor() { super(); }

  getAssessmentUsersList(): Observable<{ id: string, name: string }[]> {

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams({ userTypes: [UserRoleEnum.ASSESSMENT], onlyActive: true });
    return this.http.get<{
      id: string,
      name: string,
      type: UserRoleEnum,
      isActive: boolean,
      organisations: {
        name: string;
        role: InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;
        units: { name: string, organisationUnitUserId: string }[]
      }[]
    }[]>(url.buildUrl()).pipe(
      take(1),
      map(response => response.map(item => ({
        id: item.id,
        name: item.name
      })))
    );

  }

}
