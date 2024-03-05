import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { NotificationContextDetailEnum } from '@modules/stores/context/context.enums';

enum FormFieldActionsEnum {
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

  form: FormGroup;

  formfieldAction = {
    title: 'Decide what to do next with your innovation',
    description: `There are no organisations currently providing support to your innovation. Here's what you can do next.`,
    items: [
      {
        value: FormFieldActionsEnum.NEEDS_REASSESSMENT,
        label: `Find out if you qualify for a needs reassessment`,
        description: `If you have significantly progressed your innovation or introduced major changes since your first needs assessment, you can submit your innovation for a needs reassessment. You may be offered a different type of support following the reassessment.`
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
    const isOwner = this.stores.context.getInnovation().loggedUser.isOwner;

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

    this.baseUrl = `/innovator/innovations/${this.innovationId}`;

    this.setPageTitle(this.formfieldAction.title, { showPage: false });
    this.setBackLink('Go back', this.baseUrl);

    this.form = new FormGroup(
      {
        action: new FormControl<null | FormFieldActionsEnum>(null, {
          validators: CustomValidators.required('Please choose an option')
        })
      },
      { updateOn: 'blur' }
    );

    // Throw notification read dismiss.
    this.stores.context.dismissNotification(this.innovationId, {
      contextDetails: [NotificationContextDetailEnum.AU03_INNOVATOR_IDLE_SUPPORT]
    });

    this.setPageStatus('READY');
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.form.get('action')?.value) {
      case FormFieldActionsEnum.ARCHIVE:
        this.redirectTo(`/innovator/innovations/${this.innovationId}/manage/innovation/archive`);
        break;

      case FormFieldActionsEnum.DELETE_ACCOUNT:
        this.redirectTo('/innovator/account/manage-account/delete');
        break;

      case FormFieldActionsEnum.NEEDS_REASSESSMENT:
        this.redirectTo(`${this.baseUrl}/how-to-proceed/needs-reassessment-send`);
        break;

      case FormFieldActionsEnum.NO_ACTION:
      default:
        this.setRedirectAlertSuccess('Your innovation will remain with unassigned status for now', {
          message: 'You can come back here and choose how you want to continue later.'
        });
        this.redirectTo(this.baseUrl);
        break;
    }
  }
}
