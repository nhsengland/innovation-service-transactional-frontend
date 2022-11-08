import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';
import { RoutingHelper } from '@app/base/helpers';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getSupportLogOutDTO, SupportLogType } from '@modules/feature-modules/accessor/services/accessor.service';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';
import { InnovationNeedsAssessmentInfoDTO } from '@modules/shared/services/innovations.dtos';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../../../services/accessor.service';

import { InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'app-accessor-pages-innovation-needs-assessment-overview',
  templateUrl: './needs-assessment-overview.component.html'
})
export class InnovationNeedsAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: InnovationDataResolverType;

  assessment: InnovationNeedsAssessmentInfoDTO | undefined;
  suggestedOrganisations: InnovationNeedsAssessmentInfoDTO['suggestedOrganisations'] = [];
  logHistory: getSupportLogOutDTO[] = [];

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportLogType = SupportLogType;

  isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Needs assessment overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    // Throw notification read dismiss.
    this.stores.context.dismissNotification(NotificationContextTypeEnum.NEEDS_ASSESSMENT, this.assessmentId);

    forkJoin([
      this.innovationsService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId),
      this.accessorService.getSupportLog(this.innovationId)
    ]).subscribe(([needsAssessment, supportLog]) => {

      this.logHistory = supportLog;

      this.assessment = needsAssessment;
      this.suggestedOrganisations = this.assessment.suggestedOrganisations;

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

      // this.setBackLink('Go back', `/accessor/innovations/${this.innovationId}`);
      this.setPageStatus('READY');

    });

  }

}
