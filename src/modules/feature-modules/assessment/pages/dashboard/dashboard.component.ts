import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { StatisticsCardType } from '@app/base/types';

import { InnovationsListDTO, InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UserStatisticsTypeEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';

@Component({
  selector: 'app-assessment-pages-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends CoreComponent implements OnInit {
  user: {
    displayName: string;
    organisation: string;
    passwordResetAt: string;
    firstTimeSignInAt: string | null;
  };

  cardsList: StatisticsCardType[] = [];

  latestInnovations: TableModel<InnovationsListDTO['data'][0], InnovationsListFiltersType>;

  constructor(
    private statisticsService: StatisticsService,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Home', { hint: `Hello ${this.stores.authentication.getUserInfo().displayName}` });


    this.user = {
      displayName: this.stores.authentication.getUserInfo().displayName,
      organisation: 'Needs assessment team',
      passwordResetAt: this.stores.authentication.getUserInfo().passwordResetAt || '',
      firstTimeSignInAt: this.stores.authentication.getUserInfo().firstTimeSignInAt
    };


    this.latestInnovations = new TableModel({ pageSize: 5 });
  }

  ngOnInit(): void {

    if (this.router.getCurrentNavigation()?.extras.state?.alert === 'CHANGE_PASSWORD') {
      this.setAlertSuccess('You have successfully changed your password');
    }

    const qp: { statistics: UserStatisticsTypeEnum[] } = { statistics: [UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER, UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER] };

    this.latestInnovations.setFilters({
      latestWorkedByMe: true
    })

    forkJoin([
      this.statisticsService.getUserStatisticsInfo(qp),
      this.innovationsService.getInnovationsList({ queryParams: this.latestInnovations.getAPIQueryParams() })
    ]).subscribe(([statistics, innovationsList]) => {

      this.latestInnovations.setData(innovationsList.data, innovationsList.count);

      this.cardsList = [
        {
          title: 'Innovations awaiting assessment',
          label: `Innovations awaiting needs assessment`,
          link: `/assessment/innovations`,
          queryParams: { status: 'WAITING_NEEDS_ASSESSMENT' },
          count: statistics[UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER].count,
          overdue: this.getFooter(statistics[UserStatisticsTypeEnum.WAITING_ASSESSMENT_COUNTER].overdue)
        }, {
          title: 'Your innovations',
          label: `Innovations in needs assessment being assessed by you`,
          link: `/assessment/innovations`,
          queryParams: { status: 'NEEDS_ASSESSMENT' },
          count: statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].count,
          total: statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].total,
          overdue: this.getFooter(statistics[UserStatisticsTypeEnum.ASSIGNED_INNOVATIONS_COUNTER].overdue)
        }
      ];

      this.setPageStatus('READY');
    })
  }


  getFooter(counter: number): string {
    return counter === 1 ? `${counter} innovation is overdue` : `${counter} innovations are overdue`
  }

}
