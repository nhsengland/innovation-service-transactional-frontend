import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { OrganisationsService, getOrganisationUnitsSupportStatusDTO } from '@shared-module/services/organisations.service';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-info',
  templateUrl: './organisations-support-status-info.component.html'
})
export class InnovationSupportOrganisationsSupportStatusInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  organisations: {
    info: getOrganisationUnitsSupportStatusDTO & { status?: keyof typeof INNOVATION_SUPPORT_STATUS; }
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
  }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

  }


  ngOnInit(): void {

    this.organisationsService.getOrganisationUnitsSupportStatus(this.innovationId).subscribe(
      response => {

        this.organisations = response.map(item => {

          if (item.organisationUnits.length === 1) {
            return { info: { ...item.organisationUnits[0], organisationUnits: [] }, showHideStatus: 'hidden', showHideText: null };
          } else {
            return { info: item, showHideStatus: 'closed', showHideText: `Show ${item.organisationUnits.length} units` };
          }

        });

      },
      error => {
        this.logger.error(error);
      }
    );

  }


  onShowHideClicked(organisationId: string): void {

    const organisation = this.organisations.find(i => i.info.id === organisationId);

    switch (organisation?.showHideStatus) {
      case 'opened':
        organisation.showHideStatus = 'closed';
        organisation.showHideText = `Show ${organisation.info.organisationUnits.length} units`;
        break;
      case 'closed':
        organisation.showHideStatus = 'opened';
        organisation.showHideText = `Hide ${organisation.info.organisationUnits.length} units`;
        break;
      default:
        break;
    }

  }

}
