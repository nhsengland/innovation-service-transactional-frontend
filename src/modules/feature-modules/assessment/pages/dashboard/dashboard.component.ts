import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';

type baseStatisticsCard = {
  title: string,
  label: string,
  link: string
  queryParams: string;
}

type statisticsSectionsCard = {
  count: number,
  total?: number,
  footer: string
} & baseStatisticsCard
@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {
  user: {
    displayName: string;
    organisation: string;
    passwordResetAt: string;
  };

  cardsList: statisticsSectionsCard[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,    
    private statisticsService: StatisticsService
  ) {

    super();
    this.setPageTitle('Home', {hint: `Hello ${this.stores.authentication.getUserInfo().displayName}`});


    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: 'Needs assessment team',
      passwordResetAt: this.stores.authentication.getUserInfo().passwordResetAt || ''
    };

  }

  ngOnInit(): void {

    const startTime = new Date();
    const endTime = new Date(this.user.passwordResetAt);
    const timediffer = startTime.getTime() - endTime.getTime();
    const resultInMinutes = Math.round(timediffer / 60000);

    if (resultInMinutes <= 2 && this.activatedRoute.snapshot.queryParams.alert !== 'alertDisabled') {
      this.setAlertSuccess('You have successfully changed your password.');
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = { statistics: [UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER, UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER] };

    this.statisticsService.getUserStatisticsInfo(qp).subscribe((statistics) => {
      this.cardsList = [{
        title: 'Innovations awaiting assessment',
        label: `Innovations awaiting needs assessment`,
        link: `/assessment/innovations`,
        queryParams: 'WAITING_NEEDS_ASSESSMENT',
        count: statistics[UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER].count,
        footer: this.getFooter(statistics[UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER].overdue)
      }, {
        title: 'Your innovations',
        label: `Innovations in needs assessment being assessed by you`,
        link: `/assessment/innovations`,
        queryParams: 'NEEDS_ASSESSMENT',
        count: statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].count,
        total: statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].total,
        footer: this.getFooter(statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].overdue)
      }]

      this.setPageStatus('READY');
    })
  }


  getFooter(counter: number): string {
    return counter === 1 ? `${counter} is overdue` : `${counter} are overdue`
  }


}
