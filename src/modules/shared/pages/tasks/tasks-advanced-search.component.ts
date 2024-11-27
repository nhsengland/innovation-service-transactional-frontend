import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationTasksListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService, InnovationsTasksListFilterType } from '@modules/shared/services/innovations.service';
import { InnovationTaskStatusEnum } from '@modules/stores';
import { FiltersModel } from '@modules/core/models/filters/filters.model';
import { getConfig } from './task-advanced-search.config';

@Component({
  selector: 'shared-pages-tasks-advanced-search',
  templateUrl: './tasks-advanced-search.component.html'
})
export class PageTasksAdvancedSearchComponent extends CoreComponent implements OnInit {
  tasksList = new TableModel<InnovationTasksListDTO['data'][0], InnovationsTasksListFilterType>({});

  filtersModel!: FiltersModel;
  form!: FormGroup;

  constructor(private innovationsService: InnovationsService) {
    super();

    this.setPageTitle('Tasks');

    this.tasksList
      .setVisibleColumns({
        section: { label: 'Tasks', orderable: true },
        innovationName: { label: 'Innovations', orderable: true },
        updatedAt: { label: 'Updated', orderable: true },
        status: { label: 'Status', align: 'right', orderable: true }
      })
      .setOrderBy('updatedAt', 'descending');
  }

  ngOnInit(): void {
    const userType = this.stores.authentication.state.userContext?.type;
    if (!userType) {
      return;
    }

    const { filters, datasets } = getConfig(userType, this.ctx.schema.irSchemaInfo());

    datasets.status = [
      InnovationTaskStatusEnum.OPEN,
      InnovationTaskStatusEnum.DONE,
      InnovationTaskStatusEnum.CANCELLED,
      InnovationTaskStatusEnum.DECLINED
    ].map(status => ({ label: this.translate(`shared.catalog.innovation.task_status.${status}.name`), value: status }));

    this.filtersModel = new FiltersModel({ filters, datasets });
    this.form = this.filtersModel.form;

    this.subscriptions.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(() => this.onFormChange()));

    this.onFormChange();
  }

  getTasksList(column?: string): void {
    this.setPageStatus('LOADING');

    this.innovationsService.getTasksList(this.tasksList.getAPIQueryParams()).subscribe(response => {
      this.tasksList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.tasksList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });
  }

  onFormChange(): void {
    this.setPageStatus('LOADING');

    this.filtersModel.handleStateChanges();
    this.tasksList.setFilters({ ...this.filtersModel.getAPIQueryParams(), fields: ['notifications'] });

    this.tasksList.setPage(1);
    this.getTasksList();
  }

  onTableOrder(column: string): void {
    this.tasksList.setOrderBy(column);
    this.getTasksList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tasksList.setPage(event.pageNumber);
    this.getTasksList();
  }

  onSearchClick() {
    this.form.updateValueAndValidity({ onlySelf: true });
  }
}
