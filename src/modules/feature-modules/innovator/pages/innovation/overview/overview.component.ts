import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { DateISOType, StatisticsCardType } from '@app/base/types';

import { NotificationCategoryTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationGroupedStatusEnum, InnovationSectionEnum, InnovationStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovation: null | {
    owner: { name: string },
    loggedUser: { isOwner: boolean },
    collaborators: { nameOrEmail: string }[],
    status: InnovationStatusEnum,
    groupedStatus: InnovationGroupedStatusEnum,
    engagingOrganisationsCount: number,
    statusUpdatedAt: null | DateISOType,
    lastEndSupportAt: null | DateISOType
  } = null;

  cardsList: StatisticsCardType[] = [];

  isSubmitted = {
    submittedAllSections: false,
    submittedForNeedsAssessment: false
  };

  showBanner = true;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private statisticsService: StatisticsService
  ) {

    super();
    this.setPageTitle('Overview', { hint: 'Your innovation' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }

  ngOnInit(): void {

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.innovationsService.getInnovationCollaboratorsList(this.innovationId, ['active']),
      this.statisticsService.getInnovationStatisticsInfo(this.innovationId, { statistics: [InnovationStatisticsEnum.TASKS_OPEN_COUNTER, InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER, InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER] }),
      this.innovationsService.getInnovationSubmission(this.innovationId)
    ]).subscribe(([innovationInfo, innovationCollaborators, statistics, submit]) => {

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationCategoryTypeEnum.INNOVATION_MANAGEMENT, NotificationCategoryTypeEnum.SUPPORT] });

      const innovationContext = this.stores.context.getInnovation();

      const engagingOrganisationsCount = (innovationInfo.supports ?? []).filter(supports => [InnovationSupportStatusEnum.ENGAGING].includes(supports.status)).length;


      this.innovation = {
        owner: { name: innovationInfo.owner?.name ?? '' },
        loggedUser: { isOwner: innovationContext.loggedUser.isOwner },
        collaborators: innovationCollaborators.data.map(item => ({ nameOrEmail: `${item.name ?? item.email} ${item.role ? `(${item.role})` : ''}` })),
        status: innovationInfo.status,
        groupedStatus: innovationInfo.groupedStatus,
        engagingOrganisationsCount: engagingOrganisationsCount,
        statusUpdatedAt: innovationInfo.statusUpdatedAt,
        lastEndSupportAt: innovationInfo.lastEndSupportAt
      };

      this.isSubmitted = { submittedAllSections: submit.submittedAllSections, submittedForNeedsAssessment: submit.submittedForNeedsAssessment };
      this.showBanner = !(submit.submittedAllSections && submit.submittedForNeedsAssessment);

      const lastTaskSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER].lastSubmittedSection!];

      this.cardsList = [{
        title: 'Innovation record',
        label: `Sections were submitted`,
        link: `/innovator/innovations/${this.innovationId}/record`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].total,
        lastMessage: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedSection ? `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedSection)}"` : '',
        date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]?.lastSubmittedAt,
        emptyMessage: "You haven't submitted any section of your innovation record yet"
      }, {
        title: 'Tasks assigned to you',
        label: `tasks to do`,
        link: `/innovator/innovations/${this.innovationId}/tasks`,
        count: statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER].count,
        lastMessage: `Most recent assigned task: "Update '${this.translate('shared.catalog.innovation.innovation_sections.' + lastTaskSubmitted)}'"`,
        date: statistics[InnovationStatisticsEnum.TASKS_OPEN_COUNTER]?.lastSubmittedAt,
        emptyMessageTitle: 'No tasks assigned to you yet',
        emptyMessage: 'We might send a request to add more information to your innovation record here'
      }, {
        title: 'Messages',
        label: `Unread messages`,
        link: `/innovator/innovations/${this.innovationId}/threads`,
        count: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER].count,
        lastMessage: `Last received message`,
        date: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No messages yet'
      }];

      if (this.innovation.groupedStatus === 'RECORD_NOT_SHARED') {
        this.cardsList = this.cardsList.filter(i => i.title !== 'Actions requested');
      }

      this.setPageStatus('READY');

    });

  }

}
