import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { FormArray, FormControl, FormGroup } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';


@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-change',
  templateUrl: './data-sharing-change.component.html'
})
export class InnovationDataSharingChangeComponent extends CoreComponent implements OnInit {

  innovationId: string;
  organisationInfoUrl: string;
  organisationsList: { value: string, label: string }[] = [];

  initialState: { organisations: { id: string }[] } = { organisations: [] };

  showDataSharingValidationWarning = false;

  form = new FormGroup({
    organisations: new FormArray<FormControl<string>>([])
  }, { updateOn: 'change' });


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService,
  ) {

    super();
    this.setPageTitle('Change data sharing preferences');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationInfoUrl = `${this.CONSTANTS.BASE_URL}/about-the-service/who-we-are`;

  }

  ngOnInit(): void {

    forkJoin([
      this.organisationsService.getOrganisationsList(false),
      this.innovationsService.getInnovationSharesList(this.innovationId)
    ]).subscribe(([organisationsList, innovationSharesList]) => {

      this.initialState.organisations = innovationSharesList.map(item => ({ id: item.organisation.id }));
      this.organisationsList = organisationsList.map(o => ({ value: o.id, label: o.name }));

      innovationSharesList.forEach(item => {
        (this.form.get('organisations') as FormArray).push(new FormControl(item.organisation.id));
      });

      this.subscriptions.push(
        (this.form.get('organisations') as FormArray).valueChanges.subscribe(() => this.dataSharingValidation())
      );

      this.setPageStatus('READY');

    });

  }

  onSubmit(): void {

    const redirectUrl = `/innovator/innovations/${this.innovationId}/support`;

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).subscribe(() => {
      this.setRedirectAlertSuccess('Your data sharing preferences were changed');
      this.redirectTo(redirectUrl);
    });

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
