import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

export enum FormFieldActionsEnum {
  ARCHIVE = 'ARCHIVE',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  NEEDS_REASSESSMENT = 'NEEDS_REASSESSMENT',
  NO_ACTION = 'NO_ACTION'
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
    title: 'Decide what to do next with your innovation',
    description: `There are no organisations currently providing support to your innovation. Here's what you can do next.`,
    items: [
      {
        value: FormFieldActionsEnum.NEEDS_REASSESSMENT,
        label: `Submit for needs reassessment`,
        description: `Update your innovation record before you submit for needs reassessment to get access to the right support.`
      },
      {
        value: FormFieldActionsEnum.NO_ACTION,
        label: `Decide later`,
        description: `If you're not sure what to do next, you can decide later.`
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.action = this.activatedRoute.snapshot.queryParams.action;

    const isOwner = this.ctx.innovation.isOwner();

    if (isOwner) {
      this.formfieldAction.items.splice(
        1,
        0,
        {
          value: FormFieldActionsEnum.ARCHIVE,
          label: `Archive your innovation`,
          description: `You can continue to edit and update your innovation record when it is archived. You cannot access support during this time. If you want support on your innovation in future, you can submit your record for a needs reassessment.`
        },
        {
          value: FormFieldActionsEnum.DELETE_ACCOUNT,
          label: `Delete your account`,
          description: `If you delete your account, your innovations will be archived and your collaborators will lose access to them. You will not be able to access the NHS Innovation Service.`
        }
      );
    }

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
      case FormFieldActionsEnum.ARCHIVE:
        this.redirectTo(`${this.baseUrl}/how-to-proceed/archive`, {
          action: FormFieldActionsEnum.ARCHIVE // update this to have the new available actions in the flow
        });
        break;

      case FormFieldActionsEnum.DELETE_ACCOUNT:
        this.redirectTo('/innovator/account/manage-account/delete', {
          action: FormFieldActionsEnum.DELETE_ACCOUNT
        });
        break;

      case FormFieldActionsEnum.NEEDS_REASSESSMENT:
        this.redirectTo(`${this.baseUrl}/how-to-proceed/needs-reassessment-send`, {
          action: FormFieldActionsEnum.NEEDS_REASSESSMENT
        });
        break;

      case FormFieldActionsEnum.NO_ACTION:
      default:
        this.setRedirectAlertSuccess('There is no active support for your innovation', {
          message:
            'You can decide whether to submit your innovation for a needs reassessment, archive your innovation or delete your account at any time.'
        });
        this.redirectTo(this.baseUrl);
        break;
    }
  }
}
