import { isPlatformBrowser } from '@angular/common';
import { Component, computed, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RoutingHelper } from '@app/base/helpers';

import { ContextStore, CtxStore } from '@modules/stores';
import { HeaderMenuBarItemType } from '@modules/theme/components/header/header.component';

export type RoutesDataType = {
  module?: string; // TODO: To remove.
  header: {
    menuBarItems: { left: HeaderMenuBarItemType[]; right: HeaderMenuBarItemType[] };
  };
  breadcrumb?: string;
  layout?: {
    type?: 'full' | 'journey' | '1.third-2.thirds';
    backgroundColor?: null | string;
  };
  innovationActionData?: { id: null | string; name: string };
  innovationData?: { id: string; name: string };
  innovationSectionData?: { id: null | string; name: string };
  innovationSectionEvidenceData?: { id: null | string; name: string };
  innovationThreadData?: { id: null | string; name: string };
};

@Component({
  selector: 'theme-transactional-layout',
  templateUrl: './transactional-layout.component.html'
})
export class TransactionalLayoutComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  header: RoutesDataType['header'] = {
    menuBarItems: { left: [], right: [] }
  };
  headerNotifications = computed(() => ({ notifications: this.ctx.notifications.unread() }));

  routeLayoutInfo: Required<RoutesDataType>['layout'] = { type: 'full', backgroundColor: null };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private contextStore: ContextStore,
    protected ctx: CtxStore
  ) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
        .subscribe(() => this.ctx.layout.resetPage())
    );
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.onRouteChange(e))
    );
  }

  ngOnInit() {
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
    // }

    // Always reset focus to body.
    if (isPlatformBrowser(this.platformId) && !this.ctx.layout.alert()) {
      setTimeout(() => {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
      });
    }
  }

  onBackLinkClicked() {
    // console.log('onBackLinkClicked', this.pageLayout.backLink);

    const callback = this.ctx.layout.backLink()?.callback;
    if (!callback) return;

    if (typeof callback === 'string') {
      this.router.navigateByUrl(callback);
    } else {
      callback.call(this);
    }
  }
}
