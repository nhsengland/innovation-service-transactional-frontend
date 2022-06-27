import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { HeaderNavigationBarItemType } from '@app/base/types';

import { RoutingHelper } from '@app/base/helpers';

import { NotificationContextType } from '@modules/shared/services/notifications.service';


type RouteDataLayoutOptionsType = {
  type: null | 'userAccountMenu' | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url?: string, label?: string };
  showInnovationHeader?: boolean;
};


@Component({
  selector: 'app-innovator-layout',
  templateUrl: './innovator-layout.component.html',
})
export class InnovatorLayoutComponent extends CoreComponent {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  navigationMenuBar: {
    leftItems: HeaderNavigationBarItemType,
    rightItems: HeaderNavigationBarItemType,
    notifications: { notifications: number }
  } = { leftItems: [], rightItems: [], notifications: { notifications: 0 } };

  innovationHeaderBar: { id: string | null, name: string | null } = { id: null, name: null };
  leftSideBar: { key: string, title: string, link: string }[] = [];
  leftSideBarNotifications: { [key: string]: number } = {
    ACTION: 0,
    COMMENT: 0,
    INNOVATION: 0,
    SUPPORT: 0,
    DATA_SHARING: 0
  };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.subscriptions.push(

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e)),

      this.stores.environment.notifications$().subscribe(e => {
        this.navigationMenuBar.notifications = { notifications: e.UNREAD }; // We need to reassign the variable so that the component reacts to it.
      })

    );

  }


  private onRouteChange(event: NavigationEnd): void {



    const routeData = RoutingHelper.getRouteData(this.activatedRoute);
    const routeDataLayoutOptions: RouteDataLayoutOptionsType = routeData.layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;
    const innovation = currentRouteInnovationId ? this.stores.environment.getInnovation() : null;

    this.layoutOptions = {
      type: routeDataLayoutOptions.type || null,
      backLink: routeDataLayoutOptions.backLink ? { url: RoutingHelper.resolveUrl(routeDataLayoutOptions.backLink.url, this.activatedRoute), label: routeDataLayoutOptions.backLink.label } : null,
      showInnovationHeader: routeDataLayoutOptions.showInnovationHeader || false
    };

    if (event.url.startsWith('/innovator/first-time-signin')) {
      this.navigationMenuBar.leftItems = [];
      this.navigationMenuBar.rightItems = [{ key: 'signOut', label: 'Sign out', link: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }];
    } else {

      this.stores.environment.updateUserUnreadNotifications();

      this.navigationMenuBar.leftItems = [
        { key: 'innovations', label: 'Your innovations', link: '/innovator/dashboard' }
      ];
      this.navigationMenuBar.rightItems = [
        { key: 'notifications', label: 'Notifications', link: '/innovator/notifications' },
        { key: 'yourAccount', label: 'Your account', link: '/innovator/account' },
        { key: 'signOut', label: 'Sign out', link: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }
      ];
    }


    switch (this.layoutOptions.type) {

      case 'userAccountMenu':
        this.leftSideBar = [
          { key: 'YourDetails', title: 'Your details', link: `/innovator/account/manage-details` },
          { key: 'EmailNotifications', title: 'Email notifications', link: `/innovator/account/email-notifications` },
          { key: 'ManageInnovations', title: 'Manage innovations', link: `/innovator/account/manage-innovations` },
          { key: 'ManageAccount', title: 'Manage account', link: `/innovator/account/manage-account` }
        ];
        break;

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { key: 'Overview', title: 'Overview', link: `/innovator/innovations/${currentRouteInnovationId}/overview` },
          { key: 'InnovationRecord', title: 'Innovation record', link: `/innovator/innovations/${currentRouteInnovationId}/record` },
          { key: NotificationContextType.ACTION, title: 'Action tracker', link: `/innovator/innovations/${currentRouteInnovationId}/action-tracker` },
          { key: NotificationContextType.COMMENT, title: 'Comments', link: `/innovator/innovations/${currentRouteInnovationId}/comments` },
          { key: NotificationContextType.DATA_SHARING, title: 'Data sharing and support', link: `/innovator/innovations/${currentRouteInnovationId}/support` },
          { key: 'ActivityLog', title: 'Activity log', link: `/innovator/innovations/${currentRouteInnovationId}/activity-log` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;
    }

    if (this.layoutOptions.showInnovationHeader) {
      this.innovationHeaderBar = { id: currentRouteInnovationId, name: innovation?.name || '' };
    } else {
      this.innovationHeaderBar = { id: null, name: null };
    }

  }

}
