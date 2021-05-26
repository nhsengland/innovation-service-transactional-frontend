import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { INNOVATION_STATUS, SectionsSummaryModel } from '@stores-module/innovation/innovation.models';

@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovationStatus: keyof typeof INNOVATION_STATUS | null = null;
  innovationSections: SectionsSummaryModel[] = [];

  sections: {
    progressBar: boolean[];
    submitted: number;
    draft: number;
    notStarted: number;
  } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0 };


  isInAssessmentStatus(): boolean {
    return ['WAITING_NEEDS_ASSESSMENT', 'NEEDS_ASSESSMENT'].includes(this.innovationStatus as string);
  }


  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
  }


  ngOnInit(): void {

    this.stores.innovation.getSectionsSummary$(this.innovationId).subscribe(
      response => {
        this.innovationStatus = response.innovation.status;
        this.innovationSections = response.sections;

        this.sections.progressBar = this.innovationSections.reduce((acc: boolean[], item) => {
          return [...acc, ...item.sections.map(section => section.isCompleted)];
        }, []).sort().reverse();


        this.sections.notStarted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length, 0);
        this.sections.draft = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length, 0);
        this.sections.submitted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length, 0);

      },
      error => {
        this.logger.error(error);
      }
    );

  }

}
