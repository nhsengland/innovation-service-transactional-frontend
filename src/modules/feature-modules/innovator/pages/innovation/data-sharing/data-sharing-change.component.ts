import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { CustomValidators, FormArray, FormControl, FormGroup } from '@app/base/forms';

import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';

import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationSharesListDTO } from '@modules/shared/services/innovations.dtos';

@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-change',
  templateUrl: './data-sharing-change.component.html'
})
export class InnovationDataSharingChangeComponent extends CoreComponent implements OnInit {
  innovationId: string;
  organisationInfoUrl: string;

  organisationsList: {
    value: string;
    label: string;
    acronym: string;
  }[] = [];
  nhseOrganisation: OrganisationsListDTO | undefined;

  NHSE_ORG_ACRONYM = 'NHSE';

  initialState: { organisations: { id: string }[] } = { organisations: [] };

  showDataSharingValidationWarning = false;

  submitButton = { isActive: true, label: 'Save changes' };

  form = new FormGroup(
    {
      organisations: new FormArray<FormControl<string>>(
        [],
        CustomValidators.requiredCheckboxArray('Choose at least one organisation')
      )
    },
    { updateOn: 'change' }
  );

  get disabledItems(): string[] {
    return this.nhseOrganisation?.id ? [this.nhseOrganisation.id] : [];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService,
    private organisationsService: OrganisationsService,
    private innovatorService: InnovatorService
  ) {
    super();
    this.setPageTitle('Change data sharing preferences');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationInfoUrl = this.CONSTANTS.URLS.WHO_WE_ARE;
  }

  ngOnInit(): void {
    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: false }),
      this.innovationsService.getInnovationSharesList(this.innovationId)
    ]).subscribe(([organisationsList, innovationSharesList]) => {
      this.initialState.organisations = innovationSharesList.map(item => ({ id: item.organisation.id }));
      this.organisationsList = organisationsList.map(o => ({ value: o.id, label: o.name, acronym: o.acronym }));

      // Get Organisation NHSE
      this.addNHSEIfMissing(organisationsList, innovationSharesList);

      this.subscriptions.push(
        (this.form.get('organisations') as FormArray).valueChanges.subscribe(() => this.dataSharingValidation())
      );

      this.setPageStatus('READY');
    });
  }

  private addNHSEIfMissing(organisationsList: OrganisationsListDTO[], innovationSharesList: InnovationSharesListDTO) {
    this.nhseOrganisation = organisationsList.find(o => o.acronym === this.NHSE_ORG_ACRONYM);

    // Since NHSE needs to be always shared with, we can add it to the list if it's not already there
    const innovationSharesListWithNHSE = [...innovationSharesList];
    if (
      this.nhseOrganisation &&
      !innovationSharesList.find(item => item.organisation.acronym === this.NHSE_ORG_ACRONYM)
    ) {
      innovationSharesListWithNHSE.push({ organisation: this.nhseOrganisation });
    }

    const innovationSharesListWithoutNHSE = innovationSharesListWithNHSE.filter(
      item => item.organisation.acronym !== this.NHSE_ORG_ACRONYM
    );

    if (innovationSharesListWithoutNHSE.length > 0) {
      innovationSharesListWithNHSE.forEach(item => {
        (this.form.get('organisations') as FormArray).push(new FormControl(item.organisation.id));
      });
    } else {
      // when there are no organisations shared yet or NHSE is the only one shared add all organisations
      organisationsList.forEach(item => {
        (this.form.get('organisations') as FormArray).push(new FormControl(item.id));
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const redirectUrl = `/innovator/innovations/${this.innovationId}/support`;

    // Check if NHSE is selected, then add it forcefully
    this.ensureNHSEOrganisationIncluded();

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your data sharing preferences were changed');
        this.redirectTo(redirectUrl);
      },
      error: () => {
        this.submitButton = { isActive: true, label: 'Save changes' };
        this.setAlertError(
          'An error occurred while saving your data sharing preferences. Please, try again or contact us for further help'
        );
      }
    });
  }

  private ensureNHSEOrganisationIncluded() {
    if (
      this.nhseOrganisation &&
      this.form.value.organisations &&
      !this.form.value.organisations.includes(this.nhseOrganisation.id)
    ) {
      (this.form.get('organisations') as FormArray).push(new FormControl(this.nhseOrganisation.id));
    }
  }

  dataSharingValidation(): void {
    this.showDataSharingValidationWarning = false;

    this.initialState.organisations.forEach(o => {
      const index = (this.form.get('organisations')!.value as string[]).findIndex(item => item === o.id);
      if (index === -1) {
        this.showDataSharingValidationWarning = true;
      }
    });
  }
}
