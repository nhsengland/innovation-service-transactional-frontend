import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { TableModel } from '@app/base/models';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';

import { UsersListDTO } from '@modules/shared/dtos/users.dto';
import { InnovationsListDTO, InnovationsListFiltersType } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { GetOrganisationUnitInfoDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { UserListFiltersType, UsersService } from '@modules/shared/services/users.service';


@Component({
  selector: 'app-admin-pages-organisations-unit-info',
  templateUrl: './organisation-unit-info.component.html'
})
export class PageOrganisationUnitInfoComponent extends CoreComponent implements OnInit {
  organisationId: string;
  organisationUnitId: string;

  usersLoading: boolean = false;
  innovationsLoading: boolean = false;

  unit: GetOrganisationUnitInfoDTO = { id: '', name: '', acronym: '', isActive: false, canActivate: false};
  innovationsList = new TableModel<InnovationsListDTO['data'][0], InnovationsListFiltersType>({ pageSize: 5 });
  usersList = new TableModel<UsersListDTO['data'][0], UserListFiltersType>({ pageSize: 5 });

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovationsService: InnovationsService,
    private usersService: UsersService
  ) {
    super();

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
    this.organisationUnitId = this.activatedRoute.snapshot.params.organisationUnitId;

    this.usersList.setVisibleColumns({
      account: { label: 'User account', orderable: false },
      action: { label: '', orderable: false, align: 'right' }
    }).setFilters({
      email: true,
      onlyActive: false,
      organisationUnitId: this.organisationUnitId,
      userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR]
    });

    this.innovationsList.setVisibleColumns({
      innovation: { label: 'Innovation', orderable: false },
      status: { label: 'Status', orderable: false, align: 'right' }
    }).setFilters({
      engagingOrganisationUnits: [this.organisationUnitId],
      supportStatuses: [InnovationSupportStatusEnum.ENGAGING, InnovationSupportStatusEnum.FURTHER_INFO_REQUIRED]
    });
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    forkJoin([
      this.organisationsService.getOrganisationUnitInfo(this.organisationId, this.organisationUnitId),
      this.usersService.getUsersList({ queryParams: this.usersList.getAPIQueryParams() }),
      this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() })
    ]).subscribe({
      next: ([unitInfo, users, innovations]) => {
        this.unit = unitInfo;
        this.innovationsList.setData(innovations.data, innovations.count);
        this.usersList.setData(users.data, users.count);

        this.setPageTitle(`${this.unit.name} (${this.unit.acronym})`);

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  onUsersPageChange(event: { pageNumber: number }): void {
    this.usersLoading = true;
    this.usersList.setPage(event.pageNumber);

    this.usersService.getUsersList({ queryParams: this.usersList.getAPIQueryParams() }).subscribe({
      next: (users) => {
        this.usersList.setData(users.data, users.count);
      },
      complete: () => {
        this.usersLoading = false;
      }
    });
  }

  onInnovationsPageChange(event: { pageNumber: number }): void {
    this.innovationsLoading = true;
    this.innovationsList.setPage(event.pageNumber);

    this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() }).subscribe({
      next: (innovations) => {
        this.innovationsList.setData(innovations.data, innovations.count);
      },
      complete: () => {
        this.innovationsLoading = false;
      }
    });
  }
}
