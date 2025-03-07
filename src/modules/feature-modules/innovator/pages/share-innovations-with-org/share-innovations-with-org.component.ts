import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoreComponent } from '@app/base';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ThemeModule } from '../../../../theme/theme.module';
import { InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'share-innovations-with-org',
  templateUrl: './share-innovations-with-org.component.html',
  standalone: true,
  imports: [ThemeModule, RouterLink]
})
export class ShareInnovationsWithOrgComponent extends CoreComponent implements OnInit {
  organisation: WritableSignal<{
    id: string;
    name: string;
    summary: string | null;
    website: string | null;
  }>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationService: OrganisationsService,
    private innovatorService: InnovatorService
  ) {
    super();
    this.setPageTitle('New support organisation sharing preferences');
    this.organisation = signal({
      id: this.activatedRoute.snapshot.params.organisationId,
      name: '',
      summary: null,
      website: null
    });
  }
  ngOnInit(): void {
    this.organisationService.getOrganisationInfo(this.organisation().id).subscribe(org => {
      this.organisation.set({
        id: org.id,
        name: org.name,
        summary: org.summary,
        website: org.website
      });

      this.setPageStatus('READY');
    });
  }

  onSubmit() {
    this.innovatorService.shareAllInnovationsWithOrg(this.organisation().id).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Innovations shared with ' + this.organisation().name);
        this.redirectTo('/innovator/dashboard');
      },
      error: () => {
        this.setAlertError('An error occurred while sharing innovations with ' + this.organisation().name);
      }
    });
  }
}
