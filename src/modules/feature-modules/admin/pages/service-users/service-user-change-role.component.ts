import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { FormControl, FormGroup } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';

import { changeUserRoleDTO, getOrganisationRoleRulesOutDTO, ServiceUsersService } from '../../services/service-users.service';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';


@Component({
  selector: 'app-admin-pages-service-users-service-user-change-role',
  templateUrl: './service-user-change-role.component.html'
})
export class PageServiceUserChangeRoleComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  role: null | InnovatorOrganisationRoleEnum | AccessorOrganisationRoleEnum;

  roleName: string | null;

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  rulesList: getOrganisationRoleRulesOutDTO[] = [];

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new UntypedFormControl('')
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService,
  ) {

    super();
    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName,
    };
    this.roleName = null;
    this.role = null;
  }

  ngOnInit(): void {

    forkJoin([
      this.serviceUsersService.getUserRoleRules(this.user.id),
      this.serviceUsersService.getUserFullInfo(this.user.id)
    ]).subscribe(
      ([rules, userInfo]) => {

        this.rulesList = rules;

        this.role = (userInfo.userOrganisations.map(org => org.role)[0] === AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR) ? AccessorOrganisationRoleEnum.ACCESSOR : AccessorOrganisationRoleEnum.QUALIFYING_ACCESSOR;

        this.roleName = this.stores.authentication.getRoleDescription(this.role);

        this.setPageTitle(`Change role to ${this.roleName}`);

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch the necessary information',
          message: 'Please try again or contact us for further help'
        };
      }
    );


  }

  onSubmit(): void {

    this.form.markAllAsTouched(); // Form is always valid.

    this.securityConfirmation.code = this.form.get('code')!.value;

    const body: changeUserRoleDTO = {
      userId: this.user.id,
      role: this.role,
      securityConfirmation: this.securityConfirmation
    };

    this.serviceUsersService.changeUserRole(body).subscribe(
      () => {

        this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'roleChangeSuccess' });

      },
      (error: { id: string }) => {

        if (!this.securityConfirmation.id && error.id) {

          this.securityConfirmation.id = error.id;
          this.pageStep = 'CODE_REQUEST';

        } else {

          this.form.get('code')!.setErrors({ customError: true, message: 'The code is invalid. Please, verify if you are entering the code received on your e-mail' });

        }

      }
    );

  }

}
