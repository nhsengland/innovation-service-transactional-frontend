import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { InnovationTasksListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService, InnovationsTasksListFilterType } from '@modules/shared/services/innovations.service';
import { InnovationTaskStatusEnum } from '@modules/stores';

@Component({
  selector: 'app-accessor-pages-tasks-tasks-list',
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent extends CoreComponent implements OnInit {
  tabs: { key: string; title: string; link: string; queryParams: { openTasks: 'true' | 'false' } }[] = [];
  currentTab: { index: number; key: string; contentTitle: string; description: string };

  tasksList: TableModel<InnovationTasksListDTO['data'][0], InnovationsTasksListFilterType>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.tabs = [
      {
        key: 'openTasks',
        title: 'Open tasks',
        link: '/accessor/tasks',
        queryParams: { openTasks: 'true' }
      },
      {
        key: 'closedTasks',
        title: 'Closed tasks',
        link: '/accessor/tasks',
        queryParams: { openTasks: 'false' }
      }
    ];

    this.currentTab = { index: 0, key: '', contentTitle: '', description: '' };

    this.tasksList = new TableModel({
      visibleColumns: {
        section: { label: 'Tasks', orderable: true },
        innovationName: { label: 'Innovation', orderable: true },
        createdAt: { label: 'Initiated', orderable: true },
        status: { label: 'Status', align: 'right', orderable: true }
      },
      orderBy: 'createdAt',
      orderDir: 'descending'
    });
  }

  ngOnInit(): void {
    this.setPageTitle('Tasks');
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        if (!queryParams.openTasks) {
          this.router.navigate(['/accessor/tasks'], { queryParams: { openTasks: 'true' } });
          return;
        }

        this.currentTab.index = this.tabs.findIndex(tab => tab.queryParams.openTasks === queryParams.openTasks);
        this.currentTab.key = this.tabs[this.currentTab.index].key;
        this.currentTab.contentTitle = `${this.tabs[this.currentTab.index].title} list`;

        switch (queryParams.openTasks) {
          case 'true':
            this.tasksList.clearData().setFilters({
              status: [InnovationTaskStatusEnum.OPEN],
              createdByMe: true,
              fields: ['notifications']
            });
            break;

          case 'false':
            this.tasksList.clearData().setFilters({
              status: [
                InnovationTaskStatusEnum.DONE,
                InnovationTaskStatusEnum.DECLINED,
                InnovationTaskStatusEnum.CANCELLED
              ],
              createdByMe: true,
              fields: ['notifications']
            });
            break;

          default:
            break;
        }

        this.getTasksList();
      })
    );
  }

  getTasksList(column?: string): void {
    this.setPageStatus('LOADING');
    this.innovationsService.getTasksList(this.tasksList.getAPIQueryParams()).subscribe(response => {
      this.tasksList.setData(response.data, response.count);
      this.currentTab.description = `${response.count} ${this.tabs[
        this.currentTab.index
      ].title.toLowerCase()} assigned by you`;
      if (this.isRunningOnBrowser() && column) this.tasksList.setFocusOnSortedColumnHeader(column);
      this.setPageTitle('Tasks');
      this.setPageStatus('READY');
    });
  }

  onTableOrder(column: string): void {
    this.tasksList.setOrderBy(column);
    this.getTasksList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tasksList.setPage(event.pageNumber);
    this.getTasksList();
  }
}
