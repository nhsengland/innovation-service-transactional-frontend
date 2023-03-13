import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { GetOrganisationUnitInfoDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-pages-organisations-unit-info',
  templateUrl: './organisation-unit-info.component.html'
})
export class PageOrganisationUnitInfoComponent extends CoreComponent implements OnInit {
  organisationId: string;
  organisationUnitId: string;

  unit: GetOrganisationUnitInfoDTO = { id: '', name: '', acronym: '', isActive: false, userCount: 0};

  constructor(    
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService
  ) { 
    super();
    this.setPageTitle('Unit Information');

    
    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
    this.organisationUnitId = this.activatedRoute.snapshot.params.organisationUnitId;
  }

  ngOnInit(): void {
    forkJoin([
      this.organisationsService.getOrganisationUnitInfo(this.organisationId, this.organisationUnitId),
      this.organisationsService.getOrganisationUnitUsersList(this.organisationUnitId, {})
    ]).subscribe({

      next: ([unitInfo, unitUsers]) => {
        this.unit = unitInfo;
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('READY');
      }
      
    });
  }

}
