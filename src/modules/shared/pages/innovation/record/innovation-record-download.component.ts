import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores';

@Component({
  selector: 'shared-pages-innovation-record-download',
  templateUrl: './innovation-record-download.component.html'
})
export class PageInnovationRecordDownloadComponent extends CoreComponent implements OnInit {
  innovationId: string;
  innovation: ContextInnovationType;

  pdfDocumentUrl: string;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.innovation = this.stores.other.innovation();

    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${
      this.innovationId
    }/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;

    this.setPageTitle(`Download ${this.innovation.name} innovation record`);
    this.setBackLink();
  }

  ngOnInit(): void {
    this.setPageStatus('READY');
  }
}
