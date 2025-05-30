import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { ContextInnovationType, InnovationStatusEnum } from '@modules/stores';

import { CustomNotificationEntrypointComponentLinksType } from '@modules/feature-modules/accessor/pages/innovation/custom-notifications/custom-notifications-entrypoint.component';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';
import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import { SectionsSummaryModelV3Type } from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { InnovationsService } from '@modules/shared/services/innovations.service';

@Component({
  selector: 'shared-pages-innovation-record',
  templateUrl: './innovation-record.component.html'
})
export class PageInnovationRecordComponent extends CoreComponent implements OnInit {
  innovationId: string;

  baseUrl: string;
  pdfDocumentUrl: string;

  innovation: ContextInnovationType;
  pendingExportRequests = 0;
  innovationSections: SectionsSummaryModelV3Type = [];
  sections = { incompleteSections: 0, withOpenTasksCount: 0, openTasksCount: 0 };

  // Flags.
  isInnovationInCreatedStatus: boolean;
  isInnovationInArchivedStatus: boolean;
  isLoggedUserOwner: boolean;
  isReassessment: boolean;
  showSupportingTeamsShareRequestSection: boolean;
  showInnovatorShareRequestSection: boolean;
  showSubmit = false;
  allSectionsSubmitted = false;

  submitUrl = '';

  customNotificationLinks: CustomNotificationEntrypointComponentLinksType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private statisticsService: StatisticsService,
    private innovationsService: InnovationsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/${this.ctx.user.userUrlBasePath()}/innovations/${this.innovationId}/record/sections`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${
      this.innovationId
    }/pdf?role=${this.ctx.user.getUserContext()?.roleId}`;

    this.innovation = this.ctx.innovation.info();

    this.isLoggedUserOwner = this.innovation.loggedUser.isOwner;
    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
    this.isInnovationInArchivedStatus = this.ctx.innovation.isArchived();
    this.showSupportingTeamsShareRequestSection = this.ctx.user.isAccessorOrAssessment();
    this.showInnovatorShareRequestSection = this.ctx.user.isInnovator() && !this.isInnovationInCreatedStatus;
    this.isReassessment = !!this.innovation.assessment;

    if (
      (this.ctx.user.isInnovator() && this.innovation.status === InnovationStatusEnum.CREATED) ||
      (this.isLoggedUserOwner && this.innovation.status === InnovationStatusEnum.ARCHIVED)
    ) {
      this.showSubmit = true;
      this.submitUrl = this.isReassessment
        ? `/innovator/innovations/${this.innovationId}/how-to-proceed/needs-reassessment-send`
        : `/innovator/innovations/${this.innovationId}/record/support`;
    }
  }

  ngOnInit(): void {
    this.setPageTitle('Innovation record');

    forkJoin([
      this.ctx.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId),
      ...(this.ctx.user.isInnovator()
        ? [
            this.statisticsService.getInnovationStatisticsInfo(this.innovationId, {
              statistics: [InnovationStatisticsEnum.PENDING_EXPORT_REQUESTS_COUNTER]
            })
          ]
        : [])
    ]).subscribe({
      next: ([response, statistics]) => {
        this.innovationSections = response;
        this.pendingExportRequests = this.ctx.user.isInnovator() ? statistics.PENDING_EXPORT_REQUESTS_COUNTER.count : 0;

        const sections = this.innovationSections.flatMap(s => s.sections);
        const incompleteSections = sections.filter(s => s.status !== 'SUBMITTED');
        this.sections.incompleteSections = incompleteSections.length;
        this.allSectionsSubmitted = incompleteSections.length === 0;

        this.sections.withOpenTasksCount = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.filter(s => s.openTasksCount > 0).length,
          0
        );
        this.sections.openTasksCount = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.reduce((acc: number, section) => acc + section.openTasksCount, 0),
          0
        );

        this.customNotificationLinks = [
          {
            label: 'Notify me when this innovation record is updated',
            action: NotificationEnum.INNOVATION_RECORD_UPDATED
          }
        ];

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  downloadInnovationRecordDocument(): void {
    this.innovationsService.getInnovationRecordDocument().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `innovation-record.docx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.setAlertError('Unable to download the document. Please try again.');
      }
    });
  }
}
