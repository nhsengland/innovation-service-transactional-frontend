import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { ServiceUsersService } from '../../services/service-users.service';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { UserRoleEnum } from '@app/base/enums';


@Component({
  selector: 'app-admin-pages-users-user-info',
  templateUrl: './user-info.component.html'
})
export class PageUserInfoComponent extends CoreComponent implements OnInit {

  user: (UserInfo & { rolesDescription: string[] }) = { id: '', email: '', name: '', isActive: false, roles: [], rolesDescription: [], };

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

    this.usersService.getUserInfo(this.activatedRoute.snapshot.params.userId).subscribe({
      next: (response) => {
        this.user = {
          ...response,
          rolesDescription: response.roles.map(r => {
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
          this.action = { label: response.isActive ? 'Lock user' : 'Unlock user', url: `/admin/users/${response.id}/service-users/${response.isActive ? 'lock' : 'unlock'}` };
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
