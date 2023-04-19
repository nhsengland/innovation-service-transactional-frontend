import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { concatMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovation-data-sharing-edit',
  templateUrl: './data-sharing-edit.component.html'
})
export class InnovationDataSharingEditComponent extends CoreComponent implements OnInit {

  innovationId: string;
  organisationInfoUrl: string;
  organisationsList: { value: string, label: string }[] = [];

  initialState: { organisations: { id: string }[] } = { organisations: [] };

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
    this.setPageTitle('Choose which organisations you want to share your data with');

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

      innovationSharesList.forEach(item => {
        (this.form.get('organisations') as FormArray).push(new FormControl(item.organisation.id));
      });

      this.setPageStatus('READY');

    });

  }

  onSubmit(): void {

    const redirectUrl = `/innovator/innovations/${this.innovationId}/record`;

    this.innovatorService.submitOrganisationSharing(this.innovationId, this.form.value).
    pipe(
      concatMap(() => {
        return this.stores.innovation.submitInnovation$(this.innovationId);
      })
    ).subscribe(() => {
        this.setRedirectAlertSuccess('You have successfully submitted your innovation record for a needs assessment', { message: `The needs assessment team will contact you within 1 week.` });
        this.redirectTo(redirectUrl);
    });

  }

}
