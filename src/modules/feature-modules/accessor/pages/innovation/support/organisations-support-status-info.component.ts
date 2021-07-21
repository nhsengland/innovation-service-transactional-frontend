import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@modules/core';
import { OrganisationsService, getOrganisationUnitsSupportStatusDTO } from '@shared-module/services/organisations.service';

import { InnovationDataType } from '@modules/feature-modules/accessor/resolvers/innovation-data.resolver';


@Component({
  selector: 'app-accessor-pages-innovation-support-organisations-support-status-info',
  templateUrl: './organisations-support-status-info.component.html'
})
export class InnovationSupportOrganisationsSupportStatusInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataType;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  organisations: {
    info: getOrganisationUnitsSupportStatusDTO;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
  }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    this.organisationsService.getOrganisationUnitsSupportStatus(this.innovationId).subscribe(
      response => {
        this.organisations = response.map(item => ({
          info: item,
          showHideStatus: 'closed',
          showHideText: `Show ${item.organisationUnits.length} units`
        }));
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
