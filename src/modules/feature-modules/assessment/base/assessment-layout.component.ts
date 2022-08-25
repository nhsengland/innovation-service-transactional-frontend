import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { HeaderNavigationBarItemType } from '@app/base/types';
import { RoutingHelper } from '@app/base/helpers';

import { InnovationStatusEnum } from '@modules/stores/innovation';


type RouteDataLayoutOptionsType = {
  type: null | 'userAccountMenu' | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url: string, label: string };
};


@Component({
  selector: 'app-assessment-layout',
  templateUrl: './assessment-layout.component.html'
})
export class AssessmentLayoutComponent extends CoreComponent {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  navigationMenuBar: {
    leftItems: HeaderNavigationBarItemType,
    rightItems: HeaderNavigationBarItemType,
    notifications: { notifications: number }
  } = { leftItems: [], rightItems: [], notifications: { notifications: 0 } };

  leftSideBar: { title: string, link: string }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.navigationMenuBar.leftItems = [{ key: 'home', label: 'Home', link: '/assessment/dashboard' }];
    this.navigationMenuBar.rightItems = [
      { key: 'innovations', label: 'Innovations', link: '/assessment/innovations' },
      { key: 'notifications', label: 'Notifications', link: '/assessment/notifications' },
      { key: 'account', label: 'Account', link: '/assessment/account' },
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

    this.stores.environment.updateUserUnreadNotifications();

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData(this.activatedRoute).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;
    const innovation = currentRouteInnovationId ? this.stores.environment.getInnovation() : null;

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null
    };

    switch (this.layoutOptions.type) {

      case 'userAccountMenu':
        this.leftSideBar = [
          { title: 'Your details', link: `/assessment/account/manage-details` },
          { title: 'Manage account', link: `/assessment/account/manage-account` }
        ];
        break;

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { title: 'Overview', link: `/assessment/innovations/${currentRouteInnovationId}/overview` },
          { title: 'Innovation record', link: `/assessment/innovations/${currentRouteInnovationId}/record` },
          // { title: 'Comments', link: `/assessment/innovations/${currentRouteInnovationId}/comments` },
          { title: 'Messages', link: `/assessment/innovations/${currentRouteInnovationId}/threads` }
        ];
        if (innovation?.status === InnovationStatusEnum.IN_PROGRESS) {
          this.leftSideBar.push({ title: 'Support status', link: `/assessment/innovations/${currentRouteInnovationId}/support` });
        }

        this.leftSideBar.push({ title: 'Activity log', link: `/assessment/innovations/${currentRouteInnovationId}/activity-log` });

        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;

    }

  }

}
