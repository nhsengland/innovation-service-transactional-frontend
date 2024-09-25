import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { UserRoleEnum } from '@app/base/enums';
import { UserInfo } from '@modules/shared/dtos/users.dto';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UsersValidationRulesService } from '../../services/users-validation-rules.service';
import {
  AdminUsersService,
  AssignedInnovationsList,
  GetInnovationsByInnovatorIdDTO
} from '../../services/users.service';
import { TableModel } from '@app/base/models';
import { get } from 'lodash';

type AssignedInnovationData = AssignedInnovationsList['data'][0];

@Component({
  selector: 'app-admin-pages-users-user-info',
  templateUrl: './user-info.component.html'
})
export class PageUserInfoComponent extends CoreComponent implements OnInit {
  user: UserInfo & { rolesDescription: string[]; innovations?: GetInnovationsByInnovatorIdDTO } = {
    id: '',
    email: '',
    name: '',
    isActive: false,
    roles: [],
    rolesDescription: []
  };

  canAddRole: boolean = false;
  userHasActiveRoles: boolean = false;
  userHasInactiveRoles: boolean = false;

  accessorRolesCount: number = 0;
  hasActiveAccessorRole: boolean = false;
  isActiveQualifyingAccessor: boolean = false;

  action: { label: string; url: string } = { label: '', url: '' };

  rawAssignedInnovations: AssignedInnovationData[] = [];
  assignedInnovations: undefined | TableModel<AssignedInnovationData, {}>;

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
        this.setAlertSuccess('Organisation unit has been successfully changed');
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.usersService
      .getUserInfo(this.activatedRoute.snapshot.params.userId)
      .pipe(
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
            this.action = {
              label: userInfo.isActive ? 'Lock user' : 'Unlock user',
              url: `/admin/users/${userInfo.id}/${userInfo.isActive ? 'lock' : 'unlock'}`
            };
          }

          const accessorRoles = this.user.roles.filter(
            r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR
          );
          if (accessorRoles.length) {
            this.accessorRolesCount = accessorRoles.length;
            this.hasActiveAccessorRole = accessorRoles.some(r => r.isActive === true);
            this.isActiveQualifyingAccessor = accessorRoles.some(
              r => r.isActive === true && r.role === UserRoleEnum.QUALIFYING_ACCESSOR
            );
          }

          return forkJoin([
            isInnovator ? this.usersService.getInnovationsByInnovatorId(this.user.id, true) : of(null),
            this.canAddRole ? this.usersValidationService.canAddAnyRole(this.user.id) : of(null),
            !isInnovator && !isAdmin ? this.usersService.getAssignedInnovations(this.user.id) : of(null)
          ]);
        })
      )
      .subscribe({
        next: ([innovations, canAddAnyRoleValidations, assignedInnovations]) => {
          if (innovations) {
            // To display first the innovations owned by the innovator, and then the innovations where the innovator collaborate.
            this.user.innovations = innovations.sort((a, b) => Number(b.isOwner) - Number(a.isOwner));
          }
          if (canAddAnyRoleValidations) {
            this.canAddRole = !canAddAnyRoleValidations.some(v => !v.valid);
          }
          if (assignedInnovations) {
            this.initAssignedInnovations(assignedInnovations.data);
          }
          this.setPageTitle('User information');
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

  private initAssignedInnovations(assignedInnovations: AssignedInnovationData[]) {
    this.rawAssignedInnovations = assignedInnovations;
    this.assignedInnovations = new TableModel<AssignedInnovationData, {}>({
      visibleColumns: {
        innovation: { label: 'Innovation', orderable: true },
        supportedBy: { label: 'Supported by' },
        unit: { label: 'Organisation / Unit', orderable: true }
      },
      pageSize: 10,
      orderBy: 'innovationName',
      orderDir: 'descending'
    });
    this.onAssignedInnovationsPageChange({ pageNumber: 1 });
  }

  onAssignedInnovationsPageChange(event?: { pageNumber: number }): void {
    if (!this.assignedInnovations) return;

    if (event?.pageNumber) {
      this.assignedInnovations.setPage(event.pageNumber);
    }

    const qp = this.assignedInnovations.getAPIQueryParams();

    const raw = this.rawAssignedInnovations;

    for (const [field, dir] of Object.entries(qp.order ?? {})) {
      let key;
      switch (field) {
        case 'innovation':
          key = 'innovation.name';
          break;
        case 'unit':
          key = 'unit';
          break;
      }

      if (key) {
        raw.sort((a, b) => {
          const value1 = get(a, key) as string;
          const value2 = get(b, key) as string;
          return dir === 'ASC' ? value1.localeCompare(value2) : value2.localeCompare(value1);
        });
      }
    }

    this.assignedInnovations.setData(raw.slice(qp.skip, qp.skip + qp.take), raw.length);
  }

  onTableOrder(column: string): void {
    if (!this.assignedInnovations) return;

    this.assignedInnovations.setOrderBy(column);
    this.onAssignedInnovationsPageChange();
  }
}
