import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { ViewportScroller } from '@angular/common';
import { ContextStore, InnovationRecordSchemaStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';

type SectionStatus = 'not_started' | 'draft' | 'submitted';

// NOTE: When developing the feature this needs an entire refactor
@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html',
  styleUrl: './sidebar-innovation-menu-outlet.component.scss'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  sidebarItems: {
    label: string;
    url: string;
    status?: SectionStatus;
    children?: { label: string; url: string; id?: string; status?: SectionStatus }[];
  }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;
  isAllSectionsDetailsPage: boolean = false;

  private sectionsSidebar: {
    label: string;
    url: string;
    status?: SectionStatus; // Turn this required
    children?: { label: string; id: string; url: string; status?: SectionStatus }[];
  }[] = [];
  private _sidebarItems: { label: string; url: string; id?: string }[] = [];

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore,
    private scroller: ViewportScroller,
    private irSchemaStore: InnovationRecordSchemaStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange())
    );

    this.onRouteChange();
  }

  ngOnInit(): void {
    const innovation = this.contextStore.getInnovation();

    this.innovationStore.getAllSectionsInfo$(innovation.id).subscribe(sections => {
      const sectionsStatuses = new Map<string, SectionStatus>();
      for (const { section } of sections) {
        switch (section.status) {
          case 'SUBMITTED':
            sectionsStatuses.set(section.section, 'submitted');
            break;
          case 'DRAFT':
            sectionsStatuses.set(section.section, 'draft');
            break;
          default:
            sectionsStatuses.set(section.section, 'not_started');
        }
      }

      this.sectionsSidebar = this.irSchemaStore.getIrSchemaSectionsTreeV3('innovator', innovation.id).map(s => {
        const childrenStatuses = new Set(s.children.map(sub => sectionsStatuses.get(sub.id) ?? 'not_started'));
        return {
          ...s,
          status: childrenStatuses.has('draft')
            ? 'draft'
            : childrenStatuses.has('submitted')
              ? 'submitted'
              : 'not_started',
          children: s.children.map(sub => ({ ...sub, status: sectionsStatuses.get(sub.id) ?? 'not_started' }))
        };
      });

      this.generateSidebar();
      this.onRouteChange();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private generateSidebar(): void {
    if (this.sidebarItems.length === 0) {
      const innovation = this.contextStore.getInnovation();

      this._sidebarItems = [
        { label: 'Overview', url: `/innovator/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/innovator/innovations/${innovation.id}/record` },
        { label: 'Tasks to do', url: `/innovator/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/innovator/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED &&
        innovation.archivedStatus !== InnovationStatusEnum.CREATED
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
