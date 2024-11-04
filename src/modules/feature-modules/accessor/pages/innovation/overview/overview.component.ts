import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { ContextInnovationType, StatisticsCardType } from '@app/base/types';

import { NotificationContextDetailEnum } from '@modules/stores/context/context.enums';
import { InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { InnovationCollaboratorsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum, UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import { InnovationUnitSuggestionsType } from '@modules/stores/innovation/innovation.models';
import { KeyProgressAreasPayloadType } from '@modules/theme/components/key-progress-areas-card/key-progress-areas-card.component';
import { InnovationContextService } from '@modules/stores';

@Component({
  selector: 'app-accessor-pages-innovation-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;

  qaSuggestions: InnovationUnitSuggestionsType = [];

  isQualifyingAccessorRole = false;
  isAccessorRole = false;

  innovationSummary: { label: string; value: null | string }[] = [];
  innovatorSummary: { label: string; value: string }[] = [];
  cardsList: StatisticsCardType[] = [];
  innovationSupport: {
    organisationUnit: string;
    status: InnovationSupportStatusEnum;
    engagingAccessors: { name: string }[];
  } = { organisationUnit: '', status: InnovationSupportStatusEnum.UNASSIGNED, engagingAccessors: [] };

  isInProgress: boolean = false;
  isInAssessment: boolean = false;
  isArchived: boolean = false;
  showCards: boolean = false;
  showStartSupport = false;
  changeSupportUrlNewOrSupport: string | 'new' | undefined;

  innovationCollaborators: InnovationCollaboratorsListDTO['data'] = [];

  search?: string;

  innovationProgress: KeyProgressAreasPayloadType | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private innovationService: InnovationContextService,
    private statisticsService: StatisticsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.search = this.activatedRoute.snapshot.queryParams.search;

    this.innovation = this.ctx.innovation.info();
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();
    this.isAccessorRole = this.stores.authentication.isAccessorRole();
    this.isInAssessment = [
      InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT,
      InnovationStatusEnum.NEEDS_ASSESSMENT,
      InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT
    ].includes(this.innovation.status);
    this.isInProgress = this.innovation.status === 'IN_PROGRESS';
    this.isArchived = this.ctx.innovation.isArchived();

    this.setPageTitle('Overview', { hint: `Innovation ${this.innovation.name}` });
  }

  ngOnInit(): void {
    const qp: { statistics: InnovationStatisticsEnum[] } = {
      statistics: [
        InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER,
        InnovationStatisticsEnum.TASKS_RESPONDED_COUNTER
      ]
    };

    forkJoin({
      statistics: this.statisticsService.getInnovationStatisticsInfo(this.innovationId, qp),
      collaborators: this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ['active']),
      ...(this.innovation.support?.id && {
        support: this.innovationsService.getInnovationSupportInfo(this.innovationId, this.innovation.support.id)
      }),
      ...(this.isQualifyingAccessorRole && {
        unitsSuggestions: this.innovationService.getInnovationQASuggestions(this.innovation.id)
      }),
      innovationProgress: this.innovationsService.getInnovationProgress(this.innovationId, true)
    }).subscribe(({ support, statistics, collaborators, unitsSuggestions, innovationProgress }) => {
      this.qaSuggestions = unitsSuggestions ?? [];

      const innovationInfo = this.innovation;

      this.innovationSupport = {
        organisationUnit: this.stores.authentication.getAccessorOrganisationUnitName(),
        status: support?.status ?? InnovationSupportStatusEnum.UNASSIGNED,
        engagingAccessors: support?.engagingAccessors ?? []
      };

      this.showStartSupport =
        this.isInProgress &&
        this.isQualifyingAccessorRole &&
        (!this.innovationSupport ||
          (this.innovationSupport && this.innovationSupport.status === InnovationSupportStatusEnum.SUGGESTED));

      this.innovationSummary = [
        { label: 'Company', value: innovationInfo.owner?.organisation?.name ?? 'No company' },
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
          value: `${innovationInfo.countryName}${innovationInfo.postCode ? ', ' + innovationInfo.postCode : ''}`
        },
        { label: 'Description', value: innovationInfo.description },
        {
          label: 'Categories',
          value: innovationInfo.categories
            .map(v =>
              v === 'OTHER'
                ? innovationInfo.otherCategoryDescription
                : this.stores.schema.getIrSchemaTranslationsMap()['questions'].get('categories')?.items.get(v)?.label
            )
            .join('\n')
        }
      ];

      this.innovatorSummary = [{ label: 'Name', value: this.innovation.owner?.name ?? '[deleted account]' }];

      this.showCards =
        [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.WAITING].includes(
          this.innovationSupport.status
        ) && !this.isArchived;

      this.innovationCollaborators = collaborators.data;

      this.cardsList = [
        {
          title: 'Innovation record',
          label: `sections submitted since your organisation unit started support`,
          link: `/accessor/innovations/${this.innovationId}/record`,
          count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].count,
          total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].total,
          lastMessage: `Last submitted section: "${this.translate(
            'shared.catalog.innovation.innovation_sections.' +
              statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedSection
          )}"`,
          date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_SINCE_SUPPORT_START_COUNTER].lastSubmittedAt,
          emptyMessage: `No sections have been submitted since support started`
        },
        {
          title: 'Tasks',
          label: `tasks assigned by your organisation have been done or declined by the innovator`,
          link: `/accessor/innovations/${this.innovationId}/tasks`,
          count: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].count,
          total: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].total,
          lastMessage: `Last updated task: "${this.translate(
            'shared.catalog.innovation.innovation_sections.' +
              statistics[InnovationStatisticsEnum.TASKS_RESPONDED_COUNTER].lastUpdatedSection
          )}"`,
          date: statistics[InnovationStatisticsEnum.TASKS_RESPONDED_COUNTER]?.lastUpdatedAt,
          emptyMessage: 'No tasks assigned by your organisation yet'
        }
      ];

      // Throw notification read dismiss.
      this.stores.context.dismissNotification(this.innovationId, {
        contextDetails: [
          NotificationContextDetailEnum.AU04_SUPPORT_KPI_REMINDER,
          NotificationContextDetailEnum.AU05_SUPPORT_KPI_OVERDUE,
          NotificationContextDetailEnum.AU06_ACCESSOR_IDLE_WAITING,
          NotificationContextDetailEnum.AI03_INNOVATION_ARCHIVED_TO_ENGAGING_QA_A,
          NotificationContextDetailEnum.REMINDER,
          NotificationContextDetailEnum.AU11_ACCESSOR_IDLE_WAITING_SUPPORT_FOR_SIX_WEEKS
        ]
      });

      if (this.isQualifyingAccessorRole) {
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [
            NotificationContextDetailEnum.OS01_UNITS_SUGGESTION_TO_SUGGESTED_UNITS_QA,
            NotificationContextDetailEnum.OS03_INNOVATION_DELAYED_SHARED_SUGGESTION
          ]
        });
      }

      if (this.innovation.support?.id) {
        this.stores.context.dismissNotification(this.innovationId, {
          contextDetails: [NotificationContextDetailEnum.ST05_SUPPORT_NEW_ASSIGNED_ACCESSOR_TO_NEW_QA],
          contextIds: [this.innovation.support.id]
        });
        if (this.isQualifyingAccessorRole) {
          this.stores.context.dismissNotification(this.innovationId, {
            contextDetails: [NotificationContextDetailEnum.ST07_SUPPORT_STATUS_CHANGE_REQUEST],
            contextIds: [this.innovation.support.id]
          });
        }
      }

      this.innovationProgress = Object.keys(innovationProgress).length ? innovationProgress : undefined;

      this.changeSupportUrlNewOrSupport =
        this.innovationSupport &&
        [InnovationSupportStatusEnum.CLOSED, InnovationSupportStatusEnum.UNSUITABLE].includes(
          this.innovationSupport.status
        )
          ? 'new'
          : this.innovation.support?.id;

      this.setPageStatus('READY');
    });
  }
}
