import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { RoutingHelper } from '@app/base/helpers';

import { HeaderMenuBarItemType } from '@modules/theme/components/header/header.component';

type RouteDataLayoutOptionsType = {
  type: null | 'userAccountMenu' | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url?: string, label?: string };
  showInnovationHeader?: boolean;
};


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent extends CoreComponent {

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  headerMenuBar: {
    leftItems: HeaderMenuBarItemType[],
    rightItems: HeaderMenuBarItemType[]
  } = { leftItems: [], rightItems: [] };

  innovationHeaderBar: { id: string | null, name: string | null } = { id: null, name: null };

  leftSideBar: { key: string, title: string, link: string }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

    this.headerMenuBar = {
      leftItems: [
        { id: 'serviceUsers', label: 'Service users', url: '/admin/service-users' },
        {
          id: 'management',
          label: 'Management',
          description: 'This is the menu description',
          children: [
            { label: 'Organisations', url: '/admin/organisations', description: 'Manage organisations and associated units' },
            { label: 'Terms of use', url: '/admin/terms-conditions', description: 'Create a new version and trigger acceptance by the users' }
          ]
        }
      ],
      rightItems: [
        { id: 'account', label: 'My account', url: '/admin/account' },
        { id: 'signOut', label: 'Sign out', url: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }
      ]
    };

    if (this.stores.authentication.isAdminRole()) {
      this.headerMenuBar.leftItems.splice(0, 0, { id: 'adminUsers', label: 'Admin users', url: '/admin/administration-users' });
    }

  }

  private onRouteChange(event: NavigationEnd): void {

    const routeData: RouteDataLayoutOptionsType = RoutingHelper.getRouteData<any>(this.activatedRoute).layoutOptions || {};

    this.layoutOptions = {
      type: routeData.type || null,
      backLink: routeData.backLink ? { url: RoutingHelper.resolveUrl(routeData.backLink.url, this.activatedRoute), label: routeData.backLink.label } : null,
      showInnovationHeader: routeData.showInnovationHeader || false
    };


    switch (this.layoutOptions.type) {

      case 'userAccountMenu':
        this.leftSideBar = [
          { key: 'YourDetails', title: 'Your details', link: `/admin/account/manage-details` },
          { key: 'ManageAccount', title: 'Manage account', link: `/admin/account/manage-account` }
        ];
        break;

      case 'emptyLeftAside':
      default:
        this.leftSideBar = [];
        break;

    }

  }

}
