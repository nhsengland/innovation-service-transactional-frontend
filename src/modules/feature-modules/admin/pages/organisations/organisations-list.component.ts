import { Component, OnInit } from '@angular/core';
import { CoreComponent } from '@app/base';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

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
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
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
    this.setPageTitle('Organisations list');

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationsListWithUnits().subscribe(organisationUnits => {

      this.organisations = organisationUnits.map(organisation => {

        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
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
              organisationUnits: organisation.organisationUnits.map(org => ({
                ...org,
              }))
            },
            showHideStatus: 'closed',
            showHideText: organisation.organisationUnits.length === 0 ? null : `Show ${organisation.organisationUnits.length} units`,
            showHideDescription: `that belong to the ${organisation.name}`
          };
        }

      });

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
