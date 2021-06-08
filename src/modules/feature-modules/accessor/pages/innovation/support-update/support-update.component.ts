import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';
import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  innovationId: string;
  supportId: string;
  stepNumber: number;
  accessorList: any[];
  selectedAccessors: any[];

  supportStatusObj = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportStatus = Object.entries(this.supportStatusObj).map(([key, item]) => ({
    key,
    checked: false,
    ...item
  }));

  currentStatus: { label: string, cssClass: string, description: string };

  formSupportObj: {
    status: string;
    accessors: string[];
  };


  form = new FormGroup({
    status: new FormControl('', Validators.required),
    accessors: new FormArray([]),
    comment: new FormControl()
  });

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };

  accessorsArrayName = 'accessors';

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
  }


  ngOnInit(): void {

    if (this.supportId) {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(
        response => {
          this.formSupportObj = response;
          this.form.get('status')?.setValue(response.status);
          response.accessors.map((accessor)=> {
            ( this.form.get('accessors') as FormArray).push(
              new FormControl(accessor.id)
            )
          });
          
        },
        error => {
          this.logger.error(error);
        }
      );
    }

    this.accessorService.getAccessorsList().subscribe(
      response => {
        this.accessorList = response;
      }
    )
  }



  onSubmitStep(): void {
    this.formSupportObj = { ...this.form.value };

    this.selectedAccessors = (this.form.get('accessors')?.value as any[]).map((a) => {
      return this.accessorList.find(acc => acc.value === a);
    });

    if (this.stepNumber === 1 && this.form.get('status')?.value !== 'ENGAGING') {

      this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')?.value];

      this.stepNumber++;
    }

    this.currentStatus = (this.supportStatusObj as any)[this.form.get('status')?.value];
    this.stepNumber++;

  }

  onSubmit() {
    this.formSupportObj = {...this.form.value};
    console.log(this.formSupportObj);
  }

}
