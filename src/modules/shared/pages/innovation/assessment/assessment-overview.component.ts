import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum } from '@app/base/enums';
import { DatesHelper, UtilsHelper } from '@app/base/helpers';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/config/innovation-catalog.config';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';

@Component({
  selector: 'shared-pages-innovation-assessment-overview',
  templateUrl: './assessment-overview.component.html'
})
export class PageInnovationAssessmentOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  assessmentId: string;
  assessmentQueryParam?: string;
  editPageQueryParam?: string;
  innovation: ContextInnovationType;

  assessment?: InnovationNeedsAssessmentInfoDTO;

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  // Flags
  isAdminType: boolean;
  isAssessmentType: boolean;
  isAccessorType: boolean;
  isInnovatorType: boolean;
  isQualifyingAccessorRole: boolean;

  isInProgress: boolean;

  assessmentHasBeenSubmitted = false;
  shouldShowUpdatedAt = false;
  isReassessment = false;
  assessmentType = '';
  showAssessmentDetails = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.assessmentQueryParam = this.activatedRoute.snapshot.queryParams.assessment;
    this.editPageQueryParam = this.activatedRoute.snapshot.queryParams.editPage;

    this.innovation = this.stores.context.getInnovation();

    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isQualifyingAccessorRole = this.isAccessorType && this.stores.authentication.isQualifyingAccessorRole();

    this.isInProgress = this.innovation.status === 'IN_PROGRESS';
  }

  ngOnInit(): void {
    this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId).subscribe(response => {
      this.assessment = response;

      this.assessmentHasBeenSubmitted = !!response.finishedAt;
      this.shouldShowUpdatedAt =
        DatesHelper.dateDiff(this.assessment.finishedAt || '', this.assessment.updatedAt || '') > 0;
      this.isReassessment = this.assessment.majorVersion > 1;
      this.assessmentType = this.isReassessment ? 'reassessment' : 'assessment';
      this.showAssessmentDetails = !(this.assessment.majorVersion === 1 && this.assessment.minorVersion === 0);

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

      // Throw notification read dismiss.
      if (this.isInnovatorType) {
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [NotificationContextDetailEnum.NA04_NEEDS_ASSESSMENT_COMPLETE_TO_INNOVATOR]
        });
      }

      this.setGoBackLink();
      this.updatePageTitle();
      this.setPageStatus('READY');
    });
  }

  updatePageTitle(): void {
    let assessmentTitle = this.isReassessment ? 'Needs reassessment' : 'Needs assessment';
    if (this.assessment?.isLatest && this.innovation.status === InnovationStatusEnum.NEEDS_ASSESSMENT) {
      assessmentTitle = this.isReassessment ? 'In draft needs reassessment' : 'In draft needs assessment';
    }

    const pageTitle = `${assessmentTitle} ${UtilsHelper.getAssessmentVersion(this.assessment?.majorVersion, this.assessment?.minorVersion)}`;
    const baseHint = `Innovation ${this.innovation.name}`;
    this.setPageTitle(pageTitle, { hint: baseHint });
  }

  setGoBackLink(): void {
    if (this.isAssessmentType) {
      let goBackUrl = undefined;
      const assessmentEditUrl = `/assessment/innovations/${this.innovationId}/assessments/${this.innovation.assessment?.id}/edit`;
      switch (this.assessmentQueryParam) {
        case 'editReason':
          goBackUrl = `${assessmentEditUrl}/reason`;
          break;
        case 'edit':
          goBackUrl = `${assessmentEditUrl}${this.editPageQueryParam ? `/${this.editPageQueryParam}` : ''}`;
          break;
      }
      if (goBackUrl) {
        this.setBackLink('Go back', goBackUrl);
      }
    }
  }
}
