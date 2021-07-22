import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { INNOVATION_SUPPORT_STATUS } from '@modules/stores/innovation/innovation.models';

import { getInnovationSupportsInDTO, InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { getOrganisationUnitsSupportStatusDTO, OrganisationsService } from '@modules/shared/services/organisations.service';


@Component({
  selector: 'app-innovator-pages-innovation-data-sharing',
  templateUrl: './data-sharing.component.html',
  styleUrls: ['./data-sharing.component.scss'],
})
export class InnovationDataSharingComponent extends CoreComponent implements OnInit {

  innovationId: string;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;


  // organisationsNew: {
  //   info: getInnovationSupportsInDTO & { status?: keyof typeof INNOVATION_SUPPORT_STATUS; }
  //   showHideStatus: 'hidden' | 'opened' | 'closed';
  //   showHideText: null | string;
  // }[] = [];



  organisations: { id: string, name: string, shared: boolean, status: keyof typeof INNOVATION_SUPPORT_STATUS }[];
  organisationInfoUrl: string;

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisations = [];
    this.organisationInfoUrl = `${this.stores.environment.BASE_URL}/about-the-service/who-we-are`;
    this.summaryAlert = { type: '', title: '', message: '' };

    switch (this.activatedRoute.snapshot.queryParams.alert) {
      case 'sharingUpdateSuccess':
        this.summaryAlert = {
          type: 'success',
          title: 'Data sharing preferences',
          message: 'Your data sharing preferences were changed.'
        };
        break;
      case 'sharingUpdateError':
        this.summaryAlert = {
          type: 'error',
          title: 'An error occured when updating data sharing preferences',
          message: 'Please, try again or contact us for further help'
        };
        break;

    }
  }


  ngOnInit(): void {




    // forkJoin([
    //   this.organisationsService.getAccessorsOrganisations(),
    //   this.innovatorService.getInnovationShares(this.innovationId),
    //   this.innovatorService.getInnovationSupports(this.innovationId, false),
    // ]).subscribe(([innovationInfo, sectionSummary, innovationSupports]) => {

    // });


    this.organisationsService.getAccessorsOrganisations().subscribe(
      response => {

        this.organisations = response.map(item => ({
          id: item.id,
          name: item.name,
          status: 'UNASSIGNED',
          shared: false,
        }));

        this.innovatorService.getInnovationShares(this.innovationId).subscribe(
          r => {

            r.forEach(organisation => {
              const index = this.organisations.findIndex(o => o.id === organisation.id);
              if (index > -1) {
                this.organisations[index].shared = true;
                this.organisations[index].status = organisation.status;
              }
            });

          }
        );
      }
    );

  }

}
