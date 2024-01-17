import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';

import { CoreComponent } from '@app/base';
import { NotificationContextDetailEnum } from '@app/base/enums';
import { UtilsHelper } from '@app/base/helpers';
import { StatisticsCardType } from '@app/base/types';

import { irVersionsMainCategoryItems } from '@modules/stores/innovation/innovation-record/ir-versions.config';

import { InnovationCollaboratorsListDTO, InnovationInfoDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';

import {
  AssessmentExemptionTypeDTO,
  AssessmentService
} from '@modules/feature-modules/assessment/services/assessment.service';

@Component({
  selector: 'app-assessment-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: null | InnovationInfoDTO = null;

  assessmentExemption: null | Required<AssessmentExemptionTypeDTO>['exemption'] = null;
  innovationSummary: { label: string; value: null | string }[] = [];
  innovatorSummary: { label: string; value: string }[] = [];
  cardsList: StatisticsCardType[] = [];
  innovationCollaborators: InnovationCollaboratorsListDTO['data'] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private assessmentService: AssessmentService,
    private statisticsService: StatisticsService
  ) {
    super();
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
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
                    : irVersionsMainCategoryItems.find(item => item.value === v)?.label
                )
                .join('\n')
            }
          ];

          this.innovatorSummary = [
            { label: 'Owner', value: this.innovation.owner?.name ?? '[deleted account]' },
            {
              label: 'Contact preference',
              value:
                UtilsHelper.getContactPreferenceValue(
                  this.innovation.owner?.contactByEmail,
                  this.innovation.owner?.contactByPhone,
                  this.innovation.owner?.contactByPhoneTimeframe
                ) || ''
            },
            { label: 'Contact details', value: this.innovation.owner?.contactDetails || '' },
            { label: 'Email address', value: this.innovation.owner?.email || '' },
            { label: 'Phone number', value: this.innovation.owner?.mobilePhone || '' }
          ];

          return forkJoin([
            this.innovation.assessment
              ? this.assessmentService.getInnovationExemption(this.innovationId, this.innovation.assessment.id)
              : of(null),
            this.statisticsService.getInnovationStatisticsInfo(this.innovationId, qp)
          ]);
        })
      )
      .subscribe(([assessmentExemption, statistics]) => {
        if (assessmentExemption?.isExempted && assessmentExemption?.exemption) {
          this.assessmentExemption = assessmentExemption.exemption;
        }

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
            NotificationContextDetailEnum.NA07_NEEDS_ASSESSOR_ASSIGNED
          ]
        });

        this.setPageStatus('READY');
      });
  }
}
