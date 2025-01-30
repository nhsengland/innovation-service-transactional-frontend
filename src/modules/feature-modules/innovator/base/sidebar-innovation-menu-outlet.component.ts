import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { CtxStore } from '@modules/stores';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit {
  isSectionsPage = signal(false);
  isAllSectionsDetailsPage = signal(false);

  sidebarItems = signal<{ label: string; url: string }[]>([]);

  constructor(
    private router: Router,
    private ctx: CtxStore
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
    ]);
  }

  private onRouteChange(): void {
    this.isSectionsPage.set(this.router.url.includes('/sections'));
    this.isAllSectionsDetailsPage.set(this.router.url.includes('/all'));
  }
}
