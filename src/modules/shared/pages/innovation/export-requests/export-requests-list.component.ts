import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { TableModel } from '@app/base/models';

import { InnovationExportRequestStatusEnum } from '@modules/stores';

import { InnovationExportRequestsListDTO } from '@modules/shared/services/innovations.dtos';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-export-requests-list',
  templateUrl: './export-requests-list.component.html'
})
export class PageInnovationExportRequestsListComponent extends CoreComponent implements OnInit {
  innovationId: string;
  baseUrl: string;
  touUrl: string;

  pendingTable = new TableModel<InnovationExportRequestsListDTO['data'][number]>({
    pageSize: 100,
    visibleColumns: {
      requestedBy: { label: 'Requested by' },
      requestedOn: { label: 'Requested on' },
      status: { label: 'Status' },
      actions: { label: '' }
    }
  });
  historyTable = new TableModel<InnovationExportRequestsListDTO['data'][number]>({
    pageSize: 5,
    visibleColumns: {
      requestedBy: { label: 'Requested by' },
      requestedOn: { label: 'Requested on' },
      status: { label: 'Status' },
      actions: { label: '' }
    }
  }); //.setOrderBy('createdAt', 'descending');

  pageInformation: { title: string; leadText: string; historyTableTitle: string };

  isInnovatorType: boolean;
  isSupportTeamType: boolean;
  isHistoryLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record`;

    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isSupportTeamType =
      this.stores.authentication.isAssessmentType() || this.stores.authentication.isAccessorType();

    this.touUrl = this.isInnovatorType
      ? this.CONSTANTS.URLS.TOU_INNOVATOR
      : this.CONSTANTS.URLS.TOU_SUPPORT_ORGANISATION;

    switch (this.stores.authentication.getUserType()) {
      case UserRoleEnum.ASSESSMENT:
        this.pageInformation = {
          title: 'Request permission to use the data in this innovation record',
          leadText: `If you want to use the innovation record for any other purpose not listed in our <a href="${this.touUrl}" target="_blank" rel="noopener noreferrer" class="nhsuk-link nhsuk-link--no-visited-state">terms of use (opens in a new window)</a>, you need to request the innovator's permission.`,
          historyTableTitle: 'Requests made by needs assessment team'
        };
        break;
      case UserRoleEnum.QUALIFYING_ACCESSOR:
      case UserRoleEnum.ACCESSOR:
        this.pageInformation = {
          title: 'Request permission to use the data in this innovation record',
          leadText: `If you want to use the innovation record for any other purpose not listed in our <a href="${this.touUrl}" target="_blank" rel="noopener noreferrer" class="nhsuk-link nhsuk-link--no-visited-state">terms of use (opens in a new window)</a>, you need to request the innovator's permission.`,
          historyTableTitle: 'Requests made by your organisation'
        };
        break;
      case UserRoleEnum.INNOVATOR:
        this.pageInformation = {
          title: 'Requests to use the data in your innovation record',
          leadText: `If an organisation wants to use the data in your innovation record for anything outside of our <a href="${this.touUrl}" target="_blank" rel="noopener noreferrer" class="nhsuk-link nhsuk-link--no-visited-state">terms of use (opens in a new window)</a>, they need to request your permission.`,
          historyTableTitle: 'Previous requests'
        };
        break;
      default:
        this.pageInformation = { title: '', leadText: '', historyTableTitle: '' };
        break;
    }
  }

  ngOnInit(): void {
    this.setPageTitle(this.pageInformation.title);
    this.setBackLink('Innovation Record', this.baseUrl);

    if (this.isInnovatorType) {
      const queryParams = { ...this.pendingTable.getAPIQueryParams() };
      queryParams.filters = { statuses: [InnovationExportRequestStatusEnum.PENDING] };

      this.innovationsService.getExportRequestsList(this.innovationId, queryParams).subscribe(response => {
        this.pendingTable.setData(response.data, response.data.length);
      });
    }

    this.exportRequestsHistoryList();
  }

  private exportRequestsHistoryList() {
    this.isHistoryLoading = true;

    const queryParams = { ...this.historyTable.getAPIQueryParams() };

    if (this.stores.authentication.isInnovatorType()) {
      queryParams.filters = {
        statuses: [
          InnovationExportRequestStatusEnum.APPROVED,
          InnovationExportRequestStatusEnum.REJECTED,
          InnovationExportRequestStatusEnum.CANCELLED
        ]
      };
    }

    this.innovationsService.getExportRequestsList(this.innovationId, queryParams).subscribe(response => {
      this.historyTable.setData(response.data, response.count);

      this.isHistoryLoading = false;
      this.setPageStatus('READY');
    });
  }

  onPageChange(event: { pageNumber: number }): void {
    this.historyTable.setPage(event.pageNumber);
    this.exportRequestsHistoryList();
  }
}
