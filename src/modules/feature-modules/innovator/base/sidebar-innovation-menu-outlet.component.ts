import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { ContextStore, InnovationStore } from '@modules/stores';
import { InnovationStatusEnum } from '@modules/stores/innovation';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-base-sidebar-innovation-menu-outlet',
  templateUrl: './sidebar-innovation-menu-outlet.component.html'
})
export class SidebarInnovationMenuOutletComponent implements OnInit, OnDestroy {

  @HostListener('window:scroll', ['$event'])
  onScrollChange($event: Event){

    // let totalHeight = document.documentElement.getBoundingClientRect().height;
    // let scroll = window.scrollY;
    // let footer = document.getElementById('nhsuk-footer')!.offsetHeight + 32;
    // let sum = window.scrollY + window.innerHeight 
    // console.log('---------------------------')
    // console.log('window.innerHeight + scroll')
    // console.log(window.innerHeight + scroll)
    // console.log('second')
    // console.log(totalHeight - footer)

    // const backToTop = document.getElementById('backToTop')
    // if(window.innerHeight + scroll >= totalHeight - footer ){
    //   backToTop?.classList.add("absolute")
    // } else {
    //   backToTop?.classList.remove("absolute")
    // }

    // this.backToTopIsVisible = window.scrollY > 750 ? true : false;
    // console.log('height body')
    // console.log(document.body.getBoundingClientRect().height)
    // console.log('height documentElement')
    // console.log(document.documentElement.getBoundingClientRect().height)
    // console.log('window.scrollY')
    // console.log(window.scrollY)
    // console.log('screen size')
    // console.log(window.innerHeight)

    


  }

  backToTopIsVisible: boolean = false;
  hasReachedFooter: boolean = false;

  private subscriptions = new Subscription();

  sidebarItems: { label: string, url: string, children?: { label: string, url: string, id?: string }[] }[] = [];
  navHeading: string = 'Innovation Record sections';
  showHeading: boolean = false;
  isAllSectionsDetailsPage: boolean = false;

  private sectionsSidebar: { label: string, url: string, children?: { label: string, id: string, url: string }[] }[] = [];
  private _sidebarItems: { label: string, url: string, id?: string }[] = [];

  constructor(
    private router: Router,
    private contextStore: ContextStore,
    private innovationStore: InnovationStore,
    private scroller: ViewportScroller
  ) {

    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange())
    );

    this.onRouteChange();
  }

  ngOnInit(): void {
    this.generateSidebar();

    // this.scroller.setOffset([0,20]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private generateSidebar(): void {

    if (this.sidebarItems.length === 0) {

      const innovation = this.contextStore.getInnovation();

      this.sectionsSidebar = this.innovationStore.getInnovationRecordSectionsTree('innovator', innovation.id);
      this._sidebarItems = [
        { label: 'Overview', url: `/innovator/innovations/${innovation.id}/overview` },
        { label: 'Innovation record', url: `/innovator/innovations/${innovation.id}/record` },
        ...(innovation.status === InnovationStatusEnum.IN_PROGRESS ? [{ label: 'Support summary', url: `/innovator/innovations/${innovation.id}/support-summary` }] : []),
        { label: 'Tasks to do', url: `/innovator/innovations/${innovation.id}/tasks` },
        { label: 'Messages', url: `/innovator/innovations/${innovation.id}/threads` },
        ...(innovation.status !== InnovationStatusEnum.CREATED ? [{ label: 'Documents', url: `/innovator/innovations/${innovation.id}/documents` }] : []),
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
    

    if (this.router.url.includes('sections')) {
      this.showHeading = true;
      this.sidebarItems = this.sectionsSidebar;
      this.isAllSectionsDetailsPage = false;
      if (this.router.url.includes('/all')){
        this.isAllSectionsDetailsPage = true;
      }
    } else {
      this.showHeading = false;
      this.sidebarItems = this._sidebarItems;
      this.isAllSectionsDetailsPage = false;
    }

  }

  onScrollToTop(): void {
    this.scroller.scrollToPosition([0,0]);
  }

  onScrollToSection(section: string, event: Event): void {

    this.scroller.scrollToAnchor(section);
    (event.target as HTMLElement).blur();

  }

}
