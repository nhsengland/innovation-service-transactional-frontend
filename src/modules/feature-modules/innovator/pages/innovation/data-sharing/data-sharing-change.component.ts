import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormControl, FormGroup } from '@app/base/forms';

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

  submitButton = { isActive: true, label: 'Save changes' };

  form = new FormGroup({
    organisations: new FormArray<FormControl<string>>([], CustomValidators.requiredCheckboxArray('Choose at least one organisation'))
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
      this.organisationsService.getOrganisationsList({ unitsInformation: false }),
      this.innovationsService.getInnovationSharesList(this.innovationId)
    ]).subscribe(([organisationsList, innovationSharesList]) => {

      this.initialState.organisations = innovationSharesList.map(item => ({ id: item.organisation.id }));
      this.organisationsList = organisationsList.map(o => ({ value: o.id, label: o.name }));

      if(innovationSharesList.length > 0) {
        innovationSharesList.forEach(item => {
          (this.form.get('organisations') as FormArray).push(new FormControl(item.organisation.id));
        });
      }
      else {
        organisationsList.forEach(item => {
          (this.form.get('organisations') as FormArray).push(new FormControl(item.id));
        });
      }

      this.subscriptions.push(
        (this.form.get('organisations') as FormArray).valueChanges.subscribe(() => this.dataSharingValidation())
      );

      this.setPageStatus('READY');

    });

  }

  onSubmit(): void {

    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const redirectUrl = `/innovator/innovations/${this.innovationId}/support`;

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your data sharing preferences were changed');
        this.redirectTo(redirectUrl);
    },
      error: () => {
        this.submitButton = { isActive: true, label: 'Save changes' };
        this.setAlertError('An error occurred while saving your data sharing preferences. Please, try again or contact us for further help');
      }
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
