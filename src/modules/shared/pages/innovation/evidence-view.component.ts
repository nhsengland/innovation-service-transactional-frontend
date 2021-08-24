import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { SummaryParsingType, WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionsIds } from '@stores-module/innovation/innovation.models';

@Component({
  selector: 'shared-pages-innovation-section-evidence-view',
  templateUrl: './evidence-view.component.html'
})
export class InnovationSectionEvidenceViewComponent extends CoreComponent implements OnInit {

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  sectionId: InnovationSectionsIds;
  evidence: {
    id: string;
    title: string;
  };

  wizard: WizardEngineModel;

  summaryList: SummaryParsingType[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();
    this.setPageTitle('Evidence details');

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

    this.stores.innovation.getSectionEvidence$(this.module, this.innovationId, this.evidence.id).subscribe(
      response => {
        this.summaryList = this.wizard.runSummaryParsing(response);
        this.evidence.title = this.summaryList[1].value || '';
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
