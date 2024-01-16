import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@modules/shared/forms';
import { AdminUsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-pages-users-user-email',
  templateUrl: './user-email.component.html'
})
export class PageUserEmailComponent extends CoreComponent {
  user: { id: string; name: string };
  form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmation: new FormControl<string>('', [
        CustomValidators.required('A confirmation text is necessary'),
        CustomValidators.equalTo('change email')
      ])
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: AdminUsersService
  ) {
    super();

    this.user = {
      id: this.activatedRoute.snapshot.params.userId,
      name: RoutingHelper.getRouteData<any>(this.activatedRoute).user.displayName
    };

    this.setBackLink('Go back');
    this.setPageTitle('Change user email', { hint: this.user.name });
    this.setPageStatus('READY');
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.get('email')?.value;
    if (email) {
      this.usersService.changeUserEmail(this.user.id, email).subscribe({
        next: () => this.redirectTo(`/admin/users/${this.user.id}`, { alert: 'changeEmailSuccess' }),
        error: res => {
          if (res.status === 409) {
            this.form.get('email')?.setErrors({ conflict: true });
            this.setAlertError('User email already exists');
          } else {
            this.setPageStatus('ERROR');
            this.setAlertUnknownError();
          }
        }
      });
    }
  }
}
