import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CtxStore, InnovationStatusEnum } from '@modules/stores';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit {
  isInnovationRecordPage = signal(false);
  isSectionsPage = signal(false);
  isAllSectionsDetailsPage = signal(false);

  sidebarItems = signal<{ label: string; url: string }[]>([]);

  constructor(
    private router: Router,
    protected ctx: CtxStore
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(() => this.onRouteChange());
    this.onRouteChange();
  }

  ngOnInit(): void {
    this.generateSidebar();
  }

  private generateSidebar(): void {
    const innovation = this.ctx.innovation.info();

    this.sidebarItems.set([
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
      { label: 'Key progress areas', url: `/assessment/innovations/${innovation.id}/key-progress-areas` },
      { label: 'Data sharing preferences', url: `/assessment/innovations/${innovation.id}/support` },
      { label: 'Activity log', url: `/assessment/innovations/${innovation.id}/activity-log` }
    ]);
  }

  private onRouteChange(): void {
    this.isAllSectionsDetailsPage.set(this.router.url.includes('/all'));
    this.isSectionsPage.set(this.router.url.includes('/sections'));
    this.isInnovationRecordPage.set(this.router.url.includes('/record'));
  }
}
