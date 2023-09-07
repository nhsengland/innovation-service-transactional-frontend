import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { ContextInnovationType } from '@modules/stores/context/context.types';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { SectionsSummaryModel } from '@modules/stores/innovation/innovation.models';

import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';


type ProgressBarType = '1:active' | '2:warning' | '3:inactive';


@Component({
  selector: 'shared-pages-innovation-record',
  templateUrl: './innovation-record.component.html'
})
export class PageInnovationRecordComponent extends CoreComponent implements OnInit {

  innovationId: string;

  baseUrl: string;
  documentUrl: string;
  pdfDocumentUrl: string;

  innovation: ContextInnovationType;
  pendingExportRequests = 0;
  innovationSections: SectionsSummaryModel = [];
  sections: { progressBar: ProgressBarType[], submitted: number, draft: number, notStarted: number } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0 };

  // Flags.
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  isInnovationInCreatedStatus: boolean;
  showSupportingTeamsShareRequestSection: boolean;
  showInnovatorShareRequestSection: boolean;

  allSectionsSubmitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private statisticsService: StatisticsService
  ) {

    super();
    this.setPageTitle('Innovation record');

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record/sections`;
    this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${this.innovationId}/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;

    this.innovation = this.stores.context.getInnovation();

    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
    this.showSupportingTeamsShareRequestSection = this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType();
    this.showInnovatorShareRequestSection = this.stores.authentication.isInnovatorType() && !this.isInnovationInCreatedStatus;

  }


  ngOnInit(): void {

    forkJoin([
      this.stores.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId),
      ... this.isInnovatorType ? [this.statisticsService.getInnovationStatisticsInfo(this.innovationId, { statistics: [InnovationStatisticsEnum.PENDING_EXPORT_REQUESTS_COUNTER] })] : [],
    ]).subscribe({
      next: ([response, statistics]) => {

        this.innovationSections = response;
        this.pendingExportRequests = this.isInnovatorType ? statistics.PENDING_EXPORT_REQUESTS_COUNTER.count : 0;

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

        this.allSectionsSubmitted = this.sections.submitted === this.sections.progressBar.length;

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }

    });

  }

}
