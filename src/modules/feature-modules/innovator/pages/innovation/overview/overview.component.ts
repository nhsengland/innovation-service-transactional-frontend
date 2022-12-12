import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationSubmissionDTO, StatisticsCard } from '@modules/shared/services/innovations.dtos';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { InnovationGroupedStatusEnum, InnovationSectionEnum, InnovationSupportStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;

  cardsList: StatisticsCard[] = [];

  actionLabelMapping: {[k: string]: string} = {'=1': 'requested action to submit', 'other': 'requested actions to submit'};
  messageLabelMapping: {[k: string]: string} = {'=1': 'unread message', 'other': 'unread messages'};

  innovation: {
    groupedStatus: null | InnovationGroupedStatusEnum,
    organisationsStatusDescription: null | string,
  } = { groupedStatus: null, organisationsStatusDescription: null };

  isSubmitted: InnovationSubmissionDTO = {
    submittedAllSections: false,
    submittedForNeedsAssessment: false
  };
  showBanner = true;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();
    this.setPageTitle('Overview', { hint: 'Your innovation' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }


  ngOnInit(): void {

    const qp: { statistics: InnovationStatisticsEnum[] } = { statistics: [] };

    qp.statistics = [InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER, InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER, InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER];

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.innovationsService.getInnovationStatisticsInfo(this.innovationId, qp),
      this.innovationsService.getInnovationSubmission(this.innovationId)
    ]).subscribe(([innovation, statistics, submit]) => {

      this.stores.context.dismissNotification(this.innovationId, { contextTypes: [NotificationContextTypeEnum.INNOVATION, NotificationContextTypeEnum.SUPPORT] });

      this.innovation.groupedStatus = this.stores.innovation.getGroupedInnovationStatus(
        innovation.status,
        (innovation.supports ?? []).map(support => support.status),
        innovation.assessment?.reassessmentCount ?? 0
      );

      this.isSubmitted.submittedAllSections = submit.submittedAllSections.valueOf();
      this.isSubmitted.submittedForNeedsAssessment = submit.submittedForNeedsAssessment.valueOf();

      (submit.submittedAllSections && submit.submittedForNeedsAssessment) ? this.showBanner = false : this.showBanner = true;

      const occurrences = (innovation.supports ?? []).map(item => item.status)
        .filter(status => [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED].includes(status))
        .reduce((acc, status) => (
          acc[status] ? ++acc[status].count : acc[status] = { count: 1, text: this.translate('shared.catalog.innovation.support_status.' + status + '.name').toLowerCase() }, acc),
          {} as { [a in InnovationSupportStatusEnum]: { count: number, text: string } });

      this.innovation.organisationsStatusDescription = Object.entries(occurrences).map(([status, item]) => `${item.count} ${item.text}`).join(', ');
      // console.log(occurrences) // => {2: 5, 4: 1, 5: 3, 9: 1}

      const lastSectionSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].lastSubmittedSection!];
      const lastActionSubmitted: InnovationSectionEnum = (<any>InnovationSectionEnum)[statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER].lastSubmittedSection!];

      this.cardsList = [{
        title: 'Innovation record',
        label: `sections were submitted by you`,
        link: `/innovator/innovations/${this.innovationId}/record`,
        count: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].count,
        total: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER].total,
        lastMessage: `Last submitted section: "${this.translate('shared.catalog.innovation.innovation_sections.' + lastSectionSubmitted)}"`,
        date: statistics[InnovationStatisticsEnum.SECTIONS_SUBMITTED_COUNTER]?.lastSubmittedAt,
        emptyMessage: "You haven't submitted any section of your innovation record yet."
      }, {
        title: 'Actions requested',
        label: `request actions to submit`,
        link: `/innovator/innovations/${this.innovationId}/action-tracker`,
        count: statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER].count,
        lastMessage: `Last requested action: "Submit '${this.translate('shared.catalog.innovation.innovation_sections.' + lastActionSubmitted)}'"`,
        date: statistics[InnovationStatisticsEnum.ACTIONS_TO_SUBMIT_COUNTER]?.lastSubmittedAt,
        emptyMessageTitle: 'No action requests yet.',
        emptyMessage: 'We might send a request to add more information to your innovation record here.'
      }, {
        title: 'Messages',
        label: `unread messages`,
        link: `/innovator/innovations/${this.innovationId}/threads`,
        count: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER].count,
        lastMessage: `Last received message`,
        date: statistics[InnovationStatisticsEnum.UNREAD_MESSAGES_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No messages yet'
      }];

      if(this.innovation.groupedStatus === 'RECORD_NOT_SHARED') {
        this.cardsList.filter(i => i.title === 'Actions requested');
      }

      this.setPageStatus('READY');

    });

  }

}
