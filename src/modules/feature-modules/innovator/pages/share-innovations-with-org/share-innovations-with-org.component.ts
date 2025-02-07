import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CoreComponent } from '@app/base';
import { OrganisationsService } from '@modules/shared/services/organisations.service';

@Component({
  selector: 'share-innovations-with-org',
  templateUrl: './share-innovations-with-org.component.html',
  standalone: true
})
export class ShareInnovationsWithOrgComponent extends CoreComponent implements OnInit {
  private organisation: {
    id: string;
    name: string;
    summary: string;
  };

  constructor(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    private organisationService: OrganisationsService
  ) {
    super();
    this.setPageTitle('Share Innovations with Organization');
    this.organisation = { id: activatedRouteSnapshot.queryParams.organisationId, name: '', summary: '' };
  }
  ngOnInit(): void {
    this.organisationService.getOrganisationInfo(this.organisation.id).subscribe(org => {
      this.organisation.name = org.name;
      this.organisation.summary = org.summary;
    });
  }

  onSubmit() {
    console.log('Form submitted');
  }
}
