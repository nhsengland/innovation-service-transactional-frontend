import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsActionsListFilterType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-innovator-pages-innovation-action-tracker',
  templateUrl: './action-tracker.component.html'
})
export class InnovationActionTrackerComponent extends CoreComponent implements OnInit {

  innovationId: string;

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

    this.openedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      }
    });

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
          // InnovationActionStatusEnum.STARTED,
          // InnovationActionStatusEnum.CONTINUE,
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
