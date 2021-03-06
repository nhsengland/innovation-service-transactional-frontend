import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { OrganisationsService, organisationUsersOutDTO } from '@modules/shared/services/organisations.service';


@Component({
  selector: 'app-admin-pages-organisations-info',
  templateUrl: './organisation-info.component.html'
})
export class PageAdminOrganisationInfoComponent extends CoreComponent implements OnInit {

  orgId: string;

  organisation: {
    id: null | string,
    name: null | string,
    acronym: null | string,
    organisationUnits: {
      id: string,
      name: string,
      acronym: string,
      users: organisationUsersOutDTO[],
      showHideStatus: 'hidden' | 'opened' | 'closed',
      showHideText: null | string,
      showHideDescription: null | string,
      isLoading: boolean
    }[];
  } = { id: null, name: null, acronym: null, organisationUnits: [] };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Organisation information');

    this.orgId = this.activatedRoute.snapshot.params.orgId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'updateOrganisationSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated the organisation.' };
        break;
      case 'updateUnitSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated the organisation unit.' };
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {

    this.organisationsService.getOrganisation(this.orgId).subscribe((organisation) => {
      this.organisation = {
        ...organisation,
        organisationUnits: organisation.organisationUnits.map((u) => ({
          ...u,
          showHideStatus: 'closed',
          showHideText: `Show users`,
          showHideDescription: `that belong to the ${u.name}`,
          isLoading: false,
          users: []
        }))
      };
      this.setPageStatus('READY');
    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch organisations information',
          message: 'Please try again or contact us for further help'
        };
      }
    );

  }

  onShowHideClicked(id: string): void {

    const unit = this.organisation.organisationUnits.find(item => item.id === id);

    if (unit?.showHideStatus === 'closed') { unit.isLoading = true; }

    switch (unit?.showHideStatus) {
      case 'opened':
        unit.showHideStatus = 'closed';
        unit.showHideText = `Show users`;
        unit.showHideDescription = `that belong to the ${unit.name}`;
        unit.isLoading = false;
        break;
      case 'closed':
        this.organisationsService.getUsersByUnitId(id).subscribe(
          (response) => {
            unit.users = response;
            unit.showHideStatus = 'opened';
            unit.showHideText = `Hide users`;
            unit.showHideDescription = `that belong to the ${unit.name}`;
            unit.isLoading = false;
          },
          () => (
            this.alert = { type: 'ERROR', title: 'Unable to fetch organisation users information', message: 'Please try again or contact us for further help' },
            unit.isLoading = false
          )
        );
        break;
      default:
        break;
    }

  }

}
