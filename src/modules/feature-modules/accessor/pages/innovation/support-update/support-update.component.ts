import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormArray, FormControl, FormGroup, Validators } from '@app/base';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getInnovationNeedsAssessmentEndpointOutDTO } from '@modules/feature-modules/accessor/services/accessor.service';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-support-update',
  templateUrl: './support-update.component.html'
})
export class InnovationSupportUpdateComponent extends CoreComponent implements OnInit {

  innovationId: string;
  supportId: string;


  stepNumber: number;

  supportStatus = Object.entries(this.stores.innovation.INNOVATION_SUPPORT_STATUS).map(([key, item]) => ({
    key, ...item
  }));


  formSupportObj: {
    status: string;
    accessors: string[];
    comment: string;
  };


  form = new FormGroup({
    status: new FormControl('', Validators.required),
    accessors: new FormArray([]),
    comment: new FormControl()
  });

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };

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
      comment: ''
    };

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void {


    this.form.get('status')?.setValue('WAITING'); // <<<<<<<<---------------------------------


    if (this.supportId) {

      this.accessorService.getInnovationSupportInfo(this.innovationId, this.supportId).subscribe(
        response => {
          this.formSupportObj = response;

        },
        error => {
          this.logger.error(error);
        }
      );

    }

  }



  onSubmitStep(): void {



  if(!this.form.get('status')?.valid) {

    // mostrar mensagem
    console.log('Está vazio');
    this.summaryAlert = {
      type: 'error',
      title: 'Está vazaio',
      message: 'Please, try again or contact us for further help'
    };
    return;
  }


    console.log(this.form.value);

    this.stepNumber++;



  }

  onSubmit() {




    
  }

}
