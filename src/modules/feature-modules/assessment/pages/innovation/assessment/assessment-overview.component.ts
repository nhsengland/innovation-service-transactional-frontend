import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { DatesHelper, RoutingHelper } from '@modules/core';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getInnovationNeedsAssessmentEndpointOutDTO } from '@modules/feature-modules/assessment/services/assessment.service';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AssessmentService } from '../../../services/assessment.service';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class InnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: InnovationDataResolverType;

  alert: AlertType = { type: null };

  assessment: getInnovationNeedsAssessmentEndpointOutDTO['assessment'] & { organisationsNames: string[] } | undefined;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  shouldShowUpdatedAt = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {

    super();
    this.setPageTitle('Needs assessment overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'needsAssessmentSubmited':
        this.alert = {
          type: 'SUCCESS',
          title: 'Needs assessment successfully completed'
        };
        break;
      default:
        break;
    }

    this.assessmentService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId).subscribe(
      response => {

        this.assessment = { ...response.assessment, organisationsNames: response.assessment.organisations.map(item => item.name) };

        this.shouldShowUpdatedAt = DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;

        const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === response.assessment.maturityLevel) || 0) + 1;
        this.innovationMaturityLevel = {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
          value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
          levelIndex: maturityLevelIndex,
          description: maturityLevelItems.find(item => item.value === response.assessment.maturityLevel)?.label || ''
        };

        this.innovationSummary = [
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovation[2].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasRegulatoryApprovals)?.label || '',
            comment: response.assessment.hasRegulatoryApprovalsComment || ''
          },
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovation[3].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasEvidence)?.label || '',
            comment: response.assessment.hasEvidenceComment || ''
          },
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovation[4].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasValidation)?.label || '',
            comment: response.assessment.hasValidationComment || ''
          }
        ];

        this.innovatorSummary = [
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovator[0].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasProposition)?.label || '',
            comment: response.assessment.hasPropositionComment || ''
          },
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovator[1].label,
            value: maturityLevelItems.find(item => item.value === response.assessment.hasCompetitionKnowledge)?.label || '',
            comment: response.assessment.hasCompetitionKnowledgeComment || ''
          },
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovator[2].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasImplementationPlan)?.label || '',
            comment: response.assessment.hasImplementationPlanComment || ''
          },
          {
            label: NEEDS_ASSESSMENT_QUESTIONS.innovator[3].label,
            value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasScaleResource)?.label || '',
            comment: response.assessment.hasScaleResourceComment || ''
          }
        ];

      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
