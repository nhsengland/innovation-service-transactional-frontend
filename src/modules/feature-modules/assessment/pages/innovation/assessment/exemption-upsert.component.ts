import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { FormEngineComponent, FormEngineParameterModel } from '@modules/shared/forms';

import { AssessmentService } from '../../../services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-assessment-exemption-upsert',
  templateUrl: './exemption-upsert.component.html'
})
export class InnovationAssessmentExemptionUpsertComponent extends CoreComponent implements OnInit {
  @ViewChild(FormEngineComponent) formEngineComponent?: FormEngineComponent;

  innovationId: string;
  assessmentId: string;
  baseUrl: string;

  isNew = false;

  formParameters: FormEngineParameterModel[] = [];
  formAnswers: Record<string, string> = {};

  actionButton = { enabled: true, label: '' };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected assessmentService: AssessmentService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/overview`;

    this.setBackLink();
    this.setPageTitle('Exempt this innovation from KPI reports');

    this.formParameters = [
      new FormEngineParameterModel({
        id: 'reason',
        dataType: 'radio-group',
        label: 'Select the reason this innovation should be exempt from key performance indicator (KPI) reports',
        validations: { isRequired: [true, 'Select a reason'] },
        items: [
          {
            value: 'NO_RESPONSE',
            label: this.translate('shared.catalog.assessment_exemptions.reasons.NO_RESPONSE'),
            description:
              'We have received no response within 10 working days of their submission and have made 2 attempts to contact them.'
          },
          {
            value: 'TECHNICAL_DIFFICULTIES',
            label: this.translate('shared.catalog.assessment_exemptions.reasons.TECHNICAL_DIFFICULTIES')
          },
          {
            value: 'INCORRECT_DETAILS',
            label: this.translate('shared.catalog.assessment_exemptions.reasons.INCORRECT_DETAILS')
          },
          {
            value: 'SERVICE_UNAVAILABLE',
            label: this.translate('shared.catalog.assessment_exemptions.reasons.SERVICE_UNAVAILABLE')
          },
          {
            value: 'CAPACITY',
            label: this.translate('shared.catalog.assessment_exemptions.reasons.CAPACITY'),
            description: 'More than 6 needs assessments have been completed per working day.'
          }
        ]
      }),
      new FormEngineParameterModel({
        id: 'message',
        dataType: 'textarea',
        label: 'Add a note to explain reason in more detail (optional)',
        lengthLimit: 'xl'
      })
    ];

    this.actionButton = { enabled: true, label: 'All changes are saved' };
  }

  ngOnInit(): void {
    this.assessmentService.getInnovationExemption(this.innovationId, this.assessmentId).subscribe({
      next: response => {
        this.isNew = !response.isExempted;

        if (!this.isNew && response.exemption) {
          this.formAnswers = {
            reason: response.exemption.reason,
            message: response.exemption.message ?? ''
          };
        }

        this.actionButton.label = this.isNew ? 'Mark as exempt' : 'Update exemption information';

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onUpsert() {
    const formData = this.formEngineComponent?.getFormValues();

    if (!formData?.valid) {
      return;
    }

    this.actionButton.enabled = false;

    const body = {
      reason: formData.data.reason,
      ...(formData.data.message && { message: formData.data.message })
    };

    this.assessmentService.updateInnovationExemption(this.innovationId, this.assessmentId, body).subscribe({
      next: () => {
        if (this.isNew) {
          this.setRedirectAlertSuccess('You have marked this innovation as exempt from KPI reports');
        } else {
          this.setRedirectAlertSuccess('You have updated this innovation exemption information');
        }

        this.redirectTo(this.ctx.layout.previousUrl() ?? this.baseUrl);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        this.actionButton.enabled = true;
      }
    });
  }
}
