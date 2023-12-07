import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-innovator-pages-innovation-manage-stop-sharing',
  templateUrl: './manage-stop-sharing.component.html'
})
export class PageInnovationManageStopSharingComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;

  stepNumber: 1 | 2 = 1;

  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.context.getInnovation();

    this.setPageTitle(`Stop sharing '${this.innovation.name}' innovation`, { size: 'l' });
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.form = new FormGroup(
      {
        message: new FormControl<string>('', CustomValidators.required('A message is required')),
        confirmation: new FormControl<string>('', [
          CustomValidators.required('A confirmation text is necessary'),
          CustomValidators.equalTo('stop sharing my innovation')
        ])
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }

  onSubmitForm(): void {
    if (!this.parseForm()) {
      return;
    }

    if (!this.form.valid) {
      return;
    }

    this.innovatorService
      .pauseInnovation(this.innovationId!, this.form.get('message')!.value)
      .pipe(
        concatMap(() => {
          return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
        })
      )
      .subscribe(() => {
        this.setRedirectAlertSuccess('You have stopped sharing your innovation', {
          message:
            'You will not be able to interact with your support organisations anymore. If you would like support in the future, you can resubmit your innovation record for a needs reassessment.'
        });
        this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation`);
      });
  }

  private handleGoBack() {
    this.stepNumber--;

    if (this.stepNumber === 0) {
      this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation/stop-sharing`);
    }
  }

  private parseForm(): boolean {
    switch (this.stepNumber) {
      case 1:
        this.form.get('message')!.markAsTouched();
        if (!this.form.get('message')!.valid) {
          return false;
        }
        this.stepNumber++;
        break;

      case 2:
        this.form.markAllAsTouched();
        break;

      default:
        break;
    }

    return this.form.valid;
  }
}
