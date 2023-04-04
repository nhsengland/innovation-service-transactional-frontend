import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { ContextInnovationType } from '@modules/stores';


@Component({
  selector: 'app-innovator-pages-innovation-manage-withdraw',
  templateUrl: './manage-withdraw.component.html'
})
export class PageInnovationManageWithdrawComponent extends CoreComponent implements OnInit {

  innovationId: string;
  stepNumber: 1 | 2 = 1;
  innovation: ContextInnovationType;
  roleIdUser: string | undefined;

  user: { email: string };

  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();
    this.roleIdUser = this.stores.authentication.getUserContextInfo()?.roleId;

    this.setPageTitle(`Withdraw '${this.innovation.name}' innovation`);
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      email: user.email
    };

    this.form = new FormGroup({
      reason: new FormControl<string>('', CustomValidators.required('A reason is required')),
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

      this.setRedirectAlertInformation(`Your '${this.innovation.name}' innovation has been withdrawn`);
      this.redirectTo('/innovator/dashboard');

    });

  }

  private handleGoBack() {

    this.stepNumber--;

    if (this.stepNumber === 0) {
      this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation`);
    }

  }


  private parseForm(): boolean {

    switch (this.stepNumber) {
      case 1:
        this.form.get('reason')!.markAsTouched();
        if (!this.form.get('reason')!.valid) { return false; }
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
