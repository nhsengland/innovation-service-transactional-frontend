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
import { irSchemaTranslationsMap } from '@modules/stores/innovation/innovation-record/202405/ir-v3-schema-translation.helper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-pages-announcement-info',
  templateUrl: './announcement-info.component.html'
})
export class PageAnnouncementInfoComponent extends CoreComponent implements OnInit {
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

  summaryData: SummaryDataItemType[] = [];

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
            .map(item => this.stores.authentication.getRoleDescription(item))
            .join('\n'),

          isScheduled: response.status === AnnouncementStatusEnum.SCHEDULED,
          isActive: response.status === AnnouncementStatusEnum.ACTIVE,
          typeLabel: response.type === AnnouncementTypeEnum.LOG_IN ? 'Log in' : 'Homepage'
        };
        this.isInnovatorSelected = this.announcement.userRoles.includes(UserRoleEnum.INNOVATOR);
        this.summaryData = this.getSummaryData();
        console.log('this.summaryData', this.summaryData);

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
  }

  getSummaryData(): SummaryDataItemType[] {
    const summaryData: SummaryDataItemType[] = [];
    const irSchemaTranslations = this.stores.schema.getIrSchemaTranslationsMap();

    let editStepNumber = 1;
    if (this.announcement) {
      summaryData.push(
        {
          label: `What's the title of the announcement?`,
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement!.title
          }
        },
        {
          label: 'Write body content',
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.params.content
          }
        }
      );

      summaryData.push({
        label: 'Add a link (optional)',
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.MULTIPLE_PARAMETERS,
          questions: [
            { label: 'Link label', answer: this.announcement.params?.link?.label ?? '' },
            { label: 'Link URL', answer: this.announcement.params?.link?.url ?? '' }
          ]
        }
      });

      summaryData.push({
        label: 'Which user groups do you want this announcement to be sent to?',
        editStepNumber: editStepNumber++,
        data: {
          type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
          answer: this.announcement.userGroupsLabels
        }
      });

      if (this.announcement.userRoles.includes(UserRoleEnum.INNOVATOR)) {
        summaryData.push({
          label: 'Should this announcement be shown to all innovators or a specific type of innovations?',
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.filters?.length ? 'Specific types of innovations' : 'All innovators'
          }
        });
      }

      if (this.announcement.filters?.length) {
        summaryData.push({
          label: 'Filter innovation type',
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
          }
        });
      }

      summaryData.push(
        {
          label: 'When do you want this announcement to be live?',
          editStepNumber: editStepNumber++,
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
          }
        },
        {
          label: 'Which type of announcement?',
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.type === AnnouncementTypeEnum.LOG_IN ? 'Log in' : 'Homepage'
          }
        },
        {
          label: 'Would you like to send this announcement via email too?',
          editStepNumber: editStepNumber++,
          data: {
            type: SummaryDataItemTypeEnum.SINGLE_PARAMETER,
            answer: this.announcement.sendEmail ? 'Yes' : 'No'
          }
        }
      );
    }

    return summaryData;
  }

  formatSectionLabel(sectionId: string) {
    const sectionIdentification = this.stores.schema.getIrSchemaSectionIdentificationV3(sectionId);
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
