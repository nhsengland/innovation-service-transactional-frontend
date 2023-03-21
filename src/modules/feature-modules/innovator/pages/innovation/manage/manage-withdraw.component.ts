import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-manage-withdraw',
  templateUrl: './manage-withdraw.component.html'
})
export class PageInnovationManageWithdrawComponent extends CoreComponent implements OnInit {

  innovationId: string;
  stepNumber: 1 | 2 = 1;

  user: { email: string };

  form: FormGroup;

  innovationName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovationName = this.stores.context.getInnovation().name;

    this.setPageTitle('Withdraw this innovation');
    this.setBackLink('Go back', `/innovator/innovations/${this.innovationId}/manage/innovation`);

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      email: user.email
    };

    this.form = new FormGroup({
      reason: new FormControl<string>(''),
      email: new FormControl<string>('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(user.email, 'The email is incorrect')]),
      confirmation: new FormControl<string>('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('withdraw my innovation')])
    }, { updateOn: 'blur' }
    );
  }


  ngOnInit(): void {

    this.setPageStatus('READY');

  }


  onSubmitForm(): void {

    if (!this.parseForm()) { return; }

    if (!this.form.valid) { return; }

    this.innovatorService.withdrawInnovation(this.innovationId!, this.form.get('reason')!.value).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(() => {

      this.setRedirectAlertSuccess(`You have withdrawn the innovation '${this.innovationName}'`);
      this.redirectTo('/innovator/dashboard');

    });

  }


  private parseForm(): boolean {

    switch (this.stepNumber) {
      case 1:
        this.form.get('reason')!.markAsTouched();
        this.stepNumber++;
        break;

      case 2:
        this.form.markAllAsTouched();
        break;

      default:
        break;
    }

    return this.form.valid;

  }

}
