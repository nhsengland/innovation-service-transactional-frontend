import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { InnovationsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsListFiltersType, InnovationsService } from '@modules/shared/services/innovations.service';
import { GetOrganisationUnitInfoDTO, GetOrganisationUnitUsersDTO, OrganisationsService } from '@modules/shared/services/organisations.service';
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
  innovationsList = new TableModel<InnovationsListDTO['data'][0], InnovationsListFiltersType>({ pageSize: 5 });
  usersList = new TableModel<GetOrganisationUnitUsersDTO[0]>({ pageSize: 5 });

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

    this.innovationsList.setVisibleColumns({
      innovation: { label: 'Innovation', orderable: false },
      status: { label: 'Status', orderable: false, align: 'right' }
    }).setFilters({      
      engagingOrganisationUnits: [this.organisationUnitId]
    });

    this.usersList.setVisibleColumns({
      account: { label: 'User account', orderable: false },
      action: { label: '', orderable: false, align: 'right' }
    });

    forkJoin([
      this.organisationsService.getOrganisationUnitInfo(this.organisationId, this.organisationUnitId),
      this.organisationsService.getOrganisationUnitUsersList(this.organisationUnitId, { email: true }),
      this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() })
    ]).subscribe({
      next: ([unitInfo, users, innovations]) => {
        this.unit = unitInfo;
        this.innovationsList.setData(innovations.data, innovations.count);
        this.usersList.setData(users.map(item => 
          ({ 
            ...item,
            roleDescription: this.stores.authentication.getRoleDescription(item.role)
          })
        ), users.length);
        
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

  onUsersPageChange(event: { pageNumber: number }): void {
    this.usersList.setPage(event.pageNumber);

    this.organisationsService.getOrganisationUnitUsersList(this.organisationUnitId, { email: true }).subscribe({
      next: (users) => {        
        this.usersList.setData(users.map(item => 
          ({ 
            ...item,
            roleDescription: this.stores.authentication.getRoleDescription(item.role)
          })
        ), users.length);
      }
    });
  }
  
  onInnovationsPageChange(event: { pageNumber: number }): void {
    this.innovationsList.setPage(event.pageNumber);

    this.innovationsService.getInnovationsList({ queryParams: this.innovationsList.getAPIQueryParams() }).subscribe({
      next: (innovations) => {        
        this.innovationsList.setData(innovations.data, innovations.count);
      }
    });
  }
}
