import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { CustomValidators } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UsersService } from '@modules/shared/services/users.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  private accessorsList: { id: string, userRoleId: string, name: string }[] = [];

  innovationId: string;
  supportId: string;
  stepNumber: number;

  formAccessorsList: { value: string, label: string }[] = [];
  selectedAccessors: typeof this.accessorsList = [];
  userOrganisationUnit: null | { id: string, name: string, acronym: string };

  supportStatusObj = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj).map(([key, item]) => ({
    key,
    checked: false,
    ...item
  })).filter(x => !x.hidden);

  chosenStatus: null | InnovationSupportStatusEnum = null;

  form = new FormGroup({
    status: new FormControl<null | Partial<InnovationSupportStatusEnum>>(null, { validators: Validators.required, updateOn: 'change' }),
    accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
    message: new FormControl<string>('', CustomValidators.required('A message is required')),
    suggestOrganisations: new FormControl<string>('YES', { validators: Validators.required, updateOn: 'change' })
  }, { updateOn: 'blur' });

  formfieldSuggestOrganisations = {
    description: `Based on the innovation's current support status, can you refer another organisation to continue supporting this Innovation at this moment in time?`,
    items: [
      { value: 'YES', label: `Yes` },
      { value: 'NO', label: `No` }
    ]
  };

  private currentStatus: null | InnovationSupportStatusEnum = null;
  private messageStatusLabels: { [key in InnovationSupportStatusEnum]?: string } = {
    [InnovationSupportStatusEnum.ENGAGING]: 'Provide the innovator with clear details of changes to their support status and that your organisation is ready to actively engage with this innovation. Provide details of at least one person from your organisation assigned to this innovation.',
    [InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED]: 'Provide the innovator with clear details of changes to their support status and that further information is needed from the innovator in order to make a decision on their status. Provide a message on what specific information is needed.',
    [InnovationSupportStatusEnum.WAITING]: 'Provide the innovator with clear details of changes to their support status and that an internal decision is pending for the progression of their status.',
    [InnovationSupportStatusEnum.NOT_YET]: 'Provide the innovator with clear details of changes to their support status and that their Innovation Record is not ready for your organisation to provide just yet. Provide a message outlining this decision.',
    [InnovationSupportStatusEnum.UNSUITABLE]: 'Provide the innovator with clear details of changes to their support status and that your organisation has no suitable support offer for their innovation. Provide a message and feedback on why you organisation has made this decision.',
    [InnovationSupportStatusEnum.COMPLETE]: 'Provide the innovator with clear details of changes to their support status and that you have completed the engagement process. Provide an outline of the completion of the engagement process with you organisation.'
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

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserContextInfo()?.organisationUnit || null;

  }


  ngOnInit(): void {

    this.setPageTitle('Update support status', { showPage: false });

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.currentStatus = response.status;

        this.form.get('status')?.setValue(response.status);

        response.engagingAccessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        this.setPageStatus('READY');

      });

    }

    this.usersService.getUsersList({ queryParams: { take: 100, skip: 0, filters: { email: false, onlyActive: true, organisationUnitId: this.userOrganisationUnit?.id ?? '', userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR] } } }).subscribe(
      response => {

        this.accessorsList = response.data.map((item) => ({ id: item.id, userRoleId: item.roleId, name: item.name }));
        this.formAccessorsList = response.data.map((r) => ({ value: r.id, label: r.name }));

      }
    );

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
          this.setPageTitle('Choose accessors to support', { width: 'full' });
          this.stepNumber = 2;
        } else {
          this.selectedAccessors = [];
          this.setPageTitle('Give some details');
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
    }

    this.accessorService.saveSupportStatus(this.innovationId, body, this.supportId).subscribe(() => {

      // this.setAlertSuccess('Support status updated and organisation suggestions sent', { message: 'The Innovation Support status has been successfully updated and the Innovator has been notified of your accompanying suggestions and feedback.' });

      if (this.chosenStatus && this.currentStatus === InnovationSupportStatusEnum.ENGAGING && [InnovationSupportStatusEnum.COMPLETE, InnovationSupportStatusEnum.NOT_YET, InnovationSupportStatusEnum.UNSUITABLE].includes(this.chosenStatus)) {
        this.setAlertSuccess('Support status updated', { message: 'The innovation support status has been successfully updated.' });
        this.setPageTitle('Suggest other organisations', { showPage: false });
        this.stepNumber = 4;
      } else {
        this.setRedirectAlertSuccess('Support status updated', { message: 'The innovation support status has been successfully updated.' });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);
      }

    });

  }


  onSubmitRedirect() {

    const suggestOrganisations = this.form.get('suggestOrganisations')?.value;

    if (suggestOrganisations === 'YES') {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/support/organisations/suggest`);
    } else {
      this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);
    }


  }

  getMessageLabel() {

    const status = this.form.get('status')?.value;
    return status ? this.messageStatusLabels[status] : `Let the innovator know what's changed`;

  }


}
