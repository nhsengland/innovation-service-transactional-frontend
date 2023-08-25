import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { GetInnovationsByOwnerIdDTO, ServiceUsersService } from '../../services/service-users.service';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { UserRoleEnum } from '@app/base/enums';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-admin-pages-users-user-info',
  templateUrl: './user-info.component.html'
})
export class PageUserInfoComponent extends CoreComponent implements OnInit {

  user: (UserInfo & { rolesDescription: string[], innovations?: GetInnovationsByOwnerIdDTO }) = { id: '', email: '', name: '', isActive: false, roles: [], rolesDescription: [] };

  userIsAdminOrInnovator: boolean = false;
  userHasActiveRoles: boolean = false;
  userHasInactiveRoles: boolean = false;

  action: { label: string, url: string } = { label: '', url: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: ServiceUsersService
  ) {

    super();

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'lockSuccess':
        this.setAlertSuccess('User locked successfully');
        break;
      case 'unlockSuccess':
        this.setAlertSuccess('User unlocked successfully');
        break;
      case 'userCreationSuccess':
        this.setAlertSuccess('A new user has been added to the service');
        break;
      case 'roleChangeSuccess':
        this.setAlertSuccess('User role changed successfully');
        break;
      case 'unitChangeSuccess':
        this.setAlertSuccess('Organisation unit has been successfully changed')
        break;
      default:
        break;
    }

  }

  ngOnInit(): void {

    this.usersService.getUserInfo(this.activatedRoute.snapshot.params.userId).pipe(
      switchMap(userInfo => {
        this.user = {
          ...userInfo,
          rolesDescription: userInfo.roles.map(r => {
            let roleDescription = this.stores.authentication.getRoleDescription(r.role);
            if(r.displayTeam) {
              roleDescription += ` (${r.displayTeam})`;
            }

            if(r.isActive) {
              this.userHasActiveRoles = true;
            } else {
              this.userHasInactiveRoles = true;
            }

            return roleDescription;
          })
        };

        this.userIsAdminOrInnovator = this.user.roles[0].role === UserRoleEnum.ADMIN || this.user.roles[0].role === UserRoleEnum.INNOVATOR;

        if (this.user.roles[0].role !== UserRoleEnum.ADMIN) {
          this.action = { label: userInfo.isActive ? 'Lock user' : 'Unlock user', url: `/admin/users/${userInfo.id}/service-users/${userInfo.isActive ? 'lock' : 'unlock'}` };
        }

        return this.user.roles[0].role === UserRoleEnum.INNOVATOR ? this.usersService.getInnovationsByOwnerId(this.user.id) : of(null);

      })).subscribe({
        next: (innovations) => {
        if(innovations) {
          this.user.innovations = innovations;
        }
        this.setPageTitle('User information');
        this.setPageStatus('READY');
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertError('Unable to fetch the necessary information', { message: 'Please try again or contact us for further help'});
        }
    });

  }

}
