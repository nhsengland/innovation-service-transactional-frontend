import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';
import { CustomValidators } from '@app/base/forms';
import { AlertType } from '@app/base/models';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  innovationId: string;
  supportId: string;
  stepNumber: number;

  alert: AlertType = { type: null };

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
    status: new FormControl('', Validators.required),
    accessors: new FormArray([]),
    comment: new FormControl('', CustomValidators.required('A comment is required')),
  });


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

    if (this.supportId) {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(
        response => {

          this.form.get('status')!.setValue(response.status);

          response.accessors.forEach(accessor => {
            (this.form.get('accessors') as FormArray).push(new FormControl(accessor.id));
          });

        },
        error => {
          this.logger.error(error);
        }
      );
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
        this.alert = {
          type: 'ERROR',
          title: 'An error has occurred when updating Status',
          message: 'You must select at least one Accessor.',
          setFocus: true
        };

        return;

      } else {
        this.alert = { type: null, setFocus: false };
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

    this.accessorService.saveSupportStatus(this.innovationId, this.form.value, this.supportId).subscribe(
      response => {
        this.redirectTo(`/accessor/innovations/${this.innovationId}/support`, { alert: 'supportUpdateSuccess' });
      },
      error => {
        this.logger.error(error);
      }
    );

  }

  private validateForm(step: number): boolean {

    switch (step) {
      case 1:
        if (!this.form.get('status')!.valid) {
          this.alert = {
            type: 'ERROR',
            title: 'An error has occurred when updating Status',
            message: 'You must select a status.',
            setFocus: true
          };
          return false;
        } else {
          this.alert = { type: null, setFocus: false };
        }
        break;
      case 3:

        if (!this.form.get('comment')!.valid && this.form.get('status')!.value !== 'WAITING') {
          this.alert = {
            type: 'ERROR',
            title: 'An error has occurred when updating the Comment',
            message: 'You must add a Comment.',
            setFocus: true
          };
          return false;
        } else {
          this.alert = { type: null, setFocus: false };
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
