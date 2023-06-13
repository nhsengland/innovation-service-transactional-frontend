import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore, InnovationStore } from '@modules/stores';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  sidebarItems: { label: string, url: string, children?: { label: string, url: string }[] }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;

  private sectionsSidebar: { label: string, url: string, children?: { label: string, url: string }[] }[] = [];
  private _sidebarItems: { label: string, url: string; }[] = [];

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore
  ) {
    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        this.onRouteChange()
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

      this.sectionsSidebar = this.innovationStore.getInnovationRecordSectionsTree('accessor', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/accessor/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/accessor/innovations/${innovation.id}/record` },
        { label: 'Documents', url: `/accessor/innovations/${innovation.id}/documents` },
        { label: 'Action tracker', url: `/accessor/innovations/${innovation.id}/action-tracker` },
        { label: 'Messages', url: `/accessor/innovations/${innovation.id}/threads` },
        { label: 'Support status', url: `/accessor/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` }
      ];

    }

  }

  private onRouteChange(): void {
    this.generateSidebar();

    if (this.router.url.includes('sections')) {
      this.showHeading = true;
      this.sidebarItems = this.sectionsSidebar;
    } else {
      this.showHeading = false;
      this.sidebarItems = this._sidebarItems;
    }
  }
}
