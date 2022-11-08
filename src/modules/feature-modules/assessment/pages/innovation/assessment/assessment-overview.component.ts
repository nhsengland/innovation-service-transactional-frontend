import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { DatesHelper, RoutingHelper } from '@app/base/helpers';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getSupportLogOutDTO, SupportLogType } from '@modules/feature-modules/assessment/services/assessment.service';
import { maturityLevelItems, yesNoItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';
import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AssessmentService } from '../../../services/assessment.service';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'app-assessment-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class InnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: InnovationDataResolverType;

  assessment: InnovationNeedsAssessmentInfoDTO | undefined;
  assessmentHasBeenSubmitted = false;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  logHistory: getSupportLogOutDTO[] = [];
  supportLogType = SupportLogType;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationReassessment: { label?: string, value: null | string }[] = [];
  innovationSummary: { label?: string, value: null | string, comment: string }[] = [];
  innovatorSummary: { label?: string, value: null | string, comment: string }[] = [];

  shouldShowUpdatedAt = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    forkJoin([
      this.assessmentService.getSupportLog(this.innovationId),
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId)
    ]).subscribe(([supportLog, needsAssessment]) => {

      this.logHistory = supportLog;

      this.assessment = needsAssessment;
      this.assessmentHasBeenSubmitted = !!needsAssessment.finishedAt;

      this.shouldShowUpdatedAt = DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;

      const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === needsAssessment.maturityLevel) || 0) + 1;
      this.innovationMaturityLevel = {
        label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
        value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
        levelIndex: maturityLevelIndex,
        description: maturityLevelItems.find(item => item.value === needsAssessment.maturityLevel)?.label || '',
        comment: needsAssessment.maturityLevelComment || ''
      };

      if (this.assessment.reassessment) {
        this.innovationReassessment = [
          {
            label: 'Did the innovator updated innovation record since submitting it to the previous needs assessment?',
            value: yesNoItems.find(item => item.value === needsAssessment.reassessment?.updatedInnovationRecord)?.label || ''
          },
          {
            label: 'What has changed with the innovation and what support does the innovator need next?',
            value: needsAssessment.reassessment?.description || ''
          }
        ];
      }

      this.innovationSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[2].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasRegulatoryApprovals)?.label || '',
          comment: needsAssessment.hasRegulatoryApprovalsComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[3].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasEvidence)?.label || '',
          comment: needsAssessment.hasEvidenceComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[4].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasValidation)?.label || '',
          comment: needsAssessment.hasValidationComment || ''
        }
      ];

      this.innovatorSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[0].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasProposition)?.label || '',
          comment: needsAssessment.hasPropositionComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[1].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasCompetitionKnowledge)?.label || '',
          comment: needsAssessment.hasCompetitionKnowledgeComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[2].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasImplementationPlan)?.label || '',
          comment: needsAssessment.hasImplementationPlanComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[3].label,
          value: yesPartiallyNoItems.find(item => item.value === needsAssessment.hasScaleResource)?.label || '',
          comment: needsAssessment.hasScaleResourceComment || ''
        }
      ];

      if (!this.assessment.reassessment) {
        this.setPageTitle('Needs assessment overview');
      } else {
        this.setPageTitle('Needs reassessment overview');
      }

      this.setPageStatus('READY');

    });

  }

}
