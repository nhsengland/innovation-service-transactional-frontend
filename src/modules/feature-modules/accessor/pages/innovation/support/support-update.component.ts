import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum, UserRoleEnum } from '@app/base/enums';
import { CustomValidators, FileTypes } from '@app/base/forms';

import { ChangeSupportStatusDocumentType, InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { ContextInnovationType } from '@modules/stores';
import { AccessorService } from '../../../services/accessor.service';

import { FileUploadService } from '@modules/shared/services/file-upload.service';
import { switchMap } from 'rxjs/operators';
import { omit } from 'lodash';
import { ObservableInput, forkJoin } from 'rxjs';
import { UsersListDTO } from '@modules/shared/dtos/users.dto';
import { InnovationSupportInfoDTO } from '@modules/shared/services/innovations.dtos';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';

@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {
  private allAccessorsList: { id: string; role: UserRoleEnum; userRoleId: string; name: string }[] = [];
  private qualifyingAccessorsList: { id: string; role: UserRoleEnum; userRoleId: string; name: string }[] = [];

  innovation: ContextInnovationType;

  innovationId: string;
  supportId: string;
  stepNumber: number;
  submitButton = { isActive: true, label: 'Confirm' };

  formAccessorsList: { value: string; label: string }[] = [];
  selectedAccessors: typeof this.allAccessorsList = [];
  userOrganisationUnit: null | { id: string; name: string; acronym: string };
  disabledCheckboxAccessors: string[] = [];

  selectAccessorsStepLabel: string = '';

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
      suggestOrganisations: new FormControl<string>('YES', { validators: Validators.required, updateOn: 'change' }),
      file: new FormControl<File | null>(null, [
        CustomValidators.emptyFileValidator(),
        CustomValidators.maxFileSizeValidator(20)
      ]),
      fileName: new FormControl<string>('')
    },
    { updateOn: 'blur' }
  );

  configInputFile = {
    acceptedFiles: [FileTypes.CSV, FileTypes.XLSX, FileTypes.DOCX, FileTypes.PDF],
    maxFileSize: 20 // In Mb.
  };

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
      "This message will be sent to the innovator and collaborators. It will also appear on the innovation's support summary.",
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
    private accessorService: AccessorService,
    private fileUploadService: FileUploadService
  ) {
    super();

    this.innovation = this.stores.other.innovation();

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

    const subscriptions: {
      usersList: ObservableInput<UsersListDTO>;
      availableSupportStatuses?: ObservableInput<{
        availableStatus: InnovationSupportStatusEnum[];
      }>;
      innovationSupportInfo?: ObservableInput<InnovationSupportInfoDTO>;
    } = {
      usersList: this.usersService.getUsersList({
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
    };

    if (this.supportId) {
      subscriptions.availableSupportStatuses = this.innovationsService.getInnovationAvailableSupportStatuses(
        this.innovationId
      );
      subscriptions.innovationSupportInfo = this.innovationsService.getInnovationSupportInfo(
        this.innovationId,
        this.supportId
      );
    } else if (this.innovation.support?.id) {
      subscriptions.innovationSupportInfo = this.innovationsService.getInnovationSupportInfo(
        this.innovationId,
        this.innovation.support?.id
      );
    }

    forkJoin(subscriptions).subscribe({
      next: response => {
        this.allAccessorsList = response.usersList.data.map(item => ({
          id: item.id,
          role: item.role,
          userRoleId: item.roleId,
          name: item.name
        }));
        this.qualifyingAccessorsList = this.allAccessorsList.filter(i => i.role === UserRoleEnum.QUALIFYING_ACCESSOR);
        this.formAccessorsList = this.allAccessorsList.map(i => ({ value: i.id, label: i.name }));

        // Use these statuses, if starting support
        if (!this.supportId) {
          this.availableSupportStatuses = [
            InnovationSupportStatusEnum.ENGAGING,
            InnovationSupportStatusEnum.WAITING,
            InnovationSupportStatusEnum.UNSUITABLE
          ];

          // Filter out current status, if any
          if (response.innovationSupportInfo) {
            this.availableSupportStatuses = this.availableSupportStatuses.filter(
              status => status !== response.innovationSupportInfo?.status
            );
          }
        }
        // Use these statuses, if changing
        if (this.supportId && response.availableSupportStatuses) {
          this.availableSupportStatuses = response.availableSupportStatuses.availableStatus;
        }

        if (response.innovationSupportInfo) {
          this.currentStatus = response.innovationSupportInfo.status;

          response.innovationSupportInfo.engagingAccessors.forEach(accessor => {
            (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
          });

          // Throw notification read dismiss.
          this.stores.context.dismissNotification(this.innovationId, {
            contextDetails: [NotificationContextDetailEnum.AU02_ACCESSOR_IDLE_ENGAGING_SUPPORT],
            contextIds: [this.supportId]
          });
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  setTitleAndLabel() {
    if (this.stepNumber === 1) {
      this.setPageTitle('');
    }

    if (this.stepNumber === 2) {
      switch (this.chosenStatus) {
        case InnovationSupportStatusEnum.ENGAGING:
          this.setPageTitle('Assign accessors to support this innovation', { width: 'full', size: 'l' });
          this.selectAccessorsStepLabel = `Select 1 or more accessors from ${this.userOrganisationUnit?.name} to support this innovation.`;
          break;

        case InnovationSupportStatusEnum.WAITING:
          this.setPageTitle('Assign qualifying accessors to this innovation', { width: 'full', size: 'l' });
          this.selectAccessorsStepLabel = `Select 1 or more qualifying accessors from ${this.userOrganisationUnit?.name} to be assigned to this innovation. They will receive notifications regarding this innovation.`;
      }
    }

    if (this.stepNumber === 3) {
      this.setPageTitle(`Change support status to ${this.chosenStatus?.toLowerCase()}`, {
        width: 'full',
        size: 'l'
      });
    }

    if (this.stepNumber === 4) {
      this.setPageTitle('Suggest other organisations', { showPage: false, size: 'l' });
    }
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

        if (
          this.chosenStatus === InnovationSupportStatusEnum.ENGAGING ||
          this.chosenStatus === InnovationSupportStatusEnum.WAITING
        ) {
          const formSelectedAcessorsList = this.form.get('accessors') as FormArray;
          switch (this.chosenStatus) {
            case InnovationSupportStatusEnum.ENGAGING:
              this.disabledCheckboxAccessors = [];
              formSelectedAcessorsList.clear();
              this.stepNumber = 2;
              break;

            case InnovationSupportStatusEnum.WAITING:
              // set list of QA only
              this.formAccessorsList = this.qualifyingAccessorsList.map(i => ({ value: i.id, label: i.name }));

              // add this user by default, and disable input
              const userId = this.stores.authentication.getUserId();
              formSelectedAcessorsList.clear();
              formSelectedAcessorsList.push(new FormControl<string>(userId));

              this.disabledCheckboxAccessors = [userId];

              this.selectedAccessors = this.allAccessorsList.filter(item =>
                (this.form.get('accessors')?.value ?? []).includes(item.id)
              );

              this.stepNumber = this.qualifyingAccessorsList.length > 1 ? 2 : 3;
              break;

            default:
              break;
          }

          this.setTitleAndLabel();
        } else {
          this.selectedAccessors = [];
          this.setPageTitle(`Change support status to ${this.chosenStatus?.toLowerCase()}`, {
            width: 'full',
            size: 'l'
          });
          this.submitButton.label = 'Confirm';
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

        this.selectedAccessors = this.allAccessorsList.filter(item =>
          (this.form.get('accessors')?.value ?? []).includes(item.id)
        );

        this.submitButton.label = 'Confirm and send message';
        this.stepNumber++;

        break;

      case 4:
        this.resetBackLink();
        break;

      default:
        break;
    }
    this.setTitleAndLabel();
  }
  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const body: ChangeSupportStatusDocumentType = this.createSupportStatusBody();

    const file = this.form.value.file;
    if (file) {
      this.uploadFileAndSaveStatus(file, body);
    } else {
      this.saveSupportStatus(body);
    }
  }

  private createSupportStatusBody(): ChangeSupportStatusDocumentType {
    return {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        userRoleId: item.userRoleId
      })),
      message: this.form.get('message')?.value ?? ''
    };
  }

  private uploadFileAndSaveStatus(file: any, body: ChangeSupportStatusDocumentType): void {
    const httpUploadBody = { userId: this.stores.authentication.getUserId(), innovationId: this.innovationId };

    this.fileUploadService
      .uploadFile(httpUploadBody, file)
      .pipe(
        switchMap(response => {
          const fileData = omit(response, 'url');
          const updatedBody = {
            ...body,
            file: {
              name: this.form.value.fileName!,
              file: fileData
            }
          };
          return this.accessorService.saveSupportStatus(this.innovationId, updatedBody, this.supportId);
        })
      )
      .subscribe(this.getSaveSupportStatusSubscriber());
  }

  private saveSupportStatus(body: ChangeSupportStatusDocumentType): void {
    this.accessorService
      .saveSupportStatus(this.innovationId, body, this.supportId)
      .subscribe(this.getSaveSupportStatusSubscriber());
  }

  private getSaveSupportStatusSubscriber(): { next: () => void; error: () => void } {
    return {
      next: () => {
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
          this.redirectTo(
            this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`
          );
        }
      },
      error: () => {
        this.submitButton = {
          isActive: true,
          label: this.form.get('status')?.value === 'ENGAGING' ? 'Confirm and send message' : 'Confirm'
        };
        this.setAlertUnknownError();
      }
    };
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
    if (this.stepNumber === 3) {
      switch (this.chosenStatus) {
        case InnovationSupportStatusEnum.ENGAGING:
          this.stepNumber--;
          break;

        case InnovationSupportStatusEnum.WAITING:
          this.stepNumber = this.qualifyingAccessorsList.length === 1 ? 1 : 2;
          break;

        default:
          this.stepNumber = 1;
      }
    } else {
      this.stepNumber--;
    }

    if (this.stepNumber === 0) {
      const previousUrl = this.stores.context.getPreviousUrl() ?? `/accessor/innovations/${this.innovationId}/overview`;
      this.router.navigateByUrl(previousUrl);
    }

    this.setTitleAndLabel();
  }
}
