import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';

import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { getInnovationNeedsAssessmentEndpointOutDTO, GetSupportLogListOutDTO } from '@modules/feature-modules/innovator/services/innovator.service';

import { InnovatorService } from '../../../services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-needs-assessment-overview',
  templateUrl: './needs-assessment-overview.component.html'
})
export class InnovatorNeedsAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: ContextInnovationType;

  assessment: getInnovationNeedsAssessmentEndpointOutDTO['assessment'] | undefined;

  supportLogList: GetSupportLogListOutDTO[] = [];

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '', comment: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();
    this.setPageTitle('Innovation needs assessment overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = this.stores.context.getInnovation();

  }


  ngOnInit(): void {

    // Throw notification read dismiss.
    this.stores.context.dismissNotification(NotificationContextTypeEnum.NEEDS_ASSESSMENT, this.assessmentId);

    forkJoin([
      this.innovatorService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId),
      this.innovatorService.getSupportLogList(this.innovationId)
    ]).subscribe(([response, supportLogList]) => {

      this.supportLogList = supportLogList;

      this.assessment = response.assessment;

      const maturityLevelIndex = (maturityLevelItems.findIndex(item => item.value === response.assessment.maturityLevel) || 0) + 1;
      this.innovationMaturityLevel = {
        label: NEEDS_ASSESSMENT_QUESTIONS.innovation[1].label || '',
        value: `${maturityLevelIndex} / ${maturityLevelItems.length}`,
        levelIndex: maturityLevelIndex,
        description: maturityLevelItems.find(item => item.value === response.assessment.maturityLevel)?.label || '',
        comment: response.assessment.maturityLevelComment || ''
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
          value: yesPartiallyNoItems.find(item => item.value === response.assessment.hasCompetitionKnowledge)?.label || '',
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

      this.setPageStatus('READY');

    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch needs assessment overview',
          message: 'Please try again or contact us for further help'
        };
      }

    );

  }

}
