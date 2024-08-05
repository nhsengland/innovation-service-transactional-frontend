import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';
import { CustomValidators } from '@modules/shared/forms';

@Component({
  selector: 'app-pages-innovation-assessment-edit-reason',
  templateUrl: './assessment-edit-reason.component.html'
})
export class PageInnovationAssessmentEditReasonComponent extends CoreComponent implements OnInit {
  innovationId: string;
  assessmentId: string;

  goBackUrl: string;

  submitButton = { isActive: true, label: 'Continue' };
  isReassessment = false;
  assessmentType = '';
  errorMessage = '';

  form = new FormGroup({
    reason: new FormControl<string>('', CustomValidators.required(this.errorMessage))
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;

    this.goBackUrl = `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}`;
  }

  ngOnInit() {
    const assessment = this.stores.context.getAssessment();

    this.isReassessment = assessment.majorVersion > 1;

    this.assessmentType = this.isReassessment ? 'reassessment' : 'assessment';
    this.errorMessage = `You must add a reason to edit the needs ${this.assessmentType}`;
    const pageTitle = `Edit needs ${this.assessmentType}`;

    this.setPageTitle(pageTitle);
    this.setBackLink('Go back', this.goBackUrl);
    this.setPageStatus('READY');
  }

  onSubmit(): void {
    this.resetAlert();
    if (!this.form.valid) {
      this.setAlertError('', {
        itemsList: [{ title: this.errorMessage, fieldId: 'reason' }],
        width: '2.thirds'
      });

      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    this.assessmentService
      .editInnovationNeedsAssessment(this.innovationId, { reason: this.form.value.reason! })
      .subscribe({
        next: newAssessment => {
          this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${newAssessment.id}/edit`);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Continue' };
          this.setAlertUnknownError();
        }
      });
  }
}
