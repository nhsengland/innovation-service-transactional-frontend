import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { AnnouncementTypeEnum } from '@modules/feature-modules/admin/services/announcements.service';

import {
  AnnouncementType,
  AnnouncementsService
} from '@modules/feature-modules/announcements/services/announcements.service';

@Component({
  selector: 'app-announcements-announcements-list',
  templateUrl: './announcements-list.component.html'
})
export class AnnouncementsListComponent extends CoreComponent implements OnInit {
  #announcements: AnnouncementType[] = [];
  #announcementIndex = 0;

  announcement?: AnnouncementType;

  isContinueButtonActive = true;

  constructor(private announcementsService: AnnouncementsService) {
    super();
  }

  ngOnInit(): void {
    this.announcementsService.getAnnouncements({ type: [AnnouncementTypeEnum.LOG_IN] }).subscribe(response => {
      this.#announcements = response;
      this.announcement = this.#announcements[this.#announcementIndex];

      this.setTitle();
      this.setPageStatus('READY');
    });
  }

  onContinue(announcementId: string) {
    if (!this.isContinueButtonActive) {
      return;
    }

    this.isContinueButtonActive = false;

    this.announcementsService.readAnnouncement(announcementId).subscribe({
      next: () => {
        this.#announcementIndex++;

        if (this.#announcementIndex < this.#announcements.length) {
          this.announcement = this.#announcements[this.#announcementIndex];

          this.setTitle();
          this.setFocus();
        } else {
          // All announcements are read
          window.location.assign(`${this.CONSTANTS.APP_URL}/dashboard`);
          return;
        }

        this.isContinueButtonActive = true;
      },
      error: () => {
        this.isContinueButtonActive = true;
        this.setAlertError(
          'An error occured while reading an announcement. Please try again or contact us for further help',
          { width: '2.thirds' }
        );
      }
    });
  }

  private setTitle() {
    const title = 'Announcement';

    if (this.#announcements.length > 1) {
      this.setPageTitle(title, { hint: `${this.#announcementIndex + 1} of ${this.#announcements.length}` });
    } else {
      this.setPageTitle(title);
    }
  }

  private setFocus() {
    if (this.isRunningOnBrowser()) {
      setTimeout(() => {
        // Await for the html injection if needed.
        const h = document.getElementById('announcement-container');
        if (h) {
          h.setAttribute('tabIndex', '-1');
          h.focus();
          h.addEventListener('blur', e => {
            e.preventDefault();
            h.removeAttribute('tabIndex');
          });
        }
      });
    }
  }
}
