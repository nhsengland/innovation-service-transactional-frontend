import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { APIQueryParamsType } from '@app/base/types';

import { UserListFiltersType, UsersService } from '@modules/shared/services/users.service';


@Component({
  selector: 'app-admin-pages-organisations-other-teams-info',
  templateUrl: './other-teams-info.component.html'
})
export class PageOtherTeamsInfoComponent extends CoreComponent implements OnInit {

  isAssessmentTeamPage: boolean;
  isServiceAdministratorPage: boolean;
  pageRole: null | UserRoleEnum = null;

  usersListFilters: APIQueryParamsType<UserListFiltersType> = {
    take: 100, skip: 0,
    filters: { userTypes: [], onlyActive: false, email: true }
  };

  activeUsers: { id: string, name: string, email: string }[] = [];
  inactiveUsers: { id: string, name: string, email: string }[] = [];

  constructor(
    private usersService: UsersService
  ) {

    super();

    this.isAssessmentTeamPage = !!this.router.url.endsWith(UserRoleEnum.ASSESSMENT);
    this.isServiceAdministratorPage = !!this.router.url.endsWith(UserRoleEnum.ADMIN);

    if (this.isAssessmentTeamPage) {

      this.setPageTitle('Needs assessment team');
      this.pageRole = UserRoleEnum.ASSESSMENT;
      this.usersListFilters.filters.userTypes = [UserRoleEnum.ASSESSMENT];

    } else if (this.isServiceAdministratorPage) {

      this.setPageTitle('Service administrators');
      this.pageRole = UserRoleEnum.ADMIN;
      this.usersListFilters.filters.userTypes = [UserRoleEnum.ADMIN];

    } else {
      this.redirectTo('admin/organisations');
    }

  }

  ngOnInit(): void {

    this.usersService.getUsersList({ queryParams: this.usersListFilters }).subscribe({
      next: response => {

        this.activeUsers = response.data.filter(item => item.isActive).map(item => ({ id: item.id, name: item.name, email: item.email }));
        this.inactiveUsers = response.data.filter(item => !item.isActive).map(item => ({ id: item.id, name: item.name, email: item.email }));

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
