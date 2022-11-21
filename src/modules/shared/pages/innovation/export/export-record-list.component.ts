import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserTypeEnum } from '@app/base/enums';
import { TableModel } from '@app/base/models';
import { InnovationExportRequestItemType, InnovationsService } from '@modules/shared/services/innovations.service';
import { InnovationExportRequestStatusEnum } from '@modules/stores/innovation/innovation.enums';

@Component({
  selector: 'shared-pages-innovation-export-record-list',
  templateUrl: './export-record-list.component.html'
})
export class PageExportRecordListComponent extends CoreComponent implements OnInit {

  innovationId: string;

  validRequestTable = new TableModel<InnovationExportRequestItemType>();
  historyRequestTable = new TableModel<InnovationExportRequestItemType>({ pageSize: 1000 });

  pageInformation: { [key: string]: { title: string, lead: string, secondaryTitle: string } } = {
    [UserTypeEnum.INNOVATOR]: {
      title: 'Innovation record export requests',
      lead: 'View requests from organisations to download and share PDF versions of your innovation record.',
      secondaryTitle: 'New requests'
    },
    [UserTypeEnum.ACCESSOR]: {
      title: 'Export innovation record',
      lead: 'You need to request permission from the innovator to download and share their innovation record in PDF format.',
      secondaryTitle: 'Innovation record export requests'
    },
  };

  userType: UserTypeEnum.ACCESSOR | UserTypeEnum.INNOVATOR = this.stores.authentication.isAccessorType() ? UserTypeEnum.ACCESSOR : UserTypeEnum.INNOVATOR;

  private tableConfigs = {
    "DEFAULT": {
      requestedBy: { label: 'Requested by' },
      lastUpdate: { label: 'Last update' },
      status: { label: 'Request status' },
      actions: { label: '' }
    },
    "VALID_INNOVATOR": {
      requestedBy: { label: 'Requested by' },
      requestedOn: { label: 'Requested on' },
      actions: { label: '' }
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    const validRequestsTable = this.userType === 'ACCESSOR' ? this.tableConfigs.DEFAULT : this.tableConfigs.VALID_INNOVATOR;

    this.validRequestTable.setVisibleColumns(validRequestsTable).setOrderBy('createdAt', 'descending');
    this.historyRequestTable.setVisibleColumns(this.tableConfigs.DEFAULT).setOrderBy('createdAt', 'descending');

  }

  ngOnInit(): void {

    this.setPageTitle(this.pageInformation[this.userType]?.title, { width: '2.thirds' });

    const url = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record`;
    this.setBackLink('Innovation Record', url);

    this.getExportRecordList();

  }

  getExportRecordList() {

    this.setPageStatus('LOADING');

    this.innovationsService.getExportRequestsList(this.innovationId, { take: 1000, skip: 0 }).subscribe(response => {

      // TODO: in future this will be two different calls to the endpont 
      const [currents, history] = this.getTableInfo(response.data);

      this.validRequestTable.setData(currents, currents.length);
      this.historyRequestTable.setData(history, history.length);

      this.setPageStatus('READY');

    }

    );
  }

  updateExportRequestStatus(requestId: string, status: keyof typeof InnovationExportRequestStatusEnum) {

    this.innovationsService.updateExportRequestStatus(this.innovationId, requestId, { status }).subscribe(response => {

      if (response.id) {
        this.getExportRecordList();
      }

    }

    );

  }

  requestAgainRedirect() {

    if (this.userType !== 'ACCESSOR') {
      return;
    }

    this.redirectTo(`/accessor/innovations/${this.innovationId}/export/request`);
  }

  private getTableInfo(list: InnovationExportRequestItemType[]) {

    if (this.userType === 'ACCESSOR') {
      return this.getAccessorTables(list);
    }

    // Default is Innovator
    return this.getInnovationTables(list);
    
  }

  private getAccessorTables(exportList: (InnovationExportRequestItemType)[]) {

    const [latest, ...history] = exportList;

    if (latest) {
      return [[latest], history];
    }

    return [[], history];

  }

  private getInnovationTables(exportList: (InnovationExportRequestItemType)[]) {

    const latests = exportList.filter((item) => item.status === InnovationExportRequestStatusEnum.PENDING);
    const history = exportList.filter((item) => item.status !== InnovationExportRequestStatusEnum.PENDING);

    return [latests, history];
  }

  redirectSeeDetails(requestId: string) {
    
    this.redirectTo(`/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/export/${requestId}`)
    
  }

}
