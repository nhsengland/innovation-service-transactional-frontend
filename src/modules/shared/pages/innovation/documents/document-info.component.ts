import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { InnovationDocumentInfoOutDTO, InnovationDocumentsService } from '@modules/shared/services/innovation-documents.service';
import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';


@Component({
  selector: 'shared-pages-innovation-documents-document-info',
  templateUrl: './document-info.component.html'
})
export class PageInnovationDocumentInfoComponent extends CoreComponent implements OnInit {

  innovationId: string;
  documentId: string;
  pageStep: 'INFO' | 'DELETE' = 'INFO';
  baseUrl: string;

  documentInfo: null | (InnovationDocumentInfoOutDTO & { locationLink: null | string }) = null;

  // Flags
  canDelete = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.documentId = this.activatedRoute.snapshot.params.documentId;
    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}`;

  }

  ngOnInit(): void {

    this.gotoInfoPage();

    this.innovationDocumentsService.getDocumentInfo(this.innovationId, this.documentId).subscribe({
      next: response => {

        this.documentInfo = {
          ...response,
          locationLink: response.context.type === 'INNOVATION_SECTION' ? getAllSectionsList().find(item => item.value === response.context.id)?.label ?? '[Archived section]' : null,
        };

        this.canDelete = response.canDelete;

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }

    });

  }

  gotoInfoPage() {

    if (this.stores.context.getPreviousUrl()?.includes('/sections')) {
      this.setBackLink('Go back');
    } else {
      this.setBackLink('Go back', `${this.baseUrl}/documents`);
    }

    this.setPageTitle('Document details');
    this.pageStep = 'INFO';

  }

  gotoDeletePage() {
    this.resetAlert();
    this.setPageTitle('Are you sure you want to delete this document?');
    this.setBackLink('Go back', this.gotoInfoPage.bind(this));
    this.pageStep = 'DELETE';
  }

  onDelete() {

    this.innovationDocumentsService.deleteDocument(this.innovationId, this.documentId).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The document was deleted');
        this.redirectTo(this.stores.context.getPreviousUrl() ?? `${this.baseUrl}/documents`);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });

  }

}
