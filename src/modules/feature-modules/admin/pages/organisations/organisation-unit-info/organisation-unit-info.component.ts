import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { AccessorOrganisationRoleEnum, InnovatorOrganisationRoleEnum } from '@app/base/enums';
import { DateISOType } from '@app/base/types';
import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';
import { GetOrganisationUnitInfoDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
import { InnovationSupportStatusEnum } from '@modules/stores/innovation';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-pages-organisations-unit-info',
  templateUrl: './organisation-unit-info.component.html'
})
export class PageOrganisationUnitInfoComponent extends CoreComponent implements OnInit {
  organisationId: string;
  organisationUnitId: string;


  unit: GetOrganisationUnitInfoDTO = { id: '', name: '', acronym: '', isActive: false, userCount: 0};
  users: {id: string, name: string, roleDescription: string, email: string}[] = [];
  innovations: InnovationsListDTO = {
    count: 0,
    data: []
  };

  constructor(    
    private activatedRoute: ActivatedRoute,
    private organisationsService: OrganisationsService,
    private innovationsService: InnovationsService
  ) { 
    super();
    this.setPageTitle('Unit Information');

    
    this.organisationId = this.activatedRoute.snapshot.params.organisationId;
    this.organisationUnitId = this.activatedRoute.snapshot.params.organisationUnitId;
  }

  ngOnInit(): void {
    this.setPageStatus('LOADING');

    forkJoin([
      this.organisationsService.getOrganisationUnitInfo(this.organisationId, this.organisationUnitId),
      this.organisationsService.getOrganisationUnitUsersList(this.organisationUnitId, { email: true }),
      this.innovationsService.getInnovationsList({ queryParams:  { take: 100, skip: 0, order: { name: 'ASC' }, filters: { engagingOrganisationUnits: [this.organisationUnitId]} }})
    ]).subscribe({
      next: ([unitInfo, users, innovations]) => {
        this.unit = unitInfo;
        this.innovations = innovations;

        this.users = users.map(item => 
          ({ 
            id: item.id,
            name: item.name, 
            roleDescription: this.stores.authentication.getRoleDescription(item.role),
            email: item.email ?? ''
          })
        );
        
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('READY');
      }
    });
  }

  getUnitStatusSupport(supports?: {
    id: string,
    status: InnovationSupportStatusEnum,
    organisation: {
      id: string,
      unit: {
        id: string,
      }
    }
  }[]): InnovationSupportStatusEnum {
    return supports && supports.length > 0 ? supports[0].status : InnovationSupportStatusEnum.NOT_YET;
  }
}
