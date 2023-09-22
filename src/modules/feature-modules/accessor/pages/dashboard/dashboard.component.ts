import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { StatisticsCardType } from '@app/base/types';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';


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

  cardsList: StatisticsCardType[] = [];

  isQualifyingAccessorRole = false;

  constructor(
    private statisticsService: StatisticsService
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

    if (this.router.getCurrentNavigation()?.extras.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = { statistics: [UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER, UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER, UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER] };

    this.statisticsService.getUserStatisticsInfo(qp).subscribe({
      next: statistics => {

        this.cardsList = [
          {
            title: 'Your innovations',
            label: `Engaging innovations are assigned to you`,
            link: '/accessor/innovations',
            queryParams: { status: InnovationSupportStatusEnum.ENGAGING, assignedToMe: true },
            count: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].count,
            total: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER].total,
            lastMessage: `Last submitted:`,
            date: statistics[UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER]?.lastSubmittedAt,
            emptyMessageTitle: 'No engaging innovations assigned to you'
          },
          {
            title: 'Tasks to review',
            label: `Tasks requested by you were responded to by innovators`,
            link: `/accessor/tasks`,
            queryParams: { openTasks: false },
            count: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].count,
            total: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].total,
            lastMessage: 'Last submitted:',
            date: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER]?.lastSubmittedAt,
            emptyMessageTitle: 'No tasks opened by you yet',
            emptyMessage: 'Start requesting tasks from innovators'
          }
        ];

        if (this.isQualifyingAccessorRole) {
          this.cardsList.unshift({
            title: 'Review innovations',
            label: `Suggested innovations awaiting status assignment from your organisation unit`,
            link: '/accessor/innovations',
            queryParams: { status: InnovationSupportStatusEnum.UNASSIGNED },
            count: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER].count,
            lastMessage: `Last submitted:`,
            date: statistics[UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER]?.lastSubmittedAt,
            emptyMessageTitle: 'No innovations awaiting status assignment'
          });
        }

        this.setPageStatus('READY');

      }
    });

  }

}
