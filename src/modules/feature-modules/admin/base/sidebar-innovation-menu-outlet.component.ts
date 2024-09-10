import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ContextStore, InnovationRecordSchemaStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';

import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  sidebarItems: { label: string; url: string; children?: { label: string; url: string }[] }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;
  isInnovationRecordPage: boolean = false;
  isInnovationInArchivedStatus: boolean = false;

  private sectionsSidebar: { label: string; url: string; children?: { label: string; url: string }[] }[] = [];
  private _sidebarItems: { label: string; url: string }[] = [];

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore,
    private irSchemaStore: InnovationRecordSchemaStore
  ) {
    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        this.onRouteChange();
      })
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

      this.sectionsSidebar = this.irSchemaStore.getIrSchemaSectionsTreeV3('admin', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/admin/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/admin/innovations/${innovation.id}/record` },
        { label: 'Tasks', url: `/admin/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/admin/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED &&
        innovation.archivedStatus !== InnovationStatusEnum.CREATED
          ? [{ label: 'Documents', url: `/admin/innovations/${innovation.id}/documents` }]
          : []),
        ...(innovation.hasBeenAssessed
          ? [{ label: 'Support summary', url: `/admin/innovations/${innovation.id}/support-summary` }]
          : []),
        { label: 'Data sharing preferences', url: `/admin/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/admin/innovations/${innovation.id}/activity-log` }
      ];
    }
  }

  private onRouteChange(): void {
    this.generateSidebar();

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
}
