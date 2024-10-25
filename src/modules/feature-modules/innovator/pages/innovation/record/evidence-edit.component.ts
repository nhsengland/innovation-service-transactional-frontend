import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent } from '@app/base/forms';
import { ContextInnovationType } from '@app/base/types';

import { WizardEngineModel } from '@modules/shared/forms';

@Component({
  selector: 'app-innovator-pages-innovation-section-evidence-edit',
  templateUrl: './evidence-edit.component.html'
})
export class InnovationSectionEvidenceEditComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovation: ContextInnovationType;
  sectionId: string;
  evidenceId: string;
  baseUrl: string;

  wizard: WizardEngineModel;

  submitButton = { isActive: true, label: 'Save' };

  isCreation(): boolean {
    return !this.activatedRoute.snapshot.params.evidenceId;
  }
  isEdition(): boolean {
    return !!this.activatedRoute.snapshot.params.evidenceId;
  }

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovation = this.ctx.innovation.innovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.evidenceId = this.activatedRoute.snapshot.params.evidenceId;
    this.baseUrl = `innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`;

    this.wizard =
      this.stores.innovation.getInnovationRecordSectionEvidencesWizard(this.sectionId) ?? new WizardEngineModel({});

    // Protection from direct url access.
    if (this.wizard.steps.length === 0) {
      this.redirectTo(this.baseUrl);
    }

    this.setBackLink('Go back', this.onSubmitStep.bind(this, 'previous', new Event('')));
  }

  ngOnInit(): void {
    if (this.isCreation()) {
      this.wizard.runRules();

      this.setPageTitle('New evidence', { showPage: false });
      this.setPageStatus('READY');
    } else {
      this.stores.innovation.getSectionEvidence$(this.innovation.id, this.evidenceId).subscribe(response => {
        this.wizard.setAnswers(this.wizard.runInboundParsing(response)).runRules();
        this.wizard.gotoStep(this.activatedRoute.snapshot.params.questionId || 1);

        this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
        this.setPageStatus('READY');
      });
    }
  }

  onGotoStep(stepNumber: number): void {
    this.wizard.gotoStep(stepNumber);
    this.resetAlert();
    this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
  }

  onSubmitStep(action: 'previous' | 'next', event: Event): void {
    const formData = this.formEngineComponent?.getFormValues();

    if (action === 'previous') {
      this.wizard.addAnswers(formData?.data || {}).runRules();

      if (this.wizard.isFirstStep()) {
        this.redirectTo(`${this.baseUrl}${this.isCreation() ? '' : `/evidences/${this.evidenceId}`}`);
      } else {
        this.wizard.previousStep();
      }

      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
      return;
    }

    if (action === 'next' && !formData?.valid) {
      // Apply validation only when moving forward.
      return;
    }

    this.wizard.addAnswers(formData?.data || {}).runRules();
    this.wizard.nextStep();

    if (this.wizard.isQuestionStep()) {
      this.setPageTitle(this.wizard.currentStepTitle(), { showPage: false });
    } else {
      this.setPageTitle('Check your answers', { size: 'l' });
    }
  }

  onSubmitEvidence(): void {
    this.resetAlert();

    this.submitButton = { isActive: false, label: 'Saving...' };

    this.stores.innovation
      .upsertSectionEvidenceInfo$(this.innovation.id, this.wizard.runOutboundParsing(), this.evidenceId)
      .subscribe({
        next: response => {
          this.setRedirectAlertSuccess('Your evidence has been saved', {
            message: 'You need to submit this section for review to notify your supporting accessor(s).'
          });
          this.redirectTo(
            `innovator/innovations/${this.innovation.id}/record/sections/${this.activatedRoute.snapshot.params.sectionId}/evidences/${response.id}`
          );
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Save' };
          this.setAlertError(
            'An error occurred when saving your evidence. Please try again or contact us for further help.',
            { width: '2.thirds' }
          );
        }
      });
  }
}
