import { getUserMinimalInfoDTO } from './../../../../admin/services/service-users.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';


enum FormFieldActionsEnum {
  WITHDRAW = 'WITHDRAW',
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

  form: FormGroup;

  formfieldAction = {
    title: 'Choose how to continue with your innovation',
    description: `There are no organisations actively supporting your innovation at this moment in time. Here's what you can do next.`,
    items: [
      {
        value: FormFieldActionsEnum.NO_ACTION,
        label: `Don´t do anything yet`,
        description: `You might want to leave your innovation idle for a period of time if you're working on something in the background or need a break from progressing with your innovation. This offer to choose your preferred next step will remain active.`
      },
      {
        value: FormFieldActionsEnum.NEEDS_REASSESSMENT,
        label: `See if you qualify for a needs reassessment`,
        description: `You might want to submit your innovation for a needs reassessment if you have significantly progressed your innovation or introduced major changes since the first Needs Assessment. This might mean you need a different type of support.`
      }
    ]
  };


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    const isOwner = this.stores.context.getInnovation().loggedUser.isOwner;

    if (isOwner) {
      this.formfieldAction.items.push({
        value: FormFieldActionsEnum.WITHDRAW,
        label: `Withdraw your innovation`,
        description: `You might want to withdraw your innovation if you no longer need support from the organisations. Your current innovation will be closed, but you will keep your Innovation Service account.`
      },
      {
        value: FormFieldActionsEnum.DELETE_ACCOUNT,
        label: `Delete your account`,
        description: `If you delete your account your innovation will be withdrawn and you will no longer have access to the Innovation Service.`
      });
    }

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setPageTitle(this.formfieldAction.title, { showPage: false });
    this.setBackLink('Go back', this.baseUrl);

    this.form = new FormGroup({
      action: new FormControl<null | FormFieldActionsEnum>(null, { validators: CustomValidators.required('Please choose an option') }),
    }, { updateOn: 'blur' });

    this.setPageStatus('READY');

  }


  onSubmit(): void {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.form.get('action')?.value) {
      case FormFieldActionsEnum.WITHDRAW:
        this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/withdraw`);
        break;

      case FormFieldActionsEnum.DELETE_ACCOUNT:
        this.redirectTo('/innovator/account/manage-account/delete');
        break;

      case FormFieldActionsEnum.NEEDS_REASSESSMENT:
        this.redirectTo(`${this.baseUrl}/how-to-proceed/needs-reassessment-send`);
        break;

      case FormFieldActionsEnum.NO_ACTION:
      default:
        this.setRedirectAlertSuccess('Your innovation will remain with unassigned status for now', { message: 'You can come back here and choose how you want to continue later.' });
        this.redirectTo(this.baseUrl);
        break;
    }

  }

}
