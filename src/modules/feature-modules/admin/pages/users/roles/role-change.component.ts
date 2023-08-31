import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { AccessorOrganisationRoleEnum, UserRoleEnum } from '@app/base/enums';
import { FormGroup } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';


import { UserInfo } from '@modules/shared/dtos/users.dto';
import { UsersValidationRulesService, getOrganisationRoleRulesOutDTO } from '../../../services/users-validation-rules.service';
import { AdminUsersService, changeUserRoleDTO } from '../../../services/users.service';


@Component({
  selector: 'app-admin-pages-users-role-change',
  templateUrl: './role-change.component.html'
})
export class PageUsersRoleChangeComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  organisation: null | UserInfo['roles'][0]['organisation'];

  role: null | AccessorOrganisationRoleEnum;

  roleName: string | null;

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  rulesList: getOrganisationRoleRulesOutDTO[] = [];

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new UntypedFormControl('')
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService,
    private usersValidationRulesService: UsersValidationRulesService
  ) {

    super();
    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName,
    };
    this.roleName = null;
    this.role = null;
    this.organisation = null;
  }

  ngOnInit(): void {

    forkJoin([
      this.usersService.getUserInfo(this.user.id),
      this.usersValidationRulesService.getUserRoleRules(this.user.id)
    ]).subscribe({
      next: ([user, rules]) => {

        this.rulesList = rules;

        // TODO: ALl this component needs to be updated for the "roles". This is just to remove a uneeded endpoint
        this.organisation = user.roles[0].organisation;
        this.role = user.roles.some(r => r.role === UserRoleEnum.ACCESSOR) ? AccessorOrganisationRoleEnum.ACCESSOR : AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR;

        this.roleName = this.stores.authentication.getRoleDescription(this.role);

        this.setPageTitle(`Change role to ${this.roleName}`, { hint: this.user.name });

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');

        this.setAlertError('Unable to fetch the necessary information', { message: 'Please try again or contact us for further help' })
      }
    });


  }

  onSubmit(): void {

    if (this.role === null || this.organisation === null) {
      return;
    }

    this.form.markAllAsTouched(); // Form is always valid.

    this.securityConfirmation.code = this.form.get('code')!.value;

    const body: changeUserRoleDTO = {
      role: {
        name: this.role,
        organisationId: this.organisation?.id ?? ''
      },
      securityConfirmation: this.securityConfirmation
    };

    this.usersService.changeUserRole(this.user.id, body).subscribe(
      () => {

        this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'roleChangeSuccess' });

      },
      (error: { id: string }) => {

        if (!this.securityConfirmation.id && error.id) {

          this.securityConfirmation.id = error.id;
          this.pageStep = 'CODE_REQUEST';

        } else {

          this.form.get('code')!.setErrors({ customError: true, message: 'The code is invalid. Please, verify if you are entering the code received on your email' });

        }

      }
    );

  }

}
