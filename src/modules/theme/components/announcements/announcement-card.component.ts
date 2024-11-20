import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementParamsType } from '@modules/feature-modules/admin/services/announcements.service';
import { AnnouncementsService } from '@modules/feature-modules/announcements/services/announcements.service';
import { AuthenticationStore } from '@modules/stores';
import { listenerCount } from 'process';

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
export class AnnouncementCardComponent implements OnInit {
  @Input({ required: true }) announcementCardData!: AnnouncementCardDataType;

  @Output() clearedAnnouncement = new EventEmitter<string>();

  isOverviewPage = false;
  isDashboardPage = false;
  isLoginAnnouncementPage = false;

  innovationId: string | undefined;

  innovationsList = '';

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

  ngOnInit(): void {
    this.innovationsList = this.formatListOfItemsFromArray(this.announcementCardData.innovations ?? []);
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

  formatListOfItemsFromArray(words: string[], lastItemJoinWord = 'and'): string {
    let toReturn = '';

    if (words.length == 1) {
      toReturn = words[0];
    } else {
      words.forEach((word, i) => {
        toReturn += i < words.length - 1 ? `${word}, ` : `${lastItemJoinWord} ${word}`;
      });
    }

    return toReturn;
  }
}
