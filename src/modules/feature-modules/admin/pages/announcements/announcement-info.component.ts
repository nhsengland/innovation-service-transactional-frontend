import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import {
  AnnouncementStatusEnum,
  AnnouncementsService,
  GetAnnouncementInfoType
} from '@modules/feature-modules/admin/services/announcements.service';

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
      }) = null;
  pageStep: 'INFO' | 'DELETE' = 'INFO';

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService
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
          isActive: response.status === AnnouncementStatusEnum.ACTIVE
        };

        this.setPageStatus('READY');
      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }
    });
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
