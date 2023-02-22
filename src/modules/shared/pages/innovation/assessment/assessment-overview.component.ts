import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { DatesHelper } from '@app/base/helpers';
import { NotificationContextTypeEnum, UserRoleEnum } from '@app/base/enums';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { maturityLevelItems, yesNoItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationNeedsAssessmentInfoDTO, InnovationSupportsLogDTO, SupportLogType } from '@modules/shared/services/innovations.dtos';

import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class PageInnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: ContextInnovationType;

  assessment: InnovationNeedsAssessmentInfoDTO | undefined;
  assessmentHasBeenSubmitted = false;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  userType: '' | UserRoleEnum;

  logHistory: InnovationSupportsLogDTO[] = [];
  supportLogType = SupportLogType;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationReassessment: { label?: string, value: null | string }[] = [];
  innovationSummary: { label?: string, value: null | string, comment: string }[] = [];
  innovatorSummary: { label?: string, value: null | string, comment: string }[] = [];

  shouldShowUpdatedAt = false;
  isQualifyingAccessorRole = false;
  userRole = UserRoleEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
  ) {

    super();

    this.userType = this.stores.authentication.getUserType();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = this.stores.context.getInnovation();

    if(this.stores.authentication.isAccessorType()) {
      this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();
    }
  }


  ngOnInit(): void {
    // Throw notification read dismiss.
    this.stores.context.dismissNotification(this.innovationId, {contextTypes: [NotificationContextTypeEnum.NEEDS_ASSESSMENT], contextIds: [this.assessmentId]});
    
    forkJoin([
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId),
      this.innovationsService.getInnovationSupportLog(this.innovationId)
    ]).subscribe(([needsAssessment, supportLog]) => {
      this.logHistory = supportLog;

      this.assessment = needsAssessment;
      this.assessmentHasBeenSubmitted = !!needsAssessment.finishedAt;

      this.shouldShowUpdatedAt = DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;

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

      const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === needsAssessment.maturityLevel) || 0) + 1;
      this.innovationMaturityLevel = {
        label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
        value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
        levelIndex: maturityLevelIndex,
        description: maturityLevelItems.find(item => item.value === needsAssessment.maturityLevel)?.label || '',
        comment: needsAssessment.maturityLevelComment || ''
      };

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

      const title = !this.assessment.reassessment ? 'Needs assessment' : 'Needs reassessment';
      this.setPageTitle(title, {hint: `Innovation ${this.innovation.name}`});
  

      this.setPageStatus('READY');

    });

  }

}
