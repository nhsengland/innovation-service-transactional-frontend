import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ContextStore, InnovationStore } from '@modules/stores';
import { debounceTime, filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnDestroy {

  private subscriptions = new Subscription();

  sidebarItems: { label: string, url: string; nestedSidebarItems?: {label: string, url: string;}[] }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore,
  ) {
    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => {
        this.onRouteChange()
      })
    );

    this.onRouteChange()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  private onRouteChange(): void {
    const innovation = this.contextStore.getInnovation();

    if (this.router.url.includes('sections')) {
      const currentSection = this.router.url.split('/').pop();
      this.showHeading = true;
      this.sidebarItems = [];

      this.innovationStore.getSectionsSummary$(innovation.id).subscribe(response => {

        response.map((parentSection, i) => {
          this.sidebarItems.push({ label: `${i + 1}. ${parentSection.title}`, url: `/innovator/innovations/${innovation.id}/record/sections/${parentSection.sections[0].id}`, nestedSidebarItems: []  });

          if (parentSection.sections.find(j => j.id === currentSection)) {
            parentSection.sections.map((section, k) => {
              this.sidebarItems[i].nestedSidebarItems?.push({ label: `${i + 1}.${k + 1} ${section.title}`, url: `/innovator/innovations/${innovation.id}/record/sections/${section.id}` });
            })
          }
        });

      });
    } else {
      this.showHeading = false;
      this.sidebarItems = [
        { label: 'Overview', url: `/innovator/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/innovator/innovations/${innovation.id}/record` },
        { label: 'Action tracker', url: `/innovator/innovations/${innovation.id}/action-tracker` },
        { label: 'Messages', url: `/innovator/innovations/${innovation.id}/threads` },
        { label: 'Data sharing and support', url: `/innovator/innovations/${innovation.id}/support` },
        { label: 'Activity log', url: `/innovator/innovations/${innovation.id}/activity-log` }
      ];
    }
  
  }
}
