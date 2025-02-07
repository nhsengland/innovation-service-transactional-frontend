import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { OrganisationsService } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'app-admin-pages-organisations-organisation-info',
  templateUrl: './organisation-info.component.html'
})
export class PageOrganisationInfoComponent extends CoreComponent implements OnInit {
  organisationId: string;

  organisation: {
    id: string;
    name: null | string;
    acronym: null | string;
    summary: null | string;
    isActive: null | boolean;
    hasInactiveUnits: null | boolean;
    organisationUnits: {
      id: string;
      name: string;
      acronym: string;
      isActive: boolean;
      userCount: number;
    }[];
  } = {
    id: '',
    name: null,
    acronym: null,
    summary: null,
    isActive: null,
    hasInactiveUnits: null,
    organisationUnits: []
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {
    super();

    this.organisationId = this.activatedRoute.snapshot.params.organisationId;

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'organisationCreationSuccess':
        this.setAlertSuccess("You've successfully created the organisation");
        break;
      case 'updateOrganisationSuccess':
        this.setAlertSuccess("You've successfully updated the organisation");
        break;
      case 'updateUnitSuccess':
        this.setAlertSuccess("You've successfully updated the organisation unit");
        break;
      case 'organisationUnitActivateSuccess':
        this.setAlertSuccess("You've successfully activated the organisation unit");
        break;
      case 'organisationUnitInactivateSuccess':
        this.setAlertSuccess("You've successfully inactivated the organisation unit");
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
          hasInactiveUnits: organisation.organisationUnits?.some(unit => unit.isActive === false) || null,
          organisationUnits:
            organisation.organisationUnits?.map(u => ({
              ...u
            })) || []
        };

        this.setPageTitle('Organisation information');

        this.setPageStatus('READY');
      },
      error: error => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
        this.logger.error(error);
      }
    });
  }
}
