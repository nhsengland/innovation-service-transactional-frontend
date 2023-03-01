import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormGroup, FormEngineParameterModel, Validators } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-innovator-pages-innovation-manage-transfer',
  templateUrl: './manage-transfer.component.html'
})
export class PageInnovationManageTransferComponent extends CoreComponent implements OnInit {

  innovationId: string;

  form = new FormGroup({
    email: new UntypedFormControl('', [CustomValidators.required('An email is required'), Validators.email]),
    confirmation: new UntypedFormControl('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('transfer my innovation')]),
  }, { updateOn: 'blur' });

  formInnovationsItems: FormEngineParameterModel['items'] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Transfer ownership');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }

  onSubmitForm(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: { innovationId: string, email: string } = {
      innovationId: this.innovationId!,
      email: this.form.get('email')!.value
    };


    this.innovatorService.transferInnovation(body).subscribe({
      next: () => {
        this.redirectTo(`/innovator/innovations/${this.innovationId}/manage-innovation`);
      },
      error: () => {
        this.setAlertError('An error occurred when transferring innovation ownership. Please check the details and try again or contact us for further info.');
      }
    });

  }

}
