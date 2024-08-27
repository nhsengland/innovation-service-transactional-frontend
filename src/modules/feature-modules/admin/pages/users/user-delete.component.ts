import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { FormGroup, UntypedFormControl } from '@angular/forms';
import { CustomValidators } from '@app/base/forms';
import { AdminValidationResponseDTO, UsersValidationRulesService } from '../../services/users-validation-rules.service';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-delete',
  templateUrl: './user-delete.component.html'
})
export class PageUserDeleteComponent extends CoreComponent implements OnInit {
  user: { id: string; name: string };

  pageStep: 'RULES' | 'DELETE_USER' = 'RULES';

  rulesList: AdminValidationResponseDTO['validations'] = [];

  form = new FormGroup(
    {
      confirmation: new UntypedFormControl('', [
        CustomValidators.required('A confirmation text is necessary'),
        CustomValidators.equalTo("delete user's account")
      ])
    },
    { updateOn: 'blur' }
  );

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

    this.setPageTitle('Delete user', { hint: this.user.name });
  }

  ngOnInit(): void {
    this.usersValidationRulesService.getAdminOperationUserRules(this.user.id, 'DELETE_USER').subscribe({
      next: response => {
        this.rulesList = response.validations;

        if (this.rulesList.length === 0) {
          this.pageStep = 'DELETE_USER';
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
    this.pageStep = 'DELETE_USER';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.usersService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.setRedirectAlertInformation('User deleted successfully');
        this.redirectTo(`/admin/users`, { alert: 'deleteSuccess' });
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
