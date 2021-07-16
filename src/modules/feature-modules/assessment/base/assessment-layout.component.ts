import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { RoutingHelper } from '@modules/core';


type RouteDataLayoutOptionsType = {
  type: null | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url: string, label: string };
};

@Component({
  selector: 'app-assessment-layout',
  templateUrl: './assessment-layout.component.html'
})
export class AssessmentLayoutComponent extends CoreComponent {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  navigationMenuBar: {
    leftItems: { title: string, link: string, fullReload?: boolean }[],
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = { leftItems: [], rightItems: [] };

  leftSideBar: { title: string, link: string }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Home', link: '/assessment/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/assessment/innovations' },
        // { title: 'Account', link: '/assessment/account' },
        { title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
      ]
    };

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
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

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { title: 'Overview', link: `/assessment/innovations/${currentRouteInnovationId}/overview` },
          { title: 'Innovation record', link: `/assessment/innovations/${currentRouteInnovationId}/record` },
          // { title: 'Action tracker', link: `/assessment/innovations/${currentRouteInnovationId}/action-tracker` },
          // { title: 'Comments', link: `/assessment/innovations/${currentRouteInnovationId}/comments` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;
    }

  }

}
