import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { ServiceUsersService } from '../../services/service-users.service';


@Component({
  selector: 'app-admin-pages-admin-users-admin-user-delete',
  templateUrl: './admin-user-delete.component.html'
})
export class PageAdminUserDeleteComponent extends CoreComponent {

  pageStep: 'DELETE' | 'CODE_REQUEST' | 'SUCCESS' = 'DELETE';

  securityConfirmation = { id: '', code: '' };

  submitBtnClicked = false;

  user: { id: string };

  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceUsersService: ServiceUsersService
  ) {

    super();
    this.setPageTitle('Delete admin account');

    this.user = { id: this.activatedRoute.snapshot.params.userId };

    this.form = new FormGroup({
      reason: new FormControl(''),
      code: new FormControl(''),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('delete the administrator')]),
    }, { updateOn: 'blur' });

  }

  onSubmitForm(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitBtnClicked = true;

    this.securityConfirmation.code = this.form.get('code')!.value;

    this.serviceUsersService.deleteAdminAccount(this.user.id, this.securityConfirmation).subscribe(
      response => {
        this.redirectTo(`admin/administration-users`, { alert: 'adminDeletedSuccess' });
      },
      (error) => {
        this.submitBtnClicked = false;

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
