import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { AdminValidationResponseDTO, UsersValidationRulesService } from '../../services/users-validation-rules.service';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-lock',
  templateUrl: './user-lock.component.html'
})
export class PageUserLockComponent extends CoreComponent implements OnInit {
  user: { id: string; name: string };

  pageStep: 'RULES' | 'LOCK_USER' = 'RULES';

  rulesList: AdminValidationResponseDTO['validations'] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {
    super();

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName
    };

    this.setPageTitle('Lock user', { hint: this.user.name });
  }

  ngOnInit(): void {
    this.usersValidationRulesService.getAdminOperationUserRules(this.user.id, 'LOCK_USER').subscribe({
      next: response => {
        this.rulesList = response.validations;

        if (this.rulesList.length === 0) {
          this.pageStep = 'LOCK_USER';
        } else {
          this.pageStep = 'RULES';
        }

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
    this.usersService.lockUser(this.user.id).subscribe({
      next: () => this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'lockSuccess' }),
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
