import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    firstTimeSignInAt: null | string;
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
      organisation: this.stores.authentication.getUserContextInfo()?.organisationUnit?.name || '',
      passwordResetAt: this.stores.authentication.getUserInfo().passwordResetAt,
      firstTimeSignInAt: this.stores.authentication.getUserInfo().firstTimeSignInAt
    };
  }

  ngOnInit(): void {

    const startTime = new Date();

    if (this.timeDifferInMinutes(startTime, this.user.firstTimeSignInAt) > 5 && this.timeDifferInMinutes(startTime, this.user.passwordResetAt) <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.setAlertSuccess('You have successfully changed your password.');
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = { statistics: [UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER, UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER, UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER] };

    this.statisticsService.getUserStatisticsInfo(qp)
    .subscribe({
      next: (statistics) => {
        this.cardsList = [{
          title: 'Your innovations',
          label: `Engaging innovations are assigned to you`,
          link: '/accessor/innovations',
          queryParams: { status: InnovationSupportStatusEnum.ENGAGING, assignedToMe: true },
          count: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].count,
          total: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].total,
          lastMessage: `Last submitted:`,
          date: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER]?.lastSubmittedAt,
          emptyMessageTitle: 'No engaging innovations assigned to you'
        }, {
          title: 'Actions to review',
          label: `Actions requested by you were responded to by innovators`,
          link: `/accessor/actions`,
          queryParams: { openActions: true },
          count: statistics[UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER].count,
          total: statistics[UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER].total,
          lastMessage: `Last submitted:`,
          date: statistics[UserStatisticsTypeEnum.ACTIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
          emptyMessageTitle: 'No actions opened by you yet',
          emptyMessage: 'Start requesting actions from innovators'
        }]

        if (this.isQualifyingAccessorRole) {
          this.cardsList.unshift({
            title: 'Review innovations',
            label: `Suggested innovations awaiting status assignment from your organisation unit`,
            link: '/accessor/innovations',
            queryParams: { status: InnovationSupportStatusEnum.UNASSIGNED },
            count: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER].count,
            lastMessage: `Last submitted:`,
            date: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
            emptyMessageTitle: 'No engaging innovations assigned to you'
          })
        }

        this.setPageStatus('READY');
      }
    })
  }

  timeDifferInMinutes(startTime: Date, date: null | string ): number{
    const endTime = new Date(date ?? '');
    const timediffer = startTime.getTime() - endTime.getTime();
    return Math.round(timediffer / 60000);
  }

}
