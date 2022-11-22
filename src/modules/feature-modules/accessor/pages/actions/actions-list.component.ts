import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';
import { InnovationActionsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsActionsListFilterType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationActionStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'app-accessor-pages-actions-actions-list',
  templateUrl: './actions-list.component.html'
})
export class ActionsListComponent extends CoreComponent implements OnInit {

  tabs: { key: string, title: string, link: string, queryParams: { openActions: 'true' | 'false' } }[] = [];
  currentTab: { index: number, key: string, contentTitle: string, description: string };

  actionsList: TableModel<InnovationActionsListDTO['data'][0], InnovationsActionsListFilterType>;

  innovationSectionActionStatus = this.stores.innovation.INNOVATION_SECTION_ACTION_STATUS;


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.tabs = [
      {
        key: 'openActions',
        title: 'Open actions',
        link: '/accessor/actions',
        queryParams: { openActions: 'true' }
      },
      {
        key: 'closedActions',
        title: 'Closed actions',
        link: '/accessor/actions',
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

        if (!queryParams.openActions) {
          this.router.navigate(['/accessor/actions'], { queryParams: { openActions: 'true' } });
          return;
        }

        this.currentTab.index = this.tabs.findIndex(tab => tab.queryParams.openActions === queryParams.openActions);
        this.currentTab.key = this.tabs[this.currentTab.index].key;
        this.currentTab.contentTitle = `${this.tabs[this.currentTab.index].title} list`;

        switch (queryParams.openActions) {
          case 'true':
            this.actionsList.clearData().setFilters({
              status: [
                InnovationActionStatusEnum.REQUESTED,
                // InnovationActionStatusEnum.STARTED,
                // InnovationActionStatusEnum.CONTINUE,
                InnovationActionStatusEnum.IN_REVIEW],
              createdByMe: true,
              fields: ['notifications']
            });
            break;

          case 'false':
            this.actionsList.clearData().setFilters({
              status: [InnovationActionStatusEnum.COMPLETED, InnovationActionStatusEnum.DECLINED, InnovationActionStatusEnum.DELETED],
              createdByMe: true,
              fields: ['notifications']
            });
            break;

          default:
            break;
        }

        this.getActionsList();

      })
    );

  }


  getActionsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getActionsList(this.actionsList.getAPIQueryParams()).subscribe(response => {
      this.actionsList.setData(response.data, response.count);
      this.currentTab.description = `${response.count} ${this.tabs[this.currentTab.index].title.toLowerCase()} created by you`;

      this.setPageTitle('Actions');
      this.setPageStatus('READY');
    }

    );

  }

  onTableOrder(column: string): void {

    this.actionsList.setOrderBy(column);
    this.getActionsList();

  }

  onPageChange(event: { pageNumber: number }): void {

    this.actionsList.setPage(event.pageNumber);
    this.getActionsList();

  }

}
