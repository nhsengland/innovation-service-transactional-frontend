import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@modules/core';
import { NEEDS_ASSESSMENT_QUESTIONS } from '@modules/stores/innovation/config/needs-assessment-constants.config';

import { getInnovationNeedsAssessmentEndpointOutDTO, getSupportLogOutDTO, SupportLogType } from '@modules/feature-modules/accessor/services/accessor.service';
import { maturityLevelItems, yesPartiallyNoItems } from '@modules/stores/innovation/sections/catalogs.config';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';

import { AccessorService } from '../../../services/accessor.service';


@Component({
  selector: 'app-accessor-pages-innovation-needs-assessment-overview',
  templateUrl: './needs-assessment-overview.component.html'
})
export class InnovationNeedsAssessmentOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  assessmentId: string;
  innovation: InnovationDataResolverType;

  assessment: getInnovationNeedsAssessmentEndpointOutDTO['assessment'] | undefined;
  suggestedOrganisations: string[] = [];
  logHistory: getSupportLogOutDTO[] = [];

  innovationMaturityLevel = { label: '', value: '', levelIndex: 0, description: '' };
  innovationSummary: { label?: string; value: null | string; comment: string }[] = [];
  innovatorSummary: { label?: string; value: null | string; comment: string }[] = [];

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  supportLogType = SupportLogType;

  isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();
    this.setPageTitle('Needs assessment overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.assessmentId = this.activatedRoute.snapshot.params.assessmentId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

  }


  ngOnInit(): void {

    this.accessorService.getInnovationNeedsAssessment(this.innovationId, this.assessmentId).subscribe(
      response => {

        this.assessment = response.assessment;
        this.suggestedOrganisations = this.assessment.organisations.map(item => item.name);

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

    this.accessorService.getSupportLog(this.innovationId).subscribe(
      response => {
        this.logHistory = response;
      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
