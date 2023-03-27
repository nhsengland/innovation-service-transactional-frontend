import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { UsersService } from '@modules/shared/services/users.service';


@Component({
  selector: 'app-admin-pages-organisations-organisation-info',
  templateUrl: './organisation-info.component.html'
})
export class PageOrganisationInfoComponent extends CoreComponent implements OnInit {

  organisationId: string;

  organisation: {
    id: string,
    name: null | string,
    acronym: null | string,
    isActive: null | boolean,
    organisationUnits: {
      id: string,
      name: string,
      acronym: string,
      isActive: boolean,
      userCount: number,
      users: { name: string, roleDescription: string }[],
      showHideStatus: 'hidden' | 'opened' | 'closed',
      showHideText: null | string,
      showHideDescription: null | string,
      isLoading: boolean
    }[];
  } = { id: '', name: null, acronym: null, isActive: null, organisationUnits: [] };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private usersService: UsersService
  ) {

    super();
    this.setPageTitle('Organisation information');

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'organisationCreationSuccess':
        this.setAlertSuccess('You\'ve successfully created the organisation.');
        break;
      case 'updateOrganisationSuccess':
        this.setAlertSuccess('You\'ve successfully updated the organisation.');
        break;
      case 'updateUnitSuccess':
        this.setAlertSuccess('You\'ve successfully updated the organisation unit.');
        break;
      case 'organisationUnitActivateSuccess':
        this.setAlertSuccess('You\'ve successfully activated the organisation unit.');
        break;
      case 'organisationUnitInactivateSuccess':
        this.setAlertSuccess('You\'ve successfully inactivated the organisation unit.');
        break;
      default:
        break;
    }

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationInfo(this.organisationId, { onlyActiveUsers: true }).subscribe({
      next: organisation => {
        this.organisation = {
          ...organisation,
          organisationUnits: organisation.organisationUnits.map(u => ({
            ...u,
            showHideStatus: 'closed',
            showHideText: `Show users`,
            showHideDescription: `that belong to the ${u.name}`,
            isLoading: false,
            users: []
          }))
        };

        if (this.organisation.organisationUnits.length === 1) {
          this.onUnitUsersShowHideClicked(this.organisation.organisationUnits[0].id);
        }

        this.setPageStatus('READY');
      },
      error: error => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        this.logger.error(error);
      }
    });
  }

  onUnitUsersShowHideClicked(organisationUnitId: string): void {

    const unit = this.organisation.organisationUnits.find(item => item.id === organisationUnitId);

    if (unit?.showHideStatus === 'closed') { unit.isLoading = true; }

    switch (unit?.showHideStatus) {
      case 'opened':
        unit.showHideStatus = 'closed';
        unit.showHideText = `Show users`;
        unit.showHideDescription = `that belong to the ${unit.name}`;
        unit.isLoading = false;
        break;
      case 'closed':
        this.usersService.getUsersList({
          queryParams: { 
            take: 100, 
            skip: 0, 
            filters: { 
              onlyActive: true, 
              organisationUnitId: organisationUnitId,
              userTypes: [UserRoleEnum.ACCESSOR, UserRoleEnum.QUALIFYING_ACCESSOR] 
            }
          }}).subscribe(
          response => {
            unit.users = response.data.map(item => ({ name: item.name, roleDescription: item.roleDescription }));
            unit.showHideStatus = 'opened';
            unit.showHideText = `Hide users`;
            unit.showHideDescription = `that belong to the ${unit.name}`;
            unit.isLoading = false;
          },
          () => {
            this.setAlertError('Unable to fetch organisation users information. Please try again or contact us for further help');
            unit.isLoading = false;
          }
        );
        break;
      default:
        break;
    }

  }

}
