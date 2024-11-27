import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { AdminUsersService, changeUserRoleDTO, GetInnovationsByInnovatorIdDTO } from '../../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-role-change',
  templateUrl: './role-change.component.html'
})
export class PageUsersRoleChangeComponent extends CoreComponent implements OnInit {
  user: UserInfo & { rolesDescription: string[]; innovations?: GetInnovationsByInnovatorIdDTO } = {
    id: '',
    email: '',
    name: '',
    isActive: false,
    roles: [],
    rolesDescription: []
  };

  currentRole = '';
  newRole = '';

  userHasActiveRoles = false;
  userHasInactiveRoles = false;

  submitButton = { isActive: true, label: 'Change role' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();

    this.user.id = this.activatedRoute.snapshot.params.userId;
  }

  ngOnInit(): void {
    this.usersService.getUserInfo(this.user.id).subscribe({
      next: userInfo => {
        userInfo.roles = userInfo.roles.filter(
          r => r.role === UserRoleEnum.ACCESSOR || r.role === UserRoleEnum.QUALIFYING_ACCESSOR
        );

        if (userInfo.roles.filter(r => r.isActive).length === 0) {
          this.redirectTo('/admin/dashboard');
          return;
        }

        this.currentRole =
          userInfo.roles[0].role === UserRoleEnum.QUALIFYING_ACCESSOR ? 'qualifying accessor' : 'accessor';
        this.newRole = userInfo.roles[0].role === UserRoleEnum.QUALIFYING_ACCESSOR ? 'accessor' : 'qualifying accessor';

        this.user = {
          ...userInfo,
          rolesDescription: userInfo.roles.map(r => {
            let roleDescription = this.ctx.user.getRoleDescription(r.role);
            if (r.displayTeam) {
              roleDescription += ` (${r.displayTeam})`;
            }

            if (r.isActive) {
              this.userHasActiveRoles = true;
            } else {
              this.userHasInactiveRoles = true;
            }

            return roleDescription;
          })
        };

        this.setPageTitle(
          `Change ${this.currentRole} ${userInfo.roles.length > 1 ? 'roles' : 'role'} to ${this.newRole}`
        );

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');

        this.setAlertError('Unable to fetch the necessary information', {
          message: 'Please try again or contact us for further help'
        });
      }
    });
  }

  onSubmit(): void {
    this.submitButton = { isActive: true, label: 'Saving...' };

    const body: changeUserRoleDTO = {
      role: {
        name:
          this.user.roles[0].role === UserRoleEnum.QUALIFYING_ACCESSOR
            ? UserRoleEnum.ACCESSOR
            : UserRoleEnum.QUALIFYING_ACCESSOR,
        organisationId: this.user.roles[0].organisation?.id ?? ''
      }
    };

    this.usersService.changeUserRole(this.user.id, body).subscribe({
      next: () => {
        this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'roleChangeSuccess' });
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Change role' };
        this.setAlertUnknownError();
      }
    });
  }
}
