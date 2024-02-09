import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
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

      this.sectionsSidebar = this.innovationStore.getInnovationRecordSectionsTree('accessor', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/accessor/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/accessor/innovations/${innovation.id}/record` },
        ...(innovation.status === InnovationStatusEnum.IN_PROGRESS ||
        innovation.status === InnovationStatusEnum.ARCHIVED
          ? [{ label: 'Support summary', url: `/accessor/innovations/${innovation.id}/support-summary` }]
          : []),
        { label: 'Tasks', url: `/accessor/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/accessor/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED
          ? [{ label: 'Documents', url: `/accessor/innovations/${innovation.id}/documents` }]
          : []),
        { label: 'Data sharing preferences', url: `/accessor/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` }
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
