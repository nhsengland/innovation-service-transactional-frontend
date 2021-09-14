import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { FormEngineParameterModel, CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

@Component({
  selector: 'shared-pages-account-manage-innovations-archival',
  templateUrl: './manage-innovations-archival.component.html'
})
export class PageAccountManageInnovationsArchivalComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 | 3 = 1;
  alert: AlertType = { type: null };
  user: {
    email: string
  };

  form = new FormGroup({
    innovation: new FormControl('', CustomValidators.required('Please, choose an innovation')),
    reason: new FormControl(''),
    email: new FormControl('', [CustomValidators.required('An email is required'), Validators.email]),
    confirmation: new FormControl('', [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('archive my innovation')]),
  });

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
  }

  ngOnInit(): void {
    this.innovatorService.getInnovationTransfers().subscribe(
      response => {
        this.formInnovationsItems = this.stores.authentication.getUserInfo()
          .innovations
          .filter(i => !response.map(it => it.innovation.id).includes(i.id))
          .map(item => ({ value: item.id, label: item.name }));
      },
      () => {
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

    if (this.form.get('email')?.value !== this.user.email) {
      this.alert = {
        type: 'ERROR',
        title: 'Invalid email',
        message: 'Invalid email',
        setFocus: true
      };
      return;
    }

    this.innovatorService.archiveInnovation(this.form.get('innovation')?.value, this.form.get('reason')?.value).subscribe(
      () => {
        this.redirectTo('/innovator/account/manage-innovations', { alert: 'archivalSuccess' });
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
        if (!this.form.get('innovation')?.valid) {
          this.form.get('innovation')?.markAsTouched();
          return false;
        }
        this.innovationName = this.formInnovationsItems?.filter(item => this.form.get('innovation')?.value === item.value)[0].label || '';
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
        break;
    }
  }
}
