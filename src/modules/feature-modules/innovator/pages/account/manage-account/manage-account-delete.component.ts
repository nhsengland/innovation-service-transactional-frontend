import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-manage-account-delete',
  templateUrl: './manage-account-delete.component.html'
})
export class PageAccountManageUserAccountComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  stepNumber: 1 | 2 = 1;

  user: { email: string };

  form: FormGroup;


  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Delete your account');

    const user = this.stores.authentication.getUserInfo();
    this.user = { email: user.email };

    this.form = new FormGroup({
      reason: new FormControl(''),
      email: new FormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(this.user.email, 'The email is incorrect')]),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('delete my account')]),
    });

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
        this.redirectTo('/manage-deleteaccount', {});
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
