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

  sidebarItems = signal<{ label: string; url: string; id?: string }[]>([]);

  constructor(
    private router: Router,
    readonly ctx: CtxStore
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
        label: this.ctx.user.isQualifyingAccessor() ? 'Suggest support' : 'Data sharing preferences',
        url: `/accessor/innovations/${innovation.id}/support`
      },
      { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` },
      { label: 'Custom notifications', url: `/accessor/innovations/${innovation.id}/custom-notifications` }
    ]);
  }

  private onRouteChange(): void {
    this.isAllSectionsDetailsPage.set(this.router.url.includes('/all'));
    this.isSectionsPage.set(this.router.url.includes('/sections'));
    this.isInnovationRecordPage.set(this.router.url.includes('/record'));
  }
}
