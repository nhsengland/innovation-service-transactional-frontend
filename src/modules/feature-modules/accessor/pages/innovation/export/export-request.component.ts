import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-export-request',
  templateUrl: './export-request.component.html'
})
export class InnovationExportRequestComponent extends CoreComponent implements OnInit {

  innovationId: string;
  stepNumber: number;

  form = new FormGroup({
    requestReason: new FormControl<string>('', CustomValidators.required('A explanation is required')),
  }, { updateOn: 'blur' });

  private stepperInfo: { [key: number]: { title: string } } = {
    1: { title: 'Export innovation record' },
    2: { title: 'Request permission to export innovation record' },
    3: { title: 'Explain why you need to export this innovation record' }
  }

  private titleSettings: { width: 'full' | '2.thirds' } = { width: '2.thirds' };

  private isFirstTime = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.stepNumber = 0;

  }

  ngOnInit(): void {

    this.setPageTitle('Export innovation record', this.titleSettings);
    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous'));

    this.innovationsService.getExportRequestsList(this.innovationId, { take: 1, skip: 0, filters: {} }).subscribe(response => {

      this.isFirstTime = response.count === 0;

      this.stepNumber = this.isFirstTime ? 1 : 2;

      this.setPageStatus('READY');

    });

  }

  onSubmitStep(direction: 'previous' | 'next'): void {

    switch (direction) {

      case 'previous':
        if ((this.stepNumber === 1 && this.isFirstTime) || (this.stepNumber === 2 && !this.isFirstTime)) {
          this.redirectTo(`/accessor/innovations/${this.innovationId}/record`);
          return;
        }
        this.stepNumber--;
        break;

      case 'next':
        if (this.stepNumber === 3) { return; }
        this.stepNumber++;
        break;

    }

    this.setPageTitle(this.stepperInfo[this.stepNumber].title, this.titleSettings);

  }

  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      requestReason: this.form.get('requestReason')?.value ?? ''
    }

    this.accessorService.createExportRequest(this.innovationId, body).subscribe(() => {

      this.setRedirectAlertSuccess('You\'ve requested permission to export this innovation record', { message: 'The innovator has been notified of your request. If the innovator approves everyone from your organisation unit will be able to export the innovation record for the next 30 days.' });
      this.redirectTo(`/accessor/innovations/${this.innovationId}/export/list`);

    });

  }


}
