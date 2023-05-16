import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { TableModel } from '@app/base/models';

import { AnnouncementsService, GetAnnouncementsListType } from '@modules/feature-modules/admin/services/announcements.service';


@Component({
  selector: 'app-admin-pages-announcements-list',
  templateUrl: './announcements-list.component.html'
})
export class PageAnnouncementsListComponent extends CoreComponent implements OnInit {

  announcementsList = new TableModel<GetAnnouncementsListType['data'][number]>({ pageSize: 10 });

  constructor(
    private announcementsService: AnnouncementsService
  ) {

    super();
    this.setPageTitle('Announcements');

  }

  ngOnInit(): void {

    this.getAnnouncementsList();

  }


  getAnnouncementsList(): void {

    this.setPageStatus('LOADING');

    this.announcementsService.getAnnouncementsList(this.announcementsList.getAPIQueryParams()).subscribe({
      next: announcements => {

        this.announcementsList.setData(announcements.data, announcements.count);

        this.setPageStatus('READY');

      },
      error: () => {
        this.setPageStatus('ERROR');
        this.setAlertUnknownError();
      }

    });

  };

  onPageChange(event: { pageNumber: number }): void {
    this.announcementsList.setPage(event.pageNumber);
    this.getAnnouncementsList();
  }

}
