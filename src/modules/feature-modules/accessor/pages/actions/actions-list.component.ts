import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { AccessorService, getActionsListEndpointOutDTO } from '../../services/accessor.service';

@Component({
  selector: 'app-accessor-pages-actions-actions-list',
  templateUrl: './actions-list.component.html'
})
export class ActionsListComponent extends CoreComponent implements OnInit {

  tabs: { title: string, link: string, queryParams: { openActions: 'true' | 'false' } }[] = [];
  currentTab: { index: number, description: string };

  actionsList: TableModel<getActionsListEndpointOutDTO['data'][0]>;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService
  ) {

    super();

    this.tabs = [
      {
        title: 'Open actions',
        link: '/accessor/actions',
        queryParams: { openActions: 'true' }
      },
      {
        title: 'Closed actions',
        link: '/accessor/actions',
        queryParams: { openActions: 'false' }
      }
    ];

    this.currentTab = { index: 0, description: '' };

    this.actionsList = new TableModel({
      visibleColumns: {
        section: { label: 'Action', orderable: true },
        innovationName: { label: 'Innovation', orderable: true },
        createdAt: { label: 'Initiated', orderable: true },
        status: { label: 'Status', align: 'right', orderable: true }
      },
      pageSize: 10000,
      orderBy: 'createdAt',
      orderDir: 'desc'
    });

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(queryParams => {

        if (!queryParams.openActions) {
          this.router.navigate(['/accessor/actions'], { queryParams: { openActions: 'true' } });
          return;
        }

        this.currentTab.index = this.tabs.findIndex(tab => tab.queryParams.openActions === queryParams.openActions);

        this.actionsList.setData([]).setFilters({ openActions: queryParams.openActions });

        this.getActionsList();

      })
    );

  }


  getActionsList(): void {

    this.accessorService.getActionsList(this.actionsList.getAPIQueryParams()).subscribe(
      response => {
        this.actionsList.setData(response.data, response.count);
        this.currentTab.description = `${response.count} ${this.tabs[this.currentTab.index].title.toLowerCase()} created by you`;
      },
      error => this.logger.error(error)
    );

  }


  onTableOrder(column: string): void {

    this.actionsList.setOrderBy(column);
    this.getActionsList();

  }

}
