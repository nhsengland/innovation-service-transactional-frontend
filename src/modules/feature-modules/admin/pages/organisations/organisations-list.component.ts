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
      isActive: boolean;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        isActive: boolean;
      }[];
    };
    unitText: null | string;
  }[] = [];

  teams: {
    name: string;
    isActive: boolean;
    link: string;
  }[] = [
      { name: 'Needs assessment team', isActive: true, link: '' },
      { name: 'Service administrators', isActive: true, link: '' }
    ];

  constructor(
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Organisations');

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationsList({ unitsInformation: true, withInactive: true }).subscribe({
      next: (organisationUnits) => {

        this.organisations = organisationUnits.map(organisation => {

          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              isActive: organisation.isActive,
              organisationUnits: organisation.organisationUnits
            },
            unitText: organisation.organisationUnits.length === 0
            ? null
            : organisation.organisationUnits.length === 1
            ? `${organisation.organisationUnits.length} unit attached`
            : `${organisation.organisationUnits.length} units attached`,
          };
        }

        );

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertError('Unable to fetch organisations information', { message: 'Please try again or contact us for further help' });
      }
    });

  }
}
