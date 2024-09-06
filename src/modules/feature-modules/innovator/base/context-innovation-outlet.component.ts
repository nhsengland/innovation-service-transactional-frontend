import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore } from '@modules/stores';
import {
  AnnouncementType,
  AnnouncementsService
} from '@modules/feature-modules/announcements/services/announcements.service';
import { AnnouncementTypeEnum } from '@modules/feature-modules/admin/services/announcements.service';

@Component({
  selector: 'app-base-context-innovation-outlet',
  templateUrl: './context-innovation-outlet.component.html'
})
export class ContextInnovationOutletComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  innovation: {
    id: string;
    name: string;
    userIsOwner: boolean;
  } = { id: '', name: '', userIsOwner: false };

  announcements: AnnouncementType[] = [];

  displayAnnouncements: boolean = false;

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private announcementsService: AnnouncementsService
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange(e))
    );
    this.onRouteChange();
  }

  ngOnInit(): void {
    this.announcementsService
      .getAnnouncements({ type: [AnnouncementTypeEnum.HOMEPAGE], innovationId: this.innovation.id })
      .subscribe(announcements => (this.announcements = announcements));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClearAnnouncement(announcementId: string) {
    this.announcements = this.announcements.filter(a => a.id !== announcementId);
  }

  private onRouteChange(_event?: NavigationEnd): void {
    const innovation = this.contextStore.getInnovation();
    this.innovation = {
      id: innovation.id,
      name: innovation.name,
      userIsOwner: innovation.loggedUser.isOwner
    };
    this.displayAnnouncements = this.router.url.endsWith('/overview');
  }
}
