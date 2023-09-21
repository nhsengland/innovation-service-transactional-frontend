import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService, InnovationsTasksListFilterType } from '@modules/shared/services/innovations.service';
import { InnovationTaskStatusEnum } from '@modules/stores/innovation';

/**
 * TODO: This page will probably be removed, waiting confirmation
 */

@Component({
  selector: 'app-accessor-pages-actions-actions-list',
  templateUrl: './actions-list.component.html'
})
export class ActionsListComponent extends CoreComponent implements OnInit {

  tabs: { key: string, title: string, link: string, queryParams: { openActions: 'true' | 'false' } }[] = [];
  currentTab: { index: number, key: string, contentTitle: string, description: string };

  actionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsTasksListFilterType>;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.tabs = [
      {
        key: 'openActions',
        title: 'Open tasks',
        link: '/accessor/tasks',
        queryParams: { openActions: 'true' }
      },
      {
        key: 'closedActions',
        title: 'Closed tasks',
        link: '/accessor/tasks',
        queryParams: { openActions: 'false' }
      }
    ];

    this.currentTab = { index: 0, key: '', contentTitle: '', description: '' };

    this.actionsList = new TableModel({
      visibleColumns: {
        section: { label: 'Action', orderable: true },
        innovationName: { label: 'Innovation', orderable: true },
        createdAt: { label: 'Initiated', orderable: true },
        status: { label: 'Status', align: 'right', orderable: true }
      },
      orderBy: 'createdAt',
      orderDir: 'descending'
    });

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {

        this.setPageTitle('Tasks');

        if (!queryParams.openActions) {
          this.router.navigate(['/accessor/tasks'], { queryParams: { openActions: 'true' } });
          return;
        }

        this.currentTab.index = this.tabs.findIndex(tab => tab.queryParams.openActions === queryParams.openActions);
        this.currentTab.key = this.tabs[this.currentTab.index].key;
        this.currentTab.contentTitle = `${this.tabs[this.currentTab.index].title} list`;

        switch (queryParams.openActions) {
          case 'true':
            this.actionsList.clearData().setFilters({
              status: [InnovationTaskStatusEnum.OPEN, InnovationTaskStatusEnum.DONE],
              createdByMe: true,
              fields: ['notifications']
            });
            break;

          case 'false':
            this.actionsList.clearData().setFilters({
              status: [InnovationTaskStatusEnum.CANCELLED, InnovationTaskStatusEnum.DECLINED],
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

    this.innovationsService.getTasksList(this.actionsList.getAPIQueryParams()).subscribe(response => {
      this.actionsList.setData(response.data, response.count);
      this.currentTab.description = `${response.count} ${this.tabs[this.currentTab.index].title.toLowerCase()} created by you`;
      if (this.isRunningOnBrowser() && column) this.actionsList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    }

    );
  }

  onTableOrder(column: string): void {

    this.actionsList.setOrderBy(column);
    this.getTasksList(column);

  }

  onPageChange(event: { pageNumber: number }): void {

    this.actionsList.setPage(event.pageNumber);
    this.getTasksList();

  }

}
