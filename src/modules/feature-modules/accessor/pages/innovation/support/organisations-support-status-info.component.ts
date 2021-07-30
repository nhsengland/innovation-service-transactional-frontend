import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { OrganisationsService, getOrganisationUnitsSupportStatusDTO } from '@shared-module/services/organisations.service';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { forkJoin } from 'rxjs';


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

  isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.isQualifyingAccessorRole = this.stores.authentication.isQualifyingAccessorRole();
  }


  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationUnits(),
      this.organisationsService.getInnovationSupports(this.innovationId, false),
    ]).subscribe(([organisationUnits, organisationUnitsSupportStatus]) => {

      this.organisations = organisationUnits.map(organisation => {

        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: [],
              status: organisationUnitsSupportStatus.find(o => o.organisationUnit.id === organisation.id)?.status || 'UNASSIGNED'
            },
            showHideStatus: 'hidden',
            showHideText: null
          };
        } else {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: organisation.organisationUnits.map(org => ({
                ...org,
                status: organisationUnitsSupportStatus.find(o => o.organisationUnit.id === org.id)?.status || 'UNASSIGNED'
              }))
            },
            showHideStatus: 'closed',
            showHideText: organisation.organisationUnits.length === 0 ? null : `Show ${organisation.organisationUnits.length} units`
          };
        }

      });
    });
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
