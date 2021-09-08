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

  form = new FormGroup({
    innovation: new FormControl('', CustomValidators.required('Please, choose an innovation')),
    reason: new FormControl(''),
    email: new FormControl('', [CustomValidators.required('An email is required'), Validators.email]),
    confirmation: new FormControl('', [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('archive my innovation')]),
  });

  formInnovationsItems: FormEngineParameterModel['items'] = [];

  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Archive an innovation');

  }

  ngOnInit(): void {
    const user = this.stores.authentication.getUserInfo();
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

    const body: { innovationId: string, reason: string, email: string } = {
      innovationId: this.form.get('innovation')?.value,
      email: this.form.get('email')?.value,
      reason: this.form.get('reason')?.value
    };

    this.innovatorService.transferInnovation(body).subscribe(
      () => {
        this.redirectTo('/innovator/account/manage-innovations');
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occured when creating an action',
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
        this.setPageTitle('Archive '  + this.form.get('innovation')?.value);
        break;
      case 3:
        this.setPageTitle('Archive ' + this.form.get('innovation')?.value);
        break;
      default:
        break;
    }
  }
}
