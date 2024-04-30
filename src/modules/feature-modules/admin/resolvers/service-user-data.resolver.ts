import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService } from '../services/users.service';

type ServiceUserData = Pick<UserInfo, 'id' | 'name' | 'email'>;

export const serviceUserDataResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot): Observable<ServiceUserData> => {
  const usersService: AdminUsersService = inject(AdminUsersService);

  return usersService.getUserInfo(route.params.userId).pipe(
    take(1),
    map(r => ({ id: r.id, name: r.name, email: r.email }))
  );
};
