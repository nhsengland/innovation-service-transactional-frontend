import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { RoutingHelper } from '@app/base/helpers';

import { InnovationsActionsListFilterType, InnovationsService } from '@modules/shared/services/innovations.service';

import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';
import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-innovation-action-tracker-list',
  templateUrl: './action-tracker-list.component.html'
})
export class InnovationActionTrackerListComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: InnovationDataResolverType;

  openedActionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsActionsListFilterType>;
  closedActionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsActionsListFilterType>;

  innovationSummary: { label: string; value: string; }[] = [];

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Action tracker');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = RoutingHelper.getRouteData<any>(this.activatedRoute).innovationData;

    this.openedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      }
    })

    this.closedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      }
    });

  }


  ngOnInit(): void {

    const filters = new TableModel<InnovationActionsListDTO['data'][0], InnovationsActionsListFilterType>({ pageSize: 1000 });
    filters.setFilters({ innovationId: this.innovationId, fields: ['notifications'] });

    this.innovationsService.getActionsList(filters.getAPIQueryParams()).subscribe(response => {

      this.openedActionsList.setData(response.data
        .filter(item => [
          InnovationActionStatusEnum.REQUESTED,
          InnovationActionStatusEnum.STARTED,
          InnovationActionStatusEnum.CONTINUE,
          InnovationActionStatusEnum.IN_REVIEW
        ].includes(item.status))
      );

      this.closedActionsList.setData(response.data
        .filter(item => [
          InnovationActionStatusEnum.DECLINED,
          InnovationActionStatusEnum.COMPLETED,
          InnovationActionStatusEnum.DELETED
        ].includes(item.status))
      );

      this.setPageStatus('READY');

    });

  }

}
