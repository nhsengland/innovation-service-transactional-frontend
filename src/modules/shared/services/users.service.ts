import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType } from '@app/base/types';
import { GetUsersRequestDTO, UsersListDTO } from '../dtos/users.dto';

export type UserListFiltersType = {
  onlyActive: boolean,
  userTypes: UserRoleEnum[]
  email?: boolean,
  organisationUnitId?: string,
};


@Injectable()
export class UsersService extends CoreService {

  constructor() { super(); }

  getUsersList({ queryParams }: { queryParams?: APIQueryParamsType<UserListFiltersType> } = {}): Observable<UsersListDTO> {
    if (!queryParams) {
      queryParams = { take: 100, skip: 0, filters: { email: false, onlyActive: true, userTypes: [UserRoleEnum.ASSESSMENT] } };
    }
    const { filters, ...qParams } = queryParams;

    const qp = {
      ...qParams,
      userTypes: filters.userTypes,
      fields: filters.email ? ['email'] : [],
      onlyActive: filters.onlyActive ?? false,
      ...(filters.organisationUnitId ? { organisationUnitId: filters.organisationUnitId } : {}),
    }

    const url = new UrlModel(this.API_USERS_URL).addPath('v1').setQueryParams(qp);
    return this.http.get<GetUsersRequestDTO>(url.buildUrl()).pipe(
      take(1),
      map(response => {
        return {
          count: response.count,
          data: response.data.map((item) => {
            return {
              id: item.id,
              isActive: item.isActive,
              name: item.name,
              lockedAt: item.lockedAt,
              role: item.roles[0].role,
              roleDescription: this.stores.authentication.getRoleDescription(item.roles[0].role),
              email: item.email ?? '',
              organisationUnitUserId: item.organisationUnitUserId ?? '',
            }
          })
        }
      })
    );
  }

}
