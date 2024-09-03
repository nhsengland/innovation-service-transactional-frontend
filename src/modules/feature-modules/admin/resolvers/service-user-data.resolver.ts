import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserRoleEnum } from '@app/base/enums';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService } from '../services/users.service';

export type ServiceUserData = Pick<UserInfo, 'id' | 'name' | 'email' | 'isActive'> & { isInnovator: boolean };

@Injectable()
export class ServiceUserDataResolver {
  constructor(private usersService: AdminUsersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ServiceUserData> {
    return this.usersService.getUserInfo(route.params.userId).pipe(
      take(1),
      map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        isActive: r.isActive,
        isInnovator: r.roles.some(r => r.role === UserRoleEnum.INNOVATOR)
      }))
    );
  }
}
