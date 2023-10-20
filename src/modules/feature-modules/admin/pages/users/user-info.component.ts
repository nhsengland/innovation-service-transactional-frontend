import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { UserRoleEnum } from '@app/base/enums';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsersValidationRulesService } from '../../services/users-validation-rules.service';
import { AdminUsersService, GetInnovationsByOwnerIdDTO } from '../../services/users.service';


@Component({
  selector: 'app-admin-pages-users-user-info',
  templateUrl: './user-info.component.html'
})
export class PageUserInfoComponent extends CoreComponent implements OnInit {

  user: (UserInfo & { rolesDescription: string[], innovations?: GetInnovationsByOwnerIdDTO }) = { id: '', email: '', name: '', isActive: false, roles: [], rolesDescription: [] };

  canAddRole: boolean = false;
  userHasActiveRoles: boolean = false;
  userHasInactiveRoles: boolean = false;

  accessorRolesCount: number = 0;
  hasActiveAccessorRole: boolean = false;
  isActiveQualifyingAccessor: boolean = false;

  action: { label: string, url: string } = { label: '', url: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService,
    private usersValidationService: UsersValidationRulesService
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
      case 'roleCreationSuccess':
        this.setAlertSuccess('A new user role was added successfully');
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

        const isAdmin = this.user.roles.some(r => r.role === UserRoleEnum.ADMIN);
        const isInnovator = this.user.roles.some(r => r.role === UserRoleEnum.INNOVATOR);
        this.canAddRole = !(isAdmin || isInnovator);

        if (!isAdmin) {
          this.action = { label: userInfo.isActive ? 'Lock user' : 'Unlock user', url: `/admin/users/${userInfo.id}/${userInfo.isActive ? 'lock' : 'unlock'}` };
        }

        const accessorRoles = this.user.roles.filter(r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR);
        if (accessorRoles.length) {
          this.accessorRolesCount = accessorRoles.length;
          this.hasActiveAccessorRole = accessorRoles.some(r => r.isActive === true);
          this.isActiveQualifyingAccessor = accessorRoles.some(r => r.isActive === true && r.role === UserRoleEnum.QUALIFYING_ACCESSOR);
        }

        return forkJoin([
          isInnovator ? this.usersService.getInnovationsByOwnerId(this.user.id) : of(null),
          !(isAdmin || isInnovator) ? this.usersValidationService.canAddAnyRole(userInfo.id) : of(null)
        ])
      })).subscribe({
        next: ([innovations, canAddAnyRoleValidations]) => {
          if (innovations) {
            this.user.innovations = innovations;
          }
          if(canAddAnyRoleValidations) {
            this.canAddRole = !canAddAnyRoleValidations.some(v => !v.valid);
          }
          this.setPageTitle('User information');
          this.setPageStatus('READY');
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertError('Unable to fetch the necessary information', { message: 'Please try again or contact us for further help' });
        }
      });

  }

}
