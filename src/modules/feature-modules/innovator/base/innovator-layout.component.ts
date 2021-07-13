import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { RoutingHelper } from '@modules/core';
import { Observable, Subject } from 'rxjs';
import { InnovatorService } from '../services/innovator.service';


type RouteDataLayoutOptionsType = {
  type: null | 'innovationLeftAsideMenu' | 'emptyLeftAside';
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
    leftItems: { title: string, link: string, fullReload?: boolean }[];
    rightItems: { title: string, link: string, fullReload?: boolean }[];
  } = { leftItems: [], rightItems: [] };

  innovationHeaderBar: { id: string | null, name: string | null } = { id: null, name: null };

  leftSideBar: { title: string, link: string, key?: string }[] = [];

  notifications: {[key: string]: number};


  constructor(
    private activatedRoute: ActivatedRoute,
    private innovatorService: InnovatorService
  ) {

    super();


    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e)),
    );

    this.notifications = {
      ACTION: 0,
      COMMENT: 0,
      INNOVATION: 0,
    };

  }


  private onRouteChange(event: NavigationEnd): void {

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData(this.activatedRoute).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;

    if (currentRouteInnovationId) {
      this.subscriptions.push(
        this.innovatorService.getInnovationInfo(currentRouteInnovationId).subscribe(
          response => {
            this.notifications = response.notifications;
          }
        )
      );
    }

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null,
      showInnovationHeader: routeData.showInnovationHeader || false
    };

    if (event.url.startsWith('/innovator/first-time-signin')) {
      this.navigationMenuBar = {
        leftItems: [],
        rightItems: [{ title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }]
      };
    } else {
      this.navigationMenuBar = {
        leftItems: [
          { title: 'Home', link: '/innovator/dashboard' }
        ],
        rightItems: [
          { title: 'Your innovations', link: '/innovator/innovations' },
          { title: 'Your account', link: '/innovator/account' },
          { title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
        ]
      };
    }


    switch (this.layoutOptions.type) {

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { title: 'Overview', link: `/innovator/innovations/${currentRouteInnovationId}/overview` },
          { title: 'Innovation record', link: `/innovator/innovations/${currentRouteInnovationId}/record` },
          { title: 'Action tracker', link: `/innovator/innovations/${currentRouteInnovationId}/action-tracker`, key: 'ACTION' },
          { title: 'Comments', link: `/innovator/innovations/${currentRouteInnovationId}/comments`, key: 'COMMENT' },
          { title: 'Data sharing and support', link: `/innovator/innovations/${currentRouteInnovationId}/data-sharing` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;
    }

    if (this.layoutOptions.showInnovationHeader) {
      this.innovationHeaderBar = { id: currentRouteInnovationId, name: this.stores.authentication.getUserInfo().innovations.find(item => item.id === currentRouteInnovationId)?.name || null };
    } else {
      this.innovationHeaderBar = { id: null, name: null };
    }

  }

}
