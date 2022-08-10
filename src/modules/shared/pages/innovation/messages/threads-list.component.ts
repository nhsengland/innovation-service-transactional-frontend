import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { EnvironmentInnovationType } from '@modules/stores/environment/environment.types';

import { GetThreadsListDTO, InnovationsService } from '@modules/shared/services/innovations.service';


@Component({
  selector: 'shared-pages-innovation-messages-threads-list',
  templateUrl: './threads-list.component.html'
})
export class PageInnovationThreadsListComponent extends CoreComponent implements OnInit {

  selfUser: { id: string, urlBasePath: string };
  innovation: EnvironmentInnovationType;
  tableList = new TableModel<GetThreadsListDTO['threads'][0]>();

  isInnovator(): boolean { return this.stores.authentication.isInnovatorType(); }
  isNotInnovator(): boolean { return !this.stores.authentication.isInnovatorType(); }
  isAccessor(): boolean { return this.stores.authentication.isAccessorType(); }
  isInnovationSubmitted(): boolean { return this.innovation.status !== 'CREATED'; }


  constructor(
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Messages');

    this.selfUser = {
      id: this.stores.authentication.getUserId(),
      urlBasePath: this.stores.authentication.userUrlBasePath()
    };

    this.innovation = this.stores.environment.getInnovation();

    // switch (this.activatedRoute.snapshot.queryParams.alert) {
    //   case 'commentCreationSuccess':
    //     this.alert = {
    //       type: 'SUCCESS',
    //       title: 'You have successfully created a comment',
    //       message: 'Everyone who is currently engaging with your innovation will be notified.'
    //     };
    //     break;
    //   case 'commentEditSuccess':
    //     this.alert = {
    //       type: 'SUCCESS',
    //       title: 'You have successfully updated a comment',
    //       message: 'Everyone who is currently engaging with your innovation will be notified.'
    //     };
    //     break;
    //   default:
    //     break;
    // }

  }




  ngOnInit(): void {

    this.tableList.setVisibleColumns({
      subject: { label: 'Subject', orderable: false },
      repliesNumber: { label: 'Nº messages', orderable: true },
      createdAt: { label: 'Received at', align: 'right', orderable: true }
    }).setOrderBy('createdAt', 'descending');

    this.getThreadsList();

  }

  getThreadsList(): void {

    this.setPageStatus('LOADING');

    this.innovationsService.getThreadsList(this.innovation.id, this.tableList.getAPIQueryParams()).subscribe(
      response => {
        this.tableList.setData(response.threads, response.count);
        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.setAlertDataLoadError();
      });
  }


  onTableOrder(column: string): void {
    this.tableList.setOrderBy(column);
    this.getThreadsList();
  }

  onPageChange(event: { pageNumber: number }): void {
    this.tableList.setPage(event.pageNumber);
    this.getThreadsList();
  }

}
