import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { HeaderNavigationBarItemType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';

import { NotificationContextType, NotificationsService } from '@modules/shared/services/notifications.service';


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

  leftSideBar: { key: string, title: string, link: string }[] = [];
  leftSideBarNotifications: { [key: string]: number } = {
    ACTION: 0,
    COMMENT: 0,
    INNOVATION: 0,
    SUPPORT: 0,
    DATA_SHARING: 0,
  };


  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService,
  ) {

    super();

    this.navigationMenuBar.leftItems = [
      { key: 'home', label: 'Home', link: '/accessor/dashboard' }
    ];
    this.navigationMenuBar.rightItems = [
      { key: 'innovations', label: 'Innovations', link: '/accessor/innovations' },
      { key: 'notifications', label: 'Notifications', link: '/innovator/notifications' },
      { key: 'actions', label: 'Actions', link: '/accessor/actions', },
      { key: 'account', label: 'Account', link: '/accessor/account' },
      { key: 'signOut', label: 'Sign out', link: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }
    ];

    this.subscriptions.push(

      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e)),

      this.stores.environment.notifications$().subscribe(e => {
        this.navigationMenuBar.notifications = { notifications: e.UNREAD }; // We need to reassign the variable so that the component reacts to it.
      })

    );

  }


  private onRouteChange(event: NavigationEnd): void {

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData(this.activatedRoute).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null
    };

    switch (this.layoutOptions.type) {

      case 'userAccountMenu':
        this.leftSideBar = [
          { key: 'YourDetails', title: 'Your details', link: `/accessor/account/manage-details` },
          { key: 'EmailNotifications', title: 'Email notifications', link: `/accessor/account/email-notifications` },
          { key: 'ManageAccount', title: 'Manage account', link: `/accessor/account/manage-account` }
        ];
        break;

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { key: 'Overview', title: 'Overview', link: `/accessor/innovations/${currentRouteInnovationId}/overview` },
          { key: 'InnovationRecord', title: 'Innovation record', link: `/accessor/innovations/${currentRouteInnovationId}/record` },
          { key: NotificationContextType.ACTION, title: 'Action tracker', link: `/accessor/innovations/${currentRouteInnovationId}/action-tracker` },
          { key: NotificationContextType.COMMENT, title: 'Comments', link: `/accessor/innovations/${currentRouteInnovationId}/comments` },
          { key: NotificationContextType.SUPPORT, title: 'Support status', link: `/accessor/innovations/${currentRouteInnovationId}/support` },
          { key: 'ActivityLog', title: 'Activity log', link: `/accessor/innovations/${currentRouteInnovationId}/activity-log` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;

    }

  }

}
