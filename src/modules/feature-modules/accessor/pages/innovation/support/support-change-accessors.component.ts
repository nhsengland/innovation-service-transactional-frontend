import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';

import { AccessorService } from '../../../services/accessor.service';
import { CustomValidators } from '@modules/shared/forms';
import { RESPONSE } from 'src/express.tokens';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accessor-pages-innovation-change-accessors',
  templateUrl: './support-change-accessors.component.html'
})
export class InnovationChangeAccessorsComponent extends CoreComponent implements OnInit {
  private accessorsList: { id: string; role: UserRoleEnum; userRoleId: string; name: string }[] = [];

  innovationId: string;
  supportId: string;
  stepNumber: number;

  formAccessorsList: { value: string; label: string }[] = [];
  selectedAccessors: typeof this.accessorsList = [];
  userOrganisationUnit: null | { id: string; name: string; acronym: string };

  selectAccessorsStepLabel: string = '';

  innovationSupportStatus: InnovationSupportStatusEnum | undefined;

  disabledCheckboxAccessors: string[] = [];

  form = new FormGroup(
    {
      accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
      message: new FormControl<string>('', { validators: CustomValidators.required('Please enter a message') })
    },
    { updateOn: 'blur' }
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private usersService: UsersService,
    private accessorService: AccessorService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserContextInfo()?.organisationUnit || null;
  }

  ngOnInit(): void {
    this.setBackLink('Go back', this.handleGoBack.bind(this));

    forkJoin([
      this.usersService.getUsersList({
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
      }),
      ...(this.supportId ? [this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId)] : [])
    ]).subscribe({
      next: ([usersList, innovationSupportInfo]) => {
        this.accessorsList = usersList.data.map(item => ({
          id: item.id,
          role: item.role,
          userRoleId: item.roleId,
          name: item.name
        }));

        if (innovationSupportInfo) {
          this.innovationSupportStatus = innovationSupportInfo.status;
          this.setTitleAndLabels();
          innovationSupportInfo.engagingAccessors.forEach(accessor => {
            (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
          });
        }

        if (this.innovationSupportStatus === InnovationSupportStatusEnum.WAITING) {
          // add this user by default, and disable input
          const userId = this.stores.authentication.getUserId();
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(userId));
          this.disabledCheckboxAccessors = [userId];
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onSubmitStep(): void {
    switch (this.stepNumber) {
      case 1:
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
        this.setPageTitle('Change assigned accessors', { size: 'l' });

        break;

      case 2:
        this.setTitleAndLabels();

        this.stepNumber = 1;
        break;

      default:
        break;
    }
  }

  setTitleAndLabels() {
    switch (this.innovationSupportStatus) {
      case InnovationSupportStatusEnum.ENGAGING:
        this.setPageTitle('Assign accessors to support this innovation', { width: 'full', size: 'l' });
        this.selectAccessorsStepLabel = `Select 1 or more accessors from ${this.userOrganisationUnit?.name} to support this innovation.`;
        this.formAccessorsList = this.accessorsList.map(r => ({ value: r.id, label: r.name }));
        break;

      case InnovationSupportStatusEnum.WAITING:
        this.setPageTitle('Assign qualifying accessors to this innovation', { width: 'full', size: 'l' });
        this.selectAccessorsStepLabel = `Select 1 or more qualifying accessors from ${this.userOrganisationUnit?.name} to be assigned to this innovation. They will receive notifications regarding this innovation.`;
        this.formAccessorsList = this.accessorsList
          .filter(accessor => accessor.role === UserRoleEnum.QUALIFYING_ACCESSOR)
          .map(r => ({ value: r.id, label: r.name }));
        break;
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        userRoleId: item.userRoleId
      })),
      message: this.form.get('message')?.value ?? undefined
    };

    this.accessorService.changeAccessors(this.innovationId, this.supportId, body).subscribe(() => {
      this.setRedirectAlertSuccess('You have changed the accessors assigned to this innovation', {
        message: 'The innovator and collaborators will be notified and your message has been sent.'
      });
      this.redirectTo(`/accessor/innovations/${this.innovationId}/overview`);
    });
  }

  getMessageLabel() {
    const status = this.form.get('status')?.value;
    return 'Explain the reason you have changed the assigned accessors for this innovation.';
  }

  getMessageDescription() {
    const status = this.form.get('status')?.value;
    return 'This message will be sent to the innovator and collaborators.';
  }

  private handleGoBack() {
    if (this.stepNumber === 1) {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/overview`);
    }

    if (this.stepNumber === 2) {
      this.onSubmitStep();
    }
  }
}
