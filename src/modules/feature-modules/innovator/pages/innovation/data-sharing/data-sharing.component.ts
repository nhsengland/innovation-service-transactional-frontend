import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationService } from '@modules/stores/innovation/innovation.service';
import { OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-innovator-pages-innovation-data-sharing',
  templateUrl: './data-sharing.component.html'
})
export class InnovationDataSharingComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  organisations: {
    info: {
      id: string,
      name: string,
      acronym: string,
      status?: InnovationSupportStatusEnum,
      organisationUnits: {
        id: string,
        name: string,
        acronym: string,
        status: InnovationSupportStatusEnum
      }[]
    };
    shared: boolean;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  organisationInfoUrl: string;

  organisationSuggestions: OrganisationSuggestionModel | undefined;
  shares: { organisationId: string }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovationService: InnovationService
  ) {

    super();
    this.setPageTitle('Data sharing and support');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationInfoUrl = `${this.CONSTANTS.BASE_URL}/about-the-service/who-we-are`;

  }

  ngOnInit(): void {

    // this.notificationsService.dismissNotification(NotificationContextTypeEnum.DATA_SHARING, this.innovationId).subscribe();

    forkJoin([
      this.organisationsService.getOrganisationsList(true),
      this.innovationsService.getInnovationSharesList(this.innovationId),
      this.innovationsService.getInnovationSupportsList(this.innovationId, false),
      this.innovationService.getInnovationOrganisationSuggestions(this.innovationId),
    ]).subscribe(([organisationsList, innovationShares, innovationSupports, organisationSuggestions]) => {

      this.organisationSuggestions = organisationSuggestions;
      this.shares = innovationShares.map(item => ({ organisationId: item.organisation.id }));

      this.organisations = organisationsList.map(organisation => {

        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: [],
              status: innovationSupports.find(item => item.organisation.id === organisation.id)?.status || InnovationSupportStatusEnum.UNASSIGNED,
            },
            shared: (innovationShares.findIndex(item => item.organisation.id === organisation.id) > -1),
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
              organisationUnits: organisation.organisationUnits.map(organisationUnit => ({
                ...organisationUnit,
                status: innovationSupports.find(item => item.organisation.unit.id === organisationUnit.id)?.status || InnovationSupportStatusEnum.UNASSIGNED
              }))
            },
            shared: (innovationShares.findIndex(item => item.organisation.id === organisation.id) > -1),
            showHideStatus: 'closed',
            showHideText: organisation.organisationUnits.length === 0 ? null : `Show ${organisation.organisationUnits.length} units`,
            showHideDescription: `that belong to the ${organisation.name}`
          };
        }

      });

      this.setPageStatus('READY');

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
