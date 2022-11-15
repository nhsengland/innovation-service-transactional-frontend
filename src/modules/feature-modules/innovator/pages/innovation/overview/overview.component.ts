import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { InnovationsService } from '@modules/shared/services/innovations.service';

import { NotificationContextTypeEnum } from '@modules/stores/context/context.enums';
import { INNOVATION_STATUS, SectionsSummaryModel } from '@modules/stores/innovation/innovation.models';


type ProgressBarType = '1:active' | '2:warning' | '3:inactive';

@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  innovationId: string;
  innovationStatus: keyof typeof INNOVATION_STATUS = '';
  innovationSections: SectionsSummaryModel[] = [];
  // actionSummary: { requested: number, review: number } = { requested: 0, review: 0 };
  supportStatus = 'Awaiting support';
  supportingAccessors: { id: string; name: string, unit: string }[] = [];
  submittedAt: string | undefined;
  needsAssessmentCompleted: boolean;

  assessmentId: string | undefined;
  lastEndSupportAt: null | string = null;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  innovationStatusObj = this.stores.innovation.INNOVATION_STATUS;

  sections: {
    progressBar: ProgressBarType[];
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
    return this.submittedAt !== '';
  }

  allStepsComplete(): boolean {
    return this.allSectionsSubmitted() && this.isSubmittedForAssessment();
  }

  showNeedsAssessmentCompleteCard(): boolean {
    return !this.isInAssessmentStatus() && this.innovationStatus !== 'CREATED';
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovationsService: InnovationsService
  ) {

    super();
    this.setPageTitle('Innovation overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.needsAssessmentCompleted = false;

  }


  ngOnInit(): void {

    forkJoin([
      this.innovationsService.getInnovationInfo(this.innovationId),
      this.stores.innovation.getSectionsSummary$(this.innovationId),
      this.innovationsService.getInnovationSupportsList(this.innovationId, true),
    ]).subscribe(([innovationInfo, sectionSummary, innovationSupportsList]) => {

      this.stores.context.dismissNotification(NotificationContextTypeEnum.INNOVATION, this.innovationId);

      this.lastEndSupportAt = innovationInfo.lastEndSupportAt;

      if (innovationSupportsList.length === 1) {
        this.stores.context.dismissNotification(NotificationContextTypeEnum.SUPPORT, innovationSupportsList[0].id);
      }

      this.submittedAt = innovationInfo.submittedAt || '';
      this.needsAssessmentCompleted = !this.isInAssessmentStatus();
      this.assessmentId = innovationInfo.assessment?.id;

      // this.actionSummary = {
      //   requested: innovationInfo.actions.requestedCount,
      //   review: innovationInfo.actions.inReviewCount
      // };

      this.innovationStatus = sectionSummary.innovation.status;
      this.innovationSections = sectionSummary.sections;

      this.sections.progressBar = this.innovationSections.reduce((acc: ProgressBarType[], item) => {
        return [...acc, ...item.sections.map(s => {
          switch (s.status) {
            case 'SUBMITTED': return '1:active';
            case 'DRAFT': return '2:warning';
            case 'NOT_STARTED':
            default:
              return '3:inactive';
          }
        })];
      }, []);

      this.sections.notStarted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length, 0);
      this.sections.draft = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length, 0);
      this.sections.submitted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length, 0);

      this.supportStatus = innovationSupportsList.find(s => s.status.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase())?.status || this.innovationSupportStatus.WAITING.label;

      if (this.supportStatus.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase()) {
        this.supportStatus = this.innovationSupportStatus.ENGAGING.label;
        // this.supportingAccessors = innovationSupportsList
        //   .filter(support => support.status.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase())
        //   .flatMap(s => (s.accessors || []).map(a => ({ ...a, unit: s.organisationUnit.name })));
      }

      this.setPageStatus('READY');

    });

  }

}
