import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { OrganisationsService } from '@modules/shared/services/organisations.service';
import { ThemeModule } from '../../../../theme/theme.module';
import { InnovatorService } from '../../services/innovator.service';

@Component({
  selector: 'share-innovations-with-org',
  templateUrl: './share-innovations-with-org.component.html',
  standalone: true,
  imports: [ThemeModule]
})
export class ShareInnovationsWithOrgComponent extends CoreComponent implements OnInit {
  organisation: {
    id: string;
    name: string;
    summary: string | null;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private organisationService: OrganisationsService,
    private innovatorService: InnovatorService
  ) {
    super();
    this.setPageTitle('New support organisation sharing preferences');
    this.organisation = { id: this.activatedRoute.snapshot.params.organisationId, name: '', summary: null };
  }
  ngOnInit(): void {
    this.organisationService.getOrganisationInfo(this.organisation.id).subscribe(org => {
      this.organisation.name = org.name;
      this.organisation.summary = org.summary;

      this.setPageStatus('READY');
    });
  }

  onSubmit() {
    this.innovatorService.shareAllInnovationsWithOrg(this.organisation.id).subscribe({
      next: () => {
        this.setAlertSuccess('Innovations shared with ' + this.organisation.name);
        this.router.navigateByUrl('/innovator/dashboard');
      },
      error: () => {
        this.setAlertError('An error occurred while sharing innovations with ' + this.organisation.name);
      }
    });
  }
}
