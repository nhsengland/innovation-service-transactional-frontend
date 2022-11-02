import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  private accessorsList: { id: string, organisationUnitUserId: string, name: string }[] = [];

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

  currentStatus: null | InnovationSupportStatusEnum = null;

  form = new FormGroup({
    status: new FormControl<null | InnovationSupportStatusEnum>(null, { validators: Validators.required, updateOn: 'change', nonNullable: true }),
    accessors: new FormArray<FormControl<string>>([], { updateOn: 'change' }),
    message: new FormControl<string>('', CustomValidators.required('A message is required'))
  }, { updateOn: 'blur' });

  STATUS_LABELS: { [key: string]: string } = {
    ENGAGING: 'Provide the innovator with clear details of changes to their support status and that your organisation is ready to actively engage with this innovation. Provide details of at least one person from your organisation assigned to this innovation',
    FURTHER_INFO_REQUIRED: 'Provide the innovator with clear details of changes to their support status and that further information is needed from the innovator in order to make a decision on their status. Provide a comment on what specific information is needed',
    WAITING: 'Provide the innovator with clear details of changes to their support status and that an internal decision is pending for the progression of their status',
    NOT_YET: 'Provide the innovator with clear details of changes to their support status and that their Innovation Record is not ready for your organisation to provide just yet. Provide a comment outlining this decision',
    UNSUITABLE: 'Provide the innovator with clear details of changes to their support status and that your organisation has no suitable support offer for their innovation. Provide comments and feedback on why you organisation has made this decision',
    COMPLETE: 'Provide the innovator with clear details of changes to their support status and that you have completed the engagement process. Provide an outline of the completion of the engagement process with you organisation'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Update support status - status');
    this.setStepTitle();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.userOrganisationUnit = this.stores.authentication.getUserInfo().organisations[0].organisationUnits[0];

  }


  ngOnInit(): void {

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.innovationsService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.form.get('status')!.setValue(response.status);

        response.engagingAccessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        this.setPageStatus('READY');

      });
    }

    this.organisationsService.getOrganisationUnitUsersList(this.userOrganisationUnit?.id ?? '').subscribe(
      response => {

        this.accessorsList = response;
        this.formAccessorsList = response.map((r) => ({ value: r.id, label: r.name }));

      }
    );

  }


  /*
    TODO: REVISIT THIS METHOD. CODE IS A BIT SLOPPY.
    works. but it's sloppy.
  */
  onSubmitStep(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    this.selectedAccessors = this.accessorsList.filter(item =>
      (this.form.get('accessors')?.value ?? []).includes(item.id)
    );

    if (this.stepNumber === 1 && this.form.get('status')!.value !== 'ENGAGING') {

      this.currentStatus = this.form.get('status')?.value ?? null;

      this.stepNumber++;
    }

    if (this.stepNumber === 2 && this.currentStatus === InnovationSupportStatusEnum.ENGAGING) {

      if (this.selectedAccessors.length === 0) {
        this.setAlertError('An error has occurred when updating Status. You must select at least one Accessor.');
        return;
      } else {
        this.resetAlert();
      }

    }

    this.currentStatus = this.form.get('status')?.value ?? null;

    if (this.currentStatus !== InnovationSupportStatusEnum.ENGAGING) {
      this.selectedAccessors = [];
    }

    this.stepNumber++;
    this.setStepTitle();

  }

  onSubmit(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    const body = {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      accessors: this.selectedAccessors.map(item => ({
        id: item.id,
        organisationUnitUserId: item.organisationUnitUserId
      })),
      message: this.form.get('message')?.value ?? ''
    }

    this.accessorService.saveSupportStatus(this.innovationId, body, this.supportId).subscribe(() => {

      this.setRedirectAlertSuccess('Support status updated and organisation suggestions sent', { message: 'The Innovation Support status has been successfully updated and the Innovator has been notified of your accompanying suggestions and feedback.' });
      this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);

    });

  }

  getMessageLabel() {

    const status = this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED;
    return this.STATUS_LABELS[status] ?? "Let the innovator know what's changed";

  }

  private validateForm(step: number): boolean {

    switch (step) {
      case 1:
        if (!this.form.get('status')!.valid) {
          this.setAlertError('An error has occurred when updating Status. You must select a status.');
          return false;
        } else {
          this.resetAlert();
        }
        break;

      case 3:
        if (!this.form.get('message')!.valid && this.form.get('status')!.value !== 'WAITING') {
          this.setAlertError('An error has occurred when updating the message. You must add a message.');
          return false;
        } else {
          this.resetAlert();
        }
        break;

      default:
        break;
    }

    return true;
  }

  private setStepTitle(): void {
    switch (this.stepNumber) {
      case 1:
        this.setPageTitle('Update support status - status');
        break;
      case 2:
        this.setPageTitle('Update support status - accessors');
        break;
      case 3:
        this.setPageTitle('Update support status');
        break;
      default:
        break;
    }
  }

}
