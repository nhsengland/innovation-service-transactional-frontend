import { GetInactivateRoleUserRules } from './../../services/users-validation-rules.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { ServiceUsersService } from '../../services/service-users.service';
import { UsersValidationRulesService } from '../../services/users-validation-rules.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';


@Component({
  selector: 'app-admin-pages-service-users-service-user-inactivate-role',
  templateUrl: './service-user-inactivate-role.component.html'
})
export class PageServiceUserInactivateRoleComponent extends CoreComponent implements OnInit {

  user: {
    id: string,
    name: string,
    role: {
      id: string;
      description: string;
    }
   };

  pageStep: 'RULES' | 'INACTIVATE_ROLE' = 'RULES';

  rulesList: GetInactivateRoleUserRules['validations'] = [];

  submitButton = { isActive: true, label: 'Confirm inactivation' };


  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {

    super();

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.name,
      role: { id: this.activatedRoute.snapshot.params.roleId, description: '' }
    };

    this.setPageTitle('Inactivate role');

  }


  ngOnInit(): void {

    forkJoin([
      this.serviceUsersService.getUserInfo(this.user.id),
      this.usersValidationRulesService.getInactivateRoleUserRules(this.user.id, this.user.role.id),
    ]).subscribe({
      next: ([user, validationRules]) => {

        this.user = {
          ...this.user,
          role: user.roles.filter(role => role.id === this.user.role.id).map((r) => ({
            id: r.id,
            description: r.displayTeam ? `${this.stores.authentication.getRoleDescription(r.role)} (${r.displayTeam})` : `${this.stores.authentication.getRoleDescription(r.role)}`
          }))[0] || { id: '', description: '' }
        }

        if (!this.user.role.id) {
          this.redirectTo(`/admin/users/${this.user.id}`);
        }

        this.rulesList = validationRules.validations;

        if (this.rulesList.length === 0) { this.pageStep = 'INACTIVATE_ROLE'; }
        else { this.pageStep = 'RULES'; }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

  nextStep(): void {
    this.pageStep = 'INACTIVATE_ROLE';
  }

  onSubmit(): void {

    this.submitButton = { isActive: false, label: 'Saving...' };

    this.serviceUsersService.updateUserRole(this.user.id, this.user.role.id, false).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(`The role of ${this.user.role.description} has been inactivated`);
        this.redirectTo(`/admin/users/${this.user.id}`);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Confirm inactivation' };
        this.setAlertUnknownError();
      }
    });

  }

}
