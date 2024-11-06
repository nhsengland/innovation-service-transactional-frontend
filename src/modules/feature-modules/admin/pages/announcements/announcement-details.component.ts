import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';

import {
  AnnouncementStatusEnum,
  AnnouncementTypeEnum,
  AnnouncementsService,
  GetAnnouncementInfoType
} from '@modules/feature-modules/admin/services/announcements.service';
import { SummaryDataItemType, SummaryDataItemTypeEnum } from './announcement-newdit.component';
import { DatePipe } from '@angular/common';
import { stepsLabels } from './announcement-newdit.config';

@Component({
  selector: 'app-admin-pages-announcement-details',
  templateUrl: './announcement-details.component.html'
})
export class PageAnnouncementDetailsComponent extends CoreComponent implements OnInit {
  announcementId: string;
  announcement:
    | null
    | (GetAnnouncementInfoType & {
        userGroupsLabels: string;
        isScheduled: boolean;
        isActive: boolean;
        typeLabel: 'Log in' | 'Homepage';
      }) = null;
  pageStep: 'INFO' | 'DELETE' = 'INFO';

  isInnovatorSelected: boolean = false;

  summaryData: (SummaryDataItemType & { canChangeOnStatus?: AnnouncementStatusEnum[] })[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService,
    private datePipe: DatePipe
  ) {
    super();

    this.announcementId = this.activatedRoute.snapshot.params.announcementId;
  }

  ngOnInit(): void {
    this.gotoInfoPage();

    this.announcementsService.getAnnouncementInfo(this.announcementId).subscribe({
      next: response => {
        this.announcement = {
          ...response,
          userGroupsLabels: response.userRoles
            .map(item => this.stores.authentication.getRoleDescription(item, true))
            .join('\n'),

          isScheduled: response.status === AnnouncementStatusEnum.SCHEDULED,
          isActive: response.status === AnnouncementStatusEnum.ACTIVE,
          typeLabel: response.type === AnnouncementTypeEnum.LOG_IN ? 'Log in' : 'Homepage'
        };
        this.isInnovatorSelected = this.announcement.userRoles.includes(UserRoleEnum.INNOVATOR);
        this.summaryData = this.getSummaryData();
        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  getSummaryData(): SummaryDataItemType[] {
    const summaryData: (SummaryDataItemType & { canChangeOnStatus?: AnnouncementStatusEnum[] })[] = [];
    const irSchemaTranslations = this.ctx.schema.getIrSchemaTranslationsMap();

    let editStepNumber = 1;

    if (this.announcement) {
      summaryData.push(
        {
          label: stepsLabels.s1.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement!.title
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        },
        {
          label: stepsLabels.s2.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.params.content
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      );

      summaryData.push({
        label: stepsLabels.s3.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS,
          questions: [
            { label: 'Link label', answer: this.announcement.params?.link?.label ?? '' },
            { label: 'Link URL', answer: this.announcement.params?.link?.url ?? '' }
          ]
        },
        canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
      });

      summaryData.push({
        label: stepsLabels.s4.p1.label,
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: this.announcement.userGroupsLabels
        },
        canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
      });

      if (this.announcement.userRoles.includes(UserRoleEnum.INNOVATOR)) {
        summaryData.push({
          label: stepsLabels.s5.p1.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.filters?.length ? 'Specific types of innovations' : 'All innovators'
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        });
      }

      if (this.announcement.filters?.length) {
        summaryData.push({
          label: stepsLabels.s6.p1.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.FILTER_PARAMETER,
            sections: this.announcement.filters.map(filter => {
              return {
                section: this.formatSectionLabel(filter.section),
                question: irSchemaTranslations['questions'].get(filter.question)?.label ?? filter.question,
                answer: filter.answers
                  .map(
                    answer =>
                      irSchemaTranslations['questions'].get(filter.question.split('_')[0])?.items?.get(answer)?.label
                  )
                  .join('\n')
              };
            })
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        });
      }

      summaryData.push(
        {
          label: stepsLabels.s7.label,
          editStepNumber: this.announcement.status === AnnouncementStatusEnum.SCHEDULED ? editStepNumber++ : 1,
          data: {
            type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS,
            questions: [
              {
                label: 'Start date',
                answer: this.datePipe.transform(
                  this.announcement.startsAt,
                  this.translate('app.date_formats.long_date')
                )!
              },
              {
                label: 'End date',
                answer: this.announcement.expiresAt
                  ? this.datePipe.transform(this.announcement.expiresAt, this.translate('app.date_formats.long_date'))!
                  : ''
              }
            ]
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED, AnnouncementStatusEnum.ACTIVE]
        },
        {
          label: stepsLabels.s8.p1.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer:
              this.announcement.type === AnnouncementTypeEnum.LOG_IN ? 'Login announcement' : 'Homepage announcement'
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        },
        {
          label: stepsLabels.s9.p1.label,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.sendEmail ? 'Yes' : 'No'
          },
          canChangeOnStatus: [AnnouncementStatusEnum.SCHEDULED]
        }
      );
    }

    return summaryData;
  }

  formatSectionLabel(sectionId: string) {
    const sectionIdentification = this.ctx.schema.getIrSchemaSectionIdentificationV3(sectionId);
    return `${sectionIdentification?.group.number}.${sectionIdentification?.section.number} - ${sectionIdentification?.section.title}`;
  }

  gotoInfoPage() {
    this.setPageTitle('Announcement details');
    this.setBackLink('Go back', 'admin/announcements');
    this.pageStep = 'INFO';
  }

  gotoDeletePage() {
    this.setPageTitle('Delete announcement');
    this.setBackLink('Go back', this.gotoInfoPage.bind(this));
    this.pageStep = 'DELETE';
  }

  onDelete() {
    this.announcementsService.deleteAnnouncement(this.announcementId).subscribe({
      next: () => {
        this.setRedirectAlertSuccess('The announcement was deleted');
        this.redirectTo(`admin/announcements`);
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }
}
