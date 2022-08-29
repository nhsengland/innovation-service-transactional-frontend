import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';


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
    private organisationsService: OrganisationsService
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

    this.organisationsService.getOrganisationInfo(this.organisationId).subscribe(
      organisation => {

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
          this.onUnitUsersShowHideClicked(this.organisation.id, this.organisation.organisationUnits[0].id);
        }

        this.setPageStatus('READY');

      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      }
    );

  }

  onUnitUsersShowHideClicked(organisationId: string, organisationUnitId: string): void {

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
        const qp = new TableModel<{}, { onlyActive: boolean }>({ pageSize: 1000 }).setFilters({ onlyActive: true }).getAPIQueryParams();
        this.organisationsService.getOrganisationUnitUsers(organisationId, organisationUnitId, qp).subscribe(
          response => {
            unit.users = response.data.map(item => ({ name: item.name, roleDescription: item.organisationRoleDescription }));
            unit.showHideStatus = 'opened';
            unit.showHideText = `Hide users`;
            unit.showHideDescription = `that belong to the ${unit.name}`;
            unit.isLoading = false;
          },
          () => {
            this.setAlertError('Unable to fetch organisation users information', 'Please try again or contact us for further help');
            unit.isLoading = false;
          }
        );
        break;
      default:
        break;
    }

  }

}
