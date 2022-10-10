import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormControl, FormGroup, FormEngineParameterModel } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-innovations-archival',
  templateUrl: './innovations-archival.component.html'
})
export class PageAccountInnovationsArchivalComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 | 3 = 1;

  user: { email: string };

  form: FormGroup;

  formInnovationsItems: FormEngineParameterModel['items'] = [];

  innovationName = '';

  constructor(
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Archive an innovation');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      email: user.email
    };

    this.form = new FormGroup({
      innovation: new UntypedFormControl('', { validators: CustomValidators.required('Please, choose an innovation'), updateOn: 'change' }),
      reason: new UntypedFormControl(''),
      email: new UntypedFormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(user.email, 'The email is incorrect')]),
      confirmation: new UntypedFormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('archive my innovation')])
    }, { updateOn: 'blur' }
    );
  }


  ngOnInit(): void {


    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationsList, innovationTransfers]) => {

      this.formInnovationsItems = innovationsList
        .filter(i => !innovationTransfers.map(it => it.innovation.id).includes(i.id))
        .map(item => ({ value: item.id, label: item.name }));

      this.setPageStatus('READY');

    }
    );

  }


  onSubmitForm(): void {

    if (!this.parseForm()) { return; }

    if (!this.form.valid) { return; }

    this.innovatorService.archiveInnovation(this.form.get('innovation')!.value, this.form.get('reason')!.value).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe({
      next: () => {

        this.setRedirectAlertSuccess(`You have archived the innovation '${this.innovationName}'`);
        this.redirectTo('/innovator/account/manage-innovations');

      },
      error: () => {
        this.setAlertError('An error occured when archiving the innovation. Please, try again or contact us for further help');
      }
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
        this.setPageTitle('Archive \'' + this.innovationName + '\'');
        break;

      case 2:
        this.form.get('reason')!.markAsTouched();
        this.stepNumber++;
        this.setPageTitle('Archive \'' + this.innovationName + '\'');
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
