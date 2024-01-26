import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService } from '../services/users.service';

type ServiceUserData = Pick<UserInfo, 'id' | 'name' | 'email'>;

@Injectable()
export class ServiceUserDataResolver {
  constructor(private usersService: AdminUsersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ServiceUserData> {
    return this.usersService.getUserInfo(route.params.userId).pipe(
      take(1),
      map(r => ({ id: r.id, name: r.name, email: r.email }))
    );
  }
}
