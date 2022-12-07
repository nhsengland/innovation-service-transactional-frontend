import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContextStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnDestroy {

  private subscriptions = new Subscription();

  sidebarItems: { label: string, url: string }[] = [];


  constructor(
    private router: Router,
    private contextStore: ContextStore
  ) {

    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange())
    );

    this.onRouteChange();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  private onRouteChange(): void {

    const innovation = this.contextStore.getInnovation();

    this.sidebarItems = [
      { label: 'Overview', url: `/assessment/innovations/${innovation.id}/overview` },
      { label: 'Innovation record', url: `/assessment/innovations/${innovation.id}/record` },
      { label: 'Messages', url: `/assessment/innovations/${innovation.id}/threads` },
      { label: 'Support status', url: `/assessment/innovations/${innovation.id}/support` }
    ];

    if (innovation.status === InnovationStatusEnum.IN_PROGRESS) {
      this.sidebarItems.push(
        { label: 'Needs assessment', url: `/assessment/innovations/${innovation.id}/assessments/${innovation.assessment?.id}` }
      );
    }

    this.sidebarItems.push({ label: 'Activity log', url: `/assessment/innovations/${innovation.id}/activity-log` });

  }

}
