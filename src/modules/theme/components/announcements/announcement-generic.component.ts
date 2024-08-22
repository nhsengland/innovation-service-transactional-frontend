import { Component, Input, OnInit } from '@angular/core';

import { AnnouncementParamsType } from './announcements.types';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AnnouncementType,
  AnnouncementsService
} from '@modules/feature-modules/announcements/services/announcements.service';

@Component({
  selector: 'theme-announcements-generic',
  templateUrl: './announcement-generic.component.html',
  providers: [AnnouncementsService]
})
export class AnnouncementGenericComponent implements OnInit {
  @Input() params?: null | AnnouncementParamsType['GENERIC'];

  isOverviewPage: boolean = false;
  isLoginAnnouncementPage: boolean = false;

  innovationId: string;

  constructor(
    private router: Router,
    private announcementsService: AnnouncementsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.isOverviewPage = this.router.url.endsWith('/overview');
    this.isLoginAnnouncementPage = this.router.url.endsWith('/announcements');
  }

  ngOnInit(): void {
    // TODO: Update incoming payload with new params types
    // TODO: Add alert error
    // TODO: Remove current announcement from view (reload component?)
    console.log('this.innovationId', this.innovationId);
  }
  clearAnnouncement() {
    this.announcementsService.readAnnouncement('', this.innovationId).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}
