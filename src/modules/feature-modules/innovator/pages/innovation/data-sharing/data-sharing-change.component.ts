import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent, FormArray, FormControl, FormGroup } from '@app/base';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-change',
  templateUrl: './data-sharing-change.component.html'
})
export class InnovationDataSharingChangeComponent extends CoreComponent implements OnInit {

  innovationId: string;
  organisationsList: { value: string, label: string }[];
  organisationInfoUrl: string;

  form = new FormGroup({
    organisations: new FormArray([]),
  });

  organisationShareArrayName = 'organisations';
  initialState: {
    organisations: { id: string, status: string }[]
  };

  showWarning: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
  ) {

    super();
    this.setPageTitle('Change data sharing preferences');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationsList = [];
    this.initialState = {
      organisations: []
    };

    this.organisationInfoUrl = `${this.stores.environment.BASE_URL}/about-the-service/who-we-are`;
    this.showWarning = false;
  }

  ngOnInit(): void {

    this.organisationsService.getAccessorsOrganisations().subscribe(
      response => {
        this.organisationsList = response.map(o => ({ value: o.id, label: o.name }));

        this.innovatorService.getInnovationShares(this.innovationId).subscribe(
          r => {
            this.initialState.organisations = r;
            r.forEach((organisation) => {
              (this.form.get('organisations') as FormArray).push(
                new FormControl(organisation.id)
              );
            });
          }
        );
      }
    );

  }

  onSubmit(): void {

    const redirectUrl = `/innovator/innovations/${this.innovationId}/data-sharing`;

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).subscribe(
      () => this.redirectTo(redirectUrl, { alert: 'sharingUpdateSuccess' }),
      () => this.redirectTo(redirectUrl, { alert: 'sharingUpdateError' })
    );

  }

  dataSharingValidation(event: { checked: boolean, item: string }): void {

    this.showWarning = false;

    this.initialState.organisations.forEach((o) => {
      const index = (this.form.get('organisations')?.value as string[]).findIndex((item) => item === o.id);
      if (index === -1) {
        this.showWarning = true;
      }
    });

  }

}
