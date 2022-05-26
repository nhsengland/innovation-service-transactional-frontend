import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { FormEngineParameterModel, CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-manage-innovations-archival',
  templateUrl: './manage-innovations-archival.component.html'
})
export class PageAccountManageInnovationsArchivalComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

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
      innovation: new FormControl('', { validators: CustomValidators.required('Please, choose an innovation'), updateOn: 'change' }),
      reason: new FormControl(''),
      email: new FormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(user.email, 'The email is incorrect')]),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('archive my innovation')])
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

    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovations transfers',
          message: 'Please, try again or contact us for further help'
        };
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
    ).subscribe(
      () => {
        this.redirectTo('/innovator/account/manage-innovations', { alert: 'archivalSuccess', innovation: this.innovationName });
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occured when archiving the innovation',
          message: 'Please, try again or contact us for further help',
          setFocus: true
        };
      }
    );

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
