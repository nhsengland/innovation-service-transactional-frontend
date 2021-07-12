import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';

import { RoutingHelper } from '@modules/core';
import { AccessorService } from '../services/accessor.service';

type RouteDataLayoutOptionsType = {
  type: null | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url: string, label: string };
};

@Component({
  selector: 'app-accessor-layout',
  templateUrl: './accessor-layout.component.html'
})
export class AccessorLayoutComponent extends CoreComponent implements OnInit {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  navigationMenuBar: {
    leftItems: { title: string, link: string, fullReload?: boolean }[],
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = { leftItems: [], rightItems: [] };

  leftSideBar: { title: string, link: string, key?: string }[] = [];

  notifications: {[key: string]: number};

  constructor(
    private activatedRoute: ActivatedRoute,
    private accessorService: AccessorService,
  ) {

    super();

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Home', link: '/accessor/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/accessor/innovations' },
        { title: 'Actions', link: '/accessor/actions' },
        { title: 'Account', link: '/accessor/account' },
        { title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
      ]
    };

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

    this.notifications = {
      ACTION: 0,
      COMMENT: 0,
      INNOVATION: 0,
    };

  }

  ngOnInit(): void { }


  private onRouteChange(event: NavigationEnd): void {

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData(this.activatedRoute).layoutOptions || {};
    const currentRouteInnovationId: string | null = RoutingHelper.getRouteParams(this.activatedRoute).innovationId || null;

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null
    };

    if (currentRouteInnovationId) {
      this.subscriptions.push(
        this.accessorService.getInnovationInfo(currentRouteInnovationId).subscribe(
          response => {
            console.log(response);
            this.notifications = response.notifications;
          }
        )
      );
    }

    switch (this.layoutOptions.type) {

      case 'innovationLeftAsideMenu':
        this.leftSideBar = [
          { title: 'Overview', link: `/accessor/innovations/${currentRouteInnovationId}/overview` },
          { title: 'Innovation record', link: `/accessor/innovations/${currentRouteInnovationId}/record` },
          { title: 'Action tracker', link: `/accessor/innovations/${currentRouteInnovationId}/action-tracker`, key: 'ACTION' },
          { title: 'Comments', link: `/accessor/innovations/${currentRouteInnovationId}/comments`, key: 'COMMENT' },
          { title: 'Support status', link: `/accessor/innovations/${currentRouteInnovationId}/support` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;

    }


  }

}
