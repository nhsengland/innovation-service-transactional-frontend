import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/types';
import { WizardSummaryType, WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionsIds } from '@modules/stores/innovation/innovation.models';

@Component({
  selector: 'shared-pages-innovation-section-evidence-info',
  templateUrl: './section-evidence-info.component.html'
})
export class PageInnovationSectionEvidenceInfoComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  module: '' | 'innovator' | 'accessor' = '';
  innovationId: string;
  sectionId: InnovationSectionsIds;
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

        this.setPageStatus('READY');
      },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch evidence information',
          message: 'Please try again or contact us for further help'
        };
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
        this.redirectTo(`innovator/innovations/${this.innovationId}/record/sections/${this.sectionId}`, { alert: 'evidenceDeleteError' });
      });

  }

}
