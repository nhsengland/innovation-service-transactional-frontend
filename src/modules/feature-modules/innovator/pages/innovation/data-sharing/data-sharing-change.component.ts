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

  summaryAlert: { type: '' | 'success' | 'error' | 'warning', title: string, message: string };

  innovationId: string;
  organisationsList: any[];
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

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.organisationsList =  [];
    this.initialState = {
      organisations: []
    };

    this.organisationInfoUrl = `${this.stores.environment.BASE_URL}/about-the-service/who-we-are`;
    this.summaryAlert = { type: 'warning', title: 'Are you sure?',
     message: 'This will remove access for one or more organisations currently engaging with your innovation. They will no longer be able to support you.' };
    this.showWarning = false;
  }

  ngOnInit(): void {

    this.organisationsService.getAccessorsOrganisations().subscribe(
      response => {
        this.organisationsList = response.map( o => ({ value: o.id, label: o.name }));

        this.innovatorService.getOrganisations(this.innovationId).subscribe(
          r =>  {
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

  dataSharingValidation = (event: {checked: boolean, item: string}): void  => {
    this.showWarning = false;
    this.initialState.organisations.forEach((o) => {
      const index = (this.form.get('organisations')?.value as string[]).findIndex((item) => item === o.id);
      if (index === -1) {
        this.showWarning = true;
      }
    });
  }

}
