import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';

export enum FormFieldActionsEnum {
  NEED_MORE_SUPPORT_NOW = 'NEED_MORE_SUPPORT_NOW',
  DEVELOP_FURTHER = 'DEVELOP_FURTHER',
  HAVE_ALL_SUPPORT = 'HAVE_ALL_SUPPORT',
  DECIDED_NOT_TO_PURSUE = 'DECIDED_NOT_TO_PURSUE',
  ALREADY_LIVE_NHS = 'ALREADY_LIVE_NHS'
}

@Component({
  selector: 'app-innovator-pages-innovation-how-to-proceed',
  templateUrl: './how-to-proceed.component.html'
})
export class PageInnovationHowToProceedComponent extends CoreComponent implements OnInit {
  innovationId: string;
  baseUrl: string;
  action: FormFieldActionsEnum;

  form = new FormGroup(
    {
      action: new FormControl<null | FormFieldActionsEnum>(null, {
        validators: CustomValidators.required('Please choose an option')
      })
    },
    { updateOn: 'blur' }
  );

  formfieldAction = {
    title: 'Do you need more support to develop your innovation now?',
    description: '',
    items: [
      {
        value: FormFieldActionsEnum.NEED_MORE_SUPPORT_NOW,
        label: `Yes, I need more support now`
      },
      {
        value: FormFieldActionsEnum.DEVELOP_FURTHER,
        label: `Yes, but I will develop it further and come back`
      },
      {
        value: FormFieldActionsEnum.HAVE_ALL_SUPPORT,
        label: `No, I have all I need for now`
      },
      {
        value: FormFieldActionsEnum.DECIDED_NOT_TO_PURSUE,
        label: `No, I have decided not to pursue this innovation`
      },
      {
        value: FormFieldActionsEnum.ALREADY_LIVE_NHS,
        label: `No, my innovation is already live in the NHS`
      }
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private datePipe: DatePipe
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;

    if (this.action) {
      this.form.get('action')?.setValue(this.action);
    }

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setBackLink('Go back', this.baseUrl);
    this.setPageTitle(this.formfieldAction.title, { showPage: false });
  }

  ngOnInit(): void {
    this.innovationsService.getInnovationInfo(this.innovationId).subscribe({
      next: response => {
        this.formfieldAction.description = `If you do not make a decision your innovation will be archived automatically on ${this.datePipe.transform(response.expectedArchiveDate, this.translate('app.date_formats.long_date'))}. You can continue to edit and update your innovation record when it is archived.`;

        // Redirect to overview if user should not have access to this page
        if (
          !response.daysSinceNoActiveSupport ||
          (response.daysSinceNoActiveSupport && response.daysSinceNoActiveSupport < 7)
        ) {
          this.redirectTo(this.baseUrl);
        } else {
          this.setPageStatus('READY');
        }
      },
      error: () => {
        this.setAlertUnknownError();
        this.setPageStatus('ERROR');
      }
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.form.get('action')?.value) {
      case FormFieldActionsEnum.NEED_MORE_SUPPORT_NOW:
        this.redirectTo(`/innovator/innovations/${this.innovationId}/how-to-proceed/recommend-needs-reassessment`);
        break;
      case FormFieldActionsEnum.DEVELOP_FURTHER:
      case FormFieldActionsEnum.HAVE_ALL_SUPPORT:
      case FormFieldActionsEnum.DECIDED_NOT_TO_PURSUE:
      case FormFieldActionsEnum.ALREADY_LIVE_NHS:
        this.redirectTo(`/innovator/innovations/${this.innovationId}/how-to-proceed/archive`, {
          action: this.form.get('action')?.value
        });
        break;
    }
  }
}
