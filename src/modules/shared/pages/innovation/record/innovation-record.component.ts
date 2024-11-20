import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CoreComponent } from '@app/base';

import { ContextInnovationType, InnovationStatusEnum } from '@modules/stores';

import { InnovationStatisticsEnum } from '@modules/shared/services/statistics.enum';
import { StatisticsService } from '@modules/shared/services/statistics.service';
import { SectionsSummaryModelV3Type } from '@modules/stores/innovation/innovation-record/202405/ir-v3-types';
import { CustomNotificationEntrypointComponentLinksType } from '@modules/feature-modules/accessor/pages/innovation/custom-notifications/custom-notifications-entrypoint.component';
import { NotificationEnum } from '@modules/feature-modules/accessor/services/accessor.service';

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
  innovationSections: SectionsSummaryModelV3Type = [];
  sections: {
    progressBar: ProgressBarType[];
    submitted: number;
    draft: number;
    notStarted: number;
    withOpenTasksCount: number;
    openTasksCount: number;
  } = { progressBar: [], submitted: 0, draft: 0, notStarted: 0, withOpenTasksCount: 0, openTasksCount: 0 };

  // Flags.
  isInnovatorType: boolean;
  isAccessorType: boolean;
  isAssessmentType: boolean;
  isLoggedUserOwner: boolean;
  isInnovationInCreatedStatus: boolean;
  isInnovationInArchivedStatus: boolean;
  showSupportingTeamsShareRequestSection: boolean;
  showInnovatorShareRequestSection: boolean;
  // This flag is to differ archivals that happened while innovation was not shared.
  isArchiveBeforeShare: boolean;

  allSectionsSubmitted = false;
  isAdminType: boolean;

  customNotificationLinks: CustomNotificationEntrypointComponentLinksType = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private statisticsService: StatisticsService
  ) {
    super();

    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.baseUrl = `/${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovationId}/record/sections`;
    this.documentUrl = `${this.CONSTANTS.APP_ASSETS_URL}/NHS-innovation-service-record.docx`;
    this.pdfDocumentUrl = `${this.CONSTANTS.APP_URL}/exports/${
      this.innovationId
    }/pdf?role=${this.stores.authentication.getUserContextInfo()?.roleId}`;

    this.innovation = this.ctx.innovation.info();

    this.isInnovatorType = this.stores.authentication.isInnovatorType();
    this.isAccessorType = this.stores.authentication.isAccessorType();
    this.isAssessmentType = this.stores.authentication.isAssessmentType();
    this.isAdminType = this.stores.authentication.isAdminRole();
    this.isLoggedUserOwner = this.innovation.loggedUser.isOwner;
    this.isInnovationInCreatedStatus = this.innovation.status === InnovationStatusEnum.CREATED;
    this.isInnovationInArchivedStatus = this.ctx.innovation.isArchived();
    this.showSupportingTeamsShareRequestSection =
      this.stores.authentication.isAccessorType() || this.stores.authentication.isAssessmentType();
    this.showInnovatorShareRequestSection =
      this.stores.authentication.isInnovatorType() && !this.isInnovationInCreatedStatus;
    this.isArchiveBeforeShare = this.isInnovationInArchivedStatus && !this.innovation.assessment;
  }

  ngOnInit(): void {
    this.setPageTitle('Innovation record');

    forkJoin([
      this.ctx.innovation.getSectionsSummary$(this.activatedRoute.snapshot.params.innovationId),
      ...(this.isInnovatorType
        ? [
            this.statisticsService.getInnovationStatisticsInfo(this.innovationId, {
              statistics: [InnovationStatisticsEnum.PENDING_EXPORT_REQUESTS_COUNTER]
            })
          ]
        : [])
    ]).subscribe({
      next: ([response, statistics]) => {
        this.innovationSections = response;
        this.pendingExportRequests = this.isInnovatorType ? statistics.PENDING_EXPORT_REQUESTS_COUNTER.count : 0;

        this.sections.progressBar = this.innovationSections.reduce((acc: ProgressBarType[], item) => {
          return [
            ...acc,
            ...item.sections.map(s => {
              switch (s.status) {
                case 'SUBMITTED':
                  return '1:active';
                case 'DRAFT':
                  return '2:warning';
                case 'NOT_STARTED':
                default:
                  return '3:inactive';
              }
            })
          ];
        }, []);

        this.sections.notStarted = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.filter(s => s.status === 'NOT_STARTED').length,
          0
        );
        this.sections.draft = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.filter(s => s.status === 'DRAFT').length,
          0
        );
        this.sections.submitted = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.filter(s => s.status === 'SUBMITTED').length,
          0
        );
        this.sections.withOpenTasksCount = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.filter(s => s.openTasksCount > 0).length,
          0
        );
        this.sections.openTasksCount = this.innovationSections.reduce(
          (acc: number, item) => acc + item.sections.reduce((acc: number, section) => acc + section.openTasksCount, 0),
          0
        );

        this.allSectionsSubmitted = this.sections.submitted === this.sections.progressBar.length;

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
}
