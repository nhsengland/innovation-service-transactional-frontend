import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { FormEngineParameterModel, CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

@Component({
  selector: 'shared-pages-account-manage-account-delete',
  templateUrl: './manage-account-delete.component.html'
})
export class PageAccountManageUserAccountComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 = 1;
  alert: AlertType = { type: null };
  users: {
    email: string,
    userId: string
  };
  form: FormGroup;
  innovationName = '';

  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Delete your account');

    const user = this.stores.authentication.getUserInfo();
    this.users = {
      email: user.email,
      userId: user.id
    };

    this.form = new FormGroup({
      reason: new FormControl(''),
      email: new FormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(this.users.email, 'The email is incorrect')]),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('delete my account')]),
    });
  }

  onSubmitStep(): void {
    this.stepNumber++;
    this.setStepTitle();
  }

  onSubmitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: { reason: string } = {
      reason: this.form.get('reason')?.value
    };

    this.innovatorService.deleteUserAccount(this.users.userId, body).subscribe(
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

  private setStepTitle(): void {
    switch (this.stepNumber) {
      case 1:
        this.setPageTitle('Delete your account');
        break;
      case 2:
        this.setPageTitle('Delete your account');
        break;
      default:
        break;
    }
  }
}
