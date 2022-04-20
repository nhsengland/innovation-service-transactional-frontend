import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'pages-admin-users-delete',
  templateUrl: './admin-users-delete.component.html'
})
export class PageAdminDeleteComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  stepNumber: 1 | 2 = 1;

  // user: { email: string };
  user: { id: string };
  form: FormGroup;


  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Delete admin account');

    const user = this.stores.authentication.getUserInfo();
    this.user = { id: user.email };

    this.form = new FormGroup({
      reason: new FormControl(''),
      email: new FormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(this.user.id, 'The email is incorrect')]),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('delete my account')]),
    }, { updateOn: 'blur' });

  }

  onSubmitStep(): void {
    this.stepNumber++;
  }

  onSubmitForm(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: { reason: string } = {
      reason: this.form.get('reason')?.value
    };

    this.innovatorService.deleteUserAccount(body).subscribe(
      () => {
        this.redirectTo('/delete-account-message', {});
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occured while deleting user',
          message: 'Please, try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
