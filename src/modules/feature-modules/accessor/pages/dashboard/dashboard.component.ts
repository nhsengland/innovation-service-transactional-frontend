import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { StatisticsCardType } from '@app/base/types';

import { InnovationSupportStatusEnum } from '@modules/stores';

import { UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import {
  AnnouncementType,
  AnnouncementsService
} from '@modules/feature-modules/announcements/services/announcements.service';
import { forkJoin } from 'rxjs';
import { AnnouncementTypeEnum } from '@modules/feature-modules/admin/services/announcements.service';

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

  announcements: AnnouncementType[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private announcementsService: AnnouncementsService
  ) {
    super();

    this.setPageTitle('Home', { hint: `Hello ${this.ctx.user.getDisplayName()}` });

    this.user = {
      displayName: this.ctx.user.getDisplayName(),
      organisation: this.ctx.user.getUserContext()?.organisationUnit?.name || '',
      passwordResetAt: this.ctx.user.getUserInfo().passwordResetAt,
      firstTimeSignInAt: this.ctx.user.getUserInfo().firstTimeSignInAt
    };
  }

  ngOnInit(): void {
    if (history.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
      const newState = history.state;
      delete newState.alert;
      history.replaceState(newState, '');
      this.ctx.user.updateInfo({ passwordChangeSinceLastSignIn: true });
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = {
      statistics: [
        UserStatisticsTypeEnum.INNOVATIONS_TO_REVIEW_COUNTER,
        UserStatisticsTypeEnum.INNOVATIONS_ASSIGNED_TO_ME_COUNTER,
        UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER,
        UserStatisticsTypeEnum.INNOVATIONS_NEEDING_ACTION_COUNTER
      ]
    };

    forkJoin([
      this.statisticsService.getUserStatisticsInfo(qp),
      this.announcementsService.getAnnouncements({ type: [AnnouncementTypeEnum.HOMEPAGE] })
    ]).subscribe(([statistics, announcements]) => {
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
          title: 'Tasks',
          label: `Tasks assigned by you have been done or declined`,
          link: `/accessor/tasks`,
          queryParams: { openTasks: false },
          count: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].count,
          total: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER].total,
          lastMessage: 'Last task update:',
          date: statistics[UserStatisticsTypeEnum.TASKS_RESPONDED_COUNTER]?.lastSubmittedAt,
          emptyMessage: 'No tasks assigned by your organisation yet'
        }
      ];

      if (this.ctx.user.isQualifyingAccessor()) {
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

        this.cardsList.push({
          title: 'Your overdue actions',
          emptyMessage: 'No innovations awaiting action',
          count: statistics[UserStatisticsTypeEnum.INNOVATIONS_NEEDING_ACTION_COUNTER].count,
          label: `Innovations awaiting action`,
          link: `/accessor/innovations/needing-action`
        });

        this.cardsList.push({
          title: 'List of accessors',
          emptyMessage: 'Accessors in your organisation and the innovations they are assigned to',
          link: `/accessor/accessor-list`
        });
      }

      this.announcements = announcements;

      this.setPageStatus('READY');
    });
  }

  onClearAnnouncement(announcementId: string) {
    this.announcements = this.announcements.filter(a => a.id !== announcementId);
  }
}
