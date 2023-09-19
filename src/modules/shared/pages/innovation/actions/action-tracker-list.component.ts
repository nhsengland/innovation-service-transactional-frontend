import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationsTasksListFilterType, InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';

import { UserRoleEnum } from '@app/base/enums';
import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-action-tracker-list',
  templateUrl: './action-tracker-list.component.html'
})
export class PageInnovationActionTrackerListComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovation: ContextInnovationType;

  openedActionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsTasksListFilterType>;
  closedActionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsTasksListFilterType>;

  innovationSummary: { label: string; value: string; }[] = [];

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  // Flags
  isClosedActionsLoading = false;
  isInnovatorType: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Action tracker');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.innovation = this.stores.context.getInnovation();

    this.openedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      },
      pageSize: 100
    })

    this.closedActionsList = new TableModel({
      visibleColumns: {
        id: { label: 'ID' },
        name: { label: 'Action' },
        createdAt: { label: 'Requested date' },
        status: { label: 'Status', align: 'right' }
      },
      pageSize: 5
    });

    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
  }


  ngOnInit(): void {

    this.openedActionsList.setFilters({
      innovationId: this.innovationId,
      fields: ['notifications'],
      status: [InnovationActionStatusEnum.REQUESTED, InnovationActionStatusEnum.SUBMITTED],
      allTasks: true
    });

    this.closedActionsList.setFilters({
      innovationId: this.innovationId,
      fields: ['notifications'],
      status: [InnovationActionStatusEnum.DECLINED, InnovationActionStatusEnum.COMPLETED, InnovationActionStatusEnum.DELETED, InnovationActionStatusEnum.CANCELLED],
      allTasks: true
    });

    this.innovationsService.getActionsList(this.openedActionsList.getAPIQueryParams()).subscribe((openedActions) => {

      this.openedActionsList.setData(openedActions.data);

      this.setPageStatus('READY');

    });

  }

  onPageChange(event: { pageNumber: number }): void {
    this.closedActionsList.setPage(event.pageNumber);
    this.getClosedActionsList();
  }

  handleClosedActionsTableClick() {
    if (this.closedActionsList.getTotalRowsNumber() !== 0) {
      return;
    }
    this.getClosedActionsList();
  }

  getUserType() {
    return this.stores.authentication.isAccessorType() ? UserRoleEnum.ACCESSOR : this.stores.authentication.getUserType();
  }

  private getClosedActionsList() {

    this.isClosedActionsLoading = true;

    this.innovationsService.getActionsList(this.closedActionsList.getAPIQueryParams()).subscribe(closedActions => {

      this.closedActionsList.setData(closedActions.data, closedActions.count);

      this.isClosedActionsLoading = false;

    });
  }

}
