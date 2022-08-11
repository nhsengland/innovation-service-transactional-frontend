import { Component } from '@angular/core';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-account-delete',
  templateUrl: './account-delete.component.html'
})
export class PageAccountDeleteComponent extends CoreComponent {

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
