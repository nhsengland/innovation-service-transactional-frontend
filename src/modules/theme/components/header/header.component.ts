import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { EnvironmentStore } from '@modules/core/stores/environment.store';

@Component({
  selector: 'theme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() showMenuBar = true;

  private subscriptions: Subscription[] = [];

  showHeroSection = false;
  aacImage: string;
  authenticationButton: { title: string, url: string };

  constructor(
    private router: Router,
    private environmentStore: EnvironmentStore
  ) {

    this.aacImage = `${this.environmentStore.APP_ASSETS_URL}/images/nhs-aac-logo.png`;
    this.authenticationButton = { title: 'My dashboard', url: `${this.environmentStore.APP_URL}/dashboard` };

    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.onRouteChange(e)),
    );

  }

  ngOnInit(): void { }


  private onRouteChange(event: NavigationEnd): void {

    this.showHeroSection = event.url === '/';

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
