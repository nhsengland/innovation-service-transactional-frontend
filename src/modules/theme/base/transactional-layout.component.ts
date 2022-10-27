import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RoutingHelper } from '@app/base/helpers';

import { ContextStore } from '@modules/stores';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';
import { HeaderMenuBarItemType, HeaderNotificationsType } from '@modules/theme/components/header/header.component';
import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';


export type RoutesDataType = {
  module?: string, // TODO: To remove.
  header: {
    menuBarItems: { left: HeaderMenuBarItemType[], right: HeaderMenuBarItemType[] },
    notifications: HeaderNotificationsType
  },
  breadcrumb?: string,
  layout?: {
    type?: 'full' | 'journey' | '1.third-2.thirds',
    backgroundColor?: null | string
  },
  innovationActionData?: { id: null | string, name: string },
  innovationData?: InnovationDataResolverType,
  innovationSectionData?: { id: null | string, name: string },
  innovationSectionEvidenceData?: { id: null | string, name: string }
  innovationThreadData?: { id: null | string, name: string }
};


@Component({
  selector: 'theme-transactional-layout',
  templateUrl: './transactional-layout.component.html'
})
export class TransactionalLayoutComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  header: RoutesDataType['header'] = {
    menuBarItems: { left: [], right: [] },
    notifications: {}
  };

  routeLayoutInfo: Required<RoutesDataType>['layout'] = { type: 'full', backgroundColor: null };

  pageLayout: {
    alert: ContextPageLayoutType['alert'],
    backLink: ContextPageLayoutType['backLink'],
    title: ContextPageLayoutType['title'],
    sidebarItems: { label: string, url: string }[]
  } = {
      alert: { type: null },
      backLink: { label: null },
      title: { main: null },
      sidebarItems: []
    };


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private contextStore: ContextStore,
    private cdr: ChangeDetectorRef
  ) {

    this.subscriptions.add( // Reset page layout. contextStore.resetPage() don't emit and event, so nothing changes visually.
      this.router.events.pipe(filter((e): e is NavigationStart => e instanceof NavigationStart)).subscribe(() => this.contextStore.resetPage())
    );
    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

  }


  ngOnInit() {

    this.subscriptions.add(
      this.contextStore.pageLayout$().subscribe(item => {
        this.pageLayout.alert = item.alert;
        this.pageLayout.backLink = item.backLink;
        this.pageLayout.title = item.title;
        this.cdr.detectChanges();
        // console.log('ContextPageLayout', item.alert);
      })
    );

    this.subscriptions.add( // We need to reassign the variable so that the component reacts to it.
      this.contextStore.notifications$().subscribe(item => { this.header.notifications = { notifications: item.UNREAD }; })
    );

    // this.subscriptions.add(
    //   this.contextStore.innovation$().subscribe(e => {
    //     Object.entries(e?.notifications || {}).forEach(([key, value]) => {
    //       const leftSideMenu = this.leftSideBar.find(item => item.notificationKey === key);
    //       if (leftSideMenu) { leftSideMenu.notifications = value; }
    //     });
    //   })
    // );

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  private onRouteChange(event: NavigationEnd): void {

    const routeData = RoutingHelper.getRouteData<RoutesDataType>(this.activatedRoute);

    // console.log('ThemeTransactionalLayout::onRouteChange', routeData);
    // console.log('ThemeTransactionalLayout::eventUrl', event.url);

    this.header = routeData.header;

    this.routeLayoutInfo = {
      type: routeData.layout?.type ?? 'full',
      backgroundColor: routeData.layout?.backgroundColor ?? null
    };
    // console.log('RouteLayoutData', this.routeLayoutInfo);

    // if (this.header.menuBarItems.left.length > 0 || this.header.menuBarItems.right.length > 0) {
    this.contextStore.updateUserUnreadNotifications();
    // }


    // Always reset focus to body.
    if (isPlatformBrowser(this.platformId) && !this.pageLayout.alert.type) {
      setTimeout(() => {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
      });
    }

  }


  onBackLinkClicked() {

    // console.log('onBackLinkClicked', this.pageLayout.backLink);

    if (this.pageLayout.backLink.url) {
      this.router.navigate([this.pageLayout.backLink.url]);
    } else if (this.pageLayout.backLink.callback) {
      this.pageLayout.backLink.callback.call(this);
    }

  }

}
