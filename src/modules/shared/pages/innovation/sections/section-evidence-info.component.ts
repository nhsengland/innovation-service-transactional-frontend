import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';
import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';
import {
  InnovationDocumentsListOutDTO,
  InnovationDocumentsService
} from '@modules/shared/services/innovation-documents.service';

@Component({
  selector: 'shared-pages-innovation-section-evidence-info',
  templateUrl: './section-evidence-info.component.html'
})
export class PageInnovationSectionEvidenceInfoComponent extends CoreComponent implements OnInit {
  innovation: ContextInnovationType;
  sectionId: string;
  evidenceId: string;
  baseUrl: string;

  wizard: WizardEngineModel;

  summaryList: WizardSummaryType[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationDocumentsService: InnovationDocumentsService
  ) {
    super();

    this.innovation = this.ctx.innovation.info();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.evidenceId = this.activatedRoute.snapshot.params.evidenceId;
    this.baseUrl = `${this.ctx.user.userUrlBasePath()}/innovations/${this.innovation.id}`;

    this.wizard =
      this.ctx.innovation.getInnovationRecordSectionEvidencesWizard(this.sectionId) ?? new WizardEngineModel({});

    // Protection from direct url access.
    if (this.wizard.steps.length === 0) {
      this.redirectTo(`${this.baseUrl}/record/sections/${this.sectionId}`);
    }
  }

  ngOnInit(): void {
    forkJoin([
      this.ctx.innovation.getSectionEvidence$(this.innovation.id, this.evidenceId),
      this.innovationDocumentsService.getDocumentList(this.innovation.id, {
        skip: 0,
        take: 50,
        order: { createdAt: 'ASC' },
        filters: { contextTypes: ['INNOVATION_EVIDENCE'], contextId: this.evidenceId, fields: ['description'] }
      })
    ]).subscribe(([evidenceInfo, documents]) => {
      this.summaryList = this.wizard.runSummaryParsing(evidenceInfo);
      this.documentsList = documents.data;

      this.setPageTitle(this.summaryList[1].value ?? '');
      this.setPageStatus('READY');
    });
  }

  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }

  onDeleteEvidence(): void {
    this.ctx.innovation.deleteEvidence$(this.innovation.id, this.evidenceId).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your evidence has been deleted');
        this.redirectTo(`innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`, {
          alert: 'evidenceDeleteSuccess'
        });
      },
      error: () => {
        this.setAlertError(
          'An error occurred when deleting your evidence. Please try again or contact us for further help'
        );
      }
    });
  }
}
