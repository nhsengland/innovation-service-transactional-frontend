import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ViewportScroller } from '@angular/common';
import { CtxStore, InnovationStatusEnum } from '@modules/stores';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  sidebarItems: { label: string; url: string; children?: { label: string; url: string; id?: string }[] }[] = [];
  navHeading = 'Innovation Record sections';
  showHeading = false;
  isAllSectionsDetailsPage = false;
  isInnovationRecordPage = false;
  isInnovationInArchivedStatus = false;

  private sectionsSidebar: { label: string; url: string; children?: { label: string; id: string; url: string }[] }[] =
    [];
  private _sidebarItems: { label: string; url: string; id?: string }[] = [];

  constructor(
    private router: Router,
    private scroller: ViewportScroller,
    private ctx: CtxStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.onRouteChange())
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
      const innovation = this.ctx.innovation.info();

      this.sectionsSidebar = this.ctx.schema.getIrSchemaSectionsTreeV3('assessment', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/assessment/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/assessment/innovations/${innovation.id}/record` },
        { label: 'Tasks', url: `/assessment/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/assessment/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED
          ? [{ label: 'Documents', url: `/assessment/innovations/${innovation.id}/documents` }]
          : []),
        ...(innovation.hasBeenAssessed
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

    this.isInnovationInArchivedStatus = this.ctx.innovation.isArchived();

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
