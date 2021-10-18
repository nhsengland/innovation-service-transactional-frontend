import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';
import { AlertType } from '@app/base/models';
import { InnovatorService } from '@modules/feature-modules/innovator/services/innovator.service';

import { INNOVATION_STATUS, SectionsSummaryModel } from '@stores-module/innovation/innovation.models';
import { NotificationContextType, NotificationService } from '@modules/shared/services/notification.service';


@Component({
  selector: 'app-innovator-pages-innovations-overview',
  templateUrl: './overview.component.html'
})
export class InnovationOverviewComponent extends CoreComponent implements OnInit {

  alert: AlertType = { type: null };

  innovationId: string;
  innovationStatus: keyof typeof INNOVATION_STATUS = '';
  innovationSections: SectionsSummaryModel[] = [];
  actionSummary: { requested: number, review: number } = { requested: 0, review: 0 };
  supportStatus = 'Awaiting support';
  supportingAccessors: { id: string; name: string, unit: string }[] = [];
  submittedAt: string | undefined;
  needsAssessmentCompleted: boolean;

  assessmentId: string | undefined;

  innovationSupportStatus = this.stores.innovation.INNOVATION_SUPPORT_STATUS;
  innovationStatusObj = this.stores.innovation.INNOVATION_STATUS;

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
    private innovatorService: InnovatorService,
    private notificationService: NotificationService,
  ) {

    super();
    this.setPageTitle('Innovation record overview');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;
    this.needsAssessmentCompleted = false;
  }


  ngOnInit(): void {

    this.notificationService.dismissNotification(this.innovationId, NotificationContextType.DATA_SHARING).subscribe();

    forkJoin([
      this.innovatorService.getInnovationInfo(this.innovationId),
      this.stores.innovation.getSectionsSummary$('innovator', this.innovationId),
      this.innovatorService.getInnovationSupports(this.innovationId, true),
    ]).subscribe(([innovationInfo, sectionSummary, innovationSupports]) => {

      this.submittedAt = innovationInfo.submittedAt || '';
      this.needsAssessmentCompleted = !this.isInAssessmentStatus();
      this.assessmentId = innovationInfo.assessment?.id;

      this.actionSummary = {
        requested: innovationInfo.actions.requestedCount,
        review: innovationInfo.actions.inReviewCount
      };

      this.innovationStatus = sectionSummary.innovation.status;
      this.innovationSections = sectionSummary.sections;


      this.sections.progressBar = this.innovationSections.reduce((acc: boolean[], item) => {
        return [...acc, ...item.sections.map(s => s.isCompleted)];
      }, []).sort().reverse();

      this.sections.notStarted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length, 0);
      this.sections.draft = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length, 0);
      this.sections.submitted = this.innovationSections.reduce((acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length, 0);


      this.supportStatus = innovationSupports.find(s => s.status.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase())?.status || this.innovationSupportStatus.WAITING.label;

      if (this.supportStatus.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase()) {
        this.supportStatus = this.innovationSupportStatus.ENGAGING.label;
        this.supportingAccessors = innovationSupports
          .filter(support => support.status.toLocaleLowerCase() === this.innovationSupportStatus.ENGAGING.label.toLocaleLowerCase())
          .flatMap(s => (s.accessors || []).map(a => ({ ...a, unit: s.organisationUnit.name })));
      }

      this.setPageStatus('READY');

    },
      () => {
        this.setPageStatus('ERROR');
        this.alert = {
          type: 'ERROR',
          title: 'Unable to fetch innovation record information',
          message: 'Please try again or contact us for further help'
        };
      }
    );
  }

}
