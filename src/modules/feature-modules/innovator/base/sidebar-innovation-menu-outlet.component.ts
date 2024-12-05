import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { ViewportScroller } from '@angular/common';
import { CtxStore } from '@modules/stores';

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

  private sectionsSidebar: { label: string; url: string; children?: { label: string; id: string; url: string }[] }[] =
    [];
  private _sidebarItems: { label: string; url: string; id?: string }[] = [];

  constructor(
    private router: Router,
    private ctx: CtxStore,
    private scroller: ViewportScroller
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

      this.sectionsSidebar = this.ctx.schema.getIrSchemaSectionsTreeV3('innovator', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/innovator/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/innovator/innovations/${innovation.id}/record` },
        { label: 'Tasks to do', url: `/innovator/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/innovator/innovations/${innovation.id}/threads` },
        ...(innovation.submittedAt
          ? [{ label: 'Documents', url: `/innovator/innovations/${innovation.id}/documents` }]
          : []),
        ...(innovation.hasBeenAssessed
          ? [{ label: 'Support summary', url: `/innovator/innovations/${innovation.id}/support-summary` }]
          : []),
        { label: 'Data sharing preferences', url: `/innovator/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/innovator/innovations/${innovation.id}/activity-log` },
        ...(innovation.loggedUser.isOwner
          ? [{ label: 'Manage innovation', url: `/innovator/innovations/${innovation.id}/manage/innovation` }]
          : [{ label: 'Manage access', url: `/innovator/innovations/${innovation.id}/manage/access` }])
      ];
    }
  }

  private onRouteChange(): void {
    this.generateSidebar();

    this.isAllSectionsDetailsPage = this.router.url.includes('/all');

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
