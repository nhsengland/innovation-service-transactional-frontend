import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum } from '@app/base/enums';
import { UtilsHelper } from '@app/base/helpers';
import { StatisticsCardType } from '@app/base/types';

import { InnovationCollaboratorsListDTO, InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';

import {
  AssessmentExemptionTypeDTO,
  AssessmentService
} from '@modules/feature-modules/assessment/services/assessment.service';
import { InnovationStatusEnum } from '@modules/stores';
import { KeyProgressAreasPayloadType } from '@modules/theme/components/key-progress-areas-card/key-progress-areas-card.component';

@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: null | InnovationInfoDTO = null;

  isArchived: boolean = false;
  showCards: boolean = true;
  showAssessmentExemptionLink: boolean = false;
  assessmentType = '';

  assessmentExemption: null | Required<AssessmentExemptionTypeDTO>['exemption'] = null;
  innovationSummary: { label: string; value: null | string }[] = [];
  innovatorSummary: { label: string; value: string }[] = [];
  cardsList: StatisticsCardType[] = [];
  innovationCollaborators: InnovationCollaboratorsListDTO['data'] = [];

  search?: string;

  innovationProgress: KeyProgressAreasPayloadType | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private assessmentService: AssessmentService,
    private statisticsService: StatisticsService
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.search = this.activatedRoute.snapshot.queryParams.search;
  }

  ngOnInit(): void {
    const qp: { statistics: InnovationStatisticsEnum[] } = {
      statistics: [
        InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER,
        InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER
      ]
    };

    this.innovationsService
      .getInnovationCollaboratorsList(this.innovationId, ['active'])
      .subscribe(innovationCollaborators => {
        this.innovationCollaborators = innovationCollaborators.data;
      });

    this.innovationsService
      .getInnovationInfo(this.innovationId)
      .pipe(
        switchMap(innovationInfo => {
          this.innovation = innovationInfo;

          this.isArchived = this.innovation.status === 'ARCHIVED';

          this.assessmentType =
            this.innovation?.assessment && this.innovation?.assessment.majorVersion > 1 ? 'reassessment' : 'assessment';

          this.showCards = ![InnovationStatusEnum.ARCHIVED, InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT].includes(
            this.innovation.status
          );

          this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });

          this.innovationSummary = [
            { label: 'Company', value: this.innovation.owner?.organisation?.name ?? 'No company' },
            ...(this.innovation.owner?.organisation?.size
              ? [{ label: 'Company size', value: this.innovation.owner.organisation.size }]
              : []),
            ...(this.innovation.owner?.organisation?.registrationNumber
              ? [
                  {
                    label: 'Company UK registration number',
                    value: this.innovation.owner.organisation.registrationNumber
                  }
                ]
              : []),
            {
              label: 'Location',
              value: `${this.innovation.countryName}${this.innovation.postCode ? ', ' + this.innovation.postCode : ''}`
            },
            { label: 'Description', value: this.innovation.description },
            {
              label: 'Categories',
              value: this.innovation.categories
                .map(v =>
                  v === 'OTHER'
                    ? this.innovation?.otherCategoryDescription
                    : this.stores.schema.getIrSchemaTranslationsMap()['questions'].get('categories')?.items.get(v)
                        ?.label
                )
                .join('\n')
            }
          ];

          this.innovatorSummary = [
            { label: 'Name', value: this.innovation.owner?.name ?? '[deleted account]' },
            {
              label: 'Contact preference',
              value: this.isArchived
                ? 'Not available'
                : UtilsHelper.getContactPreferenceValue(
                    this.innovation.owner?.contactByEmail,
                    this.innovation.owner?.contactByPhone,
                    this.innovation.owner?.contactByPhoneTimeframe
                  ) || ''
            },
            {
              label: 'Contact details',
              value: this.isArchived ? 'Not available' : this.innovation.owner?.contactDetails || ''
            },
            { label: 'Email address', value: this.isArchived ? 'Not available' : this.innovation.owner?.email || '' },
            {
              label: 'Phone number',
              value: this.isArchived ? 'Not available' : this.innovation.owner?.mobilePhone || ''
            }
          ];

          return forkJoin([
            this.innovation.assessment
              ? this.assessmentService.getInnovationExemption(this.innovationId, this.innovation.assessment.id)
              : of(null),
            this.statisticsService.getInnovationStatisticsInfo(this.innovationId, qp),
            this.innovationsService.getInnovationProgress(this.innovationId, true)
          ]);
        })
      )
      .subscribe(([assessmentExemption, statistics, innovationProgress]) => {
        if (assessmentExemption?.isExempted && assessmentExemption?.exemption) {
          this.assessmentExemption = assessmentExemption.exemption;
        }

        this.showAssessmentExemptionLink = !this.assessmentExemption && this.innovation?.assessment?.minorVersion === 0;

        this.cardsList = [
          {
            title: 'Innovation record',
            label: `Sections submitted since assessment was started`,
            link: `/assessment/innovations/${this.innovationId}/record`,
            count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].count,
            total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER].total,
            lastMessage: `Last submitted section: "${this.translate(
              'shared.catalog.innovation.innovation_sections.' +
                statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]
                  .lastSubmittedSection
            )}"`,
            date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_ASSESSMENT_START_COUNTER]
              .lastSubmittedAt,
            emptyMessage: `No sections have been submitted since the assessment started`
          },
          {
            title: 'Messages',
            label: `Unread replies to conversations you have started`,
            link: `/assessment/innovations/${this.innovationId}/threads`,
            count: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER].count,
            lastMessage: `Last received message`,
            date: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_THREADS_INITIATED_BY_COUNTER]?.lastSubmittedAt,
            emptyMessage: 'No replies to read'
          }
        ];

        // Throw notification read dismiss.
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [
            NotificationContextDetailEnum.NA02_INNOVATOR_SUBMITS_FOR_NEEDS_ASSESSMENT_TO_ASSESSMENT,
            NotificationContextDetailEnum.NA06_NEEDS_ASSESSOR_REMOVED,
            NotificationContextDetailEnum.NA07_NEEDS_ASSESSOR_ASSIGNED,
            NotificationContextDetailEnum.AI04_INNOVATION_ARCHIVED_TO_NA_DURING_NEEDS_ASSESSMENT
          ]
        });

        this.innovationProgress = Object.keys(innovationProgress).length ? innovationProgress : undefined;

        this.setPageStatus('READY');
      });
  }
}
