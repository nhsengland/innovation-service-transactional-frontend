import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { NotificationContextTypeEnum } from '@app/base/enums';
import { HeaderNavigationBarItemType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';


type RouteDataLayoutOptionsType = {
  type: null | 'userAccountMenu' | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url: string, label: string };
};


@Component({
  selector: 'app-accessor-layout',
  templateUrl: './accessor-layout.component.html'
})
export class AccessorLayoutComponent extends CoreComponent {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  navigationMenuBar: {
    leftItems: HeaderNavigationBarItemType,
    rightItems: HeaderNavigationBarItemType,
    notifications: { notifications: number }
  } = { leftItems: [], rightItems: [], notifications: { notifications: 0 } };

  leftSideBar: { title: string, link: string, notificationKey?: string, notifications?: number }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.navigationMenuBar.leftItems = [
      { key: 'home', label: 'Home', link: '/accessor/dashboard' }
    ];
    this.navigationMenuBar.rightItems = [
      { key: 'innovations', label: 'Innovations', link: '/accessor/innovations' },
      { key: 'notifications', label: 'Notifications', link: '/accessor/notifications' },
      { key: 'actions', label: 'Actions', link: '/accessor/actions', },
      { key: 'account', label: 'Account', link: '/accessor/account' },
      { key: 'signOut', label: 'Sign out', link: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }
    ];

    this.subscriptions.push(

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e)),

      this.stores.context.notifications$().subscribe(e => {
        this.navigationMenuBar.notifications = { notifications: e.UNREAD }; // We need to reassign the variable so that the component reacts to it.
      }),

      this.stores.context.innovation$().subscribe(e => {
        Object.entries(e?.notifications || {}).forEach(([key, value]) => {
          const leftSideMenu = this.leftSideBar.find(item => item.notificationKey === key);
          if (leftSideMenu) { leftSideMenu.notifications = value; }
        });
      })

    );

  }


  private onRouteChange(event: NavigationEnd): void {

    this.stores.context.updateUserUnreadNotifications();

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData<any>(this.activatedRoute).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null
    };

    switch (this.layoutOptions.type) {

      case 'userAccountMenu':
        this.leftSideBar = [
          { title: 'Your details', link: `/accessor/account/manage-details` },
          { title: 'Email notifications', link: `/accessor/account/email-notifications` },
          { title: 'Manage account', link: `/accessor/account/manage-account` }
        ];
        break;

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { title: 'Overview', link: `/accessor/innovations/${currentRouteInnovationId}/overview` },
          { title: 'Innovation record', link: `/accessor/innovations/${currentRouteInnovationId}/record` },
          { title: 'Action tracker', link: `/accessor/innovations/${currentRouteInnovationId}/action-tracker`, notificationKey: NotificationContextTypeEnum.ACTION },
          // { title: 'Comments', link: `/accessor/innovations/${currentRouteInnovationId}/comments` },
          { title: 'Messages', link: `/accessor/innovations/${currentRouteInnovationId}/threads` },
          { title: 'Support status', link: `/accessor/innovations/${currentRouteInnovationId}/support` },
          { title: 'Activity log', link: `/accessor/innovations/${currentRouteInnovationId}/activity-log` }
        ];
        this.stores.context.updateInnovationNotifications();
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;

    }

  }

}
