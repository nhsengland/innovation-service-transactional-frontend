import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UserRoleEnum } from '@app/base/enums';
import { MappedObjectType } from '@app/base/types';

import { UserInfo } from '@modules/shared/dtos/users.dto';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { UsersValidationRulesService, ValidationRuleEnum } from '../services/users-validation-rules.service';
import { AdminUsersService } from '../services/users.service';

enum SubmitButton {
  USER_DETAILS = 'Go to user details',
  ADD_USER = 'Add user',
  CONTINUE = 'Continue'
}

type CancelState = { type: 'CANCEL' };
type SuccessState = { type: 'SUCCESS'; redirectTo: string; queryParams?: MappedObjectType; alertMessage?: string };
type ErrorState = { type: 'ERROR' };
type ChangeTitleState = { type: 'CHANGE_TITLE'; title: string };
type PageLoadingState = { type: 'PAGE_STATUS'; isLoading: boolean };
export type UserInformationComponentState =
  | CancelState
  | SuccessState
  | ErrorState
  | ChangeTitleState
  | PageLoadingState;

@Component({
  selector: 'app-admin-pages-user-information',
  templateUrl: './user-information.component.html'
})
export class UserInformationComponent implements OnInit {
  @Input() user: null | (UserInfo & { rolesDescription: string[] }) = null;

  @Input() parentData: null | {
    flags: {
      isBaseCreate: boolean;
      isTeamCreate: boolean;
      isUnitCreate: boolean;
    };
    queryParams: {
      organisationId?: string;
      unitId?: string;
      team: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN;
    };
  } = null;

  @Output() componentStateChangeEmit = new EventEmitter<UserInformationComponentState>();

  componentData: {
    validations: {
      isNonCompatibleRole?: boolean;
      isFromOtherOrg?: boolean;
      isFromSameUnit?: boolean;
    };
    isAddRoleValid?: boolean;
    existingRole?: UserRoleEnum;
    unitName?: string;
  } = { validations: {} };

  submitButton: { isDisabled: boolean; label: SubmitButton } = { isDisabled: false, label: SubmitButton.USER_DETAILS };

  constructor(
    private usersValidationService: UsersValidationRulesService,
    private organisationsService: OrganisationsService,
    private usersService: AdminUsersService
  ) {}

  ngOnInit(): void {
    let role: null | UserRoleEnum = null;

    if (this.parentData && this.user) {
      const isAdmin = this.user.roles.some(r => r.role === UserRoleEnum.ADMIN);
      const isInnovator = this.user.roles.some(r => r.role === UserRoleEnum.INNOVATOR);
      const isNonCompatible = isAdmin || isInnovator || this.parentData.queryParams.team === UserRoleEnum.ADMIN;

      this.componentData.validations.isNonCompatibleRole = isNonCompatible;
      this.componentData.isAddRoleValid = !isNonCompatible;

      if (this.parentData.flags.isBaseCreate) {
        this.buildTitle();
        return;
      }

      if (this.componentData.isAddRoleValid) {
        if (this.parentData.flags.isUnitCreate) {
          const existingRole = this.user.roles.find(
            r => r.role === UserRoleEnum.QUALIFYING_ACCESSOR || r.role === UserRoleEnum.ACCESSOR
          );
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
        this.changeComponentState({ type: 'SUCCESS', redirectTo: `/admin/users/${this.user.id}` });
        break;
      case SubmitButton.ADD_USER:
        const role = this.componentData.existingRole;
        const organisationId = this.parentData?.queryParams.organisationId;
        const unitId = this.parentData?.queryParams.unitId;
        if (!role) {
          return;
        }

        this.usersService
          .addRoles(this.user.id, { role, organisationId, unitIds: unitId ? [unitId] : undefined })
          .subscribe({
            next: () => {
              if (this.user && this.parentData) {
                if (this.parentData.flags.isUnitCreate) {
                  this.changeComponentState({
                    type: 'SUCCESS',
                    redirectTo: `/admin/organisations/${this.parentData.queryParams.organisationId}/unit/${this.parentData.queryParams.unitId}`,
                    alertMessage: 'A new user has been added to the unit'
                  });
                } else if (this.parentData.flags.isTeamCreate) {
                  this.changeComponentState({
                    type: 'SUCCESS',
                    redirectTo: `/admin/organisations/${this.parentData.queryParams.team}`,
                    alertMessage: 'A new user has been added to this team'
                  });
                }
              }
            },
            error: () => {
              this.changeComponentState({ type: 'ERROR' });
            }
          });
        break;
      case SubmitButton.CONTINUE:
        this.changeComponentState({
          type: 'SUCCESS',
          redirectTo: `/admin/users/${this.user?.id}/role/new`,
          queryParams: {
            organisationId: this.parentData?.queryParams.organisationId,
            unitId: this.parentData?.queryParams.unitId
          }
        });
        break;
    }
  }

  emitCancel(): void {
    this.changeComponentState({ type: 'CANCEL' });
  }

  private validateRules(userId: string, role: UserRoleEnum, organisationUnitId?: string): void {
    this.changeComponentState({ type: 'PAGE_STATUS', isLoading: true });

    this.usersValidationService
      .canAddRole(userId, {
        role,
        ...((role === UserRoleEnum.ACCESSOR || role === UserRoleEnum.QUALIFYING_ACCESSOR) && {
          organisationUnitIds: organisationUnitId ? [organisationUnitId] : []
        })
      })
      .subscribe({
        next: rules => {
          const isValid = !rules.some(r => !r.valid);
          if (!isValid) {
            this.componentData.isAddRoleValid = isValid;
          }

          this.componentData.validations.isFromOtherOrg = rules.some(
            r => r.rule === ValidationRuleEnum.UserHasAnyAccessorRoleInOtherOrganisation && !r.valid
          );
          this.componentData.validations.isFromSameUnit = rules.some(
            r => r.rule === ValidationRuleEnum.UserAlreadyHasRoleInUnit && !r.valid
          );

          if (!this.componentData.isAddRoleValid) {
            this.submitButton.label = SubmitButton.USER_DETAILS;

            if (!this.componentData.validations.isFromOtherOrg && !this.componentData.validations.isFromSameUnit) {
              this.componentData.validations.isNonCompatibleRole = true;
            }
          }

          this.buildTitle();
          this.changeComponentState({ type: 'PAGE_STATUS', isLoading: false });
        },
        error: () => {
          this.changeComponentState({ type: 'ERROR' });
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
      next: unit => {
        this.componentData.unitName = unit.name;
        this.buildTitle();
      },
      error: () => {
        this.changeComponentState({ type: 'ERROR' });
      }
    });
  }

  private buildTitle(): void {
    let title = 'This user already exists on the service';
    const displayTeam = this.getDisplayTeam();

    if ((this.parentData?.flags.isUnitCreate && this.componentData.unitName) || this.parentData?.flags.isTeamCreate) {
      if (this.componentData.isAddRoleValid === false) {
        title += `. You can not add them to the ${displayTeam}`;
      } else {
        title += `. Do you want to add them to the ${displayTeam}?`;
      }
    }

    this.changeComponentState({ type: 'CHANGE_TITLE', title });
  }

  private getDisplayTeam(): string {
    if (this.parentData?.flags.isTeamCreate) {
      return this.parentData.queryParams.team === UserRoleEnum.ASSESSMENT
        ? 'needs assessment team'
        : 'service administrators';
    }
    return this.componentData.unitName ?? 'Unknown';
  }

  private changeComponentState(state: UserInformationComponentState): void {
    this.componentStateChangeEmit.next(state);
  }
}
