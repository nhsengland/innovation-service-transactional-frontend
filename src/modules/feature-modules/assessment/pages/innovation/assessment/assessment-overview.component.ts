import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { DatesHelper, RoutingHelper } from '@app/base/helpers';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getSupportLogOutDTO, SupportLogType } from '@modules/feature-modules/assessment/services/assessment.service';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AssessmentService } from '../../../services/assessment.service';

import { GetInnovationNeedsAssessmentEndpointOutDTO, InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class InnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: InnovationDataResolverType;

  assessment: GetInnovationNeedsAssessmentEndpointOutDTO['assessment'] | undefined;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  logHistory: getSupportLogOutDTO[] = [];
  supportLogType = SupportLogType;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  shouldShowUpdatedAt = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Needs assessment overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    forkJoin([
      this.assessmentService.getSupportLog(this.innovationId),
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId)
    ]).subscribe(([supportLog, needsAssessmentInfo]) => {

      this.logHistory = supportLog;

      this.assessment = { ...needsAssessmentInfo.assessment };

      this.shouldShowUpdatedAt = DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;

      const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === needsAssessmentInfo.assessment.maturityLevel) || 0) + 1;
      this.innovationMaturityLevel = {
        label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
        value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
        levelIndex: maturityLevelIndex,
        description: maturityLevelItems.find(item => item.value === needsAssessmentInfo.assessment.maturityLevel)?.label || '',
        comment: needsAssessmentInfo.assessment.maturityLevelComment || ''
      };

      this.innovationSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[2].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasRegulatoryApprovals)?.label || '',
          comment: needsAssessmentInfo.assessment.hasRegulatoryApprovalsComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[3].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasEvidence)?.label || '',
          comment: needsAssessmentInfo.assessment.hasEvidenceComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[4].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasValidation)?.label || '',
          comment: needsAssessmentInfo.assessment.hasValidationComment || ''
        }
      ];

      this.innovatorSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[0].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasProposition)?.label || '',
          comment: needsAssessmentInfo.assessment.hasPropositionComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[1].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasCompetitionKnowledge)?.label || '',
          comment: needsAssessmentInfo.assessment.hasCompetitionKnowledgeComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[2].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasImplementationPlan)?.label || '',
          comment: needsAssessmentInfo.assessment.hasImplementationPlanComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[3].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessmentInfo.assessment.hasScaleResource)?.label || '',
          comment: needsAssessmentInfo.assessment.hasScaleResourceComment || ''
        }
      ];

      this.setPageStatus('READY');

    });

  }

}
