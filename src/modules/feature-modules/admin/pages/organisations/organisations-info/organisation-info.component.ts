import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AlertType, LinkType } from '@app/base/models';
import { OrganisationsService, organisationUsersOutDTO } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'app-admin-pages-organisations-info',
  templateUrl: './organisation-info.component.html'
})
export class PageAdminOrganisationInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };
  orgId: string;

  organisation!: {
    id: string;
    name: string;
    acronym: string;
    organisationUnits: {
      id: string;
      name: string;
      acronym: string;
      users: organisationUsersOutDTO[],
      showHideStatus: 'hidden' | 'opened' | 'closed',
      showHideText: null | string,
      showHideDescription: null | string,
      isLoading: boolean,
    }[];
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {
    super();
    this.setPageTitle('Organisation information');
    this.orgId = this.activatedRoute.snapshot.params.orgId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'updateOrganisationSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated a organisation.' };
        break;
      case 'updateUnitSuccess':
        this.alert = { type: 'SUCCESS', title: 'You\'ve successfully updated a organisation unit.' };
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

    this.organisation.organisationUnits = this.organisation.organisationUnits.map((unit) => {

      if (unit.id === id) {

        if (unit.showHideStatus === 'closed') { unit.isLoading = true; }

        switch (unit.showHideStatus) {
          case 'opened':
            unit.showHideStatus = 'closed';
            unit.showHideText = `Show users`;
            unit.showHideDescription = `that belong to the ${unit.name}`;
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
              () => this.alert = { type: 'ERROR', title: 'Unable to fetch organisation users information', message: 'Please try again or contact us for further help' }
            );
            break;
          default:
          break;
        }
      }
      return unit;
    });
  }
}
