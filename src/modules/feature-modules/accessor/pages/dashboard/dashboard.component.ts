import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CoreComponent } from '@app/base';
import { StatisticsCard } from '@modules/shared/services/innovations.dtos';
import { UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {

  user: {
    displayName: string;
    organisation: string;
    passwordResetAt: null | string;
  };

  cardsList: StatisticsCard[] = [];

  isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private statisticsService: StatisticsService,
  ) {

    super();
    this.setPageTitle('Home', { hint: `Hello ${this.stores.authentication.getUserInfo().displayName}` });
    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();

    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: this.stores.authentication.getUserInfo().organisations[0]?.name || '',
      passwordResetAt: this.stores.authentication.getUserInfo().passwordResetAt
    };

  }

  ngOnInit(): void {

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetAt ?? '');
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.setAlertSuccess('You have successfully changed your password.');
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = { statistics: [UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER, UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER, UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER] };

    this.statisticsService.getUserStatisticsInfo(qp).subscribe((statistics) => {

      this.cardsList = [{
        title: 'Your innovations',
        label: `Engaging innovations are assigned to you`,
        link: '/accessor/innovations',
        queryParams: { status: InnovationSupportStatusEnum.ENGAGING },
        count: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].count,
        total: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].total,
        footer: `Last submitted`,
        date: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No engaging innovations assigned to you'
      }, {
        title: 'Actions to review',
        label: `Actions requested by you were responded to by innovators`,
        link: `/accessor/actions`,
        queryParams: { openActions: true },
        count: statistics[UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER].count,
        footer: `Last submitted`,
        date: statistics[UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
        emptyMessage: 'No actions to review'
      }]

      if (this.isQualifyingAccessorRole) {
        this.cardsList.unshift({
          title: 'Review innovations',
          label: `Innovations awaiting status assignment from your organisation unit`,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.UNASSIGNED },
          count: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER].count,
          footer: `Last submitted`,
          date: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
          emptyMessage: 'No engaging innovations assigned to you'
        })
      }

      this.setPageStatus('READY');
    })
  }

}
