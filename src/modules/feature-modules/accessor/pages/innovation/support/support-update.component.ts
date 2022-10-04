import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormGroup, Validators } from '@app/base/forms';

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

  currentStatus: { label: string, cssClass: string, description: string };

  form = new FormGroup({
    status: new UntypedFormControl('', { validators: Validators.required, updateOn: 'change' }),
    accessors: new UntypedFormArray([], { updateOn: 'change' }),
    comment: new UntypedFormControl('', CustomValidators.required('A comment is required')),
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

    this.currentStatus = { label: '', cssClass: '', description: '' };
    /* istanbul ignore next */
    this.organisationUnit = this.stores.authentication.getUserInfo().organisations[0].organisationUnits?.[0]?.name;

  }


  ngOnInit(): void {

    if (!this.supportId) {

      this.setPageStatus('READY');

    } else {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(response => {

        this.form.get('status')!.setValue(response.status);

        response.accessors.forEach(accessor => {
          (this.form.get('accessors') as FormArray).push(new UntypedFormControl(accessor.id));
        });

        this.setPageStatus('READY');

      });
    }

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

    this.selectedAccessors = (this.form.get('accessors')!.value as string[]).map((a) => {
      return this.accessorsList.find(acc => acc.value === a);
    });

    if (this.stepNumber === 1 && this.form.get('status')!.value !== 'ENGAGING') {

      this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')!.value];

      this.stepNumber++;
    }

    if (this.stepNumber === 2 && this.currentStatus === this.supportStatusObj.ENGAGING) {

      if (this.selectedAccessors.length === 0) {
        this.setAlertError('An error has occurred when updating Status. You must select at least one Accessor.');
        return;
      } else {
        this.resetAlert();
      }

    }

    this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')!.value];

    if (this.currentStatus.label !== this.supportStatusObj.ENGAGING.label) {
      this.selectedAccessors = [];
    }

    this.stepNumber++;
    this.setStepTitle();

  }

  onSubmit(): void {

    if (!this.validateForm(this.stepNumber)) { return; }

    this.accessorService.saveSupportStatus(this.innovationId, this.form.value, this.supportId).subscribe({
      next: response => {
        this.setRedirectAlertSuccess('Support status updated', { message: 'You\'ve updated your support status and posted a comment to the innovator.' });
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
        if (!this.form.get('comment')!.valid && this.form.get('status')!.value !== 'WAITING') {
          this.setAlertError('An error has occurred when updating the comment. You must add a Comment.');
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
