import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardEngineModel, WizardSummaryType } from '@modules/shared/forms';

import { InnovationSectionEnum } from '@modules/stores/innovation';

@Component({
  selector: 'shared-pages-innovation-section-evidence-info',
  templateUrl: './section-evidence-info.component.html'
})
export class PageInnovationSectionEvidenceInfoComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  sectionId: InnovationSectionEnum;
  evidence: {
    id: string;
    title: string;
  };

  wizard: WizardEngineModel;

  summaryList: WizardSummaryType[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.module = this.activatedRoute.snapshot.data.module;
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;

    const evidence = this.stores.innovation.getSection(this.activatedRoute.snapshot.params.sectionId)?.evidences;
    this.evidence = {
      id: this.activatedRoute.snapshot.params.evidenceId,
      title: ''
    };

    this.wizard = evidence || new WizardEngineModel({});

    this.summaryList = [];

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionEvidence$(this.innovationId, this.evidence.id).subscribe(response => {

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
    // TODO HERE
    this.stores.innovation.deleteEvidence$(this.innovationId, this.evidence.id).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('Your evidence has been deleted');
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteSuccess' });
      },
      error: () => {
        this.setAlertError('An error occurred when deleting your evidence. Please try again or contact us for further help.');
        // this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteError' });
      }
    });

  }

}
