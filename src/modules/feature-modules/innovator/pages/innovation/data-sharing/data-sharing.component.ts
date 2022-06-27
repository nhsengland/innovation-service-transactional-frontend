import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';
import { InnovationService } from '@modules/stores/innovation/innovation.service';
import { INNOVATION_SUPPORT_STATUS, OrganisationSuggestionModel } from '@modules/stores/innovation/innovation.models';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { NotificationContextType, NotificationsService } from '@modules/shared/services/notifications.service';



@Component({
  selector: 'app-innovator-pages-innovation-data-sharing',
  templateUrl: './data-sharing.component.html'
})
export class InnovationDataSharingComponent extends CoreComponent implements OnInit {

  innovationId: string;

  alert: AlertType = { type: null };

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  organisations: {
    info: {
      id: string;
      name: string;
      acronym: string;
      status?: keyof typeof INNOVATION_SUPPORT_STATUS;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        status: keyof typeof INNOVATION_SUPPORT_STATUS;
      }[];
    };
    shared: boolean;
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  organisationInfoUrl: string;

  organisationSuggestions: OrganisationSuggestionModel | undefined;
  shares: { id: string, status: string }[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
    private innovationService: InnovationService,
    private notificationsService: NotificationsService
  ) {

    super();
    this.setPageTitle('Data sharing and support');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationInfoUrl = `${this.CONSTANTS.BASE_URL}/about-the-service/who-we-are`;
    this.shares = [];

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sharingUpdateSuccess':
        this.alert = {
          type: 'SUCCESS',
          title: 'Data sharing preferences',
          message: 'Your data sharing preferences were changed.'
        };
        break;
      case 'sharingUpdateError':
        this.alert = {
          type: 'ERROR',
          title: 'An error occurred when updating data sharing preferences',
          message: 'Please try again or contact us for further help'
        };
        break;
    }

  }

  ngOnInit(): void {

    this.notificationsService.dismissNotification(this.innovationId, NotificationContextType.DATA_SHARING).subscribe();

    forkJoin([
      this.organisationsService.getOrganisationUnits(),
      this.innovatorService.getInnovationShares(this.innovationId),
      this.innovatorService.getInnovationSupports(this.innovationId, false),
      this.innovationService.getInnovationOrganisationSuggestions('innovator', this.innovationId),
    ]).subscribe(([organisationUnits, innovationShares, organisationUnitsSupportStatus, organisationSuggestions]) => {

      this.organisationSuggestions = organisationSuggestions;
      this.shares = innovationShares;

      this.organisations = organisationUnits.map(organisation => {

        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: [],
              status: innovationShares.find(i => i.id === organisation.id)?.status || 'UNASSIGNED',
            },
            shared: (innovationShares.findIndex(i => i.id === organisation.id) > -1),
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
                status: organisationUnitsSupportStatus.find(o => o.organisationUnit.id === org.id)?.status || 'UNASSIGNED'
              }))
            },
            shared: (innovationShares.findIndex(i => i.id === organisation.id) > -1),
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
          title: 'Unable to fetch data sharing information',
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
