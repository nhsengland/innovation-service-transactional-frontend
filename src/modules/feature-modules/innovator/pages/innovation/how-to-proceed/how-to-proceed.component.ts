import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

export enum FormFieldActionsEnum {
  NEED_MORE_SUPPORT_NOW = 'NEED_MORE_SUPPORT_NOW',
  WILL_DEVELOP_AND_COME_BACK = 'WILL_DEVELOP_AND_COME_BACK',
  HAVE_ALL_I_NEED = 'HAVE_ALL_I_NEED',
  DECIDED_NOT_TO_PURSUE = 'DECIDED_NOT_TO_PURSUE',
  INNOVATION_IS_ALREADY_LIVE = 'INNOVATION_IS_ALREADY_LIVE'
}

@Component({
  selector: 'app-innovator-pages-innovation-how-to-proceed',
  templateUrl: './how-to-proceed.component.html'
})
export class PageInnovationHowToProceedComponent extends CoreComponent {
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
    description: `If you do not make a decision your innovation will be archived automatically on DD Month YYYY. You can continue to edit and update your innovation record when it is archived.`,
    items: [
      {
        value: FormFieldActionsEnum.NEED_MORE_SUPPORT_NOW,
        label: `Yes, I need more support now`
      },
      {
        value: FormFieldActionsEnum.WILL_DEVELOP_AND_COME_BACK,
        label: `Yes, but I will develop it further and come back`
      },
      {
        value: FormFieldActionsEnum.HAVE_ALL_I_NEED,
        label: `No, I have all I need for now`
      },
      {
        value: FormFieldActionsEnum.DECIDED_NOT_TO_PURSUE,
        label: `No, I have decided not to pursue this innovation`
      },
      {
        value: FormFieldActionsEnum.INNOVATION_IS_ALREADY_LIVE,
        label: `No, my innovation is already live in the NHS`
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;

    if (this.action) {
      this.form.get('action')?.setValue(this.action);
    }

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setPageTitle(this.formfieldAction.title, { showPage: false });
    this.setBackLink('Go back', this.baseUrl);

    this.setPageStatus('READY');
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
      case FormFieldActionsEnum.WILL_DEVELOP_AND_COME_BACK:
      case FormFieldActionsEnum.HAVE_ALL_I_NEED:
      case FormFieldActionsEnum.DECIDED_NOT_TO_PURSUE:
      case FormFieldActionsEnum.INNOVATION_IS_ALREADY_LIVE:
        this.redirectTo(`/innovator/innovations/${this.innovationId}/how-to-proceed/archive`, {
          ...(this.form.get('action')?.value && { action: this.form.get('action')!.value })
        });
        break;
    }
  }
}
