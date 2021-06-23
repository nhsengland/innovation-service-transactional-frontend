import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent, FormArray, FormControl, FormGroup } from '@app/base';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';



@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-change',
  templateUrl: './data-sharing-change.component.html',
  styleUrls: ['./data-sharing.component.scss'],
})
export class InnovationDataSharingChangeComponent extends CoreComponent implements OnInit {

  innovationId: string;
  organisationsList: any[];
  organisationInfoUrl: string;
  form = new FormGroup({
    organisationShares: new FormArray([]),
  });

  organisationShareArrayName = 'organisationShares';

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationsList =  [];
    this.organisationInfoUrl = `${this.stores.environment.BASE_URL}/about-the-service/who-we-are`;
  }

  ngOnInit(): void {

    this.organisationsService.getAccessorsOrganisations().subscribe(
      response => {
        this.organisationsList = response.map( o => ({ value: o.id, label: o.name }));

        this.innovatorService.getOrganisations(this.innovationId).subscribe(
          r =>  {
            r.forEach((organisation) => {
              (this.form.get('organisationShares') as FormArray).push(
                new FormControl(organisation.id)
              );
            });
          }
        );
      }
    );
  }

  onSubmit(): void {
    const userId = this.stores.authentication.getUserId();
    const redirectUrl = `/innovator/innovations/${this.innovationId}/data-sharing`;
    this.innovatorService
      .submitOrganisationSharing(this.innovationId, this.form.value)
      .subscribe(
        () => {
          this.redirectTo(redirectUrl,
          { alert: 'sharingUpdateSuccess' });
        },
        (error) => {
          this.redirectTo(redirectUrl,
            { alert: 'sharingUpdateError', error });
        }
      );
  }

}
