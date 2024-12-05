import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import {
  AssessmentExemptionTypeDTO,
  AssessmentService
} from '@modules/feature-modules/assessment/services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-assessment-exemption-info',
  templateUrl: './exemption-info.component.html'
})
export class InnovationAssessmentExemptionInfoComponent extends CoreComponent implements OnInit {
  innovationId: string;
  assessmentId: string;

  assessmentExemption: null | Required<AssessmentExemptionTypeDTO>['exemption'] = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;

    this.setBackLink('Go back', `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/overview`);
    this.setPageTitle('Innovation exempt from key performance indicator (KPI) reports');
  }

  ngOnInit(): void {
    this.assessmentService.getInnovationExemption(this.innovationId, this.assessmentId).subscribe({
      next: response => {
        if (response.isExempted && response.exemption) {
          this.assessmentExemption = response.exemption;
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
