import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import { CtxStore } from '@modules/stores';

import { filter } from 'rxjs';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit {
  isInnovationRecordPage = signal(false);
  isSectionsPage = signal(false);

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
      { label: 'Overview', url: `/admin/innovations/${innovation.id}/overview` },
      { label: 'Key progress areas', url: `/admin/innovations/${innovation.id}/key-progress-areas` },
      { label: 'Innovation record', url: `/admin/innovations/${innovation.id}/record` },
      { label: 'Tasks', url: `/admin/innovations/${innovation.id}/tasks` },
      { label: 'Messages', url: `/admin/innovations/${innovation.id}/threads` },
      ...(innovation.submittedAt ? [{ label: 'Documents', url: `/admin/innovations/${innovation.id}/documents` }] : []),
      ...(innovation.hasBeenAssessed
        ? [{ label: 'Support summary', url: `/admin/innovations/${innovation.id}/support-summary` }]
        : []),
      { label: 'Data sharing preferences', url: `/admin/innovations/${innovation.id}/support` },
      { label: 'Activity log', url: `/admin/innovations/${innovation.id}/activity-log` }
    ]);
  }

  private onRouteChange(): void {
    this.isSectionsPage.set(this.router.url.includes('/sections'));
    this.isInnovationRecordPage.set(this.router.url.includes('/record'));
  }
}
