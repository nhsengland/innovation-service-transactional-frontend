import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';
import { WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionEnum } from '@modules/stores/innovation';


@Component({
  selector: 'shared-pages-innovation-section-evidence-info',
  templateUrl: './section-evidence-info.component.html'
})
export class PageInnovationSectionEvidenceInfoComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType;
  sectionId: InnovationSectionEnum;
  evidence: { id: string, title: string };

  wizard: WizardEngineModel;

  summaryList: WizardSummaryType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovation = this.stores.context.getInnovation();
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.evidence = { id: this.activatedRoute.snapshot.params.evidenceId, title: '' };

    const evidence = this.stores.innovation.getSection(this.activatedRoute.snapshot.params.sectionId)?.evidences;
    this.wizard = evidence || new WizardEngineModel({});

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionEvidence$(this.innovation.id, this.evidence.id).subscribe(response => {

      this.summaryList = this.wizard.runSummaryParsing(response);
      this.evidence.title = this.summaryList[1].value || '';

      this.setPageTitle(this.evidence.title);
      this.setPageStatus('READY');

    });

  }

  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }

  onDeleteEvidence(): void {
    this.stores.innovation.deleteEvidence$(this.innovation.id, this.evidence.id).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your evidence has been deleted');
        this.redirectTo(`innovator/innovations/${this.innovation.id}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteSuccess' });
      },
      error: () => {
        this.setAlertError('An error occurred when deleting your evidence. Please try again or contact us for further help.');
        // this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteError' });
      }
    });

  }

}
