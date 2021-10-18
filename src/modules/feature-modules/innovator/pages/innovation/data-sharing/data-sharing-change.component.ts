import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent, FormArray, FormControl, FormGroup } from '@app/base';
import { AlertType } from '@app/base/models';

import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-change',
  templateUrl: './data-sharing-change.component.html'
})
export class InnovationDataSharingChangeComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovationId: string;
  organisationsList: { value: string, label: string }[];
  organisationInfoUrl: string;

  form = new FormGroup({
    organisations: new FormArray([]),
  });

  initialState: {
    organisations: { id: string, status: string }[]
  };

  showDataSharingValidationWarning = false;


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

  }

  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getAccessorsOrganisations(),
      this.innovatorService.getInnovationShares(this.innovationId)
    ]).subscribe(([organisations, innovationShares]) => {

      this.organisationsList = organisations.map(o => ({ value: o.id, label: o.name }));

      this.initialState.organisations = innovationShares;
      innovationShares.forEach((organisation) => {
        (this.form.get('organisations') as FormArray).push(new FormControl(organisation.id));
      });

      this.subscriptions.push(
        (this.form.get('organisations') as FormArray).valueChanges.subscribe(() => this.dataSharingValidation())
      );

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

  onSubmit(): void {

    const redirectUrl = `/innovator/innovations/${this.innovationId}/data-sharing`;

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).subscribe(
      () => this.redirectTo(redirectUrl, { alert: 'sharingUpdateSuccess' }),
      () => this.redirectTo(redirectUrl, { alert: 'sharingUpdateError' })
    );

  }

  dataSharingValidation(): void {

    this.showDataSharingValidationWarning = false;

    this.initialState.organisations.forEach((o) => {
      const index = (this.form.get('organisations')!.value as string[]).findIndex(item => item === o.id);
      if (index === -1) {
        this.showDataSharingValidationWarning = true;
      }
    });

  }

}
