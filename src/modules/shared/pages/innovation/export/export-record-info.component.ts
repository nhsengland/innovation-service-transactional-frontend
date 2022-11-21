import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserTypeEnum } from '@app/base/enums';
import { InnovationExportRequestItemType, InnovationsService } from '@modules/shared/services/innovations.service';
import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationExportRequestStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'shared-pages-innovation-export-record-info',
  templateUrl: './export-record-info.component.html'
})
export class PageExportRecordInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  requestId: string;
  request?: InnovationExportRequestItemType;

  innovationExport: ContextInnovationType['export'];

  userType: UserTypeEnum.ACCESSOR | UserTypeEnum.INNOVATOR = this.stores.authentication.isAccessorType() ? UserTypeEnum.ACCESSOR : UserTypeEnum.INNOVATOR;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.requestId = this.activatedRoute.snapshot.params.requestId;
    this.innovationExport = this.stores.context.getInnovation().export;

  }

  ngOnInit(): void {

    this.setPageTitle("Innovation record export request", { width: '2.thirds', size: 'l' });

    const url = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/export/list`;
    this.setBackLink('Go Back', url);

    this.getRequestInfo();

  }

  getRequestInfo() {

    this.setPageStatus('LOADING');

    this.innovationsService.getExportRequestInfo(this.innovationId, this.requestId).subscribe(response => {

      console.log(response);
      this.request = response;

      this.setPageStatus('READY');

    }

    );
  }

  updateExportRequestStatus(status: keyof typeof InnovationExportRequestStatusEnum) {

    this.innovationsService.updateExportRequestStatus(this.innovationId, this.requestId, { status }).subscribe(response => {

      if (response.id) {
        this.redirectTo(`/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/export/list`)
      }

    }

    );

  }

  rejectRequestRedirect() {

    this.redirectTo(`/innovator/innovations/${this.innovationId}/export/${this.request?.id}/reject`);
    
  }

  requestAgainRedirect() {

    if (this.userType !== 'ACCESSOR') {
      return;
    }

    this.redirectTo(`/accessor/innovations/${this.innovationId}/export/request`);
  }

}
