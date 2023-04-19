import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '@app/base';
import { Announcement, AnnouncementsService } from '../../services/announcements.service';

@Component({
  selector: 'app-announcements-announcements-list',
  templateUrl: './announcements-list.component.html'
})
export class AnnouncementsListComponent extends CoreComponent implements OnInit {
  #announcements: Announcement[] = [];
  #announcementNumber = 0;

  announcement?: Announcement;

  isBtnDisabled = false;

  constructor(
    private announcementsService: AnnouncementsService,
  ) { super(); }

  ngOnInit(): void {

    this.announcementsService.getAnnouncements().subscribe((announcements) => {
      this.#announcements = announcements;

      this.announcement = this.#announcements[this.#announcementNumber];

      this.setTitle();
    });

  }

  onContinue(announcementId: string) {
    if (this.isBtnDisabled) { return; }

    this.isBtnDisabled = true;

    this.announcementsService.readAnnouncement(announcementId).subscribe({
      next: () => {
        this.#announcementNumber++;

        if (this.#announcementNumber < this.#announcements.length) {
          this.announcement = this.#announcements[this.#announcementNumber];

          this.setTitle();
          this.setFocus();
        } else {
          // All announcements are read
          window.location.assign(`${this.CONSTANTS.APP_URL}/dashboard`);
          return;
        }

        this.isBtnDisabled = false;
      },
      error: () => {
        this.isBtnDisabled = false;
        this.setAlertError('An error occured while reading an announcement. Please try again or contact us for further help.', { width: '2.thirds' })
      }
    });

  }

  private setTitle() {
    const title = this.announcement?.params?.title ?? 'Announcement';
    if (this.#announcements.length > 1) {
      this.setPageTitle(title, { hint: `${this.#announcementNumber + 1} of ${this.#announcements.length}` });
    } else {
      this.setPageTitle(title);
    }
  }

  private setFocus() {
    if (this.isRunningOnBrowser()) {
      setTimeout(() => { // Await for the html injection if needed.
        const h = document.getElementById('announcement-container');
        if (h) {
          h.setAttribute('tabIndex', '-1');
          h.focus();
          h.addEventListener('blur', (e) => {
            e.preventDefault();
            h.removeAttribute('tabIndex');
          });
        }
      });
    }
  }

}
