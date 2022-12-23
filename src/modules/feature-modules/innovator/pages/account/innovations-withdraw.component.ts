import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-innovations-withdraw',
  templateUrl: './innovations-withdraw.component.html'
})
export class PageAccountInnovationsWithdrawComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 | 3 = 1;

  user: { email: string };

  form: FormGroup;

  formInnovationsItems: FormEngineParameterModel['items'] = [];

  innovationName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Withdraw innovation');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      email: user.email
    };

    this.form = new FormGroup({
      innovation: new FormControl<string>('', { validators: CustomValidators.required('Please, choose an innovation'), updateOn: 'change' }),
      reason: new FormControl<string>(''),
      email: new FormControl<string>('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(user.email, 'The email is incorrect')]),
      confirmation: new FormControl<string>('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('withdraw my innovation')])
    }, { updateOn: 'blur' }
    );
  }


  ngOnInit(): void {


    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationsList, innovationTransfers]) => {

      this.formInnovationsItems = innovationsList.data
        .filter(i => !innovationTransfers.map(it => it.innovation.id).includes(i.id))
        .map(item => ({ value: item.id, label: item.name }));

      if (this.activatedRoute.snapshot.queryParams.innovationId) { // Pre-select innovation.
        this.form.get('innovation')?.setValue(this.activatedRoute.snapshot.queryParams.innovationId);
      }

      this.setPageStatus('READY');

    });

  }


  onSubmitForm(): void {

    if (!this.parseForm()) { return; }

    if (!this.form.valid) { return; }

    this.innovatorService.withdrawInnovation(this.form.get('innovation')!.value, this.form.get('reason')!.value).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(() => {

      this.setRedirectAlertSuccess(`You have withdrawn the innovation '${this.innovationName}'`);
      this.redirectTo('/innovator/account/manage-innovations');

    });

  }


  private parseForm(): boolean {

    switch (this.stepNumber) {
      case 1:
        this.form.get('innovation')!.markAsTouched();
        if (!this.form.get('innovation')!.valid) { return false; }
        /* istanbul ignore next */
        this.innovationName = this.formInnovationsItems?.filter(item => this.form.get('innovation')!.value === item.value)[0].label || '';
        this.stepNumber++;
        this.setPageTitle('Withdraw \'' + this.innovationName + '\'');
        break;

      case 2:
        this.form.get('reason')!.markAsTouched();
        this.stepNumber++;
        this.setPageTitle('Withdraw \'' + this.innovationName + '\'');
        break;

      case 3:
        this.form.markAllAsTouched();
        break;

      default:
        break;
    }

    return this.form.valid;

  }

}
