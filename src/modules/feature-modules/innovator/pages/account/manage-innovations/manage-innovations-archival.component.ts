import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';

import { CoreComponent, FormControl, FormGroup } from '@app/base';
import { FormEngineParameterModel, CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

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
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Archive an innovation');

    const user = this.stores.authentication.getUserInfo();
    this.user = {
      email: user.email
    };

    this.form = new FormGroup({
      innovation: new FormControl('', CustomValidators.required('Please, choose an innovation')),
      reason: new FormControl(''),
      email: new FormControl('', [CustomValidators.required('An email is required'), CustomValidators.equalTo(user.email, 'The email is incorrect')]),
      confirmation: new FormControl('', [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('archive my innovation')]),
    });
  }

  ngOnInit(): void {

    this.innovatorService.getInnovationTransfers().subscribe(
      response => {

        this.formInnovationsItems = this.stores.authentication.getUserInfo()
          .innovations
          .filter(i => !response.map(it => it.innovation.id).includes(i.id))
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

  onSubmitStep(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    this.stepNumber++;
    this.setStepTitle();
  }

  onSubmitForm(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

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

  private validateForm(step: number): boolean {

    switch (step) {
      case 1:
        if (!this.form.get('innovation')!.valid) {
          this.form.get('innovation')!.markAsTouched();
          return false;
        }
        /* istanbul ignore next */
        this.innovationName = this.formInnovationsItems?.filter(item => this.form.get('innovation')!.value === item.value)[0].label || '';
        break;
      case 2:
        break;
      default:
        break;
    }

    return true;
  }

  private setStepTitle(): void {
    switch (this.stepNumber) {
      case 1:
        this.setPageTitle('Archive an innovation');
        break;
      case 2:
      case 3:
        this.setPageTitle('Archive \'' + this.innovationName + '\'');
        break;
      default:
        this.setPageTitle('');
        break;
    }
  }

}
