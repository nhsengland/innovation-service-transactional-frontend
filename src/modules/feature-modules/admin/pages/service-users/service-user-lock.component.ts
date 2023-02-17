import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { ServiceUsersService } from '../../services/service-users.service';
import { AdminValidationResponseDTO, UsersValidationRulesService } from '../../services/users-validation-rules.service';


@Component({
  selector: 'app-admin-pages-service-users-service-user-lock',
  templateUrl: './service-user-lock.component.html'
})
export class PageServiceUserLockComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string, role: null | string };

  pageStep: 'RULES' | 'LOCK_USER' = 'RULES';

  rulesList: AdminValidationResponseDTO['validations'] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {

    super();

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName,
      role: null
    };

    this.setPageTitle('Lock user', { hint: this.user.name });

  }


  ngOnInit(): void {

    forkJoin([
      this.serviceUsersService.getUserFullInfo(this.user.id),
      this.usersValidationRulesService.getLockUserRules(this.user.id)
    ]).subscribe({
      next: ([userInfo, response]) => {

        this.rulesList = response.validations;
        this.user.role = this.stores.authentication.getRoleDescription(userInfo.type);

        if (this.rulesList.length === 0) { this.pageStep = 'LOCK_USER'; }
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
    this.pageStep = 'LOCK_USER';
  }

  onSubmit(): void {

    this.serviceUsersService.lockUser(this.user.id).subscribe({
      next: () => this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'lockSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
