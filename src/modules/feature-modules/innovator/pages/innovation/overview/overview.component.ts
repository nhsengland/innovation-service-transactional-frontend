import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { INNOVATION_STATUS, SectionsSummaryModel } from '@stores-module/innovation/innovation.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovationStatus: keyof typeof INNOVATION_STATUS = '';
  innovationSections: SectionsSummaryModel[] = [];
  actionSummary: {requested: number, review: number} = { requested: 0, review: 0};
  supportStatus = 'AWAITING SUPPORT';
  supportingAccessors: { id: string; name: string, unit: string }[] = [];
  submittedAt: string | undefined;
  needsAssessmentCompleted: boolean;

  sections: {
    progressBar: boolean[];
    submitted: number;
    draft: number;
    notStarted: number;
  } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0 };


  isInAssessmentStatus(): boolean {
    return this.stores.innovation.isAssessmentStatus(this.innovationStatus);
  }

  allSectionsSubmitted(): boolean {
    return this.sections.submitted === this.sections.progressBar.length;
  }

  isSubmittedForAssessment(): boolean {
    return this.submittedAt !== undefined;
  }

  allStepsComplete(): boolean {
    return this.allSectionsSubmitted() && this.isSubmittedForAssessment();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService,
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.needsAssessmentCompleted = false;
  }


  showNeedsAssessmentCompleteCard(): boolean {
    return !this.isInAssessmentStatus() && this.innovationStatus !== 'CREATED';
  }

  ngOnInit(): void {


    forkJoin([
      this.innovatorService.getInnovationInfo(this.innovationId),
      this.stores.innovation.getSectionsSummary$('innovator', this.innovationId),
      this.innovatorService.getInnovationSupports(this.innovationId),
    ]).subscribe(
      ([innovationInfo, sectionSummary, innovationSupports]) => {
        this.submittedAt = innovationInfo.submittedAt || '';
        this.needsAssessmentCompleted = !this.isInAssessmentStatus();

        this.parseActionSummary(innovationInfo);
        this.parseSectionSummary(sectionSummary);
        this.supportStatus = innovationSupports.find(s => s.status === 'ENGAGING')?.status || 'AWAITING SUPPORT';
        if (this.supportStatus === 'ENGAGING') {
          this.supportingAccessors = innovationSupports
          .filter(support => support.status === 'ENGAGING')
          .flatMap(s => s.accessors
            .map(a => ({
            ...a,
            unit: s.organisationUnit.name,
          })));
        }
      },
      (error) => {
        this.logger.error(error);
      }
    );
  }

  private parseActionSummary(innovationInfo: any): void {
    this.actionSummary = {
      requested: innovationInfo?.actions?.requestedCount || 0,
      review: innovationInfo?.actions?.inReviewCount || 0
    };
  }

  private parseSectionSummary(sectionSummary: any): void {
    this.innovationStatus = sectionSummary.innovation.status;
    this.innovationSections = sectionSummary.sections;

    this.sections.progressBar = this.innovationSections.reduce((acc: boolean[], item) => {
      return [...acc, ...item.sections.map(s => s.isCompleted)];
    }, []).sort().reverse();

    this.sections.notStarted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length, 0);
    this.sections.draft = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length, 0);
    this.sections.submitted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length, 0);
  }

}
