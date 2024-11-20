import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ViewportScroller } from '@angular/common';
import { AuthenticationStore, CtxStore, InnovationStatusEnum } from '@modules/stores';

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
  isQualifyingAccessorRole: boolean;

  private sectionsSidebar: { label: string; url: string; children?: { label: string; id: string; url: string }[] }[] =
    [];
  private _sidebarItems: { label: string; url: string; id?: string }[] = [];

  constructor(
    private router: Router,
    readonly ctx: CtxStore,
    private scroller: ViewportScroller,
    private authenticationStore: AuthenticationStore
  ) {
    this.isQualifyingAccessorRole = this.authenticationStore.isQualifyingAccessorRole();

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

      this.sectionsSidebar = this.ctx.schema.getIrSchemaSectionsTreeV3('accessor', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/accessor/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/accessor/innovations/${innovation.id}/record` },
        { label: 'Tasks', url: `/accessor/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/accessor/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED
          ? [{ label: 'Documents', url: `/accessor/innovations/${innovation.id}/documents` }]
          : []),
        ...(innovation.hasBeenAssessed
          ? [{ label: 'Support summary', url: `/accessor/innovations/${innovation.id}/support-summary` }]
          : []),
        {
          label: this.isQualifyingAccessorRole ? 'Suggest support' : 'Data sharing preferences',
          url: `/accessor/innovations/${innovation.id}/support`
        },
        { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` },
        { label: 'Custom notifications', url: `/accessor/innovations/${innovation.id}/custom-notifications` }
      ];
    }
  }

  private onRouteChange(): void {
    this.generateSidebar();

    this.isAllSectionsDetailsPage = this.router.url.includes('/all');
    this.isInnovationRecordPage = this.router.url.endsWith('/record');

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
