import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { concatMap } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormEngineParameterModel } from '@app/base/forms';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'app-innovator-pages-innovation-manage-archive',
  templateUrl: './manage-archive.component.html'
})
export class PageInnovationManageArchiveComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;

  userEmail: string;

  stepNumber: 1 | 2 = 1;

  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.other.innovation();
    this.userEmail = this.stores.authentication.getUserInfo().email;

    this.setPageTitle(`Archive ${this.innovation.name} innovation`, { size: 'xl', width: '2.thirds' });
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    this.form = new FormGroup(
      {
        message: new FormControl<string>('', CustomValidators.required('A message is required')),
        email: new FormControl<string>('', [
          CustomValidators.required('Your email is required'),
          CustomValidators.equalTo(this.userEmail)
        ]),
        confirmation: new FormControl<string>('', [
          CustomValidators.required('A confirmation text is necessary'),
          CustomValidators.equalTo('archive innovation')
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
      .archiveInnovation(this.innovationId!, this.form.get('message')!.value)
      .pipe(
        concatMap(() => {
          return this.stores.authentication.initializeAuthentication$(); // Initialize authentication in order to update First Time SignIn information.
        })
      )
      .subscribe(() => {
        this.setRedirectAlertSuccess('You have archived your innovation', {
          message: 'All support has ended. You cannot send or reply to messages. All open tasks have been cancelled.'
        });
        this.redirectTo(`/innovator/innovations/${this.innovationId}/overview`);
      });
  }

  private handleGoBack() {
    this.stepNumber--;

    if (this.stepNumber === 0) {
      this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation/archive`);
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
