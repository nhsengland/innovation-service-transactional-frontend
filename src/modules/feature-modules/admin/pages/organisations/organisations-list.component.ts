import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';

import { OrganisationsService } from '@modules/feature-modules/admin/services/organisations.service';

@Component({
  selector: 'app-admin-pages-organisations-organisations-list',
  templateUrl: './organisations-list.component.html'
})
export class PageOrganisationsListComponent extends CoreComponent implements OnInit {

  organisations: {
    info: {
      id: string;
      name: string;
      acronym: string;
      isActive: boolean;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        isActive: boolean;
      }[];
    };
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  constructor(
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Organisations');

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationsList({ withInactive: true }).subscribe({
      next: (organisationUnits) => {

        this.organisations = organisationUnits.map(organisation => {

          if (organisation.organisationUnits.length === 1) {
            return {
              info: {
                id: organisation.id,
                name: organisation.name,
                acronym: organisation.acronym,
                isActive: organisation.isActive,
                organisationUnits: [],
              },
              showHideStatus: 'hidden',
              showHideText: null,
              showHideDescription: null
            };
          } else {
            return {
              info: {
                id: organisation.id,
                name: organisation.name,
                acronym: organisation.acronym,
                isActive: organisation.isActive,
                organisationUnits: organisation.organisationUnits
              },
              showHideStatus: 'closed',
              showHideText: organisation.organisationUnits.length === 0 ? null : `Show ${organisation.organisationUnits.length} units`,
              showHideDescription: `that belong to the ${organisation.name}`
            };
          }

        });

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch organisations information', { message: 'Please try again or contact us for further help' });
      }
    });

  }


  onShowHideClicked(organisationId: string): void {

    const organisation = this.organisations.find(i => i.info.id === organisationId);

    switch (organisation?.showHideStatus) {
      case 'opened':
        organisation.showHideStatus = 'closed';
        organisation.showHideText = `Show ${organisation.info.organisationUnits.length} units`;
        organisation.showHideDescription = `that belong to the ${organisation.info.name}`;
        break;
      case 'closed':
        organisation.showHideStatus = 'opened';
        organisation.showHideText = `Hide ${organisation.info.organisationUnits.length} units`;
        organisation.showHideDescription = `that belong to the ${organisation.info.name}`;
        break;
      default:
        break;
    }

  }

}
