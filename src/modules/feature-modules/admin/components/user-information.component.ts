import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AdminUsersService } from '../services/admin-users.service';
import { UsersValidationRulesService, ValidationRuleEnum } from '../services/users-validation-rules.service';

enum SubmitButton {
  USER_DETAILS = 'Go to user details',
  ADD_USER = 'Add user',
  CONTINUE = 'Continue'
}

@Component({
  selector: 'app-admin-pages-user-information',
  templateUrl: './user-information.component.html',
})
export class UserInformationComponent extends CoreComponent implements OnInit {

  @Input() user: null | (UserInfo & { rolesDescription: string[] }) = null;

  @Input() parentData: null | {
    flags: {
      isBaseCreate: boolean,
      isTeamCreate: boolean,
      isUnitCreate: boolean,
    },
    queryParams: {
      organisationId?: string,
      unitId?: string,
      team: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN
    };
  } = null;

  @Output() cancelEmit = new EventEmitter<boolean>();

  componentData: {
    validations: {
      isAdmin?: boolean,
      isInnovator?: boolean,
      isFromOtherOrg?: boolean,
      isFromSameUnit?: boolean,
    },
    isAddRoleValid?: boolean,
    existingRole?: UserRoleEnum,
    unitName?: string,
  } = { validations: {} };

  submitButton: { isDisabled: boolean, label: SubmitButton } = { isDisabled: false, label: SubmitButton.USER_DETAILS };

  constructor(
    private usersValidationService: UsersValidationRulesService,
    private organisationsService: OrganisationsService,
    private adminUsersService: AdminUsersService
  ) { super(); }

  ngOnInit(): void {

    let role: null | UserRoleEnum = null;

    if (this.parentData && this.user) {

      this.componentData.validations.isAdmin = this.user.roles.some(r => r.role === UserRoleEnum.ADMIN);
      this.componentData.validations.isInnovator = this.user.roles.some(r => r.role === UserRoleEnum.INNOVATOR);
      this.componentData.isAddRoleValid = !this.componentData.validations.isAdmin && !this.componentData.validations.isInnovator;

      if (this.parentData.flags.isBaseCreate) {
        this.buildTitle();
        return;
      }

      if (this.componentData.isAddRoleValid) {

        if (this.parentData.flags.isUnitCreate) {
          const existingRole = this.user.roles.find(r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR);
          if (existingRole) {
            role = existingRole.role;
          }
        }

        if (this.parentData.flags.isTeamCreate) {
          role = this.parentData.queryParams.team;
        }

        if (role) {
          this.submitButton.label = SubmitButton.ADD_USER;
          this.componentData.existingRole = role;
          this.validateRules(this.user.id, role, this.parentData.queryParams.unitId);
        } else {
          this.submitButton.label = SubmitButton.CONTINUE;
        }

      }

      this.getUnitName();
      this.buildTitle();
    }

  }

  onSubmit(): void {

    if (!this.user) {
      return;
    }

    switch (this.submitButton.label) {
      case SubmitButton.USER_DETAILS:
        this.redirectTo(`/admin/users/${this.user.id}`);
        break;
      case SubmitButton.ADD_USER:
        const role = this.componentData.existingRole;
        const organisationId = this.parentData?.queryParams.organisationId;
        const unitId = this.parentData?.queryParams.unitId;
        if (!role) {
          return;
        }

        this.adminUsersService.addRoles(this.user.id, { role, organisationId, unitIds: unitId ? [unitId] : undefined }).subscribe({
          next: () => {
            if (this.user) {
              if (this.parentData) {
                if (this.parentData.flags.isUnitCreate) {
                  this.setRedirectAlertSuccess('A new user has been added to the unit');
                  this.redirectTo(`/admin/organisations/${this.parentData.queryParams.organisationId}/unit/${this.parentData.queryParams.unitId}`);
                } else if (this.parentData.flags.isTeamCreate) {
                  this.setRedirectAlertSuccess('A new user has been added to the team');
                  this.redirectTo(`/admin/organisations/${this.parentData.queryParams.team}`);
                }
              } else {
                // This will never happen!
                this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'roleCreationSuccess' });
              }
            }
          },
          error: () => {
            this.setPageStatus('ERROR');
            this.setAlertUnknownError();
          },
        });
        break;
      case SubmitButton.CONTINUE:
        this.redirectTo(`/admin/users/${this.user?.id}/service-users/role/new`, { organisationId: this.parentData?.queryParams.organisationId, unitId: this.parentData?.queryParams.unitId });
        break;
    }


  }

  emitCancel(): void {
    this.cancelEmit.next(true);
  }

  private validateRules(userId: string, role: UserRoleEnum, organisationUnitId?: string): void {
    this.usersValidationService.canAddRole(
      userId,
      { role, ...((role === UserRoleEnum.ACCESSOR || role === UserRoleEnum.QUALIFYING_ACCESSOR) && { organisationUnitId }) }
    ).subscribe({
      next: (rules) => {

        const isValid = !rules.some(r => !r.valid);
        if (!isValid) {
          this.componentData.isAddRoleValid = isValid;
        }

        this.componentData.validations.isFromOtherOrg = rules.some(r => r.rule === ValidationRuleEnum.UserHasAnyAccessorRoleInOtherOrganisation && !r.valid);
        this.componentData.validations.isFromSameUnit = rules.some(r => r.rule === ValidationRuleEnum.UserAlreadyHasRoleInUnit && !r.valid);

        if (!this.componentData.isAddRoleValid) {
          this.submitButton.label = SubmitButton.USER_DETAILS;
        }

        this.buildTitle();

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  private getUnitName(): void {
    const organisationId = this.parentData?.queryParams.organisationId;
    const unitId = this.parentData?.queryParams.unitId;

    if (!organisationId || !unitId || this.componentData.unitName) {
      return;
    }

    this.organisationsService.getOrganisationUnitInfo(organisationId, unitId).subscribe({
      next: (unit) => {
        this.componentData.unitName = unit.name;
        this.buildTitle();
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    })
  }

  private buildTitle(): void {

    let title = 'This user already exists on the service';
    let displayTeam = this.getDisplayTeam();

    if ((this.parentData?.flags.isUnitCreate && this.componentData.unitName) || this.parentData?.flags.isTeamCreate) {

      if (this.componentData.isAddRoleValid === false) {
        title += `. You can not add them to the ${displayTeam}`
      } else {
        title += `. Do you want to add them to the ${displayTeam}?`
      }

    }

    this.setPageTitle(title, { size: 'l' });

  }

  private getDisplayTeam(): string {
    if (this.parentData?.flags.isTeamCreate) {
      return this.parentData.queryParams.team === UserRoleEnum.ASSESSMENT ? 'Needs assessment team' : 'Service administrators';
    }
    return this.componentData.unitName ?? 'Unknown';
  }
}
