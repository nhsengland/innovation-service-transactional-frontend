import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { WizardEngineModel } from '@modules/shared/forms';

import { InnovationSectionsIds, INNOVATION_SECTION_STATUS } from '@stores-module/innovation/innovation.models';

// import { SectionsSummaryModel } from '@stores-module/innovation/innovation.models';


@Component({
  selector: 'app-innovator-pages-innovations-section-view',
  templateUrl: './section-view.component.html'
})
export class InnovationsSectionViewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  section: {
    id: InnovationSectionsIds;
    title: string;
    status: keyof typeof INNOVATION_SECTION_STATUS;
    editButtonLabel: string;
  };

  wizard: WizardEngineModel;

  summaryList: { label: string, value: string, stepNumber: number }[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.section = {
      id: this.activatedRoute.snapshot.params.sectionId,
      title: this.stores.innovation.getSectionTitle(this.activatedRoute.snapshot.params.sectionId),
      status: 'UNKNOWN',
      editButtonLabel: 'Start now'
    };

    this.wizard = this.stores.innovation.getSectionWizard(this.section.id);

    this.summaryList = [];

  }


  ngOnInit(): void {

    this.stores.innovation.getSectionInfo$(this.innovationId, this.section.id).subscribe(
      response => {
        this.summaryList = this.wizard.runSummaryParsing(response.data);
        this.section.status = response.section.status;
        this.section.editButtonLabel = ['NOT_STARTED', 'UNKNOWN'].includes(this.section.status) ? 'Start now' : 'Edit section';
        console.log(response, this.summaryList);
      },
      () => {
        this.logger.error('Error fetching data');
      });


  }

  getEditUrl(stepNumber: number): string {
    return `edit/${stepNumber}`;
  }

}
