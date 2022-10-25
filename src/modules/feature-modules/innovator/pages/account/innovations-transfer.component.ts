import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup, FormEngineParameterModel, Validators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'shared-pages-account-innovations-transfer',
  templateUrl: './innovations-transfer.component.html'
})
export class PageAccountInnovationsTransferComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 = 1;

  form = new FormGroup({
    innovation: new UntypedFormControl('', { validators: CustomValidators.required('Please choose an innovation'), updateOn: 'change' }),
    email: new UntypedFormControl('', [CustomValidators.required('An email is required'), Validators.email]),
    confirmation: new UntypedFormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('transfer my innovation')]),
  }, { updateOn: 'blur' });

  formInnovationsItems: FormEngineParameterModel['items'] = [];


  constructor(
    private innovationsService: InnovationsService,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Transfer ownership of an innovation');

  }

  ngOnInit(): void {

    forkJoin([
      this.innovationsService.getInnovationsList(),
      this.innovatorService.getInnovationTransfers()
    ]).subscribe(([innovationsList, innovationTransfers]) => {

      this.formInnovationsItems = innovationsList.data.filter(i => !innovationTransfers.map(it => it.innovation.id).includes(i.id))
        .map(item => ({ value: item.id, label: item.name }));

      this.setPageStatus('READY');
    });

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

    this.innovatorService.transferInnovation(body).subscribe({
      next: () => {
        this.redirectTo('/innovator/account/manage-innovations');
      },
      error: () => {
        this.setAlertError('An error occurred when transferring innovation ownership. Please check the details and try again or contact us for further info.');
      }
    });

  }

}
