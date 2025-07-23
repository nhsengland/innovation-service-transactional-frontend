import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { CustomValidators } from '@modules/shared/forms';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsListDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSharesListDTO } from '@modules/shared/services/innovations.dtos';
import { concatMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-edit',
  templateUrl: './data-sharing-edit.component.html'
})
export class InnovationDataSharingEditComponent extends CoreComponent implements OnInit {
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

  submitButton = { isActive: true, label: 'Confirm submission' };

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
    this.setPageTitle('Choose which organisations you want to share your data with');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationInfoUrl = this.CONSTANTS.URLS.WHO_WE_ARE;
  }

  ngOnInit(): void {
    forkJoin([
      this.organisationsService.getOrganisationsList({ unitsInformation: false }),
      this.innovationsService.getInnovationSharesList(this.innovationId)
    ]).subscribe(([organisationsList, innovationSharesList]) => {
      this.initialState.organisations = innovationSharesList.map(item => ({ id: item.organisation.id }));
      this.organisationsList = organisationsList.map(o => ({
        value: o.id,
        label: this.formatOrganizationLabel(o.name, o.acronym),
        acronym: o.acronym
      }));

      this.addNHSEIfMissing(organisationsList, innovationSharesList);

      this.setPageStatus('READY');
    });
  }

  private formatOrganizationLabel(name: string, acronym: string): string {
    if (acronym === this.NHSE_ORG_ACRONYM && !name.includes('(necessary)')) {
      return `${name} (necessary)`;
    }
    return name;
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

  private ensureNHSEOrganisationIncluded() {
    if (
      this.nhseOrganisation &&
      this.form.value.organisations &&
      !this.form.value.organisations.includes(this.nhseOrganisation.id)
    ) {
      (this.form.get('organisations') as FormArray).push(new FormControl(this.nhseOrganisation.id));
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitButton = { isActive: false, label: 'Saving...' };

    const redirectUrl = `/innovator/innovations/${this.innovationId}/record`;

    // Check if NHSE is selected, then add it forcefully
    this.ensureNHSEOrganisationIncluded();

    this.innovatorService
      .submitOrganisationSharing(this.innovationId, this.form.value)
      .pipe(
        concatMap(() => {
          return this.ctx.innovation.submitInnovation$(this.innovationId);
        })
      )
      .subscribe({
        next: () => {
          this.setRedirectAlertSuccess(
            'You have successfully submitted your innovation record for a needs assessment',
            { message: `The needs assessment team will contact you within 1 week.` }
          );
          this.redirectTo(redirectUrl);
        },
        error: () => {
          this.submitButton = { isActive: true, label: 'Confirm submission' };
          this.setAlertError(
            'An error occurred while submiting your innovation record. Please, try again or contact us for further help'
          );
        }
      });
  }
}
