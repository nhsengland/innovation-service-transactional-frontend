/* istanbul ignore file */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { RoutingHelper } from '@modules/core';


type RouteDataLayoutOptionsType = {
  type?: null | 'leftAsideMenu' | 'leftAsideBackLink';
  backLink?: null | { url?: string, label?: string };
  showInnovationHeader?: boolean;
};


@Component({
  selector: 'app-innovator-layout',
  templateUrl: './innovator-layout.component.html'
})
export class InnovatorLayoutComponent extends CoreComponent implements OnInit {

  layoutOptions: RouteDataLayoutOptionsType = {};

  navigationMenuBar: {
    leftItems: { title: string, link: string, fullReload?: boolean }[];
    rightItems: { title: string, link: string, fullReload?: boolean }[];
  } = { leftItems: [], rightItems: [] };

  innovationHeaderBar: { id: string | null, name: string | null } = { id: null, name: null };

  leftSideBar: { title: string, link: string }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

  }

  ngOnInit(): void { }


  private onRouteChange(event: NavigationEnd): void {

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData(this.activatedRoute.snapshot).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute.snapshot).innovationId || null;

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.type === 'leftAsideBackLink' ? { url: RoutingHelper.resolveUrl(routeData.backLink?.url, this.activatedRoute), label: routeData.backLink?.label } : null,
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

    if (this.layoutOptions.type === 'leftAsideMenu') {
      this.leftSideBar = [
        { title: 'Overview', link: `/innovator/innovations/${currentRouteInnovationId}/overview` },
        { title: 'Innovation record', link: `/innovator/innovations/${currentRouteInnovationId}/record` },
        { title: 'Action tracker', link: `/innovator/innovations/${currentRouteInnovationId}/action-tracker` },
        { title: 'Comments', link: `/innovator/innovations/${currentRouteInnovationId}/comments` },
        { title: 'Data sharing and support', link: `/innovator/innovations/${currentRouteInnovationId}/data-sharing` }
      ];
    } else {
      this.leftSideBar = [];
    }

    if (this.layoutOptions.showInnovationHeader) {
      this.innovationHeaderBar = { id: currentRouteInnovationId, name: this.stores.authentication.getUserInfo().innovations.find(item => item.id === currentRouteInnovationId)?.name || null };
    } else {
      this.innovationHeaderBar = { id: null, name: null };
    }

  }

}
