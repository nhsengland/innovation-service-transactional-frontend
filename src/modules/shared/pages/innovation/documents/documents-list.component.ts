import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { InnovationDocumentsListFiltersType, InnovationDocumentsListOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';


@Component({
  selector: 'shared-pages-innovation-documents-documents-list',
  templateUrl: './documents-list.component.html'
})
export class PageInnovationDocumentsListComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  tableList = new TableModel<InnovationDocumentsListOutDTO['data'][number], InnovationDocumentsListFiltersType>({ pageSize: 10 });

  // Flags
  isAdmin: boolean;
  isInnovatorType: boolean;

  constructor(
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();
    this.setPageTitle('Documents');

    this.innovation = this.stores.context.getInnovation();

    this.isAdmin = this.stores.authentication.isAdminRole();
    this.isInnovatorType = this.stores.authentication.isInnovatorType();

    if (this.isAdmin) {
      this.setPageTitle('Documents', { hint: `Innovation ${this.innovation.name}` })
    }

  }


  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      name: { label: 'Name', orderable: true },
      createdAt: { label: 'Uploaded', orderable: true },
      contextType: { label: 'Location', orderable: true },
      actions: { label: '', align: 'right'}
    }).setOrderBy('createdAt', 'descending');

    this.getDocumentsList();

  }

  getDocumentsList(column?: string): void {

    this.setPageStatus('LOADING');

    this.innovationDocumentsService.getDocumentList(this.innovation.id, this.tableList.getAPIQueryParams()).subscribe(response => {
      this.tableList.setData(response.data, response.count);
      if (this.isRunningOnBrowser() && column) this.tableList.setFocusOnSortedColumnHeader(column);
      this.setPageStatus('READY');
    });

  }


  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getDocumentsList(column);
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
    this.getDocumentsList();
  }

}
