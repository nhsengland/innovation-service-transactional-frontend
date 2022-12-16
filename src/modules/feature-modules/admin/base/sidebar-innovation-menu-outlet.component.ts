import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ContextStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';

import { Subscription, filter } from 'rxjs';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnDestroy  {
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
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange())
    );

    this.onRouteChange();   
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onRouteChange(): void {
    const innovation = this.contextStore.getInnovation();
    this.sidebarItems = [];
    
    if (this.router.url.includes('sections')) {
      const currentSection = this.router.url.split('/').pop();
      this.showHeading = true;
      
      this.innovationStore.getSectionsSummary$(innovation.id).subscribe(response => {

        response.map((parentSection, i) => {
          this.sidebarItems.push({ label: `${i + 1}. ${parentSection.title}`, url: `/admin/innovations/${innovation.id}/record/sections/${parentSection.sections[0].id}`, nestedSidebarItems: []  });

          if (parentSection.sections.find(j => j.id === currentSection)) {
            parentSection.sections.map((section, k) => {
              this.sidebarItems[i].nestedSidebarItems?.push({ label: `${i + 1}.${k + 1} ${section.title}`, url: `/admin/innovations/${innovation.id}/record/sections/${section.id}` });
            })
          }
        });
      });
    } else {
      this.showHeading = false;
   
      this.sidebarItems = [
        { label: 'Overview', url: `/admin/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/admin/innovations/${innovation.id}/record` },
        { label: 'Action tracker', url: `/admin/innovations/${innovation.id}/action-tracker` },
        { label: 'Messages', url: `/admin/innovations/${innovation.id}/threads` },
        { label: 'Data sharing and support', url: `/admin/innovations/${innovation.id}/support` }, // TODO: this url may change      
      ];
      
      if (innovation.status !== InnovationStatusEnum.CREATED && innovation.status !== InnovationStatusEnum.WAITING_NEEDS_ASSESSMENT) {
        this.sidebarItems.push({ label: 'Needs assessment', url: `/admin/innovations/${innovation.id}/assessments/${innovation.assessment?.id}` });
      }
  
      this.sidebarItems.push({ label: 'Activity log', url: `/admin/innovations/${innovation.id}/activity-log` });
    }
  }

}
