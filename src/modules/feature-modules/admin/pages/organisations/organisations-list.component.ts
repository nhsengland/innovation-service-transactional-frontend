import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';


@Component({
  selector: 'app-admin-pages-organisations-organisations-list',
  templateUrl: './organisations-list.component.html'
})
export class PageOrganisationsListComponent extends CoreComponent implements OnInit {

  organisations: OrganisationsListDTO[] = [];

  teams: {
    name: string;
    isActive: boolean;
    link: string;
  }[] = [
      { name: 'Needs assessment team', isActive: true, link: UserRoleEnum.ASSESSMENT },
      { name: 'Service administrators', isActive: true, link: UserRoleEnum.ADMIN }
    ];

  constructor(
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Organisations');

  }

  ngOnInit(): void {

    this.organisationsService.getOrganisationsList({ unitsInformation: true, withInactive: true }).subscribe({
      next: response => {

        this.organisations = response;

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
