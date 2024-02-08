import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum } from '@app/base/enums';
import { DatesHelper } from '@app/base/helpers';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import {
  maturityLevelItems,
  yesNoItems,
  yesPartiallyNoItems
} from '@modules/stores/innovation/config/innovation-catalog.config';

import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class PageInnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  assessmentId: string;
  innovation: ContextInnovationType;

  assessment?: InnovationNeedsAssessmentInfoDTO;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationReassessment: { label?: string; value: null | string }[] = [];
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  // Flags
  isAdminType: boolean;
  isAssessmentType: boolean;
  isAccessorType: boolean;
  isInnovatorType: boolean;
  isQualifyingAccessorRole: boolean;

  isArchived: boolean;

  assessmentHasBeenSubmitted = false;
  shouldShowUpdatedAt = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = this.stores.context.getInnovation();

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isQualifyingAccessorRole = this.isAccessorType && this.stores.authentication.isQualifyingAccessorRole();

    this.isArchived = this.innovation.status === 'ARCHIVED';
  }

  ngOnInit(): void {
    this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId).subscribe(response => {
      this.assessment = response;

      this.assessmentHasBeenSubmitted = !!response.finishedAt;
      this.shouldShowUpdatedAt =
        DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;

      if (this.assessment.reassessment) {
        this.innovationReassessment = [
          {
            label:
              'Did the innovator update the innovation record since submitting it to the previous needs assessment?',
            value: yesNoItems.find(item => item.value === response.reassessment?.updatedInnovationRecord)?.label || ''
          },
          {
            label: 'What has changed with the innovation and what support does the innovator need next?',
            value: response.reassessment?.description || ''
          }
        ];
      }

      const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === response.maturityLevel) || 0) + 1;
      this.innovationMaturityLevel = {
        label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
        value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
        levelIndex: maturityLevelIndex,
        description: maturityLevelItems.find(item => item.value === response.maturityLevel)?.label || '',
        comment: response.maturityLevelComment || ''
      };

      this.innovationSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[2].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasRegulatoryApprovals)?.label || '',
          comment: response.hasRegulatoryApprovalsComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[3].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasEvidence)?.label || '',
          comment: response.hasEvidenceComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovation[4].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasValidation)?.label || '',
          comment: response.hasValidationComment || ''
        }
      ];

      this.innovatorSummary = [
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[0].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasProposition)?.label || '',
          comment: response.hasPropositionComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[1].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasCompetitionKnowledge)?.label || '',
          comment: response.hasCompetitionKnowledgeComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[2].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasImplementationPlan)?.label || '',
          comment: response.hasImplementationPlanComment || ''
        },
        {
          label: NEEDS_ASSESSMENT_QUESTIONS.innovator[3].label,
          value: yesPartiallyNoItems.find(item => item.value === response.hasScaleResource)?.label || '',
          comment: response.hasScaleResourceComment || ''
        }
      ];

      this.setPageTitle(!this.assessment.reassessment ? 'Needs assessment' : 'Needs reassessment', {
        hint: `Innovation ${this.innovation.name}`
      });

      // Throw notification read dismiss.
      if (this.isInnovatorType) {
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [NotificationContextDetailEnum.NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR]
        });
      }

      this.setPageStatus('READY');
    });
  }
}
