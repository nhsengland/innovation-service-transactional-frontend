import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators } from '@app/base/forms';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  innovationId: string;
  supportId: string;
  stepNumber: number;

  accessorsList: { value: string, label: string }[];
  selectedAccessors: any[];
  organisationUnit: string | undefined;

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


  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Update support status - status');
    this.setStepTitle();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.accessorsList = [];
    this.selectedAccessors = [];

    this.organisationUnit = this.stores.authentication.getUserInfo().organisations[0].organisationUnits?.[0]?.name;

  }


  ngOnInit(): void {

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.form.get('status')!.setValue(response.status);

        response.engagingAccessors?.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new FormControl<string>(accessor.id));
        });

        this.setPageStatus('READY');

      });
    }

    /** TODO: Change to new endpoint */
    this.accessorService.getAccessorsList().subscribe(
      response => {
        this.accessorsList = response.map((r) => ({ value: r.id, label: r.name }));
      }
    );

  }


  /*
    TODO: REVISIT THIS METHOD. CODE IS A BIT SLOPPY.
    works. but it's sloppy.
  */
  onSubmitStep(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    this.selectedAccessors = (this.form.get('accessors')?.value ?? []).map(a => {
      return this.accessorsList.find(acc => acc.value === a);
    });

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
    const body = {
      status: this.form.get('status')?.value ?? InnovationSupportStatusEnum.UNASSIGNED,
      accessors: [{
        id: this.form.get('accessors'),
        organisationUnitUserId: ''
      }],
      message: this.form.get('message')?.value ?? ''
    }

    if (!this.validateForm(this.stepNumber)) { return; }

    this.accessorService.saveSupportStatus(this.innovationId, body, this.supportId).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('Support status updated', { message: 'You\'ve updated your support status and posted a message to the innovator.' });
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`);
      },
      error: error => this.setAlertUnknownError()
    });

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
