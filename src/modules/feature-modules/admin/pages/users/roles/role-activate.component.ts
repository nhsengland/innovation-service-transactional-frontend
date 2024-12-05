import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetActivateRoleUserRules,
  ValidationRuleEnum,
  Validations
} from '../../../services/users-validation-rules.service';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { UsersValidationRulesService } from '../../../services/users-validation-rules.service';
import { AdminUsersService } from '../../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-role-activate',
  templateUrl: './role-activate.component.html'
})
export class PageUsersRoleActivateComponent extends CoreComponent implements OnInit {
  user: {
    id: string;
    name: string;
    role: { id: string; description: string };
  };

  validations: Validations<GetActivateRoleUserRules>['validations'] = [];
  rulesToShow: Validations<GetActivateRoleUserRules>['validations'] = [];

  submitButton = { isActive: true, label: 'Confirm' };

  activationFailed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {
    super();

    const userInfo = RoutingHelper.getRouteData<any>(this.activatedRoute).user;

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: userInfo.name,
      role: { id: this.activatedRoute.snapshot.params.roleId, description: '' }
    };

    this.setPageTitle('Activate role');
  }

  ngOnInit(): void {
    forkJoin([
      this.usersService.getUserInfo(this.user.id),
      this.usersValidationRulesService.getActivateRoleUserRules(this.user.id, this.user.role.id)
    ]).subscribe({
      next: ([user, validationRules]) => {
        this.user = {
          ...this.user,
          role: user.roles
            .filter(role => role.id === this.user.role.id)
            .map(r => ({
              id: r.id,
              description: r.displayTeam
                ? `${this.ctx.user.getRoleDescription(r.role).toLowerCase()} (${r.displayTeam})`
                : `${this.ctx.user.getRoleDescription(r.role).toLowerCase()}`
            }))[0] ?? { id: '', description: '' }
        };

        if (!this.user.role.id) {
          this.redirectTo(`/admin/users/${this.user.id}`);
        }

        this.validations = validationRules.validations;
        this.rulesToShow = validationRules.validations.filter(v =>
          [
            ValidationRuleEnum.UserHasAnyAccessorRoleInOtherOrganisation,
            ValidationRuleEnum.OrganisationUnitIsActive
          ].includes(v.rule)
        );

        this.submitButton.isActive = !this.validations.some(v => v.valid === false);

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onSubmit(): void {
    this.submitButton = { isActive: true, label: 'Saving...' };

    if (this.validations.some(v => v.valid === false)) {
      this.setAlertError(`An error occured while activating this user's role`);
      this.activationFailed = true;
      this.submitButton = { isActive: false, label: 'Confirm' };
    } else {
      this.usersService.updateUserRole(this.user.id, this.user.role.id, true).subscribe({
        next: () => {
          this.setRedirectAlertSuccess(`The role of ${this.user.role.description} has been activated`);
          this.redirectTo(`/admin/users/${this.user.id}`);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Confirm activation' };
          this.setAlertUnknownError();
        }
      });
    }
  }
}
