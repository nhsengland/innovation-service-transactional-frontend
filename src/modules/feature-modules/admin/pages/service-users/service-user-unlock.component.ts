import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormGroup } from '@app/base/forms';
import { RoutingHelper } from '@app/base/helpers';

import { getLockUserRulesOutDTO, ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-service-users-service-user-unlock',
  templateUrl: './service-user-unlock.component.html'
})
export class PageServiceUserUnlockComponent extends CoreComponent implements OnInit {

  user: { id: string, name: string };

  pageStep: 'RULES_LIST' | 'CODE_REQUEST' | 'SUCCESS' = 'RULES_LIST';

  rulesList: getLockUserRulesOutDTO[] = [];

  securityConfirmation = { id: '', code: '' };

  form = new FormGroup({
    code: new UntypedFormControl('')
  }, { updateOn: 'blur' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService
  ) {

    super();

    this.user = { id: this.activatedRoute.snapshot.params.userId, name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName };

    this.setPageTitle('Unlock user', { hint: this.user.name });

  }


  ngOnInit(): void {

    this.serviceUsersService.getUserFullInfo(this.user.id).subscribe({

      next: response => {

        if (!response.lockedAt) {
          this.redirectTo(`admin/service-users/${this.user.id}`);
          return;
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch the necessary information', { message: 'Please try again or contact us for further help' });
      }

    });

  }


  onSubmit(): void {

    this.form.markAllAsTouched(); // Form is always valid.

    this.securityConfirmation.code = this.form.get('code')!.value;

    this.serviceUsersService.unlockUser(this.user.id, this.securityConfirmation).subscribe({
      next: () => {

        this.redirectTo(`admin/service-users/${this.user.id}`, { alert: 'unlockSuccess' });

      },
      error: (error: { id: string }) => {

        if (!this.securityConfirmation.id && error.id) {

          this.securityConfirmation.id = error.id;
          this.pageStep = 'CODE_REQUEST';

        } else {

          this.form.get('code')!.setErrors({ customError: true, message: 'The code is invalid. Please, verify if you are entering the code received on your email' });

        }

      }
    });

  }

}
