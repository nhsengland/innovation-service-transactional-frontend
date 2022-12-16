import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { ContextStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation/innovation.enums';


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
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), debounceTime(500)).subscribe(e => {
        this.sidebarItems = [];
        this.onRouteChange()
      })
    );

    this.onRouteChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  private onRouteChange(): void {

    const innovation = this.contextStore.getInnovation();
    
    if (this.router.url.includes('sections')) {
      const currentSection = this.router.url.split('/').pop();
      this.showHeading = true;
      
      this.innovationStore.getSectionsSummary$(innovation.id).subscribe(response => {

        response.map((parentSection, i) => {
          this.sidebarItems.push({ label: `${i + 1}. ${parentSection.title}`, url: `/assessment/innovations/${innovation.id}/record/sections/${parentSection.sections[0].id}`, nestedSidebarItems: []  });

          if (parentSection.sections.find(j => j.id === currentSection)) {
            parentSection.sections.map((section, k) => {
              this.sidebarItems[i].nestedSidebarItems?.push({ label: `${i + 1}.${k + 1} ${section.title}`, url: `/assessment/innovations/${innovation.id}/record/sections/${section.id}` });
            })
          }
        });

      });
    } else {
      this.showHeading = false;

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

}
