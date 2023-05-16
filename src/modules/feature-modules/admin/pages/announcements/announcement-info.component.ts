import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

import { AnnouncementStatusEnum, AnnouncementsService, GetAnnouncementInfoType } from '@modules/feature-modules/admin/services/announcements.service';


@Component({
  selector: 'app-admin-pages-announcement-info',
  templateUrl: './announcement-info.component.html'
})
export class PageAnnouncementInfoComponent extends CoreComponent implements OnInit {

  announcementId: string;
  announcementInfo: null | GetAnnouncementInfoType & { userGroupsLabels: string } = null;

  isScheduled(): boolean { return this.announcementInfo?.status === AnnouncementStatusEnum.SCHEDULED; }
  isActive(): boolean { return this.announcementInfo?.status === AnnouncementStatusEnum.ACTIVE; }

  constructor(
    private activatedRoute: ActivatedRoute,
    private announcementsService: AnnouncementsService
  ) {

    super();

    this.announcementId = this.activatedRoute.snapshot.params.announcementId;
    this.setPageTitle('Announcement details');
    this.setBackLink('Go back', 'admin/announcements');

  }

  ngOnInit(): void {

    this.announcementsService.getAnnouncementInfo(this.announcementId).subscribe({
      next: response => {

        this.announcementInfo = {
          ...response,
          userGroupsLabels: response.userRoles.map(item => this.stores.authentication.getRoleDescription(item)).join('\n')
        };

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }

    });

  }

}
