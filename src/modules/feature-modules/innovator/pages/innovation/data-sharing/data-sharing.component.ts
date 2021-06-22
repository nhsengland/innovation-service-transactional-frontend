import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';



@Component({
  selector: 'app-innovator-pages-innovation-data-sharing',
  templateUrl: './data-sharing.component.html',
  styleUrls: ['./data-sharing.component.scss'],
})
export class InnovationDataSharingComponent extends CoreComponent implements OnInit {

  innovationId: string;
  organisations: {id: string, name: string, shared?: boolean, status?: string}[];
  private innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  statuses: any = this.innovationSupportStatus;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisations =  [];
  }

  ngOnInit(): void {

    this.organisationsService.getAccessorsOrganisations().subscribe(
      response => {
        this.organisations = response;
        this.organisations = this.organisations.map(o => ({
          ...o,
          status: '',
          shared: false,
        }));
        this.innovatorService.getOrganisations(this.innovationId).subscribe(
          r =>  {
            r.map((organisation) => {
              const index = this.organisations.findIndex( o => o.id === organisation.id);
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

  onChangePreferences(): void {
    this.redirectTo(`/innovator/innovations/${this.innovationId}/data-sharing/edit`);
  }

}
