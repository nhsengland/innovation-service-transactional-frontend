import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';


@Component({
  selector: 'app-accessor-layout',
  templateUrl: './accessor-layout.component.html'
})
export class AccessorLayoutComponent extends CoreComponent implements OnInit {

  navigationMenuBar: {
    leftItems: { title: string, link: string, fullReload?: boolean }[],
    rightItems: { title: string, link: string, fullReload?: boolean }[]
  } = { leftItems: [], rightItems: [] };


  constructor() {

    super();

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e))
    );

  }

  ngOnInit(): void { }


  private onRouteChange(event: NavigationEnd): void {

    this.navigationMenuBar = {
      leftItems: [
        { title: 'Home', link: '/accessor/dashboard' }
      ],
      rightItems: [
        { title: 'Innovations', link: '/accessor/innovations' },
        { title: 'Actions', link: '/accessor/actions' },
        { title: 'Activity', link: '/accessor/activity' },
        { title: 'Account', link: '/accessor/account' },
        { title: 'Sign out', link: `${this.stores.environment.APP_URL}/signout`, fullReload: true }
      ]
    };

  }

}
