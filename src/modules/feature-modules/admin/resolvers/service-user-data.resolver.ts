import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { UsersService } from '@modules/shared/services/users.service';

type ServiceUserData = Pick<UserInfo, 'id' | 'name'>;

@Injectable()
export class ServiceUserDataResolver implements Resolve<ServiceUserData> {

  constructor(private usersService: UsersService) { }


  resolve(route: ActivatedRouteSnapshot): Observable<ServiceUserData> {

    return this.usersService.getUserInfo(route.params.userId).pipe(
      take(1),
      map(r => ({ id: r.id, name: r.name }))
    );

  }

}
