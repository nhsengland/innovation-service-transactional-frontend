import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { AssessmentService } from '@modules/feature-modules/assessment/services/assessment.service';

import { InnovationDataResolverType, InnovationSupportStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-assessment-pages-innovation-support-organisations-support-status-info',
  templateUrl: './organisations-support-status-info.component.html'
})
export class InnovationSupportOrganisationsSupportStatusInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;

  innovation: InnovationDataResolverType;

  organisations: {
    info: {
      id: string;
      name: string;
      acronym: string;
      status?: InnovationSupportStatusEnum;
      organisationUnits: {
        id: string;
        name: string;
        acronym: string;
        status: InnovationSupportStatusEnum;
      }[];
    };
    showHideStatus: 'hidden' | 'opened' | 'closed';
    showHideText: null | string;
    showHideDescription: null | string;
  }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private organisationsService: OrganisationsService
  ) {

    super();
    this.setPageTitle('Support status', { hint: 'All organisations' });

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;

  }


  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationsListWithUnits(),
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
              status: organisationUnitsSupportStatus.find(o => o.organisationUnit.organisation.id === organisation.id)?.status || InnovationSupportStatusEnum.UNASSIGNED
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
                status: organisationUnitsSupportStatus.find(o => o.organisationUnit.id === org.id)?.status || InnovationSupportStatusEnum.UNASSIGNED
              }))
            },
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
