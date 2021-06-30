import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineParameterModel } from '@modules/shared/forms';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { OrganisationsService } from '@shared-module/services/organisations.service';

import { AssessmentService } from '../../../services/assessment.service';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-edit',
  templateUrl: './assessment-edit.component.html'
})
export class InnovationAssessmentEditComponent extends CoreComponent implements OnInit {

  @ViewChildren(FormEngineComponent) formEngineComponent?: QueryList<FormEngineComponent>;

  innovationId: string;
  innovationName: string;
  assessmentId: string;
  stepId: number;

  form: {
    sections: {
      title: string;
      parameters: FormEngineParameterModel[];
    }[];
    data: { [key: string]: any };
  };

  currentAnswers: { [key: string]: any };

  summaryAlert: { type: '' | 'error' | 'warning', title: string, message: string };


  isValidStepId(): boolean {
    const id = this.activatedRoute.snapshot.params.stepId;
    return (1 <= Number(id) && Number(id) <= 2);
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private organisationsService: OrganisationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovationName = '';
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.stepId = this.activatedRoute.snapshot.params.stepId;

    this.form = { sections: [], data: {} };

    this.currentAnswers = {};

    this.summaryAlert = { type: '', title: '', message: '' };

  }


  ngOnInit(): void {

    // Update last step with the organisations list and pre-select all checkboxes.
    this.organisationsService.getAccessorsOrganisations().subscribe(response => {
      NEEDS_ASSESSMENT_QUESTIONS.organisations[0].items = response.map(item => ({ value: item.id, label: item.name }));
    });

    this.assessmentService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId).subscribe(
      response => {
        this.innovationName = response.innovation.name;
        this.form.data = response.assessment;
      },
      error => {
        this.logger.error(error);
      }
    );

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {

        this.stepId = Number(params.stepId);

        if (!this.isValidStepId()) {
          this.redirectTo('not-found');
          return;
        }

        switch (this.stepId) {
          case 1:
            this.form.sections = [
              { title: 'The innovation', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovation },
              { title: 'The innovator', parameters: NEEDS_ASSESSMENT_QUESTIONS.innovator }
            ];
            break;
          case 2:
            this.form.sections = [
              { title: 'Support need summary', parameters: NEEDS_ASSESSMENT_QUESTIONS.summary },
              { title: '', parameters: NEEDS_ASSESSMENT_QUESTIONS.organisations }
            ];
            break;
        }

      })
    );

  }


  onSubmit(action: 'continue' | 'saveAsDraft' | 'submit'): void {

    this.summaryAlert = { type: '', title: '', message: '' };

    let isValid = true;

    (this.formEngineComponent?.toArray() || []).forEach(engine => {

      const formData = engine.getFormValues();

      this.currentAnswers = { ...this.currentAnswers, ...formData?.data };

      if (!formData?.valid) {
        isValid = false;
      }

    });

    if (!isValid) {
      return;
    }

    this.assessmentService.updateInnovationNeedsAssessment(this.innovationId, this.assessmentId, (action === 'submit'), this.currentAnswers).subscribe(
      () => {
        switch (action) {
          case 'continue':
            this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/edit/2`);
            break;
          case 'submit':
            this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}/log`, { alert: 'needsAssessmentSubmited'});
            break;
          default:
            break;
        }
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
