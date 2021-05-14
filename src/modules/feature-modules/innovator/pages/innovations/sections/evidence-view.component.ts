import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionsIds } from '@stores-module/innovation/innovation.models';

@Component({
  selector: 'app-innovator-pages-innovations-section-evidence-view',
  templateUrl: './evidence-view.component.html'
})
export class InnovationsSectionEvidenceViewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  sectionId: InnovationSectionsIds;
  evidence: {
    id: string;
    title: string;
  };

  wizard: WizardEngineModel;

  summaryList: { label: string, value: string, editStepNumber?: number, evidenceId?: string }[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

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

    this.stores.innovation.getSectionEvidence$(this.innovationId, this.evidence.id).subscribe(
      response => {
        this.summaryList = this.wizard.runSummaryParsing(response);
        this.evidence.title = this.summaryList[1].value;
      },
      () => {
        this.logger.error('Error fetching data');
      });


  }

  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }

  onDeleteEvidence(): void {
    this.stores.innovation.deleteEvidence$(this.innovationId, this.evidence.id).subscribe(
      () => {
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteSuccess' });
      },
      () => {
        this.logger.error('Error fetching data');
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteError' });
      });

  }

}
