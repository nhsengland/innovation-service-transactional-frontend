import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { APIQueryParamsType } from '@app/base/types';

import { TableModel } from '@app/base/models';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { UserListFiltersType, UsersService } from '@modules/shared/services/users.service';
import { InnovationSupportStatusEnum } from '@modules/stores';
import { ObservedValueOf } from 'rxjs';
import { OrganisationDataResolver } from '../../resolvers/organisation-data.resolver';
import { OrganisationUnitDataResolver } from '../../resolvers/organisation-unit-data.resolver';

@Component({
  selector: 'app-admin-pages-organisation-unit-info',
  templateUrl: './organisation-unit-info.component.html'
})
export class OrganisationUnitInfoComponent extends CoreComponent implements OnInit {
  public unit: ObservedValueOf<ReturnType<OrganisationUnitDataResolver['resolve']>>;
  public organisation: ObservedValueOf<ReturnType<OrganisationDataResolver['resolve']>>;

  isAssessmentTeamPage: boolean;
  isServiceAdministratorPage: boolean;
  isUnitTeamPage: boolean;
  pageRole: null | UserRoleEnum = null;

  usersListFilters: APIQueryParamsType<UserListFiltersType> = {
    take: 500,
    skip: 0,
    filters: { userTypes: [], onlyActive: false, email: true }
  };
  addUserQueryParams:
    | null
    | { team: UserRoleEnum.ASSESSMENT | UserRoleEnum.ADMIN }
    | { organisationId: string; unitId: string } = null;

  activeUsers: { id: string; name: string; email: string }[] = [];
  inactiveUsers: { id: string; name: string; email: string }[] = [];

  innovationsLoading = false;
  innovationsList = new TableModel<
    { id: string; name: string; support: { status: InnovationSupportStatusEnum } | null },
    { supportUnit: string; supportStatuses: InnovationSupportStatusEnum[] }
  >({ pageSize: 5 });

  constructor(
    private innovationsService: InnovationsService,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
    super();

    this.unit = this.route.snapshot.data.organisationUnit;
    this.organisation = this.route.snapshot.data.organisation;

    this.isAssessmentTeamPage = !!this.router.url.endsWith(UserRoleEnum.ASSESSMENT);
    this.isServiceAdministratorPage = !!this.router.url.endsWith(UserRoleEnum.ADMIN);
    this.isUnitTeamPage = !!this.unit;

    if (this.isAssessmentTeamPage) {
      this.setPageTitle('Needs assessment team');
      this.addUserQueryParams = { team: UserRoleEnum.ASSESSMENT };
      this.usersListFilters.filters.userTypes = [UserRoleEnum.ASSESSMENT];
    } else if (this.isServiceAdministratorPage) {
      this.setPageTitle('Service administrators');
      this.addUserQueryParams = { team: UserRoleEnum.ADMIN };
      this.usersListFilters.filters.userTypes = [UserRoleEnum.ADMIN];
    } else if (this.isUnitTeamPage) {
      this.setPageTitle(`${this.unit.name}`);
      this.pageRole = UserRoleEnum.ASSESSMENT; // change this it will be different params
      this.usersListFilters.filters.userTypes = [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR];
      this.usersListFilters.filters.organisationUnitId = this.unit.id;
      this.addUserQueryParams = { organisationId: this.organisation.id, unitId: this.unit.id };

      // Innovations List
      this.innovationsList
        .setVisibleColumns({
          innovation: { label: 'Innovation', orderable: false },
          status: { label: 'Status', orderable: false, align: 'right' }
        })
        .setFilters({
          supportUnit: this.unit.id,
          supportStatuses: [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.WAITING]
        });
    } else {
      this.redirectTo('admin/organisations');
    }
  }

  ngOnInit(): void {
    this.usersService.getUsersList({ queryParams: this.usersListFilters }).subscribe({
      next: users => {
        this.activeUsers = users.data
          .filter(item => item.isActive)
          .map(item => ({ id: item.id, name: item.name, email: item.email }));
        this.inactiveUsers = users.data
          .filter(item => !item.isActive)
          .map(item => ({ id: item.id, name: item.name, email: item.email }));
        if (this.isUnitTeamPage) {
          this.getInnovationsList();
        }

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onInnovationsPageChange(event: { pageNumber: number }): void {
    this.innovationsLoading = true;
    this.innovationsList.setPage(event.pageNumber);

    this.getInnovationsList();
  }

  getInnovationsList() {
    const { take, skip, order, filters } = this.innovationsList.getAPIQueryParams();

    this.innovationsService
      .getInnovationsList(['id', 'name', 'support.status'], filters, { take, skip, order: { name: 'ASC' } })
      .subscribe({
        next: innovations => {
          this.innovationsList.setData(innovations.data, innovations.count);
        },
        complete: () => {
          this.innovationsLoading = false;
        },
        error: () => {
          this.setPageStatus('ERROR');
          this.setAlertUnknownError();
        }
      });
  }
}
