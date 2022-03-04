import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { AlertType } from '@modules/core';
import { getOrganisationRoleRulesOutDTO, getOrgnisationRoleRulesInDTO, ServiceUsersService } from '../../services/service-users.service';
import { RoutingHelper } from '@modules/core';


@Component({
  selector: 'app-admin-pages-change-user-role',
  templateUrl: './change-user-role.component.html'
})
export class PageServiceChangeUserRole extends CoreComponent implements OnInit {
  alert: AlertType = { type: null };

  user: { id: string, name: string };

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  rulesList: getOrganisationRoleRulesOutDTO[] = [];

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new FormControl('')
  }, { updateOn: 'blur' });

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Change User Role');
    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData(this.activatedRoute).user.displayName };
  }

  ngOnInit(): void { 
    this.setPageStatus('READY');
    this.rulesList = [{
      key: "lastAccessorUserOnOrganisationUnit" as keyof getOrgnisationRoleRulesInDTO,
      valid: true,
      meta:{
        supports:{
          count:17,
          innovations:[
            {
              innovationId:'1FD6CB69-7580-EC11-94F6-0003FF0059E3',
              innovationName:'Refined Rubber Chicken',
              unitId:'F8394E00-86EF-EB11-A7AD-281878026472',
              unitName:'Eastern AHSN'
            }
          ]
        }
      }
    }]
    // this.serviceUsersService.getChangeUserRoleRules(this.user.id).subscribe(
    //   response => {
    //     this.rulesList = response;
    //     this.setPageStatus('READY');
    //   },
    //   () => {
    //     this.setPageStatus('ERROR');
    //     this.alert = {
    //       type: 'ERROR',
    //       title: 'Unable to fetch the necessary information',
    //       message: 'Please try again or contact us for further help'
    //     };
    //   }
    // );
  }

  onSubmit(): void {

    this.form.markAllAsTouched(); // Form is always valid.

    this.securityConfirmation.code = this.form.get('code')!.value;

    this.serviceUsersService.changeUserRole(this.user.id, this.securityConfirmation).subscribe(
      () => {

        this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'lockSuccess' });

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
