import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RoutingHelper } from '@app/base/helpers';

import { ContextStore } from '@modules/stores';
import { ContextPageLayoutType } from '@modules/stores/context/context.types';
import { HeaderMenuBarItemType, HeaderNotificationsType } from '@modules/theme/components/header/header.component';

import { RoutesDataType } from '../accessor-routing.module';


@Component({
  selector: 'app-innovator-layouts-base-layout',
  templateUrl: './base-layout.component.html'
})
export class BaseLayoutComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  headerSection: {
    menuBarItems: { left: HeaderMenuBarItemType[], right: HeaderMenuBarItemType[] },
    notifications: HeaderNotificationsType
  } = {
      menuBarItems: { left: [], right: [] },
      notifications: {}
    };

  routeLayoutInfo: Required<RoutesDataType>['layout'] = { type: 'full', chosenMenu: null, backgroundColor: null };

  pageLayout: {
    context: { visible: boolean, innovation: { id: string, name: string, assessmentId?: string } },
    alert: ContextPageLayoutType['alert'],
    backLink: ContextPageLayoutType['backLink'],
    title: ContextPageLayoutType['title'],
    sidebarItems: { label: string, url: string }[]
  } = {
      context: { visible: false, innovation: { id: '', name: '' } },
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

    this.headerSection = {
      menuBarItems: {
        left: [
          { id: 'innovations', label: 'Innovations', url: '/accessor/innovations' },
          { id: 'notifications', label: 'Notifications', url: '/accessor/notifications' },
          { id: 'actions', label: 'Actions', url: '/accessor/actions', },
          { id: 'account', label: 'Account', url: '/accessor/account' }
        ],
        right: []
      },
      notifications: {}
    };

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
      this.contextStore.notifications$().subscribe(item => { this.headerSection.notifications = { notifications: item.UNREAD }; })
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

    this.routeLayoutInfo = {
      type: routeData.layout?.type ?? 'full',
      chosenMenu: routeData.layout?.chosenMenu ?? null,
      backgroundColor: routeData.layout?.backgroundColor ?? null,
    };

    console.log('EventData', event.url);
    // console.log('RouteLayoutData', this.routeLayoutInfo);

    if (event.url.startsWith('/accessor/terms-of-use')) {
      this.headerSection.menuBarItems.left = [];
      this.headerSection.menuBarItems.right = [];
    } else {

      this.contextStore.updateUserUnreadNotifications();

      switch (this.routeLayoutInfo.chosenMenu) {

        case 'innovations':
          const innovation = this.contextStore.getInnovation();
          // Only shows link if not on needs assessment page.
          const assessmentId = !event.url.endsWith(`assessments/${innovation.assessment?.id}`) ? innovation.assessment?.id : undefined;
          this.pageLayout.context = { visible: true, innovation: { id: innovation.id, name: innovation.name, assessmentId } };

          this.pageLayout.sidebarItems = [
            { label: 'Overview', url: `/accessor/innovations/${innovation.id}/overview` },
            { label: 'Innovation record', url: `/accessor/innovations/${innovation.id}/record` },
            { label: 'Action tracker', url: `/accessor/innovations/${innovation.id}/action-tracker` },
            { label: 'Messages', url: `/accessor/innovations/${innovation.id}/threads` },
            { label: 'Support status', url: `/accessor/innovations/${innovation.id}/support` },
            { label: 'Activity log', url: `/accessor/innovations/${innovation.id}/activity-log` }
          ];
          break;

        case 'yourAccount':
          this.pageLayout.context = { visible: false, innovation: { id: '', name: '' } };
          this.pageLayout.sidebarItems = [
            { label: 'Your details', url: `/accessor/account/manage-details` },
            { label: 'Email notifications', url: `/accessor/account/email-notifications` },
            { label: 'Manage account', url: `/accessor/account/manage-account` }
          ];
          break;

        default:
          this.pageLayout.context = { visible: false, innovation: { id: '', name: '' } };
          this.pageLayout.sidebarItems = [];
          break;

      }

    }

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
