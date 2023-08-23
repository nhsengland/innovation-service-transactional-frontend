import { getInactivateRoleUserRules } from './../../services/users-validation-rules.service';
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
    },
   } = { id: '', name: '', role: { id: '', description: '' } };

  pageStep: 'RULES' | 'INACTIVATE_ROLE' = 'RULES';

  rulesList: getInactivateRoleUserRules['validations'] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {

    super();

    this.user = {
      ...this.user,
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName,
      role: { id: this.activatedRoute.snapshot.params.roleId, description: '' }
    };

    this.setPageTitle('Inactivate role', { hint: this.user.name });

  }


  ngOnInit(): void {

    forkJoin([
      this.serviceUsersService.getUserInfo(this.user.id),
      this.usersValidationRulesService.getInactivateRoleUserRules(this.user.id, this.user.role.id),
    ]).subscribe({
      next: ([user, validationRules]) => {

        this.user = {
          ...this.user,
          role: user.roles.map((r) => ({
            id: r.id,
            description: r.displayTeam ? `${this.stores.authentication.getRoleDescription(r.role)} (${r.displayTeam})` : `${this.stores.authentication.getRoleDescription(r.role)}`
          })).filter(role => role.id === this.user.role.id)[0]
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

    this.serviceUsersService.updateUserRole(this.user.id, this.user.role.id, false).subscribe({
      next: () => {
        this.setRedirectAlertSuccess(`The role of ${this.user.role.description} has been inactivate`);
        this.redirectTo(`/admin/users/${this.user.id}`);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
