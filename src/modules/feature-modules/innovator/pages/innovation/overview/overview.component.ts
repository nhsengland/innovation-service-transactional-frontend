import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationGroupedStatusEnum, InnovationSectionEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { statisticsCard } from '@modules/shared/services/innovations.dtos';


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  statisticsSectionsCard: statisticsCard;
  statisticsActionsCard: statisticsCard;
  statisticsMessagesCard: statisticsCard;

  innovation: {
    groupedStatus: null | InnovationGroupedStatusEnum,
    organisationsStatusDescription: null | string
  } = { groupedStatus: null, organisationsStatusDescription: null };

  /* allSectionsSubmitted(): boolean {
    return this.sections.submitted === this.sections.progressBar.length;
  }

  isSubmittedForAssessment(): boolean {
    return this.submittedAt !== '';
  } */

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Overview', { hint: 'Your innovation' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.statisticsSectionsCard = {
      title: '',
      label: ``,
      link: ``,
      count: 0,
      total: 0,
      footer: null,
      date: null
    }

    this.statisticsActionsCard = {
      title: '',
      label: ``,
      link: ``,
      count: 0,
      footer: null,
      date: null
    }

    this.statisticsMessagesCard = {
      title: '',
      label: ``,
      link: ``,
      count: 0,
      footer: null,
      date: null
    }

  }


  ngOnInit(): void {

    const qp: { statistics: InnovationStatisticsEnum[] } = { statistics: [] };

    qp.statistics = [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER, InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER, InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER];

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.innovationsService.getInnovationStatisticsInfo(this.innovationId, qp),
    ]).subscribe(([innovation, statistics]) => {

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.INNOVATION, NotificationContextTypeEnum.SUPPORT] });

      this.innovation.groupedStatus = this.stores.innovation.getGroupedInnovationStatus(
        innovation.status,
        (innovation.supports ?? []).map(support => support.status),
        innovation.assessment?.reassessmentCount ?? 0
      );

      const occurrences = (innovation.supports ?? []).map(item => item.status)
        .reduce((acc, status) => (
          acc[status] ? ++acc[status].count : acc[status] = { count: 1, text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase() }, acc),
          {} as { [a in InnovationSupportStatusEnum]: { count: number, text: string } });

      this.innovation.organisationsStatusDescription = Object.entries(occurrences).map(([status, item]) => `${item.count} ${item.text}`).join(', ');
      // console.log(occurrences) // => {2: 5, 4: 1, 5: 3, 9: 1}

      const lastSectionSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedSection!];
      const lastActionSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER].lastSubmittedAt!];

      this.statisticsSectionsCard = {

        title: ' Innovation Record ',
        label: `sections were submitted by you`,
        link: `/innovator/innovations/${this.innovationId}/record`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].total,
        footer: `Last submitted section: "${lastSectionSubmitted}"`,
        date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]?.lastSubmittedAt

      };

      this.statisticsActionsCard = {

        title: ' Actions requested ',
        label: `request actions to submit`,
        link: `/innovator/innovations/${this.innovationId}/action-tracker`,
        count: statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER].count,
        footer: `Last requested action: "${lastActionSubmitted}"`,
        date: statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]?.lastSubmittedAt

      };

      this.statisticsMessagesCard = {

        title: ' Messages ',
        label: `unread messages`,
        link: `/innovator/innovations/${this.innovationId}/threads`,
        count: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER].count,
        footer: `Last received message`,
        date: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER].lastSubmittedAt,

      }

      this.setPageStatus('READY');

    });

  }

}
