import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { CustomValidators } from '@modules/shared/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'app-pages-innovation-assessment-reassessment-new',
  templateUrl: './reassessment-new.component.html'
})
export class PageInnovationReassessmentNewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  assessmentId: string;

  goBackUrl: string;

  submitButton = { isActive: true, label: 'Continue' };

  errorMessage: string = 'You must add a reason for the needs reassessment';

  form = new FormGroup({
    reason: new FormControl<string>('', CustomValidators.required(this.errorMessage))
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;

    this.goBackUrl = `/assessment/innovations/${this.innovationId}/assessments/${this.assessmentId}`;
  }

  ngOnInit() {
    this.setPageTitle('Needs reassessment');
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

    // TO DO: Check if flow is working as expected (it creates an assessment with reassessment and redirects to the assessment edit page)
    this.innovationsService
      .createNeedsReassessment(this.innovationId, { description: this.form.value.reason! })
      .subscribe({
        next: newAssessmentId => {
          this.redirectTo(`/assessment/innovations/${this.innovationId}/assessments/${newAssessmentId}/edit`);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Continue' };
          this.setAlertUnknownError();
        }
      });
  }
}
