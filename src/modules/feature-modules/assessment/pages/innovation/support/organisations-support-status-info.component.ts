import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';
import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';
import { RoutingHelper } from '@app/base/helpers';

@Component({
  selector: 'app-assessment-pages-innovation-support-organisations-support-status-info',
  templateUrl: './organisations-support-status-info.component.html'
})
export class InnovationSupportOrganisationsSupportStatusInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  innovation: InnovationDataResolverType;

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
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];

  // isQualifyingAccessorRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Support status');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData(this.activatedRoute).innovationData;
  }


  ngOnInit(): void {

    this.setPageStatus('READY');
    forkJoin([
      this.organisationsService.getOrganisationUnits(),
      this.assessmentService.getInnovationSupports(this.innovationId, false),
    ]).subscribe(([organisationUnits, organisationUnitsSupportStatus]) => {
      this.organisations = organisationUnits.map(organisation => {
        if (organisation.organisationUnits.length === 1) {
          return {
            info: {
              id: organisation.id,
              name: organisation.name,
              acronym: organisation.acronym,
              organisationUnits: [],
              status: organisationUnitsSupportStatus.find(o => o.organisationUnit.organisation.id === organisation.id)?.status || 'UNASSIGNED'
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
                status: organisationUnitsSupportStatus.find(o => o.organisationUnit.id === org.id)?.status || 'UNASSIGNED'
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
          title: 'Unable to fetch innovation record information',
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
