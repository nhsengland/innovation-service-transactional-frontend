import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationSupportStatusEnum } from '@modules/stores';

import { DateISOType } from '@app/base/types';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'app-accessor-pages-innovations-needing-action',
  templateUrl: './innovations-needing-action.component.html'
})
export class InnovationsNeedingActionComponent extends CoreComponent implements OnInit {
  innovationsNeedingActionList = new TableModel<{
    id: string;
    name: string;
    supportStatus: InnovationSupportStatusEnum;
    dueDate: DateISOType;
    dueDays: number;
  }>({ pageSize: 20 });

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.setPageTitle('Innovations Needing Action');

    this.innovationsNeedingActionList = new TableModel({
      visibleColumns: {
        name: { label: 'Innovation', orderable: true },
        dueDate: { label: 'Due date', orderable: true },
        dueDays: { label: 'Pending action', orderable: false },
        supportStatus: { label: 'Support status', align: 'right', orderable: false }
      },
      orderBy: 'name',
      orderDir: 'ascending'
    });
  }

  ngOnInit(): void {
    this.setPageTitle('Innovations Needing Action');
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(() => {
        this.getInnovationsNeedingActionList();
      })
    );
  }

  getInnovationsNeedingActionList(column?: string): void {
    this.setPageStatus('LOADING');

    const { take, skip, order } = this.innovationsNeedingActionList.getAPIQueryParams();

    this.innovationsService.getInnovationsNeedingActionsList({ take, skip, order }).subscribe(response => {
      this.innovationsNeedingActionList.setData(response.innovations, response.count);

      if (this.isRunningOnBrowser() && column) {
        this.innovationsNeedingActionList.setFocusOnSortedColumnHeader(column);
      }

      this.setPageStatus('READY');
    });
  }

  onTableOrder(column: string): void {
    this.innovationsNeedingActionList.setOrderBy(column);
    this.getInnovationsNeedingActionList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.innovationsNeedingActionList.setPage(event.pageNumber);
    this.getInnovationsNeedingActionList();
  }

  getActionText(dueDays: number, supportStatus: InnovationSupportStatusEnum) {
    if (supportStatus === 'ENGAGING' || supportStatus === 'WAITING') {
      return dueDays < 0 ? 'awaiting update' : 'overdue update';
    }
    if (supportStatus === 'SUGGESTED') {
      return dueDays < 0 ? 'awaiting initial engagement' : 'overdue initial engagement';
    }
    throw new Error('Invalid support status');
  }

  getActionColor(dueDays: number) {
    return dueDays < 0 ? 'WARNING' : 'ERROR';
  }
}
