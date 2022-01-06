import { Component, OnInit } from '@angular/core';

import { CoreComponent, FormControl, FormGroup, Validators } from '@app/base';
import { FormEngineParameterModel, CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-manage-innovations-transfer',
  templateUrl: './manage-innovations-transfer.component.html'
})
export class PageAccountManageInnovationsTransferComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 = 1;
  alert: AlertType = { type: null };

  form = new FormGroup({
    innovation: new FormControl('', { validators: [CustomValidators.required('Please choose an innovation')], updateOn: 'submit' }),
    email: new FormControl('', { validators: [CustomValidators.required('An email is required'), Validators.email], updateOn: 'submit' }),
    confirmation: new FormControl('', { validators: [CustomValidators.required('A confirmation text is neccessry'), CustomValidators.equalTo('transfer my innovation')], updateOn: 'submit' }),
  });
  formInnovationsItems: FormEngineParameterModel['items'] = [];


  constructor(
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Transfer ownership of an innovation');

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
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }


  onSubmitStep(): void {

    if (!this.form.get('innovation')!.valid) {
      this.form.get('innovation')!.markAsTouched();
      return;
    }

    this.stepNumber = 2;

  }

  onSubmitForm(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: { innovationId: string, email: string } = {
      innovationId: this.form.get('innovation')!.value,
      email: this.form.get('email')!.value
    };

    this.innovatorService.transferInnovation(body).subscribe(
      () => {
        this.redirectTo('/innovator/account/manage-innovations');
      },
      () => {
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when creating an action',
          message: 'Please try again or contact us for further help',
          setFocus: true
        };
      }
    );

  }

}
