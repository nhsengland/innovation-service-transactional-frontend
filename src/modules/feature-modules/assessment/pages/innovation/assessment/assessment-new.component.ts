import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineParameterModel } from '@modules/shared/forms';

import { AssessmentService } from '../../../services/assessment.service';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-new',
  templateUrl: './assessment-new.component.html'
})
export class InnovationAssessmentNewComponent extends CoreComponent implements OnInit {

  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  innovationName: string;

  formParameters: FormEngineParameterModel[];
  formAnswers: { [key: string]: any };

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovationName = '';

    this.formParameters = [
      new FormEngineParameterModel({ id: 'comment', dataType: 'textarea', label: 'Enter your comment', validations: { isRequired: true } })
    ];
    this.formAnswers = {};

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void {

    this.assessmentService.getInnovationInfo(this.innovationId).subscribe(
      response => {
        this.innovationName = response.summary.name;
      },
      error => {
        this.logger.error(error);
      }
    );

  }

  onSubmit(): void {

    this.summaryAlert = { type: '', title: '', message: '' };

    const formData = this.formEngineComponent?.getFormValues();

    if (!formData?.valid) {
      return;
    }

    this.formAnswers = formData?.data;

    this.assessmentService.createInnovationNeedsAssessment(this.innovationId, this.formAnswers).subscribe(
      response => {
        this.redirectTo(`assessment/innovations/${this.innovationId}/assessments/${response.id}`, { alert: 'needsAssessmentStarted' });
      },
      () => {
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when starting needs assessment',
          message: 'Please, try again or contact us for further help'
        };
      }
    );

  }

}
