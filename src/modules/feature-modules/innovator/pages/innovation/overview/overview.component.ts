import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationGroupedStatusEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';

type baseStatisticsCard = {
  title: string,
  label: string,
  link: string
}

type statisticsSectionsCard = {
  count: number,
  total: number,
  footer: string
} & baseStatisticsCard

enum InnovationSectionEnum {
  INNOVATION_DESCRIPTION = 'INNOVATION_DESCRIPTION',
  VALUE_PROPOSITION = 'VALUE_PROPOSITION',
  UNDERSTANDING_OF_NEEDS = 'UNDERSTANDING_OF_NEEDS',
  UNDERSTANDING_OF_BENEFITS = 'UNDERSTANDING_OF_BENEFITS',
  EVIDENCE_OF_EFFECTIVENESS = 'EVIDENCE_OF_EFFECTIVENESS',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  REGULATIONS_AND_STANDARDS = 'REGULATIONS_AND_STANDARDS',
  CURRENT_CARE_PATHWAY = 'CURRENT_CARE_PATHWAY',
  TESTING_WITH_USERS = 'TESTING_WITH_USERS',
  COST_OF_INNOVATION = 'Cost of your innovation',
  COMPARATIVE_COST_BENEFIT = 'Comparative cost benefit',
  REVENUE_MODEL = 'Revenue model',
  IMPLEMENTATION_PLAN = 'Implementation plan and deployment'
}


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  statisticsSectionsCard: statisticsSectionsCard;

  innovation: {
    groupedStatus: null | InnovationGroupedStatusEnum,
    organisationsStatusDescription: null | string
  } = { groupedStatus: null, organisationsStatusDescription: null };

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Overview', { hint: 'Your innovation' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.statisticsSectionsCard = {
      title: 'Innovation Record',
      label: ``,
      link: ``,
      count: 0,
      total: 0,
      footer: ``
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

      const lastSectionSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedSection];
      const lastSectionSubmittedDate = this.convertToDate(statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedAt as string);

      this.statisticsSectionsCard = {
        title: 'Innovation Record',
        label: `sections were submitted by you`,
        link: `/innovator/innovations/${this.innovationId}`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].total,
        footer: `Last submitted section: "${lastSectionSubmitted}" on ${lastSectionSubmittedDate}`
      }

      this.setPageStatus('READY');

    });

  }

  convertToDate(date: string): string {
    const [dateStr, timeStr] = date.split('T');

    const d = new Date(dateStr);
    const newDateFormat = [d.getDate(), d.toLocaleDateString('en-GB', { month: 'short' }), d.getFullYear()].join(' ');

    return newDateFormat

  }

}
