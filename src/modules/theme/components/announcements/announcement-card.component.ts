import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementParamsType } from '@modules/feature-modules/admin/services/announcements.service';
import { AnnouncementsService } from '@modules/feature-modules/announcements/services/announcements.service';
import { AuthenticationStore } from '@modules/stores';

export type AnnouncementCardDataType = {
  title: string;
  params: AnnouncementParamsType;
  innovations?: string[];
  id?: string;
};

@Component({
  selector: 'theme-announcements-card',
  templateUrl: './announcement-card.component.html',
  providers: [AnnouncementsService]
})
export class AnnouncementCardComponent {
  @Input({ required: true }) announcementCardData!: AnnouncementCardDataType;

  @Output() clearedAnnouncement = new EventEmitter<string>();

  isOverviewPage: boolean = false;
  isDashboardPage: boolean = false;
  isLoginAnnouncementPage: boolean = false;

  innovationId: string | undefined;

  constructor(
    private router: Router,
    private announcementsService: AnnouncementsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.innovationId = this.activatedRoute.snapshot.params.innovationId;

    this.isOverviewPage = this.router.url.endsWith('/overview');
    this.isDashboardPage = this.router.url.endsWith('/dashboard');
    this.isLoginAnnouncementPage = this.router.url.endsWith('/announcements');
  }

  clearAnnouncement() {
    if (this.announcementCardData.id) {
      this.announcementsService.readAnnouncement(this.announcementCardData.id, this.innovationId).subscribe({
        next: () => {
          this.clearedAnnouncement.emit(this.announcementCardData.id);
        },
        error: () => {}
      });
    }
  }
}
