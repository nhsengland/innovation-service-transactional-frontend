import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-account-innovations-stop-sharing',
  templateUrl: './innovations-stop-sharing.component.html'
})
export class PageAccountInnovationsStopSharingComponent extends CoreComponent implements OnInit {

  stepNumber: 1 | 2 | 3 = 1;

  form: FormGroup;

  formInnovationsItems: FormEngineParameterModel['items'] = [];

  innovationName = '';

  constructor(
    private innovatorService: InnovatorService,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Stop sharing an innovation', { size: 'l' });
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.form = new FormGroup({
      innovation: new FormControl<string>('', { validators: CustomValidators.required('Please, choose an innovation'), updateOn: 'change' }),
      message: new FormControl<string>('', CustomValidators.required('A message is required')),
      confirmation: new FormControl<string>('', [CustomValidators.required('A confirmation text is necessary'), CustomValidators.equalTo('stop sharing my innovation')])
    }, { updateOn: 'blur' }
    );
  }


  ngOnInit(): void {

    this.innovationsService.getInnovationsList({ queryParams: { take: 100, skip: 0, filters: { status: [InnovationStatusEnum.IN_PROGRESS] } } }).subscribe((innovations) => {

      this.formInnovationsItems = innovations.data.map(item => ({ value: item.id, label: item.name }));

      this.setPageStatus('READY');

    });

  }


  onSubmitForm(): void {

    if (!this.parseForm()) { return; }

    if (!this.form.valid) { return; }

    this.innovatorService.pauseInnovation(this.form.get('innovation')!.value, this.form.get('message')!.value).pipe(
      concatMap(() => {
        return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
      })
    ).subscribe(() => {

      this.setRedirectAlertSuccess('You have stopped sharing your innovation', { message: 'You will not be able to interact with your support organisations anymore. You can reshare your innovation in the future by submitting it to a needs reassessment.' });
      this.redirectTo('/innovator/account/manage-innovations');

    });

  }

  private handleGoBack() {

    this.stepNumber--;
    
    if (this.stepNumber === 0) {
      this.redirectTo('/innovator/account/manage-innovations/stop-sharing');
    }

    if (this.stepNumber === 1) {
      this.setPageTitle('Stop sharing an innovation', { size: 'l' });
    }

  }


  private parseForm(): boolean {

    switch (this.stepNumber) {
      case 1:
        this.form.get('innovation')!.markAsTouched();
        if (!this.form.get('innovation')!.valid) { return false; }
        this.innovationName = this.formInnovationsItems?.filter(item => this.form.get('innovation')!.value === item.value)[0].label ?? '';
        this.stepNumber++;
        this.setPageTitle('Stop sharing \'' + this.innovationName + '\' innovation', { size: 'l' });
        break;

      case 2:
        this.form.get('message')!.markAsTouched();
        if (!this.form.get('message')!.valid) { return false; }
        this.stepNumber++;
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
