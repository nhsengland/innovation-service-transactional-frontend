import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';
import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html',
  styleUrls: ['./support-update.component.scss']
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  innovationId: string;
  supportId: string;
  stepNumber: number;
  accessorList: any[];
  selectedAccessors: any[];
  organisationUnit: string | undefined;
  textAreaCssOverride: string;

  supportStatusObj = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj).map(([key, item]) => ({
    key,
    checked: false,
    ...item
  })).filter(x => !x.hidden);


  currentStatus: { label: string, cssClass: string, description: string };

  formSupportObj: {
    status: string;
    accessors: string[];
  };


  form = new FormGroup({
    status: new FormControl('', Validators.required),
    accessors: new FormArray([]),
    comment: new FormControl('', Validators.required),
  });

  summaryAlert: { type: '' | 'error' | 'warning' | 'success', title: string, message: string };

  accessorsArrayName = 'accessors';
  commentField = 'comment';

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.supportId = this.activatedRoute.snapshot.params.supportId;

    this.stepNumber = 1;

    this.formSupportObj = {
      status: '',
      accessors: [],
    };

    this.summaryAlert = { type: '', title: '', message: '' };
    this.accessorList = [];
    this.selectedAccessors = [];

    this.currentStatus = { label: '', cssClass: '', description: '' };
    this.organisationUnit = this.stores.authentication.getUserInfo().organisations?.[0]?.organisationUnits?.[0]?.name;
    this.textAreaCssOverride = 'nhsuk-u-padding-top-0';
  }


  ngOnInit(): void {

    if (this.supportId) {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(
        response => {
          this.formSupportObj = response;
          this.form.get('status')?.setValue(response.status);
          response.accessors.forEach(accessor => {
            (this.form.get('accessors') as FormArray).push(
              new FormControl(accessor.id)
            );
          });

        },
        error => {
          this.logger.error(error);
        }
      );
    }

    this.accessorService.getAccessorsList().subscribe(
      response => {
        this.accessorList = response.map((r) => ({ value: r.id, label: r.name }));
      }
    );

  }



  onSubmitStep(): void {

    if (!this.validateForm(this.stepNumber)) { return; }
    this.formSupportObj = { ...this.form.value };

    this.selectedAccessors = (this.form.get('accessors')?.value as any[]).map((a) => {
      return this.accessorList.find(acc => acc.value === a);
    });

    if (this.stepNumber === 1 && this.form.get('status')?.value !== 'ENGAGING') {

      this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')?.value];

      this.stepNumber++;
    }

    this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')?.value];

    if (this.currentStatus.label !== this.supportStatusObj.ENGAGING.label) {
      this.selectedAccessors = [];
    }

    this.stepNumber++;

  }

  onSubmit(): void {
    if (!this.validateForm(this.stepNumber)) { return; }
    this.formSupportObj = { ...this.form.value };

    this.accessorService.saveSupportStatus(this.innovationId, this.form.value, this.supportId)
      .subscribe(
        response => {
          this.redirectTo(`/accessor/innovations/${this.innovationId}/support`, {result: 'updated'});
        },
        error => {
          this.logger.error(error);
        }
      );
  }

  private validateForm(step: number): boolean {

    switch (step) {
      case 1:
        if (!this.form.get('status')?.valid) {
          this.summaryAlert = {
            type: 'error',
            title: 'An error has occured when updating Status',
            message: 'You must select a status.'
          };
          return false;
        } else {
          this.summaryAlert.type = '';
        }
        break;
      case 3:

        if (!this.form.get('comment')?.valid && this.form.get('status')?.value !== 'WAITING') {
          this.summaryAlert = {
            type: 'error',
            title: 'An error has occured when updating the Comment',
            message: 'You must add a Comment.'
          };
          return false;
        } else {
          this.summaryAlert.type = '';
        }

        break;
      default:
        break;
    }

    return true;
  }
}

