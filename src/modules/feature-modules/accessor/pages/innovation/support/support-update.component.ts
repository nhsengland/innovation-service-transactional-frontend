import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum, UserRoleEnum } from '@app/base/enums';
import { CustomValidators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { ContextPageLayoutType } from '@modules/stores/context/context.types';
import { AccessorService } from '../../../services/accessor.service';

@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {
  private accessorsList: { id: string; userRoleId: string; name: string }[] = [];

  innovationId: string;
  supportId: string;
  stepNumber: number;

  formAccessorsList: { value: string; label: string }[] = [];
  selectedAccessors: typeof this.accessorsList = [];
  userOrganisationUnit: null | { id: string; name: string; acronym: string };

  supportStatus = Object.entries(this.stores.innovation.INNOVATION_SUPPORT_STATUS)
    .map(([key, item]) => ({
      key,
      checked: false,
      ...item
    }))
    .filter(x => !x.hidden);

  availableSupportStatuses: string[];

  chosenStatus: null | InnovationSupportStatusEnum = null;

  form = new FormGroup(
    {
      status: new FormControl<null | Partial<InnovationSupportStatusEnum>>(null, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
      message: new FormControl<string>('', CustomValidators.required('A message is required')),
      suggestOrganisations: new FormControl<string>('YES', { validators: Validators.required, updateOn: 'change' })
    },
    { updateOn: 'blur' }
  );

  formfieldSuggestOrganisations = {
    description: `Based on the innovation's current support status, can you refer another organisation to continue supporting this Innovation at this moment in time?`,
    items: [
      { value: 'YES', label: `Yes` },
      { value: 'NO', label: `No` }
    ]
  };

  private currentStatus: null | InnovationSupportStatusEnum = null;

  private messageStatusLabels: { [key in InnovationSupportStatusEnum]?: string } = {
    [InnovationSupportStatusEnum.ENGAGING]: 'Describe the support you plan to provide.',
    [InnovationSupportStatusEnum.WAITING]:
      'Explain the information or decisions you need, before you can support this innovation.',
    [InnovationSupportStatusEnum.UNSUITABLE]:
      'Explain why your organisation has no suitable support offer for this innovation.',
    [InnovationSupportStatusEnum.CLOSED]:
      'Explain why your organisation has closed its engagement with this innovation.'
  };

  private messageStatusDescriptions: { [key in InnovationSupportStatusEnum]?: string } = {
    [InnovationSupportStatusEnum.ENGAGING]:
      'This message will be sent to the innovator and collaborators. It will also appear on the innovation’s support summary.',
    [InnovationSupportStatusEnum.WAITING]: 'The innovator and collaborators will be notified.',
    [InnovationSupportStatusEnum.UNSUITABLE]: 'The innovator and collaborators will be notified.',
    [InnovationSupportStatusEnum.CLOSED]: 'The innovator and collaborators will be notified.'
  };

  private messageStatusUpdated: {
    [key in InnovationSupportStatusEnum]?:
      | { message: string; itemsList?: ContextPageLayoutType['alert']['itemsList'] }
      | undefined;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private usersService: UsersService,
    private accessorService: AccessorService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.availableSupportStatuses = [];

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserContextInfo()?.organisationUnit || null;

    this.messageStatusUpdated = {
      [InnovationSupportStatusEnum.ENGAGING]: {
        message: 'The innovator and collaborators will be notified and your message has been sent.'
      },
      [InnovationSupportStatusEnum.WAITING]: {
        message:
          'The innovator and collaborators will be notified. If you need information from the innovator you can assign them a task.',
        itemsList: [{ title: ' Go to tasks.', callback: `/accessor/innovations/${this.innovationId}/tasks` }]
      },
      [InnovationSupportStatusEnum.UNSUITABLE]: { message: 'The innovator and collaborators will be notified.' },
      [InnovationSupportStatusEnum.CLOSED]: { message: 'The innovator and collaborators will be notified.' }
    };
  }

  ngOnInit(): void {
    if (this.stores.context.getPreviousUrl()?.includes('support/suggest')) {
      this.stepNumber = 4;
      this.onSubmitStep();
      this.setPageStatus('READY');
      return;
    }

    this.setPageTitle('Update support status', { showPage: false, size: 'l' });
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    if (!this.supportId) {
      this.setPageStatus('READY');
    } else {
      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {
        this.currentStatus = response.status;

        response.engagingAccessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        // Throw notification read dismiss.
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [NotificationContextDetailEnum.AU02_ACCESSOR_IDLE_ENGAGING_SUPPORT],
          contextIds: [this.supportId]
        });

        this.setPageStatus('READY');
      });
    }

    this.usersService
      .getUsersList({
        queryParams: {
          take: 100,
          skip: 0,
          filters: {
            email: false,
            onlyActive: true,
            organisationUnitId: this.userOrganisationUnit?.id ?? '',
            userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR]
          }
        }
      })
      .subscribe(response => {
        for (const item of response.data) {
          this.accessorsList.push({ id: item.id, userRoleId: item.roleId, name: item.name });
          this.formAccessorsList.push({ value: item.id, label: item.name });
        }
      });

    this.innovationsService.getInnovationAvailableSupportStatuses(this.innovationId).subscribe(availableStatuses => {
      this.availableSupportStatuses = availableStatuses.availableStatus;
    });
  }

  onSubmitStep(): void {
    switch (this.stepNumber) {
      case 1:
        this.chosenStatus = this.form.get('status')?.value ?? null;

        const formStatusField = this.form.get('status');
        if (!formStatusField?.valid) {
          formStatusField?.markAsTouched();
          formStatusField?.setErrors({ customError: true, message: 'Please, choose one of the available statuses' });
          return;
        }

        if (this.chosenStatus === InnovationSupportStatusEnum.ENGAGING) {
          this.setPageTitle('Assign accessors to support this innovation', { width: 'full', size: 'l' });
          this.stepNumber = 2;
        } else {
          this.selectedAccessors = [];
          this.setPageTitle(`Change support status to ${this.chosenStatus?.toLowerCase()}`, {
            width: 'full',
            size: 'l'
          });
          this.stepNumber = 3;
        }

        break;

      case 2:
        const formAccessors = this.form.get('accessors');
        if ((this.form.get('accessors')?.value ?? []).length === 0) {
          formAccessors?.markAsTouched();
          formAccessors?.setErrors({ customError: true, message: 'Please, choose at least one accessor' });
          return;
        }

        this.selectedAccessors = this.accessorsList.filter(item =>
          (this.form.get('accessors')?.value ?? []).includes(item.id)
        );

        this.stepNumber++;
        this.setPageTitle(`Change support status to ${this.chosenStatus?.toLowerCase()}`, { size: 'l' });

        break;

      case 4:
        this.setPageTitle('Suggest other organisations', { showPage: false, size: 'l' });
        this.resetBackLink();
        break;

      default:
        break;
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        userRoleId: item.userRoleId
      })),
      message: this.form.get('message')?.value ?? ''
    };

    this.accessorService.saveSupportStatus(this.innovationId, body, this.supportId).subscribe(() => {
      if (
        this.chosenStatus &&
        this.currentStatus === InnovationSupportStatusEnum.ENGAGING &&
        [
          InnovationSupportStatusEnum.CLOSED,
          InnovationSupportStatusEnum.WAITING,
          InnovationSupportStatusEnum.UNSUITABLE
        ].includes(this.chosenStatus)
      ) {
        this.setAlertSuccess('Support status updated', {
          message: this.getMessageStatusUpdated()?.message,
          itemsList: this.getMessageStatusUpdated()?.itemsList
        });
        this.stepNumber = 4;
        this.onSubmitStep();
      } else {
        this.setRedirectAlertSuccess('Support status updated', {
          message: this.getMessageStatusUpdated()?.message,
          itemsList: this.getMessageStatusUpdated()?.itemsList
        });
        this.redirectTo(this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`);
      }
    });
  }

  onSubmitRedirect() {
    const suggestOrganisations = this.form.get('suggestOrganisations')?.value;

    if (suggestOrganisations === 'YES') {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/support/suggest`, { entryPoint: 'supportUpdate' });
    } else {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/overview`);
    }
  }

  getMessageLabel() {
    const status = this.form.get('status')?.value;
    return status ? this.messageStatusLabels[status] : `Let the innovator know what's changed`;
  }

  getMessageDescription() {
    const status = this.form.get('status')?.value;
    return status ? this.messageStatusDescriptions[status] : '';
  }

  getMessageStatusUpdated(): { message: string; itemsList?: ContextPageLayoutType['alert']['itemsList'] } | undefined {
    const status = this.form.get('status')?.value;
    return status ? this.messageStatusUpdated[status] : undefined;
  }

  private handleGoBack() {
    if (this.stepNumber === 3 && this.chosenStatus !== InnovationSupportStatusEnum.ENGAGING) {
      this.stepNumber = 1;
    } else {
      this.stepNumber--;
    }

    if (this.stepNumber === 0) {
      const previousUrl = this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`;
      this.router.navigateByUrl(previousUrl);
    }
  }
}
