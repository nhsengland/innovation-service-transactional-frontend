import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RoutingHelper } from '@app/base/helpers';

import { HeaderMenuBarItemType } from '@modules/theme/components/header/header.component';
import { Subscription } from 'rxjs';


export type TransactionalLayoutRouteDataType = {
  layout: {
    type: 'full' | '1.third_2.thirds' | '2.thirds_1.third';
    backgroundColor: null | string
    backLink?: null | { url?: string, label?: string };
    showInnovationHeader?: boolean;
  }
};



type RouteDataLayoutOptionsType = {
  type: null | 'userAccountMenu' | 'innovationLeftAsideMenu' | 'emptyLeftAside';
  backLink?: null | { url?: string, label?: string };
  showInnovationHeader?: boolean;
};


@Component({
  selector: 'theme-transactional-layout',
  templateUrl: './transactional-layout.component.html'
})
export class TransactionalLayoutComponent implements OnDestroy {

  private subscriptions = new Subscription();

  layout: TransactionalLayoutRouteDataType['layout'] = {
    type: 'full',
    backgroundColor: null
  };

  layoutOptions: RouteDataLayoutOptionsType = { type: null };

  headerMenuBar: {
    leftItems: HeaderMenuBarItemType[],
    rightItems: HeaderMenuBarItemType[]
  } = { leftItems: [], rightItems: [] };

  innovationHeaderBar: { id: string | null, name: string | null } = { id: null, name: null };

  leftSideBar: { key: string, title: string, link: string }[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {



    this.subscriptions.add(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );
    // this.headerMenuBar = {
    //   leftItems: [
    //     { label: 'Service users', url: '/admin/service-users' },
    //     {
    //       label: 'Management',
    //       description: 'This is the menu description',
    //       children: [
    //         { label: 'Organisations', url: '/admin/organisations', description: 'Manage organisations and associated units' },
    //         { label: 'Terms of use', url: '/admin/terms-conditions', description: 'Create a new version and trigger acceptance by the users' }
    //       ]
    //     }
    //   ],
    //   rightItems: [
    //     { label: 'My account', url: '/admin/account' },
    //     // { label: 'Sign out', url: `${this.CONSTANTS.APP_URL}/signout`, fullReload: true }
    //   ]
    // };

    // if (this.stores.authentication.isAdminRole()) {
    //   this.headerMenuBar.leftItems.splice(0, 0, { label: 'Admin users', url: '/admin/administration-users' });
    // }

  }




  private onRouteChange(event: NavigationEnd): void {


    const routeDataOld: RouteDataLayoutOptionsType = RoutingHelper.getRouteData<any>(this.activatedRoute).layoutOptions || {};

    this.layoutOptions = {
      type: routeDataOld.type || null,
      backLink: routeDataOld.backLink ? { url: RoutingHelper.resolveUrl(routeDataOld.backLink.url, this.activatedRoute), label: routeDataOld.backLink.label } : null,
      showInnovationHeader: routeDataOld.showInnovationHeader || false
    };

    const routeData = RoutingHelper.getRouteData<any>(this.activatedRoute);

    this.layout = {
      type: routeData.layout?.type ?? 'full',
      backgroundColor: routeData.layout?.backgroundColor ?? null
    };


    console.log('RouteData', routeData);



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


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
