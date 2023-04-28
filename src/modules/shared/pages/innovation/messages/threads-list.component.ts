import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { ContextInnovationType } from '@modules/stores/context/context.types';

import { GetThreadsListDTO, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationStatusEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-messages-threads-list',
  templateUrl: './threads-list.component.html'
})
export class PageInnovationThreadsListComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, organisationUnitId?: string };
  innovation: ContextInnovationType;
  tableList = new TableModel<GetThreadsListDTO['threads'][0]>({ pageSize: 10 });

  // Flags
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAdmin: boolean;
  isInnovationSubmitted: boolean;

  constructor(
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Messages');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      organisationUnitId: this.stores.authentication.getUserContextInfo()?.organisationUnit?.id
    };

    this.innovation = this.stores.context.getInnovation();


    // Flags
    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovationSubmitted = this.innovation.status !== InnovationStatusEnum.CREATED;

    if (this.isAdmin) {
      this.setPageTitle('Messages', { hint: `Innovation ${this.innovation.name}` })
    }

  }


  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      subject: { label: 'Subject', orderable: true },
      messageCount: { label: 'Nº messages', orderable: true },
      createdAt: { label: 'Latest received', align: 'right', orderable: true }
    }).setOrderBy('createdAt', 'descending');

    this.getThreadsList();

  }

  getThreadsList(column?: string): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getThreadsList(this.innovation.id, this.tableList.getAPIQueryParams()).subscribe(response => {
      this.tableList.setData(response.threads, response.count);
      if (this.isRunningOnBrowser() && column) this.tableList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });

  }


  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getThreadsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
    this.getThreadsList();
  }

}
