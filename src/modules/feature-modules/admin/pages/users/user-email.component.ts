import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '@modules/shared/forms';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-email',
  templateUrl: './user-email.component.html'
})
export class PageUserEmailComponent extends CoreComponent {
  user: { id: string; name: string; email: string };
  form = new FormGroup(
    {
      email: new FormControl('', [
        CustomValidators.required('Email is required'),
        CustomValidators.validEmailValidator()
      ]),
      emailConfirmation: new FormControl<string>('', [
        CustomValidators.required('Confirmation email is required'),
        CustomValidators.validEmailValidator()
      ])
    },
    { updateOn: 'blur' }
  );

  submitButton = { isActive: true, label: 'Confirm' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();

    this.setPageTitle("Change user's email");

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: this.activatedRoute.snapshot.data.user.name,
      email: this.activatedRoute.snapshot.data.user.email
    };

    this.setPageStatus('READY');
  }

  onSubmit(): void {
    this.resetAlert();

    this.submitButton = { isActive: false, label: 'Saving...' };

    const email = this.form.get('email')?.value;
    const emailConfirmation = this.form.get('emailConfirmation')?.value;

    if (email !== emailConfirmation) {
      this.setAlertError('The email addresses do not match');
      this.form.get('emailConfirmation')?.setErrors({ customError: true, message: 'The email addresses do not match' });
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.submitButton = { isActive: true, label: 'Confirm' };
      return;
    }

    if (email) {
      this.usersService.changeUserEmail(this.user.id, email).subscribe({
        next: () => this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'changeEmailSuccess' }),
        error: res => {
          this.submitButton = { isActive: true, label: 'Confirm' };
          if (res.status === 409) {
            this.form
              .get('email')
              ?.setErrors({ customError: true, message: 'Another user is registered with this email address' });
            this.setAlertError('Another user is registered with this email address');
          } else {
            this.setAlertUnknownError();
          }
        }
      });
    }
  }
}
