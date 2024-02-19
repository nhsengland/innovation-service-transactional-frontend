import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  sidebarItems: { label: string; url: string; children?: { label: string; url: string; id?: string }[] }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;
  isAllSectionsDetailsPage: boolean = false;
  isInnovationRecordPage: boolean = false;
  isInnovationInArchivedStatus: boolean = false;

  private sectionsSidebar: { label: string; url: string; children?: { label: string; id: string; url: string }[] }[] =
    [];
  private _sidebarItems: { label: string; url: string; id?: string }[] = [];

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore,
    private scroller: ViewportScroller
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange())
    );

    this.onRouteChange();
  }

  ngOnInit(): void {
    this.generateSidebar();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private generateSidebar(): void {
    if (this.sidebarItems.length === 0) {
      const innovation = this.contextStore.getInnovation();

      this.sectionsSidebar = this.innovationStore.getInnovationRecordSectionsTree('assessment', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/assessment/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/assessment/innovations/${innovation.id}/record` },
        { label: 'Tasks', url: `/assessment/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/assessment/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED
          ? [{ label: 'Documents', url: `/assessment/innovations/${innovation.id}/documents` }]
          : []),
        ...([
          InnovationStatusEnum.IN_PROGRESS,
          InnovationStatusEnum.AWAITING_NEEDS_REASSESSMENT,
          InnovationStatusEnum.ARCHIVED
        ].includes(innovation.status)
          ? [{ label: 'Support summary', url: `/assessment/innovations/${innovation.id}/support-summary` }]
          : []),
        { label: 'Data sharing preferences', url: `/assessment/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/assessment/innovations/${innovation.id}/activity-log` }
      ];
    }
  }

  private onRouteChange(): void {
    this.generateSidebar();

    this.isAllSectionsDetailsPage = this.router.url.includes('/all');
    this.isInnovationRecordPage = this.router.url.endsWith('/record');

    this.isInnovationInArchivedStatus = this.contextStore.getInnovation().status === InnovationStatusEnum.ARCHIVED;

    if (this.router.url.includes('sections')) {
      this.showHeading = true;
      this.sidebarItems = this.sectionsSidebar;
    } else {
      this.showHeading = false;
      this.sidebarItems = this._sidebarItems;
    }
  }

  onScrollToSection(section: string, event: Event): void {
    this.scroller.scrollToAnchor(section);
    (event.target as HTMLElement).blur();
  }
}
