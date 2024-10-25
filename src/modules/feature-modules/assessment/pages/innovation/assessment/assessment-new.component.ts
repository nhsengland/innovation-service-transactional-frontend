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

  disableCreateButton = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovationName = '';

    this.formParameters = [
      new FormEngineParameterModel({
        id: 'message',
        dataType: 'textarea',
        label: 'Let the innovator know how you want to proceed',
        validations: { isRequired: [true, 'Message is required'] },
        lengthLimit: 'xxl'
      })
    ];
    this.formAnswers = {};
  }

  ngOnInit(): void {
    this.innovationName = this.ctx.innovation.info().name;

    this.setPageTitle(this.innovationName, { hint: 'Starting needs assessment for', size: 'l' });
    this.setBackLink('Go back', `/assessment/innovations/${this.innovationId}`);
    this.setPageStatus('READY');
  }

  onSubmit(): void {
    const formData = this.formEngineComponent?.getFormValues();

    if (!formData?.valid) {
      return;
    }

    this.formAnswers = formData.data;
    this.disableCreateButton = true;

    this.assessmentService.createInnovationNeedsAssessment(this.innovationId, this.formAnswers).subscribe({
      next: response => this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${response.id}/edit`),
      error: () => {
        this.setAlertUnknownError();
        this.disableCreateButton = false;
      }
    });
  }
}
